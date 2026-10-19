// RPG Companion — Lumiverse Spindle frontend
// Renders the tracker panel in a drawer tab and a settings view. All persistence goes through the backend.

const ICON_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.5 20.5 7.3v9.4L12 21.5 3.5 16.7V7.3z"/><path d="M12 2.5 7.5 15h9z"/><path d="M3.5 7.3 7.5 15M20.5 7.3 16.5 15M7.5 15 12 21.5 16.5 15"/></svg>';
const SMALL_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>';

const CSS = `
.rpgc { --rpgc-gap: 10px; color: var(--lumiverse-text, #ddd); font-size: 13px; line-height: 1.4; padding: 10px 10px 24px; display: flex; flex-direction: column; gap: 12px; }
.rpgc * { box-sizing: border-box; }
.rpgc-top { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rpgc-top .rpgc-mode { color: var(--lumiverse-text-muted, #999); font-size: 12px; flex: 1; white-space: nowrap; }
.rpgc-status { font-size: 12px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--lumiverse-border, #333); color: var(--lumiverse-text-muted, #aaa); }
.rpgc-status.warning { border-color: #c9a227; color: #e5c55a; }
.rpgc-status.error { border-color: #c0504d; color: #e88683; }
.rpgc-status.ok { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-status.busy { border-color: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-btn { appearance: none; border: 1px solid var(--lumiverse-border, #444); background: var(--lumiverse-fill-subtle, transparent); color: inherit; border-radius: var(--lumiverse-radius, 6px); padding: 4px 9px; font: inherit; font-size: 12px; cursor: pointer; }
.rpgc-btn:hover { border-color: var(--lumiverse-border-hover, #666); }
.rpgc-btn:focus-visible, .rpgc-edit:focus-visible, .rpgc input:focus-visible, .rpgc select:focus-visible, .rpgc textarea:focus-visible { outline: 2px solid var(--lumiverse-accent, #7aa2f7); outline-offset: 1px; }
.rpgc-btn.primary { background: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent-fg, #111); border-color: transparent; }
.rpgc-btn.icon { padding: 2px 7px; line-height: 1.2; }
.rpgc-btn.danger { color: #e06c75; }
.rpgc-btn[disabled] { opacity: .5; cursor: default; }
.rpgc-note { color: var(--lumiverse-text-muted, #999); font-size: 12px; }
.rpgc-sec { border: 1px solid var(--lumiverse-border, #333); border-radius: var(--lumiverse-radius, 8px); background: var(--lumiverse-fill-subtle, transparent); }
.rpgc-sec > summary { list-style: none; cursor: pointer; padding: 8px 10px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.rpgc-sec > summary::-webkit-details-marker { display: none; }
.rpgc-sec > summary::before { content: '▸'; font-size: 10px; color: var(--lumiverse-text-dim, #777); transition: transform var(--lumiverse-transition-fast, .12s); }
.rpgc-sec[open] > summary::before { transform: rotate(90deg); }
.rpgc-sec > summary .rpgc-sum-extra { margin-left: auto; font-weight: 400; color: var(--lumiverse-text-muted, #999); font-size: 12px; }
.rpgc-body { padding: 2px 10px 10px; display: flex; flex-direction: column; gap: 8px; }
.rpgc-edit { border-radius: 4px; padding: 0 2px; min-width: 1ch; display: inline-block; white-space: pre-wrap; word-break: break-word; }
.rpgc-edit:hover { background: var(--lumiverse-fill, rgba(255,255,255,.05)); }
.rpgc-edit:empty::before { content: attr(data-ph); color: var(--lumiverse-text-dim, #666); font-size: 12px; font-style: normal; }
.rpgc-who { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }
.rpgc-who .rpgc-mood { font-size: 20px; }
.rpgc-who .rpgc-lvl { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--lumiverse-text-muted, #999); display: flex; gap: 4px; align-items: center; }
.rpgc-stat { display: grid; grid-template-columns: minmax(64px, 30%) 1fr auto; gap: 8px; align-items: center; }
.rpgc-stat-name { color: var(--lumiverse-text-muted, #aaa); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rpgc-bar { height: 8px; border-radius: 99px; background: rgba(128,128,128,.22); background: color-mix(in srgb, var(--lumiverse-text, #ddd) 14%, transparent); overflow: hidden; }
.rpgc-bar > i { display: block; height: 100%; border-radius: 99px; transition: width .35s ease, background-color .35s ease; }
.rpgc-stat-val { font-variant-numeric: tabular-nums; font-size: 12px; min-width: 42px; text-align: right; }
.rpgc-kv { display: grid; grid-template-columns: minmax(70px, 32%) 1fr; gap: 4px 8px; }
.rpgc-kv > .k { color: var(--lumiverse-text-muted, #aaa); font-size: 12px; padding-top: 1px; }
.rpgc-attrs { display: grid; grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 6px; }
.rpgc-attr { border: 1px solid var(--lumiverse-border, #333); border-radius: 6px; padding: 4px 6px; display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.rpgc-attr b { font-size: 11px; color: var(--lumiverse-text-muted, #aaa); font-weight: 600; }
.rpgc-attr span { font-variant-numeric: tabular-nums; font-weight: 600; }
.rpgc-mini { appearance: none; border: 0; background: none; color: var(--lumiverse-text-muted, #aaa); cursor: pointer; padding: 0 3px; font: inherit; line-height: 1; }
.rpgc-mini:hover { color: var(--lumiverse-text, #fff); }
.rpgc-dice { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.rpgc-dice input { width: 52px; }
.rpgc-roll { font-weight: 600; }
.rpgc input[type=text], .rpgc input[type=search], .rpgc input[type=number], .rpgc select, .rpgc textarea { background: var(--lumiverse-fill, rgba(255,255,255,.05)); color: inherit; border: 1px solid var(--lumiverse-border, #444); border-radius: 5px; padding: 3px 6px; font: inherit; font-size: 12px; }
.rpgc textarea { width: 100%; min-height: 90px; resize: vertical; }
.rpgc-scene { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.rpgc-scene .cell { display: flex; flex-direction: column; gap: 1px; }
.rpgc-scene .cell.wide { grid-column: 1 / -1; }
.rpgc-scene .lbl { font-size: 11px; color: var(--lumiverse-text-dim, #888); }
.rpgc-scene .weather { font-size: 18px; }
.rpgc-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 3px; }
.rpgc-list li { display: flex; align-items: flex-start; gap: 6px; }
.rpgc-list li .grow { flex: 1; }
.rpgc-list li .qty { color: var(--lumiverse-text-muted, #aaa); font-variant-numeric: tabular-nums; }
.rpgc-add { display: flex; gap: 6px; }
.rpgc-add input { flex: 1; min-width: 0; }
.rpgc-char { border-top: 1px solid var(--lumiverse-border, #333); padding-top: 8px; display: flex; flex-direction: column; gap: 5px; }
.rpgc-char:first-child { border-top: 0; padding-top: 0; }
.rpgc-char-head { display: flex; align-items: center; gap: 7px; }
.rpgc-char-head .emo { font-size: 22px; }
.rpgc-char-head .name { font-weight: 600; font-size: 14px; }
.rpgc-rel { margin-left: auto; font-size: 12px; color: var(--lumiverse-text-muted, #aaa); display: flex; align-items: center; gap: 3px; }
.rpgc-thought { font-style: italic; border-left: 2px solid var(--lumiverse-accent, #7aa2f7); padding: 2px 0 2px 8px; color: var(--lumiverse-text, #ddd); }
.rpgc-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.rpgc-tabs .rpgc-btn.on { border-color: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-loc { font-size: 12px; font-weight: 600; margin-top: 4px; display: flex; gap: 6px; align-items: center; }
.rpgc-quest-main { font-weight: 600; }
.rpgc-set { display: flex; flex-direction: column; gap: 6px; }
.rpgc-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rpgc-row > label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.rpgc-row .lbl { min-width: 110px; color: var(--lumiverse-text-muted, #aaa); font-size: 12px; }
.rpgc-cfg-item { display: flex; gap: 6px; align-items: center; }
.rpgc-cfg-item input[type=text] { flex: 1; min-width: 0; }
.rpgc-cfg-item input.num { width: 64px; flex: none; }
.rpgc h4 { margin: 6px 0 0; font-size: 12px; font-weight: 600; color: var(--lumiverse-text-muted, #aaa); }
.rpgc input[type=color] { width: 34px; height: 22px; padding: 0 2px; border: 1px solid var(--lumiverse-border, #444); border-radius: 4px; background: none; cursor: pointer; }
.rpgc-lock { appearance: none; border: 0; background: none; padding: 0 2px; margin: 0 2px 0 0; cursor: pointer; color: var(--lumiverse-text-dim, #777); opacity: .55; vertical-align: -2px; line-height: 1; }
.rpgc-lock:hover { opacity: 1; }
.rpgc-lock.on { color: var(--lumiverse-accent, #7aa2f7); opacity: 1; }
.rpgc-story { display: flex; gap: 6px; flex-wrap: wrap; }
.rpgc-imm { border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 6px; }
.rpgc-imm.live { border-color: color-mix(in srgb, #d9534f 45%, var(--lumiverse-border, #333)); }
.rpgc-imm-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rpgc-imm-head b { flex: 1; }
.rpgc-imm-env { font-size: 12px; font-style: italic; color: var(--lumiverse-text-muted, #999); }
.rpgc-imm-side { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-muted, #999); margin-top: 4px; }
.rpgc-imm-c { display: flex; flex-direction: column; gap: 3px; padding: 5px 0; border-top: 1px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 10%, transparent); }
.rpgc-imm-c.down { opacity: .5; }
.rpgc-imm-name { display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap; }
.rpgc-imm-name span.tag { font-size: 10px; border: 1px solid var(--lumiverse-border, #444); border-radius: 99px; padding: 0 6px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-imm-name span.tag.down { border-color: #d9534f; color: #d9534f; }
.rpgc-imm-note { font-size: 11px; color: var(--lumiverse-text-muted, #999); }
.rpgc-imm-pool { display: grid; grid-template-columns: 58px 1fr auto; gap: 6px; align-items: center; font-size: 12px; }
.rpgc-imm-pool .val { font-variant-numeric: tabular-nums; white-space: nowrap; background: none; border: 0; color: inherit; font: inherit; padding: 0; cursor: pointer; }
.rpgc-imm-pool .val[disabled] { cursor: default; }
.rpgc-imm-pool .band { grid-column: 2 / 4; font-size: 11px; color: var(--lumiverse-text-muted, #999); margin-top: -2px; }
.rpgc-imm-src { font-size: 9px; border: 1px solid currentColor; border-radius: 3px; padding: 0 3px; margin-left: 4px; opacity: .8; }
.rpgc-imm-chg { font-size: 11px; color: var(--lumiverse-text-muted, #999); }
.rpgc-imm-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.rpgc-imm-chips span { font-size: 10px; border: 1px solid var(--lumiverse-border, #444); border-radius: 99px; padding: 0 6px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-imm-fx { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 1px; }
.rpgc-imm-fx span { font-size: 11px; border-radius: 4px; padding: 0 6px; background: color-mix(in srgb, #e0a93b 16%, transparent); }
.rpgc-imm-fx span.new { box-shadow: inset 0 0 0 1px color-mix(in srgb, #e0a93b 70%, transparent); }
.rpgc-imm-did { font-size: 11px; font-style: italic; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-imm-tell { font-size: 11px; color: #e0a93b; }
.rpgc-imm-intel { display: flex; flex-direction: column; gap: 2px; font-size: 11px; }
.rpgc-imm-intel button { text-align: left; background: none; border: 1px dashed var(--lumiverse-border, #555); border-radius: 4px; color: inherit; font: inherit; padding: 1px 6px; cursor: pointer; }
.rpgc-imm-intel button.on, .rpgc-mini.on { border: 1px solid #5b8def; color: #8fb0f5; }
.rpgc-imm-intel button:focus-visible, .rpgc-imm-pool .val:focus-visible { outline: 2px solid #5b8def; outline-offset: 1px; }
.rpgc-imm-flag { font-size: 11px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; padding: 3px 6px; border-radius: 6px; background: color-mix(in srgb, #5b8def 14%, transparent); }
.rpgc-imm-dice { font-size: 11px; font-variant-numeric: tabular-nums; }
.rpgc-imm-log summary { font-size: 11px; cursor: pointer; color: var(--lumiverse-text-muted, #999); }
.rpgc-imm-log ol { margin: 4px 0 0 18px; padding: 0; font-size: 11px; display: flex; flex-direction: column; gap: 2px; }
.rpgc-imm-pool .val.editing input { width: 76px; font: inherit; }
.rpgc-chooser { display: flex; flex-direction: column; gap: 8px; padding: 12px; }
.rpgc select option, .rpgc select optgroup { background-color: Canvas; color: CanvasText; }
.rpgc.theme-rezero, .rpgc.theme-overlord, .rpgc.theme-horror, .rpgc.theme-hell, .rpgc.theme-space, .rpgc.theme-midnight, .rpgc.theme-terminal, .rpgc.theme-undertale, .rpgc.theme-darksouls, .rpgc.theme-skyrim { color-scheme: dark; }
.rpgc.theme-cote, .rpgc.theme-mushoku, .rpgc.theme-dnd, .rpgc.theme-heaven, .rpgc.theme-parchment, .rpgc.theme-sakura { color-scheme: light; }
.rpgc-top .rpgc-panelsel { font-size: 12px; max-width: 110px; }
.rpgc-dnd-roller { display: flex; flex-direction: column; gap: 4px; }
.rpgc-dnd-roll { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.rpgc-dnd-roll select { max-width: 100%; }
.rpgc-dnd-num { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; }
.rpgc-dnd-num input, .rpgc-dnd-roll .rpgc-dice input { width: 56px; }
.rpgc-dnd-result { display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; font-variant-numeric: tabular-nums; font-size: 12px; }
.rpgc-dnd-result b { font-size: 18px; }
.rpgc-dnd-abils { display: grid; grid-template-columns: repeat(auto-fill, minmax(86px, 1fr)); gap: 6px; }
.rpgc-dnd-abil { border: 1px solid var(--lumiverse-border, #333); border-radius: 6px; padding: 4px 6px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.rpgc-dnd-abil.hud { border-style: dashed; }
.rpgc-dnd-abil .ab { font-size: 11px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-dnd-abil .mod { font-size: 17px; font-weight: 600; font-variant-numeric: tabular-nums; }
.rpgc-dnd-abil .score { display: flex; align-items: center; gap: 4px; font-size: 12px; font-variant-numeric: tabular-nums; }
.rpgc-dnd-abil label { font-size: 10px; display: flex; gap: 3px; align-items: center; }
.rpgc-dnd-skillbox > summary { font-size: 12px; cursor: pointer; }
.rpgc-dnd-skills { display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 2px 10px; font-size: 12px; margin-top: 4px; }
.rpgc-dnd-skill { display: flex; align-items: center; gap: 6px; }
.rpgc-dnd-skill .nm { flex: 1; }
.rpgc-dnd-skill .nm .ab { font-size: 10px; color: var(--lumiverse-text-muted, #999); }
.rpgc-dnd-skill .md { width: 28px; text-align: right; font-variant-numeric: tabular-nums; }
.rpgc-dnd-skill button { min-width: 48px; font-size: 10px; }
.rpgc-dnd-skill button.p1 { border-color: #5b8def; }
.rpgc-dnd-skill button.p2 { border-color: #e0a93b; }
.rpgc-psub { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 6px; padding-top: 5px; border-top: 1px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 12%, transparent); }
.rpgc-psub .gt { font-size: 11px; font-weight: 600; color: var(--lumiverse-text-muted, #aaa); margin-right: auto; }
.rpgc-pcard.sub, .rpgc-char.sub { border: 0; padding: 0; margin: 0; background: none; box-shadow: none; }
.rpgc-chapter { border: 1px solid var(--lumiverse-border, #333); border-radius: 6px; padding: 4px 8px; }
.rpgc-chapter > summary { cursor: pointer; display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; }
.rpgc-chapter.loop { border-left: 3px solid #9b6bd6; }
.rpgc-chapter.arc { border-left: 3px solid #5b8def; }
.rpgc-chapter.day { border-left: 3px solid #e0a93b; }
.rpgc-chapter.unsummarised > summary b { opacity: .75; }
.rpgc-chip.kind { font-size: 10px; }
.rpgc-chsum { white-space: pre-wrap; font-size: 12px; line-height: 1.5; margin: 6px 0; }
.rpgc-knowledge ul, .rpgc-chapter ul { margin: 4px 0 4px 18px; padding: 0; font-size: 12px; }
.rpgc-knowledge li { display: flex; gap: 6px; align-items: baseline; }
.rpgc-wgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 6px; }
.rpgc-wstat { display: flex; flex-direction: column; align-items: center; padding: 6px; border: 1px solid var(--lumiverse-border, #333); border-radius: 6px; }
.rpgc-wstat b { font-size: 18px; font-variant-numeric: tabular-nums; }
.rpgc-wstat span { font-size: 10px; color: var(--lumiverse-text-muted, #aaa); text-transform: none; }
.rpgc-wrow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; }
.rpgc-wrow .lbl { min-width: 96px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-wrow .val { font-variant-numeric: tabular-nums; }
.rpgc-wrow > .rpgc-bar { flex: 1; min-width: 80px; }
.rpgc-wrow.mine .lbl { color: var(--lumiverse-text, #eee); font-weight: 600; }
.rpgc-wability { border-left: 2px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 20%, transparent); padding-left: 8px; }
.rpgc-wlore { margin: 2px 0 0; font-size: 11px; }
.rpgc-wlist { margin: 4px 0 0 18px; padding: 0; font-size: 12px; display: flex; flex-direction: column; gap: 3px; }
.rpgc-wlist li.followed { opacity: .75; } .rpgc-wlist li.ignored { opacity: .6; text-decoration: line-through; }
.rpgc-ladder { display: inline-flex; gap: 2px; } .rpgc-ladder i { width: 10px; height: 6px; border-radius: 2px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 16%, transparent); } .rpgc-ladder i.on { background: #e0a93b; }
.rpgc-karma { position: relative; flex: 1; min-width: 100px; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #7a1f2b, #555 50%, #d8c27a); }
.rpgc-karma i { position: absolute; top: -3px; width: 3px; height: 12px; margin-left: -1px; background: var(--lumiverse-text, #fff); border-radius: 1px; }
.rpgc-decree { border: 1px solid var(--lumiverse-border, #444); border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; }
.rpgc-decree.urgent { border-color: #d9534f; }
.rpgc-checklist { list-style: none; margin: 0; padding: 0; font-size: 12px; display: flex; flex-direction: column; gap: 2px; }
.rpgc-checklist li.met { opacity: .7; } .rpgc-checklist li.active { font-weight: 600; }
.rpgc-hud-block.pointer { opacity: .7; font-style: italic; }
.rpgc-soul { font-size: 16px; line-height: 1; }
.rpgc-savestar { color: #ffe600; }
.rpgc-ember { color: #e07b39; }
.rpgc-pips { display: inline-flex; gap: 3px; }
.rpgc-pips i { width: 9px; height: 13px; border-radius: 2px 2px 4px 4px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 15%, transparent); }
.rpgc-pips i.on { background: #e8a83a; box-shadow: 0 0 4px rgba(232,168,58,.6); }
.rpgc-wstat.ready b { color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-plotnow { font-size: 13px; line-height: 1.45; margin: 2px 0 6px; }
.rpgc-threads { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; font-size: 12px; }
.rpgc-threads li.resolved { opacity: .7; }
.rpgc-checklist li.failed { opacity: .6; text-decoration: line-through; }
.rpgc-checklist.mine li { display: flex; align-items: center; gap: 6px; }
.rpgc-imm-name .tag.mercy { background: color-mix(in srgb, #ffe600 30%, transparent); color: inherit; }
.rpgc-imm-name .tag.spared { background: color-mix(in srgb, #ffe600 55%, transparent); color: #000; }
.rpgc-injuries { display: flex; flex-direction: column; gap: 6px; }
.rpgc-injury { border-left: 3px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 25%, transparent); padding-left: 8px; }
.rpgc-injury.moderate { border-left-color: #d9b44f; } .rpgc-injury.severe { border-left-color: #d9964f; } .rpgc-injury.critical { border-left-color: #d9534f; }
.rpgc-injury.scar { opacity: .75; } .rpgc-chip.perm { background: color-mix(in srgb, var(--lumiverse-text, #ddd) 18%, transparent); }
.rpgc-chip.warm { background: color-mix(in srgb, #d9b44f 30%, transparent); }
.rpgc-injury.treated { opacity: .8; }
.rpgc-chip.crit { font-weight: 700; }
.rpgc-tells { font-style: italic; }
.rpgc-diag { font-family: ui-monospace, monospace; font-size: 11px; word-break: break-word; }
.rpgc-arc0 { position: relative; height: 8px; border-radius: 4px; margin: 6px 0; background: linear-gradient(90deg, #3a5a8a, #6b2a3a 50%, #2a2a2a); }
.rpgc-arc0 i { position: absolute; top: -4px; width: 4px; height: 16px; margin-left: -2px; border-radius: 2px; background: var(--lumiverse-text, #fff); }
.rpgc-arc0 .mark { position: absolute; top: 0; width: 1px; height: 8px; background: rgba(255,255,255,.55); }
.rpgc-wlist li.past { opacity: .6; }
.rpgc-wrow.legendary .lbl, .rpgc-chip.legendary { color: #e0a93b; }
.rpgc-spells > summary { cursor: pointer; list-style: none; }
.rpgc-spells > summary::-webkit-details-marker { display: none; }
.rpgc-spells .next { opacity: .7; }
.rpgc-chapter.month { border-left: 3px solid #6bbf8a; }
.rpgc.theme-mushoku .rpgc-imm-tell, .rpgc.theme-mushoku .rpgc-wrow.legendary .lbl, .rpgc.theme-mushoku .rpgc-chip.legendary,
.rpgc.theme-cote .rpgc-imm-tell, .rpgc.theme-dnd .rpgc-imm-tell, .rpgc.theme-heaven .rpgc-imm-tell, .rpgc.theme-parchment .rpgc-imm-tell, .rpgc.theme-sakura .rpgc-imm-tell,
.rpgc.theme-cote .rpgc-wrow.legendary .lbl, .rpgc.theme-dnd .rpgc-wrow.legendary .lbl, .rpgc.theme-heaven .rpgc-wrow.legendary .lbl, .rpgc.theme-parchment .rpgc-wrow.legendary .lbl, .rpgc.theme-sakura .rpgc-wrow.legendary .lbl,
.rpgc.theme-cote .rpgc-chip.legendary, .rpgc.theme-dnd .rpgc-chip.legendary, .rpgc.theme-heaven .rpgc-chip.legendary, .rpgc.theme-parchment .rpgc-chip.legendary, .rpgc.theme-sakura .rpgc-chip.legendary { color: #8a5a00; }
.rpgc-btn.rpgc-choice { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; text-align: left; padding: 10px 12px; white-space: normal; }
.rpgc-btn.rpgc-choice span { font-size: 12px; opacity: .8; font-weight: normal; }
.rpgc-story .rpgc-btn { flex: 1 1 auto; }
.rpgc-enc { padding: 4px 2px 8px; }
.rpgc-enc-stage { border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 10px; }
.rpgc-enc-env { font-size: 12px; color: var(--lumiverse-text-muted, #aaa); font-style: italic; }
.rpgc-enc-side h4 { margin: 0 0 4px; }
.rpgc-enc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
.rpgc-fighter { border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; background: var(--lumiverse-fill-subtle, rgba(0,0,0,.15)); }
.rpgc-fighter.down { opacity: .45; }
.rpgc-fighter-head { display: flex; align-items: center; gap: 6px; font-weight: 600; }
.rpgc-fighter-head .sprite { font-size: 20px; line-height: 1; }
.rpgc-fighter-head .you { margin-left: auto; font-size: 10px; font-weight: 600; color: var(--lumiverse-accent, #7aa2f7); text-transform: uppercase; letter-spacing: .05em; }
.rpgc-fighter .hp { font-size: 11px; color: var(--lumiverse-text-muted, #aaa); font-variant-numeric: tabular-nums; }
.rpgc-fighter .desc { font-size: 11px; color: var(--lumiverse-text-dim, #888); }
.rpgc-chips { display: flex; flex-wrap: wrap; gap: 3px; }
.rpgc-map { --rh-bg: color-mix(in srgb, var(--lumiverse-text, #ddd) 7%, transparent); --rh-fg: var(--lumiverse-text, #ddd); --rh-mute: var(--lumiverse-text-muted, #999); --rh-acc: var(--lumiverse-accent, #7aa2f7); --rh-line: var(--lumiverse-border, #444);
    --rh-soft: color-mix(in srgb, var(--lumiverse-text, #ddd) 6%, transparent); text-align: center; overflow-x: auto; }
.rpgc-map svg { max-width: 100%; height: auto; }
.rpgc-map-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
/* ── Atlas: the location book as a map ── */
.rpgc-atlas-trail { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 4px; font-size: 12px; margin-bottom: 6px; }
.rpgc-atlas-trail button { background: none; border: 0; padding: 1px 3px; border-radius: 4px; color: var(--lumiverse-text-muted, #999); cursor: pointer; font: inherit; }
.rpgc-atlas-trail button:hover { background: var(--lumiverse-fill-subtle, rgba(127,127,127,.1)); color: var(--lumiverse-text, #ddd); }
.rpgc-atlas-trail button.here { color: var(--lumiverse-text, #ddd); font-weight: 700; }
.rpgc-atlas-trail .sep { opacity: .5; }
.rpgc-atlas-focus { border: 1px solid var(--lumiverse-border, #444); border-radius: 10px; padding: 8px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 3%, transparent); }
.rpgc-atlas-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
.rpgc-atlas-head b { font-size: 14px; }
.rpgc-atlas-floor { margin-top: 8px; }
.rpgc-atlas-floor > .lbl { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--lumiverse-text-muted, #999); margin: 0 0 4px 2px; }
.rpgc-atlas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 5px; }
.rpgc-atlas-tile { position: relative; text-align: left; min-height: 48px; padding: 6px 7px 6px 9px; border-radius: 8px; border: 1px solid var(--lumiverse-border, #444); background: color-mix(in srgb, var(--lumiverse-text, #ddd) 5%, transparent); color: var(--lumiverse-text, #ddd); cursor: pointer; font: inherit; font-size: 12px; line-height: 1.25; display: flex; flex-direction: column; gap: 3px; }
.rpgc-atlas-tile:hover { border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-atlas-tile .nm { font-weight: 600; }
.rpgc-atlas-tile .sub { font-size: 10.5px; color: var(--lumiverse-text-muted, #999); display: flex; gap: 6px; flex-wrap: wrap; }
.rpgc-atlas-tile .bar { position: absolute; left: 0; top: 6px; bottom: 6px; width: 3px; border-radius: 3px; }
.rpgc-atlas-tile.generic { border-style: dashed; }
.rpgc-atlas-tile.stub { border-style: dotted; opacity: .65; }
.rpgc-atlas-tile.here { border-color: #e8b030; box-shadow: 0 0 0 1px #e8b030 inset; }
.rpgc-atlas-tile.onpath { border-color: color-mix(in srgb, #e8b030 55%, var(--lumiverse-border, #444)); }
.rpgc-atlas-tile.sel { outline: 2px solid var(--lumiverse-accent, #7aa2f7); outline-offset: 1px; }
.rpgc-atlas-det { margin-top: 8px; border-top: 1px dashed var(--lumiverse-border, #444); padding-top: 6px; font-size: 12px; }
.rpgc-atlas-det p { margin: 3px 0; white-space: pre-line; }
.rpgc-atlas-det .k { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--lumiverse-text-muted, #999); display: block; margin-top: 6px; }
/* ── New game: the bot's catalog ── */
.rpgc-ng-pages { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
.rpgc-ng-pages .rpgc-btn { font-size: 11px; padding: 2px 8px; }
.rpgc-ng-sec { margin-top: 6px; }
.rpgc-ng-sec > .lbl { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--lumiverse-text-muted, #999); margin: 6px 0 3px 2px; }
.rpgc-ng-item { display: block; width: 100%; text-align: left; border: 1px solid var(--lumiverse-border, #444); border-radius: 8px; padding: 5px 8px; margin: 3px 0; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 4%, transparent); color: var(--lumiverse-text, #ddd); font: inherit; font-size: 12px; cursor: pointer; line-height: 1.35; }
.rpgc-ng-item:hover { border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-ng-item.on { border-color: var(--lumiverse-accent, #7aa2f7); box-shadow: 0 0 0 1px var(--lumiverse-accent, #7aa2f7) inset; }
.rpgc-ng-item .c { font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace; font-size: 11.5px; font-weight: 600; }
.rpgc-ng-item .k { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; margin-right: 6px; padding: 0 5px; border-radius: 99px; border: 1px solid currentColor; opacity: .75; }
.rpgc-ng-item .d { display: block; color: var(--lumiverse-text-muted, #999); font-size: 11.5px; margin-top: 2px; }
.rpgc-ng-cmd { width: 100%; box-sizing: border-box; min-height: 64px; font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace; font-size: 12px; }
.rpgc-ng-warn { color: #e0902f; font-size: 12px; margin: 3px 0; }
/* ── OOC guide ── */
.rpgc-ooc-q { font-weight: 600; margin-top: 8px; }
.rpgc-ooc-a { white-space: pre-wrap; border-left: 3px solid var(--lumiverse-accent, #7aa2f7); padding: 4px 8px; margin: 3px 0 0; font-size: 12.5px; line-height: 1.45; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 4%, transparent); border-radius: 0 8px 8px 0; }
/* ── Chronicle: the story's timeline ── */
.rpgc-chron-add { display: flex; gap: 5px; margin: 6px 0; }
.rpgc-chron-add input { flex: 1; min-width: 0; }
.rpgc-chron-loop { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #e8b030; margin: 10px 0 2px; display: flex; align-items: center; gap: 6px; }
.rpgc-chron-loop::after { content: ''; flex: 1; border-top: 1px solid color-mix(in srgb, #e8b030 45%, transparent); }
.rpgc-chron-day { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--lumiverse-text-muted, #999); margin: 8px 0 2px 2px; }
.rpgc-chron-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.rpgc-chron-item { display: grid; grid-template-columns: 22px 1fr auto; gap: 2px 6px; align-items: start; padding: 5px 6px; border-radius: 8px; border: 1px solid transparent; font-size: 12.5px; line-height: 1.4; }
.rpgc-chron-item:hover { background: var(--lumiverse-fill-subtle, rgba(127,127,127,.08)); }
.rpgc-chron-item .ic { text-align: center; font-size: 13px; line-height: 1.35; }
.rpgc-chron-item .tx { min-width: 0; overflow-wrap: anywhere; }
.rpgc-chron-item .tm { color: var(--lumiverse-text-muted, #999); font-size: 11px; margin-right: 5px; font-variant-numeric: tabular-nums; }
.rpgc-chron-item .who { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 2px; }
.rpgc-chron-item .act { display: flex; gap: 1px; align-items: center; white-space: nowrap; }
.rpgc-chron-item .st { font-size: 11px; width: 16px; text-align: center; }
.rpgc-chron-item .st.sent { color: #7fc99a; }
.rpgc-chron-item .st.wait { color: var(--lumiverse-text-muted, #999); }
.rpgc-chron-item.moment, .rpgc-chron-item.note { border-color: color-mix(in srgb, #e8b030 35%, transparent); background: color-mix(in srgb, #e8b030 6%, transparent); }
.rpgc-chron-item.moment .ic, .rpgc-chron-item.star .ic { color: #e8b030; }
.rpgc-chron-item.big .tx { font-weight: 600; }
.rpgc-chron-item.hidden { opacity: .5; }
.rpgc-chron-item.hidden .tx { text-decoration: line-through; }
.rpgc-chron-cortex { margin-top: 10px; border-top: 1px dashed var(--lumiverse-border, #444); padding-top: 8px; display: flex; flex-direction: column; gap: 5px; font-size: 12px; }
.rpgc-chron-cortex .on { color: #7fc99a; font-weight: 600; }
.rpgc-chron-cortex .off { color: #e88683; font-weight: 600; }
.rpgc-surv { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; padding: 0 6px; border-radius: 999px; border: 1px solid currentColor; white-space: nowrap; }
.rpgc-chip { font-size: 11px; border: 1px solid var(--lumiverse-border, #444); border-radius: 99px; padding: 0 6px; }
.rpgc-enc-log { max-height: 220px; overflow-y: auto; border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.rpgc-enc-log .player { color: var(--lumiverse-accent, #7aa2f7); font-weight: 600; }
.rpgc-enc-log .enemy { color: #e88683; }
.rpgc-enc-log .party { color: #7fc99a; }
.rpgc-enc-log .system { color: var(--lumiverse-text-muted, #aaa); font-style: italic; }
.rpgc-enc-actions { display: flex; flex-wrap: wrap; gap: 5px; }
.rpgc-enc-actions .lbl { width: 100%; font-size: 11px; color: var(--lumiverse-text-dim, #888); margin-top: 2px; }
.rpgc-enc-result { font-size: 18px; font-weight: 700; text-align: center; padding: 8px 0 2px; }
.rpgc-hud { display: flex; flex-direction: column; gap: 5px; }
.rpgc-hud-row { display: flex; align-items: flex-start; gap: 6px; }
.rpgc-hud-row .body { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; gap: 3px 10px; }
.rpgc-hud-row.pinned { background: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 9%, transparent); border-radius: 6px; }
.rpgc-hud-f { display: inline-flex; align-items: baseline; gap: 4px; min-width: 0; }
.rpgc-hud-f .l { font-size: 11px; color: var(--lumiverse-text-dim, #888); }
.rpgc-hud-f .v { word-break: break-word; }
.rpgc-hud-f.frac { flex: 1 1 100%; display: grid; grid-template-columns: minmax(40px, auto) 1fr auto; align-items: center; gap: 8px; }
.rpgc-hud-path { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 4px; font-size: 12px; }
.rpgc-hud-path .seg { padding: 1px 6px; border-radius: 5px; background: var(--lumiverse-fill, rgba(127,127,127,.12)); }
.rpgc-hud-path .seg:last-child { font-weight: 600; }
.rpgc-hud-path .sep { color: var(--lumiverse-text-dim, #777); font-size: 10px; }
.rpgc-hud-mod { display: inline-block; font-size: 12px; padding: 2px 8px; border-radius: 6px; border: 1px solid var(--lumiverse-border, #444); word-break: break-word; }
.rpgc-hud-arc { font-weight: 600; }
.rpgc-pin { appearance: none; border: 0; background: none; padding: 1px 2px; cursor: pointer; color: var(--lumiverse-text-dim, #777); opacity: .5; line-height: 1; flex: none; }
.rpgc-pin:hover { opacity: 1; }
.rpgc-pin.on { color: var(--lumiverse-accent, #7aa2f7); opacity: 1; }
.rpgc-guard { display: flex; flex-direction: column; gap: 5px; }
.rpgc-guard .line { font-family: var(--lumiverse-font-mono, ui-monospace, monospace); font-size: 11px; word-break: break-word; flex: 1; min-width: 0; }
.rpgc-guard .item { display: flex; gap: 6px; align-items: center; }
.rpgc-enc-log .roll { color: #c9a227; font-variant-numeric: tabular-nums; }
.rpgc-quest { display: flex; align-items: center; gap: 6px; }
.rpgc-quest .grow { flex: 1; min-width: 0; }
.rpgc-quest .st { font-size: 10px; text-transform: uppercase; letter-spacing: .04em; padding: 1px 6px; border-radius: 99px; border: 1px solid var(--lumiverse-border, #444); cursor: pointer; }
.rpgc-quest .st.open { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-quest .st.live { color: var(--lumiverse-accent, #7aa2f7); border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-quest .st.closing { color: #c9a227; border-color: #c9a227; }
.rpgc-quest .st.done { opacity: .5; text-decoration: line-through; }
.rpgc-quest .hud { font-size: 10px; color: var(--lumiverse-text-dim, #777); }
.rpgc-song { display: flex; align-items: center; gap: 8px; border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; padding: 6px 8px; }
.rpgc-song .note { font-size: 18px; }
.rpgc-song .info { flex: 1; min-width: 0; }
.rpgc-song .info .t { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rpgc-song .info .a { font-size: 12px; color: var(--lumiverse-text-muted, #aaa); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rpgc-avatar { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; flex: none; background: var(--lumiverse-fill, rgba(127,127,127,.12)); }
.rpgc-char-head .rpgc-avatar-wrap { position: relative; flex: none; }
.rpgc-avatar-btn { appearance: none; border: 1px solid var(--lumiverse-border, #444); background: var(--lumiverse-fill-subtle, transparent); color: var(--lumiverse-text-muted, #aaa); border-radius: 6px; padding: 2px 7px; font: inherit; font-size: 11px; cursor: pointer; }
.rpgc-avatar-btn:hover { color: var(--lumiverse-text, #fff); border-color: var(--lumiverse-border-hover, #666); }
.rpgc-avatar-acts { display: inline-flex; gap: 4px; align-items: center; }
/* ── HMS systems ── */
.rpgc .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.rpgc-danger { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; padding: 7px 10px; border-radius: var(--lumiverse-radius, 8px); border: 1px solid #c0504d; background: color-mix(in srgb, #c0504d 14%, transparent); color: #f0a09d; font-size: 12px; }
.rpgc-danger strong { color: #ff8c87; text-transform: uppercase; letter-spacing: .04em; font-size: 11px; }
.rpgc-cards { display: flex; flex-direction: column; gap: 5px; }
.rpgc-subhead { margin: 10px 0 2px; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--lumiverse-text-muted, #999); }
.rpgc-vital { display: flex; flex-direction: column; gap: 3px; margin-bottom: 6px; }
.rpgc-vital .head { display: flex; align-items: baseline; gap: 6px; font-size: 12px; }
.rpgc-vital .lbl { font-weight: 600; }
.rpgc-vital .num { color: var(--lumiverse-text-muted, #aaa); font-variant-numeric: tabular-nums; }
.rpgc-vital .stage { margin-left: auto; color: var(--lumiverse-text-muted, #aaa); font-size: 11px; }
.rpgc-vital .delta { margin-left: auto; font-variant-numeric: tabular-nums; font-size: 11px; padding: 0 5px; border-radius: 99px; }
.rpgc-vital .delta.down { color: #ff8c87; background: color-mix(in srgb, #c0504d 16%, transparent); }
.rpgc-vital .delta.up { color: #8fd18f; background: color-mix(in srgb, #4caf50 16%, transparent); }
.rpgc-lvbar > i.ok { background: #5fae6e; }
.rpgc-lvbar > i.low { background: #d8a33a; }
.rpgc-lvbar > i.critical { background: #d9534f; animation: rpgc-pulse 1.6s ease-in-out infinite; }
@keyframes rpgc-pulse { 50% { opacity: .55; } }
@media (prefers-reduced-motion: reduce) { .rpgc-lvbar > i.critical { animation: none; } }
.rpgc-wound, .rpgc-cond, .rpgc-qcard { border: 1px solid var(--lumiverse-border, #333); border-left-width: 3px; border-radius: 6px; padding: 5px 8px; }
.rpgc-wound .head, .rpgc-cond .head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rpgc-wound .name, .rpgc-cond .name, .rpgc-qcard .name { font-weight: 600; font-size: 12px; }
.rpgc-wound .meta, .rpgc-cond .meta { font-size: 11px; color: var(--lumiverse-text-muted, #999); margin-top: 1px; }
.rpgc-wound .tag { margin-left: auto; font-size: 11px; padding: 0 6px; border-radius: 99px; border: 1px solid currentColor; }
.rpgc-wound.raw { border-left-color: #d9534f; } .rpgc-wound .tag.raw { color: #ff8c87; }
.rpgc-wound.treated { border-left-color: #d8a33a; } .rpgc-wound .tag.treated { color: #e5c55a; }
.rpgc-wound.healed { border-left-color: #5fae6e; } .rpgc-wound .tag.healed { color: #8fd18f; }
.rpgc-wound.permanent { border-left-color: #8a7fb8; } .rpgc-wound .tag.permanent { color: #b7aee0; }
.rpgc-wound.cosmetic, .rpgc-wound.other { border-left-color: var(--lumiverse-border-hover, #666); }
.rpgc-wound.warn .warn { color: #ff8c87; }
.rpgc-cond { border-left-color: #d8a33a; }
.rpgc-cond.rec { border-left-color: #5fae6e; }
.rpgc-cond.critical { border-left-color: #d9534f; background: color-mix(in srgb, #c0504d 8%, transparent); }
.rpgc-cond .trend { margin-left: auto; font-size: 11px; }
.rpgc-cond .trend.up { color: #ff8c87; } .rpgc-cond .trend.down { color: #8fd18f; } .rpgc-cond .trend.new { color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-ladder { display: inline-flex; gap: 2px; }
.rpgc-ladder > i { width: 10px; height: 6px; border-radius: 2px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 16%, transparent); }
.rpgc-ladder > i.on { background: #d8a33a; }
.rpgc-ladder > i.on.top { background: #d9534f; }
.rpgc-ladder.rec > i.on { background: #5fae6e; }
.rpgc-mind-scale { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 6px; }
.rpgc-mind-step { appearance: none; font: inherit; font-size: 11px; padding: 2px 7px; border-radius: 99px; border: 1px solid var(--lumiverse-border, #444); background: none; color: var(--lumiverse-text-muted, #aaa); cursor: pointer; }
.rpgc-mind-step.on { background: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent-fg, #111); border-color: transparent; }
.rpgc-mind-step.hot.on { background: #d9534f; color: #fff; }
.rpgc-surv { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 4px; flex-wrap: wrap; }
.rpgc-surv .lbl { min-width: 60px; font-weight: 600; }
.rpgc-surv .num, .rpgc-surv .own { color: var(--lumiverse-text-muted, #aaa); font-size: 11px; }
.rpgc-surv.hot .num { color: #ff8c87; }
.rpgc-surv-acts { margin-top: 6px; }
.rpgc-abil { margin-bottom: 6px; }
.rpgc-abil h4 { margin: 0 0 3px; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--lumiverse-text-muted, #999); }
.rpgc-chip.abil em { font-style: normal; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.abil .lv, .rpgc-chip.abil .st { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.mind { border-color: #8a7fb8; color: #b7aee0; }
.rpgc-chip.carrier { border-color: #d9534f; color: #ff8c87; flex: none; }
.rpgc-guard .item.carrier .line { color: #ff8c87; }
.rpgc-hud-block { font-family: var(--lumiverse-font-mono, ui-monospace, monospace); font-size: 11px; padding: 5px 8px; margin: 3px 0; border-radius: 6px; border: 1px dashed var(--lumiverse-border, #444); white-space: pre-wrap; word-break: break-word; }
.rpgc-hud-block .row:first-child { font-weight: 600; }
.rpgc-hud-path .seg.fold { background: none; border: 1px dashed var(--lumiverse-border, #444); color: var(--lumiverse-text-muted, #999); font-style: italic; }
.rpgc-qcard { display: flex; align-items: center; gap: 6px; border-left-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-qcard.closing { border-left-color: #d8a33a; }
.rpgc-qcard.done { border-left-color: #5fae6e; }
.rpgc-qcard.failed { border-left-color: #d9534f; }
.rpgc-qcard.ended, .rpgc-qcard.hidden, .rpgc-qcard.other { border-left-color: var(--lumiverse-border-hover, #666); }
.rpgc .qst { margin-left: auto; font-size: 11px; padding: 0 6px; border-radius: 99px; border: 1px solid currentColor; white-space: nowrap; }
.rpgc .qst.active { color: var(--lumiverse-accent, #7aa2f7); } .rpgc .qst.closing { color: #e5c55a; } .rpgc .qst.done { color: #8fd18f; }
.rpgc .qst.failed { color: #ff8c87; } .rpgc .qst.ended, .rpgc .qst.hidden, .rpgc .qst.other { color: var(--lumiverse-text-muted, #999); }
.rpgc-objs { list-style: none; margin: 0 0 4px; padding: 0; display: flex; flex-direction: column; gap: 2px; font-size: 12px; }
.rpgc-objs li { display: flex; gap: 6px; }
.rpgc-objs li .mark { width: 12px; text-align: center; }
.rpgc-objs li.done { color: var(--lumiverse-text-muted, #999); text-decoration: line-through; }
.rpgc-objs li.done .mark { color: #8fd18f; text-decoration: none; }
.rpgc-objs li.active .mark { color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-journal li { flex-wrap: wrap; }
.rpgc-journal .path { width: 100%; font-size: 11px; color: var(--lumiverse-text-dim, #777); }
.rpgc-subdet > summary { cursor: pointer; font-size: 12px; color: var(--lumiverse-text-muted, #aaa); margin: 6px 0 3px; }
/* ── Party ── */
.rpgc-sec.alarm > summary .rpgc-sum-extra { color: #ff8c87; }
.rpgc-pcard { border: 1px solid var(--lumiverse-border, #333); border-left: 3px solid var(--lumiverse-accent, #7aa2f7); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; }
.rpgc-pcard.warn { border-left-color: #d8a33a; }
.rpgc-pcard.high { border-left-color: #d9534f; }
.rpgc-pcard.away { opacity: .82; }
.rpgc-pcard .head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rpgc-pcard .head .name { font-weight: 600; }
.rpgc-pcard .head .mood { font-style: italic; color: var(--lumiverse-text-muted, #aaa); font-size: 12px; }
.rpgc-pcard .head .rpgc-chip.here, .rpgc-pcard .head .rpgc-chip.away { margin-left: auto; }
.rpgc-pcard .head .rpgc-avatar { width: 22px; height: 22px; }
.rpgc-chip.here { border-color: #5fae6e; color: #8fd18f; }
.rpgc-chip.away { color: var(--lumiverse-text-muted, #999); }
.rpgc-chip.card em { font-style: normal; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.card.reg { border-color: #8a7fb8; }
.rpgc-chip.card.band { border-color: #d8a33a; }
.rpgc-chip.card.stage, .rpgc-chip.card.phase { border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-palerts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; font-size: 12px; }
.rpgc-palerts li { padding-left: 14px; position: relative; color: #e5c55a; }
.rpgc-palerts li::before { content: '!'; position: absolute; left: 3px; font-weight: 700; }
.rpgc-palerts li.high { color: #ff8c87; }
.rpgc-palerts li.info { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-pgroup { display: flex; flex-direction: column; gap: 2px; }
.rpgc-pgroup .gt { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-dim, #777); }
.rpgc-pdim { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.rpgc-pdim .lbl { min-width: 92px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-pdim .w { min-width: 58px; }
.rpgc-pdim.hot .w { color: #ff8c87; }
.rpgc-pdim .trend.worse { color: #ff8c87; } .rpgc-pdim .trend.better { color: #8fd18f; }
.rpgc-pdim .dur { color: var(--lumiverse-text-dim, #777); font-size: 11px; }
.rpgc-ladder.party > i.on { background: #d8a33a; }
.rpgc-ladder.party > i.on.hot { background: #d9534f; }
.rpgc-ladder.party > i.on.good { background: #5fae6e; }
.rpgc-ptell { font-size: 12px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-ptell em { font-style: normal; color: #d8a33a; }
.rpgc-pconcern { font-size: 12px; font-style: italic; border-left: 2px solid var(--lumiverse-border, #444); padding-left: 6px; }
.rpgc-suggest .rpgc-btn { font-size: 11px; padding: 2px 7px; }
/* ── Combat v2 ── */
.rpgc-fighter .power { font-size: 11px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-fighter .telegraph { font-size: 11px; font-style: italic; color: #e5c55a; border-left: 2px solid #d8a33a; padding-left: 5px; }
.rpgc-chip.threat { margin-left: auto; font-size: 10px; }
.rpgc-chip.threat.trivial, .rpgc-chip.threat.weaker { color: #8fd18f; border-color: #5fae6e; }
.rpgc-chip.threat.even { color: #e5c55a; border-color: #d8a33a; }
.rpgc-chip.threat.stronger, .rpgc-chip.threat.overwhelming { color: #ff8c87; border-color: #d9534f; }
.rpgc-intel { display: flex; flex-wrap: wrap; gap: 3px; }
.rpgc-chip.intel { font-size: 11px; text-align: left; cursor: default; background: none; }
button.rpgc-chip.intel { cursor: pointer; font: inherit; font-size: 11px; color: inherit; }
button.rpgc-chip.intel:hover { border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-chip.intel em { font-style: normal; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.intel.weakness { border-color: #5fae6e; } .rpgc-chip.intel.resist { border-color: #d9534f; }
.rpgc-chip.intel.intent, .rpgc-chip.intel.tell { border-color: #d8a33a; } .rpgc-chip.intel.power { border-color: #8a7fb8; }
.rpgc-order { display: flex; align-items: center; gap: 5px; font-size: 11px; flex-wrap: wrap; }
.rpgc-order .o { flex: 1; min-width: 0; color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-order .o.own { color: var(--lumiverse-text-dim, #777); font-style: italic; }
.rpgc-order .rpgc-btn { font-size: 11px; padding: 1px 7px; }
.rpgc-mpbar > i.mp { background: #6c8fd9; }
.rpgc-enc-tabs { display: flex; flex-wrap: wrap; gap: 4px; }
.rpgc-enc-tabs .n { opacity: .6; font-size: 10px; }
.rpgc-enc-tactics { display: flex; flex-wrap: wrap; gap: 4px; padding-top: 4px; border-top: 1px dashed var(--lumiverse-border, #444); }
.rpgc-enc-orderhead { display: flex; flex-direction: column; gap: 2px; }
.rpgc-btn .cost { opacity: .65; font-size: 10px; }
.rpgc-enc-log .order { color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-enc-log .intel { color: #e5c55a; }
.rpgc-enc-log .party.refused { color: #ff8c87; }
/* ── read-layer additions ── */
.rpgc-attrs { display: flex; flex-wrap: wrap; gap: 4px; }
.rpgc-attr { display: inline-flex; gap: 4px; align-items: baseline; font-size: 12px; padding: 1px 7px; border: 1px solid var(--lumiverse-border, #444); border-radius: 6px; }
.rpgc-attr b { font-size: 10px; letter-spacing: .04em; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-rolls { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; font-size: 12px; }
.rpgc-rollline.win b:last-child { color: #8fd18f; } .rpgc-rollline.lose b:last-child { color: #ff8c87; }
.rpgc-notices { list-style: none; margin: 4px 0 0; padding: 0; font-size: 12px; color: #e5c55a; }
.rpgc-cleared { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-bottom: 4px; }
.rpgc-cleared .rpgc-chip { display: inline-flex; gap: 3px; align-items: center; color: var(--lumiverse-text-muted, #aaa); }
/* ── Themes: variable overrides, so every component follows ── */
.rpgc.theme-parchment { --lumiverse-text: #3a2e1f; --lumiverse-text-muted: #6b5a43; --lumiverse-text-dim: #8a7a62; --lumiverse-border: #b89f78; --lumiverse-border-hover: #8f774f; --lumiverse-accent: #8b4513; --lumiverse-accent-fg: #fff8ec; background: linear-gradient(#f4e9d4, #eadbbd); font-family: Georgia, 'Palatino Linotype', serif; }
.rpgc.theme-midnight { --lumiverse-text: #e6e3ff; --lumiverse-text-muted: #a7a2d6; --lumiverse-text-dim: #77729f; --lumiverse-border: #3a3566; --lumiverse-border-hover: #5a52a0; --lumiverse-accent: #b388ff; --lumiverse-accent-fg: #150f2a; background: radial-gradient(circle at top, #221c44, #0e0b1f); }
.rpgc.theme-terminal { --lumiverse-text: #b8f5b0; --lumiverse-text-muted: #6fcf73; --lumiverse-text-dim: #3f8f45; --lumiverse-border: #1f5f2a; --lumiverse-border-hover: #2f8f3f; --lumiverse-accent: #39ff88; --lumiverse-accent-fg: #021; background: #050b06; font-family: ui-monospace, Menlo, Consolas, monospace; }
.rpgc.theme-sakura { --lumiverse-text: #4a2a3a; --lumiverse-text-muted: #8a5a70; --lumiverse-text-dim: #b08aa0; --lumiverse-border: #f0b8cc; --lumiverse-border-hover: #e08aa8; --lumiverse-accent: #d6457a; --lumiverse-accent-fg: #fff; background: linear-gradient(#fff4f8, #ffe6ef); }
/* ── People ── */
.rpgc-chip.standing { font-size: 11px; }
.rpgc-chip.standing.neg { color: #ff8c87; border-color: #d9534f; } .rpgc-chip.standing.pos { color: #8fd18f; border-color: #5fae6e; }
.rpgc-chip.standing.top { color: #ff9ec4; border-color: #d6457a; } .rpgc-chip.standing.neutral, .rpgc-chip.standing.unknown { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-person { border: 1px solid var(--lumiverse-border, #333); border-left: 3px solid var(--lumiverse-border-hover, #666); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 3px; }
.rpgc-person.neg { border-left-color: #d9534f; } .rpgc-person.pos { border-left-color: #5fae6e; } .rpgc-person.top { border-left-color: #d6457a; }
.rpgc-person .head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; } .rpgc-person .name { font-weight: 600; }
.rpgc-person .meta { margin-left: auto; font-size: 11px; color: var(--lumiverse-text-dim, #777); }
.rpgc-relrow { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.rpgc-relrow .lbl { min-width: 70px; color: var(--lumiverse-text-muted, #aaa); } .rpgc-relrow .v { min-width: 30px; text-align: right; font-variant-numeric: tabular-nums; }
.rpgc-relrow .d.up { color: #8fd18f; font-size: 11px; } .rpgc-relrow .d.down { color: #ff8c87; font-size: 11px; }
.rpgc-relbar { position: relative; flex: 1; height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 14%, transparent); overflow: hidden; }
.rpgc-relbar.two::after { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--lumiverse-text-dim, #777); }
.rpgc-relbar > i { position: absolute; top: 0; bottom: 0; left: 0; border-radius: 3px; } .rpgc-relbar > i.pos { background: #5fae6e; } .rpgc-relbar > i.neg { background: #d9534f; }
.rpgc-hearts, .rpgc-stars { color: #d6457a; letter-spacing: 1px; } .rpgc-stars { color: #e5c55a; } .rpgc-hearts .off, .rpgc-stars .off { opacity: .22; }
.rpgc-people-compact { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.rpgc-people-compact li { display: flex; align-items: center; gap: 6px; font-size: 12px; } .rpgc-people-compact .name { min-width: 90px; font-weight: 600; }
.rpgc-people-compact .rpgc-relrow { flex: 1; } .rpgc-people-compact .rpgc-relrow .lbl { display: none; }
.rpgc-codex { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 6px; }
.rpgc-codex-tile { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 4px; border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; text-align: center; font-size: 11px; }
.rpgc-codex-tile .glyph { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; background: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 22%, transparent); }
.rpgc-codex-tile .name { font-weight: 600; } .rpgc-codex-tile.neg .st { color: #ff8c87; } .rpgc-codex-tile.pos .st { color: #8fd18f; } .rpgc-codex-tile.top .st { color: #ff9ec4; }
.rpgc-filters .rpgc-btn { font-size: 11px; padding: 2px 8px; }
/* ── Phone ── */
.rpgc-phone-head { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; padding: 4px 8px; border-radius: 6px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 7%, transparent); }
.rpgc-phone-head .bal { font-weight: 600; font-variant-numeric: tabular-nums; }
.rpgc-thread { display: flex; flex-direction: column; gap: 4px; max-height: 260px; overflow-y: auto; padding: 4px 0; }
.rpgc-thread .msg { max-width: 82%; padding: 4px 9px; border-radius: 12px; font-size: 12px; line-height: 1.35; }
.rpgc-thread .msg.in { align-self: flex-start; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 12%, transparent); }
.rpgc-thread .msg.out { align-self: flex-end; background: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent-fg, #111); }
.rpgc-thread .msg.call, .rpgc-thread .msg.pay { align-self: center; background: none; color: var(--lumiverse-text-muted, #aaa); font-style: italic; }
.rpgc-contacts li { align-items: center; } .rpgc-contacts .prev { color: var(--lumiverse-text-dim, #777); font-size: 11px; }
.rpgc-linkbtn { appearance: none; background: none; border: 0; padding: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; }
/* ── Fights: D&D and outcomes ── */
.rpgc-initiative { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; font-size: 11px; }
.rpgc-initiative .slot { padding: 1px 7px; border: 1px solid var(--lumiverse-border, #444); border-radius: 99px; }
.rpgc-initiative .slot.you { border-color: var(--lumiverse-accent, #7aa2f7); } .rpgc-initiative .slot.out { opacity: .4; text-decoration: line-through; }
.rpgc-ac { margin-left: 6px; font-size: 10px; padding: 0 5px; border: 1px solid var(--lumiverse-border, #555); border-radius: 4px; }
.rpgc-deathsaves { font-size: 12px; letter-spacing: 2px; color: #8fd18f; } .rpgc-deathsaves .fail { color: #ff8c87; } .rpgc-deathsaves .off { opacity: .3; }
.rpgc-outcome { margin-left: 6px; font-size: 10px; padding: 0 5px; border-radius: 99px; border: 1px solid currentColor; }
.rpgc-outcome.success { color: #8fd18f; } .rpgc-outcome.partial { color: #e5c55a; } .rpgc-outcome.fail { color: #ff8c87; }
/* ── Relationship cards ── */
.rpgc-relmood { display: flex; gap: 10px; align-items: baseline; font-size: 12px; }
.rpgc-relmood .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--lumiverse-text-dim, #777); }
.rpgc-relgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px 12px; }
.rpgc-reltile { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.rpgc-reltile .top { display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; }
.rpgc-reltile .lbl { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-reltile .v { font-weight: 700; font-variant-numeric: tabular-nums; } .rpgc-reltile .v small { font-weight: 400; opacity: .6; }
.rpgc-reltile .rpgc-relbar { flex: none; height: 5px; }
.rpgc-reltile .why { font-size: 11px; line-height: 1.3; } .rpgc-reltile .why.up { color: #5fd18f; } .rpgc-reltile .why.down { color: #ff8c87; }
.rpgc-chip.bond { font-size: 11px; color: var(--lumiverse-accent, #7aa2f7); border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-chip.bond.pinned::after { content: ' \u2713'; }
.rpgc-chip.minor { font-size: 10px; color: #8fd18f; border-color: #5fae6e; }
.rpgc-dossier { display: grid; grid-template-columns: max-content 1fr; gap: 3px 12px; font-size: 12px; padding: 5px 0; border-top: 1px dashed var(--lumiverse-border, #444); }
.rpgc-dossier .row { display: contents; }
.rpgc-dossier .k { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--lumiverse-text-dim, #777); padding-top: 2px; }
.rpgc-dossier .v { font-style: italic; }
.rpgc-dossier .row.secret .k { color: #ff8c87; } .rpgc-dossier .row.secret .v { color: #ffb3ae; }
/* ── Test zone ── */
.rpgc-tz { display: flex; flex-direction: column; gap: 8px; padding: 10px; border: 1px dashed var(--lumiverse-accent, #7aa2f7); border-radius: 10px; background: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 6%, transparent); }
.rpgc-tz-banner { display: flex; flex-direction: column; gap: 2px; font-size: 12px; } .rpgc-tz-banner strong { font-size: 13px; color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-tz-log { display: flex; flex-direction: column; gap: 5px; max-height: 280px; overflow-y: auto; font-size: 12px; }
.rpgc-tz-log .msg { display: flex; gap: 6px; align-items: baseline; } .rpgc-tz-log .who { font-weight: 700; min-width: 38px; flex: none; }
.rpgc-tz-log .msg.user .who { color: var(--lumiverse-accent, #7aa2f7); } .rpgc-tz-log .txt { white-space: pre-wrap; word-break: break-word; }
/* ── Density and text size ── */
.rpgc.density-compact { gap: 6px; padding: 6px 6px 16px; }
.rpgc.density-compact .rpgc-body { gap: 4px; } .rpgc.density-compact .rpgc-person, .rpgc.density-compact .rpgc-pcard { padding: 4px 6px; }
.rpgc.text-small { font-size: 12px; } .rpgc.text-large { font-size: 15px; }
/* ── 1.9 panels ── */
.rpgc-you-head { display: flex; flex-wrap: wrap; gap: 4px; }
.rpgc-chip.hot { color: #ff8c87; border-color: #d9534f; }
.rpgc-vital.levelup .lbl { color: #e5c55a; } .rpgc-chip.levelup { margin-left: auto; color: #e5c55a; border-color: #d8a33a; }
.rpgc-modgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 4px 10px; }
.rpgc-mod { display: flex; gap: 6px; align-items: center; font-size: 12px; cursor: pointer; } .rpgc-mod:not(.on) span { opacity: .55; }
.rpgc-qcard { flex-direction: column; align-items: stretch; gap: 3px; } .rpgc-qcard .qhead { display: flex; align-items: center; gap: 6px; }
.rpgc-qcard .obj { font-size: 12px; } .rpgc-qcard.focus { box-shadow: 0 0 0 1px #e5c55a inset; } .rpgc-mini.star { color: #e5c55a; }
.rpgc-float { position: fixed; z-index: 9990; width: 380px; height: 70vh; min-width: 260px; min-height: 160px; display: flex; flex-direction: column; resize: both; overflow: hidden;
    border: 1px solid var(--lumiverse-border, #444); border-radius: 10px; background: var(--lumiverse-bg, #15151b); box-shadow: 0 10px 40px rgba(0,0,0,.5); }
.rpgc-float.big { width: 640px; height: 88vh; } .rpgc-float.min { height: auto !important; resize: none; } .rpgc-float.min > .rpgc { display: none; }
.rpgc-float-bar { display: flex; align-items: center; gap: 4px; padding: 5px 8px; cursor: move; user-select: none; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 8%, transparent); }
.rpgc-float-bar .ttl { flex: 1; font-weight: 700; font-size: 12px; } .rpgc-float > .rpgc { flex: 1; overflow-y: auto; }
.rpgc-parked { padding: 16px; }
/* ── wiki banners: section headers and cards take a world's wiki look through these variables ── */
.rpgc .rpgc-sec > summary { background: var(--rpgc-banner-bg, transparent); color: var(--rpgc-banner-fg, inherit); border-radius: var(--rpgc-banner-radius, inherit); justify-content: var(--rpgc-banner-align, flex-start); }
.rpgc .rpgc-sec > summary .rpgc-sum-extra { color: var(--rpgc-banner-muted, var(--lumiverse-text-muted, #999)); }
.rpgc .rpgc-sec { background: var(--rpgc-card-bg, var(--lumiverse-fill-subtle, transparent)); }
.rpgc .rpgc-person > .head, .rpgc .rpgc-pcard > .head { background: var(--rpgc-infobox-bg, transparent); color: var(--rpgc-infobox-fg, inherit); margin: var(--rpgc-infobox-margin, 0); padding: var(--rpgc-infobox-pad, 0); border-radius: 6px 6px 0 0; }
.rpgc .rpgc-filters .rpgc-btn.primary, .rpgc .rpgc-enc-tabs .rpgc-btn.primary { background: var(--rpgc-tab-bg, var(--lumiverse-accent, #7aa2f7)); color: var(--rpgc-tab-fg, var(--lumiverse-accent-fg, #111)); }
/* Re:Zero wiki: near-black panels, violet banners, cyan links, an icy frame */
.rpgc.theme-rezero { --lumiverse-text: #ecebf5; --lumiverse-text-muted: #b3aed0; --lumiverse-text-dim: #7d7899; --lumiverse-border: #3a2f5c; --lumiverse-accent: #2ad4cf; --lumiverse-accent-fg: #06201f;
    --rpgc-banner-bg: #7b5bb8; --rpgc-banner-fg: #fff; --rpgc-banner-muted: #e6ddff; --rpgc-card-bg: #0f0d15; --rpgc-infobox-bg: #6a2dff; --rpgc-infobox-fg: #fff; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #5b2bff; --rpgc-tab-fg: #fff;
    background: linear-gradient(#0b0a10, #0b0a10) padding-box, linear-gradient(160deg, #cfe7f7, #8fb6db 45%, #e8f4fb) border-box; border: 3px solid transparent; }
/* Overlord wiki: charcoal, grey uppercase banners, blue links, deep red */
.rpgc.theme-overlord { --lumiverse-text: #eaeaea; --lumiverse-text-muted: #b8b8b8; --lumiverse-text-dim: #858585; --lumiverse-border: #4a4a4a; --lumiverse-accent: #7fa8ff; --lumiverse-accent-fg: #0a1020;
    --rpgc-banner-bg: linear-gradient(#444, #333); --rpgc-banner-fg: #fff; --rpgc-banner-muted: #d0d0d0; --rpgc-card-bg: #161616; --rpgc-infobox-bg: #3a3a3a; --rpgc-infobox-fg: #fff; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #555; --rpgc-tab-fg: #fff;
    background: radial-gradient(ellipse at top, #2a0d0d, #0c0c0c 55%); font-family: Georgia, 'Times New Roman', serif; }
.rpgc.theme-overlord .rpgc-sec > summary { text-transform: uppercase; letter-spacing: .05em; }
/* Classroom of the Elite wiki: sky page, white cards, magenta accent, red infobox headers */
.rpgc.theme-cote { --lumiverse-text: #1d2433; --lumiverse-text-muted: #4f5b70; --lumiverse-text-dim: #7c889c; --lumiverse-border: #f0bdd0; --lumiverse-accent: #e3326f; --lumiverse-accent-fg: #fff;
    --rpgc-banner-bg: linear-gradient(#f0578e, #d92a62); --rpgc-banner-fg: #fff; --rpgc-banner-muted: #ffe3ee; --rpgc-card-bg: #ffffff; --rpgc-infobox-bg: #d61f3c; --rpgc-infobox-fg: #fff; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #e2335e; --rpgc-tab-fg: #fff;
    background: linear-gradient(#cfe6f8, #e8f3fc 40%, #dbeefb); font-family: 'Segoe UI', system-ui, sans-serif; }
/* Mushoku Tensei wiki: cream cards, a red header bar, brown-orange tabs */
.rpgc.theme-mushoku { --lumiverse-text: #3b2a1e; --lumiverse-text-muted: #6d5642; --lumiverse-text-dim: #9a846c; --lumiverse-border: #e2cfae; --lumiverse-accent: #b5652a; --lumiverse-accent-fg: #fff;
    --rpgc-banner-bg: #c0392b; --rpgc-banner-fg: #fff; --rpgc-banner-muted: #ffe0d8; --rpgc-card-bg: #fdf7ea; --rpgc-infobox-bg: #b83a2f; --rpgc-infobox-fg: #fff; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #b5652a; --rpgc-tab-fg: #fff;
    background: linear-gradient(#f3e3c4, #faf1de 30%, #efd9b4); }
/* D&D: a player's handbook — parchment, dragon red, serif */
.rpgc.theme-dnd { --lumiverse-text: #2b1d12; --lumiverse-text-muted: #5b4632; --lumiverse-text-dim: #8b7358; --lumiverse-border: #c9ad7f; --lumiverse-accent: #9b1c1c; --lumiverse-accent-fg: #fff5e6;
    --rpgc-banner-bg: #8e1b1b; --rpgc-banner-fg: #f7e9cf; --rpgc-banner-muted: #f0d9b0; --rpgc-card-bg: #f6ecd6; --rpgc-infobox-bg: #58180d; --rpgc-infobox-fg: #f7e9cf; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #9b1c1c; --rpgc-tab-fg: #fff5e6;
    background: #eee0c2; font-family: 'Bookman Old Style', Georgia, serif; }
/* Heaven: ivory, gold, soft sky */
.rpgc.theme-heaven { --lumiverse-text: #3b3526; --lumiverse-text-muted: #6d6550; --lumiverse-text-dim: #9d9478; --lumiverse-border: #eadba8; --lumiverse-accent: #c79a2a; --lumiverse-accent-fg: #fff;
    --rpgc-banner-bg: linear-gradient(90deg, #f6e7b0, #fff8e1, #f6e7b0); --rpgc-banner-fg: #5a4710; --rpgc-card-bg: rgba(255,255,255,.75); --rpgc-tab-bg: #c79a2a; --rpgc-tab-fg: #fff;
    background: radial-gradient(ellipse at top, #ffffff, #eaf5ff 55%, #fdf6e0); }
/* Horror: black, bone, dried blood */
.rpgc.theme-horror { --lumiverse-text: #d6cfcf; --lumiverse-text-muted: #9b8f8f; --lumiverse-text-dim: #6c6262; --lumiverse-border: #3a1010; --lumiverse-accent: #a30f0f; --lumiverse-accent-fg: #fff;
    --rpgc-banner-bg: linear-gradient(#240707, #140404); --rpgc-banner-fg: #e8d9d9; --rpgc-card-bg: #0d0a0a; --rpgc-infobox-bg: #3a0808; --rpgc-infobox-fg: #f0e0e0; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #6e0b0b; --rpgc-tab-fg: #fff;
    background: radial-gradient(ellipse at center, #140909, #030202 75%); font-family: Georgia, serif; }
/* ── World themes ── */
/* Undertale: black boxes, white borders, pixel type, the yellow of MERCY and the orange of the buttons */
.rpgc.theme-undertale { --lumiverse-text: #ffffff; --lumiverse-text-muted: #c8c8c8; --lumiverse-text-dim: #8a8a8a; --lumiverse-border: #ffffff; --lumiverse-accent: #ffe600; --lumiverse-accent-fg: #000;
    --rpgc-banner-bg: #000; --rpgc-banner-fg: #fff; --rpgc-banner-muted: #ffe600; --rpgc-card-bg: #000; --rpgc-infobox-bg: #000; --rpgc-infobox-fg: #ffe600; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #ff7f27; --rpgc-tab-fg: #000;
    background: #000; font-family: 'Determination Mono', 'Press Start 2P', 'VT323', 'Courier New', monospace; letter-spacing: .02em; }
.rpgc.theme-undertale .rpgc-sec { border: 2px solid #fff; border-radius: 0; }
.rpgc.theme-undertale .rpgc-sec > summary::before { content: '* '; color: #fff; }
.rpgc.theme-undertale .rpgc-btn { border-radius: 0; border-color: #ff7f27; color: #ff7f27; }
.rpgc.theme-undertale .rpgc-btn.primary { background: #ff7f27; color: #000; }
/* Dark Souls: ash and stone, ember light, carved serif capitals */
.rpgc.theme-darksouls { --lumiverse-text: #d9d1c0; --lumiverse-text-muted: #a69c88; --lumiverse-text-dim: #716a5e; --lumiverse-border: #3b342a; --lumiverse-border-hover: #6a5a44; --lumiverse-accent: #e07b39; --lumiverse-accent-fg: #140a04;
    --rpgc-banner-bg: linear-gradient(#2a241c, #17130e); --rpgc-banner-fg: #eadcb8; --rpgc-banner-muted: #bfae88; --rpgc-card-bg: #12100d; --rpgc-infobox-bg: #2a2117; --rpgc-infobox-fg: #f0e2c0; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #8a4a1f; --rpgc-tab-fg: #fff3e6;
    background: radial-gradient(ellipse at bottom, rgba(224,123,57,.14), transparent 60%), linear-gradient(#0f0e0c, #070605); font-family: 'Optimus Princeps', 'Cinzel', 'Trajan Pro', Georgia, serif; }
.rpgc.theme-darksouls .rpgc-sec > summary { text-transform: uppercase; letter-spacing: .08em; }
/* Skyrim: smoke-black menus, bone-white type, thin rules, pale gold */
.rpgc.theme-skyrim { --lumiverse-text: #ebe6d6; --lumiverse-text-muted: #b5ae9b; --lumiverse-text-dim: #7e796c; --lumiverse-border: #4a473f; --lumiverse-border-hover: #7a7564; --lumiverse-accent: #d9c58a; --lumiverse-accent-fg: #15130c;
    --rpgc-banner-bg: linear-gradient(90deg, transparent, rgba(235,230,214,.14), transparent); --rpgc-banner-fg: #f1ebd8; --rpgc-banner-muted: #c9c1aa; --rpgc-card-bg: rgba(14,14,13,.9); --rpgc-infobox-bg: #1d1c19; --rpgc-infobox-fg: #f1ebd8; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #3a372f; --rpgc-tab-fg: #f1ebd8;
    background: radial-gradient(ellipse at top, #22242a, #0b0b0b 65%); font-family: Futura, 'Century Gothic', 'Trebuchet MS', sans-serif; }
.rpgc.theme-skyrim .rpgc-sec > summary { text-transform: uppercase; letter-spacing: .14em; font-weight: 400; border-top: 1px solid rgba(235,230,214,.25); border-bottom: 1px solid rgba(235,230,214,.25); }
.rpgc.theme-hell { --lumiverse-text: #ffd9cf; --lumiverse-text-muted: #e09a88; --lumiverse-text-dim: #a8624f; --lumiverse-border: #5a1a12; --lumiverse-border-hover: #8a2a1a; --lumiverse-accent: #ff4d2e; --lumiverse-accent-fg: #1a0200; background: radial-gradient(ellipse at bottom, #3a0a04, #0d0202 70%); }
.rpgc.theme-space { --lumiverse-text: #d8ecff; --lumiverse-text-muted: #93b4d6; --lumiverse-text-dim: #5c7897; --lumiverse-border: #1b2a44; --lumiverse-border-hover: #2d4670; --lumiverse-accent: #4fd1ff; --lumiverse-accent-fg: #021018;
    background: radial-gradient(1px 1px at 12% 18%, #fff, transparent), radial-gradient(1px 1px at 68% 34%, #cfe8ff, transparent), radial-gradient(1.5px 1.5px at 40% 72%, #fff, transparent), radial-gradient(1px 1px at 86% 82%, #bfe0ff, transparent), radial-gradient(ellipse at top, #0e1a33, #04060d 70%); }
.rpgc-weather-layer { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.rpgc-wp { position: absolute; will-change: transform; }
.rpgc-snow { color: #fff; opacity: .85; animation: rpgc-fall linear infinite; top: -5%; }
.rpgc-rain { width: 2px; height: 14px; background: linear-gradient(transparent, rgba(174,194,224,.75)); animation: rpgc-rain linear infinite; top: -5%; }
.rpgc-mist { left: -20%; width: 140%; height: 40%; background: radial-gradient(ellipse at center, rgba(200,200,210,.16), transparent 70%); animation: rpgc-drift ease-in-out infinite alternate; }
.rpgc-leaf { color: rgba(210,200,170,.6); animation: rpgc-wind linear infinite; top: -5%; }
.rpgc-flash { position: absolute; inset: 0; background: rgba(255,255,255,.5); opacity: 0; animation: rpgc-flash ease-out infinite; }
.rpgc-glow { position: absolute; border-radius: 50%; filter: blur(30px); }
@keyframes rpgc-fall { to { transform: translateY(110vh) translateX(4vw); } }
@keyframes rpgc-rain { to { transform: translateY(110vh); } }
@keyframes rpgc-drift { to { transform: translateX(8%); } }
@keyframes rpgc-wind { to { transform: translate(110vw, 20vh) rotate(360deg); } }
@keyframes rpgc-flash { 0%,92%,100% { opacity: 0; } 94% { opacity: .8; } 96% { opacity: .1; } 98% { opacity: .6; } }
@media (prefers-reduced-motion: reduce) { .rpgc-wp, .rpgc-flash { animation: none !important; } .rpgc-flash { display: none; } }
@media (prefers-reduced-motion: reduce) { .rpgc-bar > i { transition: none; } }
/* ── The guide: roomy lines, left-aligned, nothing justified ── */
.rpgc-guide { font-size: 14px; line-height: 1.65; }
.rpgc-guide .rpgc-body p { margin: 0 0 10px; }
.rpgc-guide h4 { margin: 14px 0 6px; font-size: 14px; }
.rpgc-guide ul, .rpgc-guide ol { margin: 0 0 10px; padding-left: 20px; }
.rpgc-guide li { margin: 3px 0; }
.rpgc-guide code { font-family: ui-monospace, monospace; font-size: 12.5px; padding: 0 3px; border-radius: 4px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 10%, transparent); }
.rpgc-guide pre { white-space: pre-wrap; word-break: break-word; font-family: ui-monospace, monospace; font-size: 12px; line-height: 1.5; padding: 8px; border-radius: 6px; margin: 0 0 10px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 7%, transparent); }
.rpgc-guide table { width: 100%; border-collapse: collapse; margin: 0 0 12px; font-size: 13px; line-height: 1.5; }
.rpgc-guide th, .rpgc-guide td { text-align: left; vertical-align: top; padding: 5px 6px; border-bottom: 1px solid var(--lumiverse-border, #333); }
.rpgc-guide th { font-weight: 600; }
.rpgc-guide .rpgc-guide-intro { font-size: 13px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-guide input[type=search] { font-size: 14px; padding: 7px 9px; margin: 6px 0 10px; }
.rpgc-guide mark { background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 35%, transparent); color: inherit; border-radius: 3px; }
`;

// The guide, embedded from GUIDE.md so it ships inside the extension (tools/embed_guide.py refreshes it).
const GUIDE_MD = /* GUIDE:BEGIN */ "# HMS Guide\n\n**RPG Companion HMS Edition 2.0 beta** and **HMS Reporter beta**\n\nThis guide explains how an HMS game works, how to set it up, and what every part does.\nRead **Start here** first. Use the other parts when you need them.\n\n---\n\n## 1. Start here: three parts, one game\n\nAn HMS game has three parts. Each part has one job.\n\n| Part | What it is | Its job |\n| --- | --- | --- |\n| **The bot** | The character card and its lorebooks: Re:Zero, Mushoku Tensei, Classroom of the Elite or Overlord | The world and its rules. It writes the **WORLD STATE HUD** at the top of every reply. |\n| **HMS Reporter beta** | A preset: the prompt Lumiverse sends | How the story under the HUD is written: style, voices, length, thinking. |\n| **RPG Companion HMS Edition 2.0 beta** | An extension: the side panel | It reads the HUD and shows it as cards. It tracks people, quests, fights and more. It helps you start a game and ask questions. |\n\n### Who is in charge\n\nWhen two parts disagree, this order wins:\n\n1. **The bot.** Its rules and its HUD are the law. The bots call this **STATE IS GOD**. Nothing may hide, change or replace the HUD.\n2. **The preset.** It only shapes the story under the HUD. It never changes a rule or a HUD line.\n3. **The extension.** It reads and shows. It asks the model for one small hidden block after the story. It never writes a HUD of its own and never adds rules.\n\n### What a reply looks like\n\n```\n### WORLD STATE ###\nDay: 3 | Time: 14:10 (Afternoon)\n\u25c6 World of Re:Zero \u2192 Lugunica \u2192 Roswaal Mansion\nArc: Arc 2: A Week at the Mansion\n***\nThe story...\n<rpg_companion>{ ... }<\/rpg_companion>\n```\n\n- **The HUD** is the top part, from `### WORLD STATE ###` down to the `***` line. It belongs to the bot.\n- **The wall** is the `***` line.\n- **The story** comes under the wall. It follows the bot's rules, written in the preset's style.\n- **The hidden block** comes last. It belongs to the extension. You never see it: it is removed from the saved message.\n\n### Who owns what\n\n| Thing | Owner | Notes |\n| --- | --- | --- |\n| The HUD: time, place, arc, powers, money | Bot | The extension only reads it. |\n| Rules: death, power gaps, Return by Death, exams | Bot | Fights in the extension use the bot's own rules. |\n| Start commands and the catalog | Bot | The New game card only fills them in for you. |\n| OOC answers | Bot (its guide character) | The OOC card asks that same guide. |\n| Injuries in Re:Zero and Mushoku Tensei | Bot | These bots keep wounds on their HUD. The extension stays out. |\n| Injuries in Classroom of the Elite and Overlord | Extension | These bots keep no wounds. The Injuries card tracks them. |\n| How the story reads, its length, thinking | Preset | Set them under the sliders icon. |\n| Emoji and dialogue colours | Extension | Drawn on your screen. The preset never writes emoji. |\n| Side panel, map, Chronicle, people, quests | Extension | Read from the HUD and the hidden block. |\n\n---\n\n## 2. Install and set up\n\nYou need **Lumiverse 1.2.0 or newer**.\n\n### Step 1: Remove the old RPG Companion\n\nIf you have the original RPG Companion extension, disable or remove it. Both would add to your prompt.\n\n### Step 2: Install the extension\n\n1. Open the drawer and go to **Extensions**.\n2. Click **Add Extension**.\n3. Pick one way:\n    - **Install from Source**: paste the extension's GitHub link.\n    - **Import Local** (owner or admin only): first put the `rpg_companion_hms` folder in `Lumiverse/data/extensions/`.\n4. Read the permissions and click **Install**.\n5. New extensions start switched off. Turn **Enable** on.\n6. Grant the permissions. You can skip any. That part then switches off and tells you why.\n\n| Permission | What it is for |\n| --- | --- |\n| interceptor | Adds the extension's small request to your prompt. |\n| generation | The extension's own model calls: fights, the OOC guide, chapter summaries, a missed side-panel block. |\n| chat_mutation | Keeps the hidden block out of saved replies, puts back HUD lines, and posts your new-game, phone and Move the world turns. |\n| world_books | Reads your lorebooks: the Atlas, the Arc line check, the OOC guide, lore for fights. |\n| memories | Uses Lumiverse's Memory Cortex: the Chronicle writes to it, fights read from it. |\n| image_gen | Character portraits only. |\n\n### Step 3: Import the preset\n\n1. Open the **Preset Manager** in Lumiverse.\n2. Import the file `HMS_Reporter_beta.json`. It comes with the extension, in its `preset` folder.\n3. Choose **HMS Reporter beta** as the preset for your HMS chats.\n\n### Step 4: Open the panel\n\nOpen a chat with an HMS bot. Then open the **RPG Companion (HMS)** tab in the side drawer.\n\n### Step 5: Use your world's preset\n\nAfter the first reply, the panel offers **Use the [world] preset**. Click it.\nIt sets the right cards, fights and theme for that bot in one click.\nYou can also do this later in **Settings \u2192 Play style**.\n\n### Good settings to start with\n\n- Preset sliders: **Thinking: Normal**, **Prose length: Scene-led**, **Start replies with the HUD header: Auto**.\n- Lumiverse: switch on the **Memory Cortex** if you want the Chronicle to remember key moments.\n- Extension: keep **Together** mode (Settings \u2192 General).\n- Want emoji or coloured dialogue? Settings \u2192 **Chat and panel extras** \u2192 **Dialogue**. They are off at first.\n\n---\n\n## 3. Start a new game\n\n### The catalog\n\nEvery HMS bot opens on a **catalog**. Its first message has many pages. Swipe left and right to see them.\n\n- **The hub page** says how to start, and names the **start handler** line.\n- **The canvas page** is almost empty. You type your start under it.\n- **Command pages** list starts, add-ons and ready-made examples.\n\n### The start handler line\n\nYour first message must begin with the bot's start line, on a line of its own.\n\n| Bot | First line | Line to resume an old campaign |\n| --- | --- | --- |\n| Re:Zero | `ReZero_Start_Handler` | `ReZero_Start_Continuer` |\n| Mushoku Tensei | `MUSHOKU_TENSEI_START_HANDLER` | `MUSHOKU_TENSEI_START_CONTINUER` |\n| Classroom of the Elite | `Cote_Start_Handler` | `Cote_Start_Continuer` |\n| Overlord | `Overlord_Start_Handler` | `Overlord_Start_Continuer` |\n\nThen come your commands. For example:\n\n```\nReZero_Start_Handler\nStart at Arc 3 with RBD, Hell Mode, Start with Echidna\n```\n\n### The New game card (the easy way)\n\nOn a new chat, the panel shows **New game**. It reads the catalog pages for you.\n\n1. Pick a page at the top.\n2. Pick one **start**.\n3. Pick any **add-ons**. Add-ons stack on a start.\n4. Fill any blanks, like `[Name]`.\n5. Read the warnings. For example: no start yet, an empty blank, or no Return by Death in Re:Zero. One click adds `with RBD`.\n6. Press **Start the game**.\n\nThe card turns the greeting to the canvas page and sends your command. You can also edit the command by hand, **Copy** it, or **Clear** it.\n\n### Resume an old campaign\n\nInside the New game card, open **Resume an old campaign instead**.\n\n1. Paste the last HUD from your old chat. This is your save file.\n2. If you have them, paste your last few messages and a summary of the story.\n3. Press **Resume the campaign**.\n\nThe card puts the bot's Continuer line first, as the bot asks.\n\n### After the first reply\n\n- The bot builds the HUD on turn 1. From then on it carries it in every reply.\n- **Arc line check.** The Arc line is a lookup key. If it is misspelled, the arc's lore never loads. The World State card warns you and offers the book's spelling in one click.\n\n---\n\n## 4. What happens each turn\n\n1. You write what you do, and send it.\n2. The preset builds the prompt: the bot's card and engine, your lore, memory, the chat, and the extension's small request.\n3. The model writes the HUD, the `***` wall, the story, and the hidden block.\n4. The extension reads the reply:\n    - It reads the HUD and updates the cards.\n    - It reads the hidden block (people, quests, phone, injuries), then removes it from the saved message.\n    - It checks for HUD lines that vanished, and puts back lines you pinned.\n    - It draws the HUD as a card in the chat, and dialogue colours and emoji if you switched them on.\n5. When you answer a reply, that reply is settled. The Chronicle then writes its key moments to the Memory Cortex.\n\n### The button row\n\n| Button | What it does |\n| --- | --- |\n| **Move the world** | You do nothing new. One story thread off screen moves one step. |\n| **Immersive fight** | Starts a fight you play in the chat. The panel tracks it. |\n| **Turn-based fight** | Opens the D&D fight window. Only when D&D is on. |\n| **Read again** | Reads the latest reply again. Free: no model call. Use it when a card did not update. |\n\n### The top bar\n\n| Item | What it does |\n| --- | --- |\n| Together mode / Separate mode / Paused | Shows how the extension gets its data. See Settings \u2192 General. |\n| **Refresh** | Asks the model again for the side-panel data. This costs a call. |\n| Drawer / Floating / Own window | Where the panel lives: in the drawer, floating over the chat, or in its own window for a second screen. |\n| **Test zone** | A practice chat inside the extension. Demo mode costs nothing. |\n| **Guide** | This guide. |\n| **Settings** | All settings. |\n\n### Buttons in the chat input bar\n\n**Refresh side panel**, **Open RPG Companion**, **Start or resume a fight**, and **Move the world**.\n\n---\n\n## 5. HMS Reporter beta (the preset)\n\n### What it does\n\nHMS Reporter beta tells the model how to write the story under the wall. It always puts the bot first. It says: the core and its lorebook entries outrank everything in this preset.\n\n### The blocks, top to bottom\n\n| Block | On at first? | What it does |\n| --- | --- | --- |\n| Frame | On | Says who is in charge and the reply shape: HUD, wall, story, then the hidden block if one is asked for. Explains OOC messages. |\n| Game card | On | The bot's description and its system prompt. |\n| HMS core (personality field) | On | The bot's engine: its rules and its HUD. |\n| Scenario | On | The card's scenario, if it has one. |\n| Player persona | On | Your persona. |\n| Example messages | On | Style examples only. |\n| Reporter: how the prose reads | On | Lead with what changed. Use exact details. Show only what you can see. End where the world hands it back. Cut stock phrases. |\n| Voices and groups | On | People speak briefly and in their own voice. Nobody reads minds. Groups talk to each other. |\n| The player's character | On | The model never writes your choices, words or thoughts. A Narrative Mode from the bot can change this. |\n| Mature content (adults only) | Off | Adult scenes between adults only. Minors and family bonds always stay non-explicit. |\n| Gore | Off | Shows violence without softening it. |\n| World info (before) and (after) | On | Your lorebook entries. |\n| Memory (Chat Memory and Memory Cortex) | On | Lumiverse's long-term memory. |\n| Story summary (Loom Summary) | Off | Lumiverse's own summary. Turn it on only if you use it instead of Chapters. |\n| Chat history | On | The chat itself. |\n| Card's post-history instructions | On | Anything the card puts after the chat. |\n| Fight craft | Fights only | Loads by itself during fights: wind-ups, the room in the fight, impact before pain. |\n| Side panel (RPG Companion) | On | The extension's request goes here. It stays empty without the extension and on OOC turns. |\n| Before you write | On | Thinking, length, and the dialogue marker reminder. On an OOC turn: answer out of character. |\n\n### Your settings: the sliders icon\n\n| Setting | Choices | Tip |\n| --- | --- | --- |\n| Thinking | Off, Light, Normal (default), Deep | Deep plans many moves ahead. It is the slowest. |\n| Think out loud | On or off | For models that cannot think by themselves. Also switch on Auto-parse thoughts in Lumiverse, so the plan folds away. |\n| Prose length | Brief, Scene-led (default), Long, Very long | The HUD never counts toward the length. |\n| Start replies with the HUD header | Auto (default), Always, Never | Auto helps only Kimi and DeepSeek. Use Always only if a model keeps skipping the HUD, with thinking off. |\n\n### OOC messages\n\nStart a message with the bot's OOC trigger, like `[OOC: ...]` or `OOC guide: ...`.\nThe preset then asks for an answer out of character: no HUD, no story, no hidden block, and no time passes.\n\n---\n\n## 6. The extension's cards\n\nThe panel shows one card per thing. A card only shows when it has something to show.\nClick a card's title to fold or unfold it.\n\n### New game\nOnly on a new chat. See part 3.\n\n### World State\nThe HUD, line by line.\n\n- **Pin** a line (the pin icon) to keep it exactly as it is. If the model drops or changes it, the extension puts it back. The model is also reminded.\n- **The guard.** If a line vanishes, you see it with **Restore**. A carrier line (one that keeps lore loaded, like the Arc line) is marked, because losing it hides lore.\n- Lines that end by their own rules (a healed injury, a passed exam) show as **cleared**, with a put-back button.\n- If a reply has no HUD at all, press **Put the last HUD back**.\n- The **Arc line check** warns when the Arc line loads no arc lore, and fixes it in one click.\n\n### The world card\nOne card per world: **Re:Zero**, **Overlord**, **Classroom of the Elite**, **Mushoku Tensei**, **Undertale**, **Dark Souls** and **Skyrim**.\nIt shows that world's own stats from the HUD, explained from your lorebooks. Some examples:\n\n- Re:Zero: deaths and the save point, Authorities, spirit contracts and their ranks.\n- Overlord: levels and classes, with a check that they add up.\n- Classroom of the Elite: the calendar, class standings, Private Points, the exam.\n- Mushoku Tensei: sword styles and magic ranks, and the Man-God's advice.\n\n### Map\nWhere everyone stands in the room. It is off at first: Settings \u2192 Chat and panel extras \u2192 **Map**.\nA room is drawn once, then only people move. The **map bank** keeps every drawn room for that world, so a place is never paid for twice.\n\n### Atlas\nThe bot's location book as a map. It shows where you are, the rooms around you, and details for any place: how watched it is, opening hours, who is usually there.\nClick a place to go in, **Up** to go out.\n\n### You\nYour own state: health and other pools, meters, mood, stress and sanity.\nLevel and experience show only in worlds that have levels.\n**Standard issue** lists things the bot assumes you have. **Carried** lists small things you got in the story. You can add or remove them.\n\n### D&D\nA character sheet and a dice roller. Your roll goes into your next message.\nSwitch it off in Settings \u2192 Modules if your game does not use dice.\n\n### People\nEveryone you have met. Each person shows:\n\n- **Standing**: how close they feel to you, from Nemesis to Devoted. It is never romance.\n- **Bond**: what kind of relationship it is: classmate, mentor, family, partner.\n- Their mood, and bars like Affection and Trust, with the reason a bar moved.\n- **In the scene**: how they look and act now, and their thoughts.\n\nUse **Set the bond** if the story reads a relationship wrong.\nMinors are protected: never a romantic bond, never any desire.\nParty members show how they are holding up. Add them with **Add to party**.\n\n### Phone\nYour device, your money, your contacts, your messages and notices.\nSend a text, call or transfer. It goes into the story as your turn, and the bot decides whether it reaches anyone.\n\n### Body\nWounds and conditions from the HUD, with how long each has lasted.\n\n### Injuries\nOnly for bots that keep no wounds on their HUD (Classroom of the Elite, Overlord).\nEach injury is raw until tended. Treated is not healed. The card shows healing time and warnings.\n\n### Mind\nMind conditions, like Dread, and the Mental Council.\n\n### Survival\nOff at first. Tracks time since you slept, ate and drank, from the HUD clock. The bot decides what it means.\n\n### Magic\nMagic pools, traditions, cooldowns, and a spellbook that learns your spells.\n\n### Abilities\nYour powers, skills and attributes, read from the HUD.\n\n### Quests\n- **The plot**: where the story stands, and its open threads.\n- **Objectives**: what you are trying to do now. You can add your own. Yours are never sent to the model.\n- **Quests** from the HUD, with the goal, who gave it, where, the reward, and the time left.\n- **Your notes** are never sent to the model.\n- If a quest drops off the HUD while still live, press **Put back**.\n\n### Chronicle\nThe story's timeline: key moments, milestones, how people came to feel about you, and plot points.\nFilter it, star an entry, hide one, or add your own.\nSettled replies are written to the Memory Cortex. See part 8.\n\n### Chapters\nSummaries of parts of the story. Press **End chapter and summarise** when a part ends.\nSummaries go with every message, on top of the chat.\n\n### OOC guide\nAsk the bot's guide a question. See part 7.\n\n### Critical\nA red banner for real danger: health near zero, a condition at its worst, a wound left raw too long.\n\n### The fight tracker\nDuring an immersive fight: everyone's HP, MP and Stamina, effects, what each fighter just did, and a fight log.\n\n### Fights\n\n| Kind | How it works |\n| --- | --- |\n| **Immersive fight** | No window. You fight by writing in the chat. The panel tracks bodies, effects and moves. Enemies keep hidden plans. **Study** an enemy to learn its weak points. The bot's rules decide who wins. |\n| **Turn-based fight** | A D&D window: initiative, attack rolls, damage dice, saving throws. The extension rolls the dice. When it ends, the aftermath is posted to the chat as a normal reply, with the HUD. |\n| **Narrative window** | The old fight window. Hidden unless you switch it on in Settings \u2192 Fights \u2192 Legacy. |\n\n### In the chat itself\n\n- **The HUD card.** The HUD drawn as a neat card in the bot's colours. The saved reply keeps its plain text. **Show the HUD as text** opens the plain version.\n- **Internal states** under each reply: tabs for Scene, People, Bonds, Plot and Map.\n- **Dialogue display** (off at first): an emoji for each speaker's feeling, a colour per speaker, or their name.\n\n### Test zone\nA practice chat inside the extension. It runs the same code as a real chat and touches none of your chats.\n**Demo** plays scripted turns for each world and costs nothing. **Live** uses your model.\n\n---\n\n## 7. Ask out of character (OOC)\n\nEach bot has a guide character who answers questions about the world, the rules and the commands.\n\n| Bot | Guide | Trigger |\n| --- | --- | --- |\n| Re:Zero | Echidna | `[OOC: your question]` |\n| Mushoku Tensei | Roxy | `OOC guide: your question` |\n| Overlord | Demiurge | `OOC guide: your question` |\n| Classroom of the Elite | Arisu Sakayanagi | `OOC guide: your question` (also `[OOC:` or `OOC:`) |\n\n### Two ways to ask\n\n1. **In the panel**: open the **OOC guide** card, type your question, press **Ask**. The answer stays in the panel. The story never sees it. It costs one model call.\n2. **In the chat**: press **Ask in the story**, or type the trigger yourself.\n\nYou can name another guide in the **Guide** box, if the bot allows it.\n\n### What happens on an OOC turn\n\n- No HUD, no story, and no time passes.\n- The extension adds nothing to that turn and does not read the answer as story.\n- Your next normal message picks the story up again.\n\n---\n\n## 8. Memory: what remembers what\n\n| Helper | Part | What it keeps | Reaches the model? |\n| --- | --- | --- | --- |\n| **Chronicle** | Extension | The timeline: moments, milestones, bonds, plot | Yes, through the Memory Cortex |\n| **Chapters** | Extension | Summaries of story parts; loops in Re:Zero | Yes, as \"the story so far\", once summarised |\n| **Map bank** | Extension | Every room drawn, per world | Only a short room plan when needed |\n| **Memory Cortex** and **Chat Memory** | Lumiverse | People, places, links between them, older passages | Yes, through the preset's Memory block |\n| **Loom Summary** | Lumiverse | One summary of the story | Only if you switch on its block in the preset |\n\n### The Chronicle and the Memory Cortex\n\n- A reply is written to the Cortex only after you answer it. So a swipe never leaves a wrong memory.\n- Each entry becomes a fact on the people it is about, with an importance tag.\n- Choose how much is written: Settings \u2192 **Chronicle** \u2192 Write to the Memory Cortex. **Key moments, bonds, plot and milestones** is the default.\n- **Write now** writes at once. **Write everything again** is for after a Cortex rebuild. Nothing is written twice.\n- In Re:Zero, a loop undone by Return by Death is written as undone.\n\n### Tip\n\nUse **Chapters** or the **Loom Summary**, not both. Both would send a summary of the same story.\n\n---\n\n## 9. Settings, section by section\n\nSettings opens as a list of sections. Click one to open it. Every switch has a short note under it.\n\n| Section | What it holds |\n| --- | --- |\n| **Play style** | World presets (one click per bot), play styles (HMS Narrative, D&D, Power scaling, Pure narrative, Gritty survival, Social and romance), your own saved presets, the panel theme, density and text size. |\n| **Modules** | Every feature in one list. Switch off what you do not use: it leaves the panel and the prompt, and costs no tokens. |\n| **HMS engine** | HMS mode (automatic, always, off), the hidden block, fetching a forgotten block, the guard for dropped lines, the pin reminder. |\n| **HMS systems** | How the HUD is read: pools and meters, wounds and conditions, abilities and attributes, people and their bars, the phone, the party, the survival clock, injuries, experience. |\n| **Quests** | The Quests card, quest details, the plot, objectives, the quest journal, quest labels and states. |\n| **Chapters** | Automatic chapters for loops, arcs, days or months; summaries; whether they go with every message and with fights. |\n| **Chronicle** | On or off, asking the story for key moments, and how much goes into the Memory Cortex. |\n| **Lorebook context** | Which of the extension's own calls get your lorebooks, and what the last call sent. |\n| **Engine core & memory** | Whether fights run on the bot's engine, and how much long-term memory they recall. |\n| **General** | The master switch, Together or Separate mode, the connection for the extension's own calls, and time limits. |\n| **Panels** | Which classic panels show, and bar colours. |\n| **Chat and panel extras** | Internal states under each reply, the map and map bank, the HUD card, dialogue emoji, colours and names, weather effects, portraits. |\n| **Characters setup** | What is asked about each character in the scene: details, thoughts, character bars. |\n| **Fights** | Difficulty, how immersive fights resolve, fate dice, effects, moves, hidden plans, the legacy window. |\n| **D&D** | The D&D card, the roller, the HUD's scores, turn-based fights. |\n| **Story extras** | Extras from the original RPG Companion: immersive HTML, dialogue colouring, deception tags, the omniscience filter, choose your own adventure (off in HMS chats), song suggestions. |\n| **Tracker field presets** | Save and load whole tracker setups, mostly for classic chats. Link one to a character. |\n| **Custom prompts** | Every prompt the extension sends, editable. Empty uses the built-in one. |\n| **Help & bug report** | **Open the guide**, and **Copy bug report** for Discord. No chat text unless you tick the box. |\n| **Reset** | Clear this chat's trackers, or reset all settings. |\n\n**Together or Separate?** Together (the default) gets the side-panel data in the same reply: one call. Separate makes a second call after each reply. Use Separate only if your model keeps forgetting the hidden block.\n\n---\n\n## 10. When something goes wrong\n\n| Problem | What to do |\n| --- | --- |\n| The World State card is empty. | It says why. Often the model wrote the HUD inside its thinking. Press **Read again**. The extension also moves a HUD out of the thinking by itself. |\n| A card did not update. | Press **Read again**. It is free. |\n| \"The reply left out the side-panel block.\" | The extension fetches it with a quick second call. If it happens a lot, use **Separate** mode (Settings \u2192 General). |\n| A HUD line vanished. | Press **Restore** in the World State card. Pin the line if it keeps happening. |\n| The reply has no HUD at all. | Press **Put the last HUD back**, or swipe for a new reply. |\n| The HUD header shows twice. | The extension keeps one by itself. If it keeps happening, set the preset's HUD header slider to **Never**. |\n| \"The Arc line loads no arc entry.\" | Press **Use** to put in the book's spelling. |\n| An OOC answer came back with a HUD or a story. | Check the trigger is at the very start of your message, like `[OOC: ...]`. |\n| No emoji or dialogue colours. | They are off at first: Settings \u2192 Chat and panel extras \u2192 Dialogue. |\n| The New game card does not show. | It only shows on a new chat whose first message has catalog pages. |\n| The D&D card shows in a game without dice. | Use your world's preset, or switch D&D off in Settings \u2192 Modules. |\n| \"Your provider allows only one request at a time.\" | Wait for the reply to finish, then press **Refresh**, or **Read again** (free). |\n| A permission is missing. | Grant it in the Extensions panel. The part that needs it says which one. |\n| Something else. | Settings \u2192 **Help & bug report** \u2192 **Copy bug report**, and paste it in the Discord. |\n\n### What it costs\n\n- The hidden-block request is about 1,000 to 1,700 tokens per reply, depending on what is switched on.\n- Modules you switch off cost nothing.\n- Fights, the OOC guide and chapter summaries each make their own call when you use them.\n\n---\n\n## 11. Words used in this guide\n\n| Word | Meaning |\n| --- | --- |\n| **HMS** | The game engine inside the bot's card. |\n| **HUD** (WORLD STATE) | The block at the top of each reply: time, place, arc, powers and more. |\n| **The wall** | The `***` line under the HUD. The story starts after it. |\n| **STATE IS GOD** | The bots' rule: the HUD is true, and the story must agree with it. |\n| **Carrier line** | A HUD line whose words keep a lorebook entry loaded, like the Arc line. |\n| **Start handler** | The bot's start line, like `ReZero_Start_Handler`. Your first message begins with it. |\n| **Catalog** | The pages of the bot's first message: how to start, and all the commands. |\n| **Canvas** | The almost empty catalog page you type your start under. |\n| **OOC** | Out of character: a question to the bot's guide, outside the story. |\n| **Hidden block** | The small `<rpg_companion>` data after the story. The extension reads it and removes it. |\n| **Pin** | Keep a HUD line exactly as it is. |\n| **Guard** | The check for HUD lines that vanished. |\n| **Swipe** | Another version of a reply. The extension follows the swipe you keep. |\n| **Lorebook** | The bot's world entries. A keyword in the chat loads an entry. |\n| **Memory Cortex** | Lumiverse's memory of people, places and their links. |\n| **Preset** | The prompt recipe Lumiverse sends to the model. Here: HMS Reporter beta. |\n| **Extension** | An add-on for Lumiverse. Here: RPG Companion HMS Edition. |\n| **Together / Separate** | Whether the side-panel data comes in the same reply, or from a second call. |\n| **Settled reply** | A reply you have answered. It can no longer be swiped away. |\n" /* GUIDE:END */;

// ─────────────────────────── utilities ───────────────────────────

function h(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
        for (const [k, v] of Object.entries(attrs)) {
            if (v === undefined || v === null || v === false) continue;
            if (k === 'class') node.className = v;
            else if (k === 'text') node.textContent = v;
            else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
            else if (k === 'value') node.value = v;
            else if (k === 'checked') node.checked = !!v;
            else node.setAttribute(k, v === true ? '' : String(v));
        }
    }
    for (const c of children.flat(Infinity)) {
        if (c === null || c === undefined || c === false) continue;
        node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    return node;
}

function clone(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }
function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function toSnakeCase(name) { return String(name).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, ''); }
function toFieldKey(name) { return toSnakeCase(String(name).replace(/\s*\(.*\)\s*$/, '').trim()); }
function labelOf(key) { return String(key).replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase()); }

function plain(v) {
    if (v === null || v === undefined) return '';
    if (isObj(v)) {
        if ('value' in v) return plain(v.value);
        if ('content' in v) return plain(v.content);
        if ('title' in v) return plain(v.title);
        if ('name' in v) return plain(v.name);
        if ('status' in v) return plain(v.status);
        return '';
    }
    if (Array.isArray(v)) return v.map(plain).filter(Boolean).join(', ');
    return String(v);
}

function hexToRgb(hex) {
    const m = String(hex || '').replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
    if (!m) return [128, 128, 128];
    let s = m[1];
    if (s.length === 3) s = s.split('').map(c => c + c).join('');
    return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16));
}
function mixColor(low, high, t) {
    const a = hexToRgb(low), b = hexToRgb(high);
    const c = a.map((x, i) => Math.round(x + (b[i] - x) * Math.max(0, Math.min(1, t))));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/**
 * Inline editable text. onCommit(newText) fires on blur/Enter when changed.
 */
function editable(value, onCommit, opts = {}) {
    const span = h('span', {
        class: 'rpgc-edit' + (opts.class ? ' ' + opts.class : ''),
        contenteditable: 'plaintext-only',
        role: 'textbox',
        tabindex: '0',
        'data-ph': opts.placeholder || '—',
        'aria-label': opts.label || 'Edit value',
        spellcheck: 'false'
    });
    span.textContent = value ?? '';
    const original = span.textContent;
    span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !(opts.multiline && e.shiftKey)) { e.preventDefault(); span.blur(); }
        if (e.key === 'Escape') { span.textContent = original; span.blur(); }
    });
    span.addEventListener('blur', () => {
        const next = span.textContent.trim();
        if (next !== original.trim()) onCommit(next);
    });
    // Firefox lacks plaintext-only
    if (span.contentEditable !== 'plaintext-only') span.contentEditable = 'true';
    return span;
}

function section(id, title, openState, extra, ...content) {
    const d = h('details', { class: 'rpgc-sec' },
        h('summary', null, title, extra ? h('span', { class: 'rpgc-sum-extra' }, extra) : null),
        h('div', { class: 'rpgc-body' }, ...content));
    // Settings sections start closed, so Settings opens as a short list of headings; cards start open.
    d.open = String(id).startsWith('s-') ? openState[id] === true : openState[id] !== false;
    d.dataset.openKey = id;
    d.addEventListener('toggle', () => { openState[id] = d.open; });
    return d;
}

// ─────────────────────────── the guide ───────────────────────────
// A small markdown reader for GUIDE.md: headings, paragraphs, lists, tables, code, **bold** and `code`.
// Everything is built as elements, never as HTML, so the text can hold any character.

function guideInline(text, find) {
    const out = [];
    for (const part of String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/)) {
        if (!part) continue;
        if (/^\*\*[^*]+\*\*$/.test(part)) out.push(h('b', null, guideMark(part.slice(2, -2), find)));
        else if (/^`[^`]+`$/.test(part)) out.push(h('code', null, part.slice(1, -1)));
        else out.push(...guideMark(part, find));
    }
    return out;
}
function guideMark(text, find) {
    const t = String(text);
    if (!find) return [t];
    const out = [];
    const low = t.toLowerCase();
    let at = 0, i;
    while ((i = low.indexOf(find, at)) >= 0) { if (i > at) out.push(t.slice(at, i)); out.push(h('mark', null, t.slice(i, i + find.length))); at = i + find.length; }
    if (at < t.length) out.push(t.slice(at));
    return out;
}
function guideSections(md) {
    const secs = [];
    let intro = [];
    let cur = null;
    for (const line of String(md || '').replace(/\r/g, '').split('\n')) {
        const m = line.match(/^##\s+(.+?)\s*$/);
        if (m && !/^###/.test(line)) { cur = { title: m[1], lines: [] }; secs.push(cur); continue; }
        if (/^#\s/.test(line)) continue;
        (cur ? cur.lines : intro).push(line);
    }
    return { intro, secs };
}
function guideBlocks(lines, find) {
    const out = [];
    let i = 0;
    const isTable = (l) => /^\s*\|/.test(l);
    const isItem = (l) => /^\s*(?:[-*]|\d+\.)\s+/.test(l);
    while (i < lines.length) {
        const l = lines[i];
        if (!l.trim() || /^\s*---+\s*$/.test(l)) { i++; continue; }
        if (/^\s*```/.test(l)) {
            const body = [];
            for (i++; i < lines.length && !/^\s*```/.test(lines[i]); i++) body.push(lines[i]);
            i++;
            out.push(h('pre', null, body.join('\n')));
            continue;
        }
        const hm = l.match(/^###\s+(.+)$/);
        if (hm) { out.push(h('h4', null, guideInline(hm[1], find))); i++; continue; }
        if (isTable(l)) {
            const rows = [];
            for (; i < lines.length && isTable(lines[i]); i++) {
                const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
                if (cells.every(c => /^:?-{3,}:?$/.test(c))) continue;
                rows.push(cells);
            }
            if (rows.length) out.push(h('table', null,
                h('thead', null, h('tr', null, rows[0].map(c => h('th', null, guideInline(c, find))))),
                h('tbody', null, rows.slice(1).map(r => h('tr', null, r.map(c => h('td', null, guideInline(c, find))))))));
            continue;
        }
        if (isItem(l)) {
            const ordered = /^\s*\d+\./.test(l);
            const list = h(ordered ? 'ol' : 'ul', null);
            let last = null;
            for (; i < lines.length && (isItem(lines[i]) || (lines[i].trim() && /^\s{2,}/.test(lines[i]))); i++) {
                const raw = lines[i];
                const deep = /^\s{2,}/.test(raw);
                const text = raw.replace(/^\s*(?:[-*]|\d+\.)\s+/, '').trim();
                if (deep && last) {
                    let sub = last.querySelector(':scope > ul, :scope > ol');
                    if (!sub) { sub = h(/^\s*\d+\./.test(raw) ? 'ol' : 'ul', null); last.appendChild(sub); }
                    sub.appendChild(h('li', null, guideInline(text, find)));
                } else {
                    last = h('li', null, guideInline(text, find));
                    list.appendChild(last);
                }
            }
            out.push(list);
            continue;
        }
        const para = [];
        for (; i < lines.length && lines[i].trim() && !isTable(lines[i]) && !isItem(lines[i]) && !/^\s*```|^###\s|^\s*---+\s*$/.test(lines[i]); i++) para.push(lines[i].trim());
        out.push(h('p', null, guideInline(para.join(' '), find)));
    }
    return out;
}

// ─────────────────────────── setup ───────────────────────────

export function setup(ctx) {
    const state = {
        chatId: null,
        userName: 'You',
        data: { userStats: null, infoBox: null, characters: null },
        settings: null,
        busy: false,
        busySince: 0,
        status: null,
        view: 'trackers',
        invTab: 'onPerson',
        open: { chapter: false },
        locks: {},
        checkpoint: null,
        encounter: null,
        encounterBusy: false,
        encounterActive: false,
        encounterFor: null,
        encounterNotice: null,
        encPick: null,
        encOrders: {},        // pending orders to allies, sent with the next action
        encOrderFor: null,    // the ally an order is being built for
        encExploit: null,     // intel the next action acts on
        encTab: 'physical',
        encOrderTab: 'physical',
        plotBusy: false,
        characterId: null,
        presetSel: '',
        song: null,
        hms: null,
        worldBusy: false,
        encHistory: null,
        showHistory: false,
        expectPush: false,
        expectPushSince: 0,
        avatars: {},
        avatarBusy: {},
        diceCount: 1,
        diceSides: 20
    };

    const removeStyle = ctx.dom.addStyle(CSS);
    const tab = ctx.ui.registerDrawerTab({
        id: 'rpg-companion-hms',
        title: 'RPG Companion (HMS)',
        shortName: 'RPG',
        headerTitle: 'RPG Companion HMS Edition 2.0 beta',
        description: 'The side panel for HMS bots: the HUD as cards, people, quests, the map, fights, the Chronicle, and a guide',
        keywords: ['rpg', 'hms', 'tracker', 'hud', 'quests', 'dice', 'guide'],
        iconSvg: ICON_SVG
    });
    const root = h('div', { class: 'rpgc' });
    // A collapsible saves where it is going the moment it is clicked. The browser's own toggle event
    // comes later; a repaint in between (a reply landing, the panel refreshing) used to rebuild it in its
    // old state, so a section snapped shut \u2014 or back open \u2014 as if by itself.
    root.addEventListener('click', (e) => {
        const sum = e.target && e.target.closest ? e.target.closest('summary') : null;
        if (!sum) return;
        const ctl = e.target.closest('button, a, input, select, textarea, label');
        if (ctl && ctl !== sum && sum.contains(ctl)) return;          // a control inside the header does its own thing
        const det = sum.parentElement;
        if (det && det.tagName === 'DETAILS' && det.dataset.openKey) state.open[det.dataset.openKey] = !det.open;
    }, true);
    tab.root.appendChild(root);

    const refreshAction = ctx.ui.registerInputBarAction({ id: 'rpgh-refresh', label: 'Refresh side panel', iconSvg: SMALL_ICON });
    refreshAction.onClick(() => requestRefresh());
    const openAction = ctx.ui.registerInputBarAction({ id: 'rpgh-open', label: 'Open RPG Companion' });
    openAction.onClick(() => tab.activate());
    const fightAction = ctx.ui.registerInputBarAction({ id: 'rpgh-fight', label: 'Start or resume a fight' });
    fightAction.onClick(() => openFightChooser());
    const worldAction = ctx.ui.registerInputBarAction({ id: 'rpgh-world', label: 'Move the world' });
    worldAction.onClick(() => { if (state.chatId) send({ type: 'world_moves', chatId: state.chatId }); });

    // The three actions that spend tokens or write to the chat follow the Enabled
    // toggle. Opening the panel stays available so the toggle can be found again.
    let actionsEnabled = null;
    function syncActionAvailability() {
        const s = state.settings;
        const on = !!(s && s.enabled) && !!state.chatId;
        // The fight button also follows "Enable fights", like the fight buttons in the panel.
        const fights = on && s.encounterSettings?.enabled !== false;
        const key = `${on}|${fights}`;
        if (key === actionsEnabled) return;
        actionsEnabled = key;
        for (const a of [refreshAction, worldAction]) {
            try { a.setEnabled?.(on); } catch { /* host may not support it */ }
        }
        try { fightAction.setEnabled?.(fights); } catch { /* host may not support it */ }
    }

    // ── backend comms ──
    const send = (payload) => ctx.sendToBackend(payload);
    const requestState = (extra = {}) => send({ type: 'get_state', chatId: state.chatId, characterId: state.characterId, ...extra });
    function requestRefresh() {
        if (!state.chatId || state.busy) return;
        state.busy = true;
        state.busySince = Date.now();
        state.status = { kind: 'busy', text: 'Generating trackers with a separate call…' };
        render();
        send({ type: 'refresh', chatId: state.chatId });
    }
    function cancelRefresh() {
        if (!state.chatId) return;
        state.busy = false;
        render();
        send({ type: 'cancel_refresh', chatId: state.chatId });
    }

    let saveTimer = null;
    function saveTrackers() {
        clearTimeout(saveTimer);
        const chatId = state.chatId;
        const data = clone(state.data);
        saveTimer = setTimeout(() => send({ type: 'save_trackers', chatId, data }), 350);
    }
    let settingsTimer = null;
    function saveSettings(rerender = true) {
        clearTimeout(settingsTimer);
        const settings = clone(state.settings);
        settingsTimer = setTimeout(() => send({ type: 'save_settings', chatId: state.chatId, settings }), 300);
        if (rerender) render();
    }

    const unsubBackend = ctx.onBackendMessage((msg) => {
        if (!msg) return;
        if (msg.type === 'diagnostics') { onDiagnostics(msg); return; }
        if (msg.type === 'catalog') {
            if (msg.chatId === state.chatId) { state.catalog = msg.catalog ? { ...msg.catalog, chatId: msg.chatId } : { none: true, chatId: msg.chatId, pages: [] }; state.catReq = false; render(); }
            return;
        }
        if (msg.type === 'catalog_check') {
            if (msg.chatId === state.chatId && state.ng && msg.text === ngText()) { state.ng.warnings = msg.warnings || []; render(); }
            return;
        }
        if (msg.type === 'mapbank_view') {
            state.mapView = msg.svg ? { key: msg.key, svg: msg.svg, vars: msg.vars || '', name: msg.name || '' } : null;
            render();
            return;
        }
        if (msg.type === 'chronicle') {
            if (msg.chatId === state.chatId) { state.chronData = msg.chronicle ? { ...msg.chronicle, chatId: msg.chatId } : { none: true, chatId: msg.chatId, version: null, entries: [] }; state.chronReq = false; render(); }
            return;
        }
        if (msg.type === 'atlas') {
            if (msg.chatId === state.chatId) { state.atlasData = msg.atlas || { version: null, nodes: [], none: true }; state.atlasReq = false;
                if (state.atlasData.nodes) state.atlasIndex = new Map(state.atlasData.nodes.map(n => [n.id, n])); render(); }
            return;
        }
        if (msg.type === 'connections') {
            state.connections = { available: !!msg.available, list: Array.isArray(msg.list) ? msg.list : [] };
            state.connReq = false;
            render();
            return;
        }
        if (msg.type === 'plot_prompt') {
            if (msg.chatId === state.chatId) runPlot(msg);
            return;
        }
        if (msg.type === 'encounter') {
            if (msg.chatId !== state.chatId && msg.chatId !== state.encounterFor) return;
            if (!encModal || msg.chatId === (state.encounterFor || state.chatId)) {
                state.encounter = msg.encounter || null;
                state.encounterBusy = !!msg.busy;
                // Orders and half-built picks belong to one fight; a fight that ended takes them along.
                if (!state.encounter || state.encounter.phase !== 'combat') { state.encOrders = {}; state.encOrderFor = null; state.encExploit = null; state.encPick = null; }
                if (msg.notice) state.encounterNotice = msg.notice;
            }
            if (msg.chatId === state.chatId) state.encounterActive = !!(msg.encounter && msg.encounter.active);
            renderEncounter();
            render(true);
            return;
        }
        if (msg.type === 'encounter_history') {
            if (msg.chatId === state.chatId) { state.encHistory = msg.logs || []; renderEncounter(); }
            return;
        }
        if (msg.type === 'fight_engaged') {
            if (msg.chatId !== state.chatId) return;
            if (msg.mode === 'turnbased' && dndOn()) openEncounter('dnd');
            else { state.status = { kind: 'ok', text: 'A fight started in the story. The panel is tracking it.' }; render(); }
            return;
        }
        if (msg.type === 'avatar_status') {
            const key = msg.name;
            if (msg.busy) state.avatarBusy[key] = true;
            else {
                delete state.avatarBusy[key];
                if (msg.url) state.avatars[key] = { url: msg.url };
                if (msg.error) state.status = { kind: 'error', text: msg.error };
            }
            render();
            return;
        }
        if (msg.type !== 'state') return;
        if (msg.chatId && state.chatId && msg.chatId !== state.chatId) return;
        if (msg.settings) state.settings = msg.settings;
        if (msg.chatId !== undefined) {
            if (msg.data) state.data = msg.data;
            else if (!msg.status || msg.status.kind !== 'error') state.data = { userStats: null, infoBox: null, characters: null };
            if (msg.userName) state.userName = msg.userName;
            const wasBusy = state.busy;
            state.busy = !!msg.busy;
            if (state.busy && !wasBusy) state.busySince = Date.now();
            state.status = msg.status || null;
            state.locks = msg.locks || {};
            state.checkpoint = msg.checkpoint || null;
            if (msg.encounterActive !== undefined) state.encounterActive = !!msg.encounterActive;
            if (msg.song !== undefined) state.song = msg.song;
            if (msg.hms !== undefined) state.hms = msg.hms;
            if (msg.extras !== undefined) state.extras = msg.extras;
            if (msg.sandbox !== undefined) state.sandboxInfo = msg.sandbox;
            if (msg.lore !== undefined) state.lore = msg.lore;
            if (msg.dnd !== undefined) state.dnd = msg.dnd;
            if (msg.version) state.version = msg.version;
            if (msg.paletteDefault) state.paletteDefault = msg.paletteDefault;
            if (msg.chapters !== undefined) state.chapters = msg.chapters;
            if (msg.chronicle !== undefined) state.chronicle = msg.chronicle;
            if (msg.newGame !== undefined) state.newGame = msg.newGame;
            if (msg.ooc !== undefined) state.ooc = msg.ooc;
            if (msg.world !== undefined) state.world = msg.world;
            if (msg.plotView !== undefined) state.plotView = msg.plotView;
            if (msg.injuries !== undefined) state.injuries = msg.injuries;
            if (msg.hudSheet !== undefined) state.hudSheet = msg.hudSheet;
            if (msg.immersive !== undefined) state.immersive = msg.immersive;
            if (msg.immBusy !== undefined) state.immBusy = !!msg.immBusy;
            if (state.settings && panelMode() !== state.panelApplied) { state.panelApplied = panelMode(); applyPanelMode(); }
            if (msg.avatars) state.avatars = msg.avatars;
        }
        state.expectPush = false;
        syncActionAvailability();
        render(true);
    });

    // ── chat tracking ──
    function syncChat() {
        if (state.sandbox) return;   // the test zone is not a Lumiverse chat; stay in it
        let chatId = null;
        let characterId = null;
        try {
            const active = ctx.getActiveChat();
            chatId = active?.chatId ?? null;
            characterId = active?.characterId ?? null;
        } catch { chatId = null; }
        if (chatId !== state.chatId || characterId !== state.characterId) {
            const chatChanged = chatId !== state.chatId;
            state.chatId = chatId;
            state.characterId = characterId;
            if (chatChanged) {
                state.data = { userStats: null, infoBox: null, characters: null };
                state.busy = false;
                state.locks = {};
                state.checkpoint = null;
                state.encounterActive = false;
                state.status = null;
                state.hms = null;
                state.lore = null;
                state.immersive = null;
                state.immBusy = false;
                state.immEdit = null;
                state.dnd = null;
                state.chapters = null;
                state.chEdit = null;
                state.chronicle = null;
                state.chronData = null;
                state.chronReq = false;
                state.newGame = null; state.catalog = null; state.catReq = false; state.ng = null;
                state.ooc = null;
                state.world = null;
                state.hudSheet = null;
                state.plotView = null;
                state.injuries = null;
            }
            syncActionAvailability();
            render();
            requestState({ refreshName: true });
        }
    }
    let pollTick = 0;
    const pollTimer = setInterval(() => {
        syncChat();
        // If the backend never reports back, stop showing the busy state
        const limit = ((state.settings?.trackerTimeoutSec || 180) + 30) * 1000;
        if (state.busy && state.busySince && Date.now() - state.busySince > limit) {
            state.busy = false;
            state.status = { kind: 'error', text: 'No answer from the tracker call. Check the Lumiverse console for [RPG Companion] messages.' };
            render();
        }
        // Self-heal: if a reply just landed and a push was missed, re-request state.
        // Also a slow heartbeat so the panel can never sit stale for long.
        pollTick++;
        const active = document.activeElement;
        const editing = active && root.contains(active) && (active.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(active.tagName));
        if (state.chatId && !editing && (state.expectPush || pollTick % 6 === 0)) {
            if (state.expectPush && Date.now() - (state.expectPushSince || 0) > 1500) { state.expectPush = false; requestState(); }
            else if (!state.expectPush) requestState();
        }
    }, 1000);
    const evUnsubs = [];
    const onChatEvent = (p) => {
        if (p && p.chatId && p.chatId !== state.chatId) { syncChat(); return; }
        requestState();
    };
    for (const ev of ['MESSAGE_SWIPED', 'SWIPE_EDITED', 'MESSAGE_DELETED']) evUnsubs.push(ctx.events.on(ev, onChatEvent));
    evUnsubs.push(ctx.events.on('CHAT_SWITCHED', () => syncChat()));
    evUnsubs.push(ctx.events.on('PERSONA_CHANGED', () => requestState({ refreshName: true })));
    evUnsubs.push(ctx.events.on('GENERATION_STARTED', (p) => {
        if (p?.chatId === state.chatId) { state.expectPush = false; }
    }));
    evUnsubs.push(ctx.events.on('GENERATION_ENDED', (p) => {
        if (!p || p.chatId === state.chatId || p.chatId === undefined) {
            // The backend pushes after it processes the reply; mark that we're waiting for it,
            // and request once now in case the event beat us to it.
            state.expectPush = true;
            state.expectPushSince = Date.now();
            requestState();
        }
    }));

    // ── data helpers (create skeletons on first edit) ──
    const S = () => state.settings;
    function us() {
        if (!isObj(state.data.userStats)) state.data.userStats = {};
        return state.data.userStats;
    }
    function ib() {
        if (!isObj(state.data.infoBox)) state.data.infoBox = {};
        return state.data.infoBox;
    }
    function chars() {
        if (!Array.isArray(state.data.characters)) state.data.characters = [];
        return state.data.characters;
    }
    function inv() {
        const u = us();
        if (!isObj(u.inventory)) u.inventory = {};
        const i = u.inventory;
        for (const k of ['onPerson', 'clothing', 'assets']) {
            if (!Array.isArray(i[k])) i[k] = typeof i[k] === 'string' && i[k] && i[k] !== 'None' ? i[k].split(',').map(n => ({ name: n.trim() })) : [];
        }
        if (!isObj(i.stored)) i.stored = {};
        return i;
    }
    function commit() { saveTrackers(); render(); }

    // ── rendering ──
    let pendingRender = false;
    let deferredEl = null;
    function render(fromBackend = false) {
        root.className = 'rpgc' + themeClass();
        if (encModal) encModal.root.className = 'rpgc rpgc-enc' + themeClass();
        const active = document.activeElement;
        if (fromBackend && active && root.contains(active) && (active.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(active.tagName))) {
            // Repaint would blow away the field the user is editing. Defer it until they blur,
            // but the incoming state was already applied, so nothing is lost.
            pendingRender = true;
            if (deferredEl !== active) {
                deferredEl = active;
                const flush = () => { deferredEl = null; if (pendingRender) { pendingRender = false; setTimeout(() => render(), 0); } };
                active.addEventListener('blur', flush, { once: true });
            }
            return;
        }
        pendingRender = false;
        deferredEl = null;
        const scroll = tab.root.scrollTop;
        root.replaceChildren(...(state.view === 'settings' ? renderSettings() : state.view === 'guide' ? renderGuide() : state.view === 'sandbox' ? renderSandbox() : renderTrackers()).filter(Boolean));   // a switched-off card is simply absent
        tab.root.scrollTop = scroll;
        updateWeather();
    }

    function topBar() {
        const s = S();
        const mode = !s ? '' : !s.enabled ? 'Paused' : s.generationMode === 'separate' ? 'Separate mode' : 'Together mode';
        const st = state.busy && (!state.status || state.status.kind !== 'busy')
            ? { kind: 'busy', text: 'Generating trackers with a separate call…' }
            : state.status;
        const bar = h('div', { class: 'rpgc-top' },
            h('span', { class: 'rpgc-mode' }, mode),
            state.view === 'trackers' && state.busy
                ? h('button', { class: 'rpgc-btn', onclick: cancelRefresh }, 'Cancel')
                : null,
            state.view === 'trackers' && !state.busy
                ? h('button', { class: 'rpgc-btn', title: 'Generate trackers for the latest reply with a separate call', disabled: !state.chatId || !s?.enabled ? true : null, onclick: requestRefresh }, 'Refresh')
                : null,
            s ? (() => {
                const pm = h('select', { class: 'rpgc-panelsel', 'aria-label': 'Where the panel lives', title: 'Where the panel lives', onchange: (e) => setPanelMode(e.target.value) },
                    h('option', { value: 'drawer' }, 'Drawer'), h('option', { value: 'float' }, 'Floating'), h('option', { value: 'popout' }, 'Own window'));
                pm.value = panelMode();
                return pm;
            })() : null,
            S()?.uiTestZone === false && !state.sandbox ? null : h('button', {
                class: 'rpgc-btn', 'aria-pressed': state.view === 'sandbox' ? 'true' : 'false', title: state.sandbox ? 'Back to your chat' : 'Try everything without a chat',
                onclick: () => (state.sandbox ? leaveSandbox() : enterSandbox())
            }, state.sandbox ? 'Leave test zone' : 'Test zone'),
            h('button', {
                class: 'rpgc-btn', 'aria-pressed': state.view === 'guide' ? 'true' : 'false', title: 'How everything works: the bot, the preset and this panel',
                onclick: () => { state.view = state.view === 'guide' ? (state.sandbox ? 'sandbox' : 'trackers') : 'guide'; render(); }
            }, state.view === 'guide' ? 'Close the guide' : 'Guide'),
            h('button', {
                class: 'rpgc-btn', 'aria-pressed': state.view === 'settings' ? 'true' : 'false',
                onclick: () => { state.view = state.view === 'settings' ? (state.sandbox ? 'sandbox' : 'trackers') : 'settings'; render(); }
            }, state.view === 'settings' ? (state.sandbox ? 'Back to the test zone' : 'Back to trackers') : 'Settings'));
        if (!st || !st.text || !state.chatId) return bar;
        const wrap = document.createDocumentFragment();
        wrap.appendChild(bar);
        wrap.appendChild(h('div', { class: 'rpgc-status ' + (st.kind || ''), role: 'status' }, st.text));
        return wrap;
    }

    function renderTrackers() {
        const s = S();
        if (!s) return [h('p', { class: 'rpgc-note' }, 'Loading…')];
        const out = [topBar()];
        if (!state.chatId) {
            out.push(h('p', { class: 'rpgc-note' }, 'Open a chat to see its trackers.'));
            return out;
        }
        const ng = renderNewGame();
        if (hmsOn()) { const r = renderHmsTrackers(); if (ng) r.splice(1, 0, ng); const oo = renderOoc(); if (oo) r.push(oo); return r; }
        if (ng) out.push(ng);
        const d = state.data;
        if (!d.userStats && !d.infoBox && !(d.characters && d.characters.length)) {
            out.push(h('p', { class: 'rpgc-note' }, s.generationMode === 'separate'
                ? 'No trackers yet. They fill in after the next reply, or press Refresh to generate them now.'
                : 'No trackers yet. They fill in with the next reply. You can also set starting values below.'));
        }
        const story = storyRow();
        if (story) out.push(story);
        const immEl = renderImmersive();
        if (immEl) out.push(immEl);
        const songEl = renderSong();
        if (songEl) out.push(songEl);
        if (s.showUserStats) out.push(renderUserStats());
        { const inj = renderInjuries(); if (inj) out.push(inj); }
        { const dnd = renderDnd(); if (dnd) out.push(dnd); }
        if (s.showInfoBox) out.push(renderInfoBox());
        for (const el of [renderPeopleAll(), renderPhone()]) if (el) out.push(el);
        if (s.showUserStats && s.showInventory) out.push(renderInventory());
        if (s.showUserStats && s.showQuests) out.push(renderQuests());
        out.push(renderChapter());
        return out;
    }

    function statBar(value, max) {
        const s = S();
        const num = Number(value);
        const pct = Number.isFinite(num) ? Math.max(0, Math.min(100, (num / (max || 100)) * 100)) : 0;
        const fill = h('i');
        fill.style.width = pct + '%';
        fill.style.backgroundColor = mixColor(s.statBarColorLow, s.statBarColorHigh, pct / 100);
        return h('div', { class: 'rpgc-bar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': String(max || 100), 'aria-valuenow': String(Number.isFinite(num) ? num : 0) }, fill);
    }

    function renderUserStats() {
        const s = S();
        const cfg = s.trackerConfig.userStats;
        const u = state.data.userStats || {};
        const status = isObj(u.status) ? u.status : {};
        const numberMode = cfg.statsDisplayMode === 'number';

        const lvl = cfg.showLevel !== false ? h('span', { class: 'rpgc-lvl' },
            'Level',
            h('button', { class: 'rpgc-mini', 'aria-label': 'Lower level', onclick: () => { s.level = Math.max(1, (s.level || 1) - 1); saveSettings(); } }, '−'),
            h('b', null, String(s.level || 1)),
            h('button', { class: 'rpgc-mini', 'aria-label': 'Raise level', onclick: () => { s.level = (s.level || 1) + 1; saveSettings(); } }, '+')) : null;

        const who = h('div', { class: 'rpgc-who' },
            cfg.statusSection?.enabled && cfg.statusSection.showMoodEmoji
                ? editable(plain(status.mood), (v) => { const st = us(); st.status = isObj(st.status) ? st.status : {}; st.status.mood = v; commit(); }, { class: 'rpgc-mood', placeholder: 'mood', label: 'Mood emoji' })
                : null,
            h('span', null, state.userName),
            cfg.statusSection?.enabled ? lockBtn(['status'], 'mood and status') : null,
            lvl);

        const statsEls = (cfg.customStats || []).filter(st => st && st.enabled && st.name).map(st => {
            const list = Array.isArray(u.stats) ? u.stats : [];
            const found = list.find(x => x && (x.id === st.id || String(x.name).toLowerCase() === String(st.name).toLowerCase()));
            const max = numberMode ? (st.maxValue || 100) : 100;
            const val = found ? found.value : '';
            return h('div', { class: 'rpgc-stat' },
                h('span', { class: 'rpgc-stat-name', title: st.name }, lockBtn(['stats', st.id], st.name), st.name),
                statBar(val, max),
                h('span', { class: 'rpgc-stat-val' },
                    editable(val === '' ? '' : String(val), (v) => {
                        const n = Number(v);
                        if (!Number.isFinite(n)) { render(); return; }
                        const target = us();
                        if (!Array.isArray(target.stats)) target.stats = [];
                        const ex = target.stats.find(x => x && (x.id === st.id || String(x.name).toLowerCase() === String(st.name).toLowerCase()));
                        if (ex) ex.value = n; else target.stats.push({ id: st.id, name: st.name, value: n });
                        commit();
                    }, { placeholder: '–', label: `${st.name} value` }),
                    numberMode ? `/${max}` : '%'));
        });

        const statusEls = [];
        if (cfg.statusSection?.enabled) {
            for (const field of cfg.statusSection.customFields || []) {
                const key = toFieldKey(String(field).toLowerCase());
                statusEls.push(h('span', { class: 'k' }, field),
                    editable(plain(status[key]), (v) => { const st = us(); st.status = isObj(st.status) ? st.status : {}; st.status[key] = v; commit(); }, { label: field }));
            }
        }

        let skillsEl = null;
        if (cfg.skillsSection?.enabled) {
            const skills = Array.isArray(u.skills) ? u.skills : [];
            skillsEl = h('div', null,
                h('h4', null, cfg.skillsSection.label || 'Skills'),
                listEditor(skills.map(plain), (arr) => { us().skills = arr.map(name => ({ name })); commit(); }, 'Add a skill', (t) => ['skills', lockKey(t)]));
        }

        const attrsEl = null, diceEl = null;   // ability scores and the roller live in the D&D card now

        return section('stats', 'Your stats', state.open, null,
            who,
            ...statsEls,
            statusEls.length ? h('div', { class: 'rpgc-kv' }, ...statusEls) : null,
            skillsEl,
            attrsEl,
            diceEl);
    }

    function listEditor(items, onChange, addLabel, lockPathFor) {
        const list = h('ul', { class: 'rpgc-list' }, items.map((txt, i) => h('li', null,
            lockPathFor ? lockBtn(lockPathFor(txt), txt) : null,
            h('span', { class: 'grow' }, editable(txt, (v) => { const next = items.slice(); if (v) next[i] = v; else next.splice(i, 1); onChange(next); }, { label: 'Edit entry' })),
            h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${txt}`, onclick: () => { const next = items.slice(); next.splice(i, 1); onChange(next); } }, '✕'))));
        const input = h('input', { type: 'text', placeholder: addLabel, 'aria-label': addLabel });
        const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; onChange([...items, v]); };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        return h('div', { class: 'rpgc-set' }, list, h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add')));
    }

    function renderInfoBox() {
        const w = S().trackerConfig.infoBox.widgets;
        const d = state.data.infoBox || {};
        const cells = [];
        const setField = (key, sub, v) => { const b = ib(); b[key] = isObj(b[key]) ? b[key] : {}; b[key][sub] = v; commit(); };

        if (w.date?.enabled) cells.push(h('div', { class: 'cell wide' }, sceneLbl('Date', 'date'), editable(plain(d.date), v => setField('date', 'value', v), { label: 'Date' })));
        if (w.time?.enabled) {
            const t = isObj(d.time) ? d.time : {};
            cells.push(h('div', { class: 'cell' }, sceneLbl('Time', 'time'),
                h('span', null, editable(t.start ?? plain(d.time), v => setField('time', 'start', v), { label: 'Time start' }), ' – ', editable(t.end ?? '', v => setField('time', 'end', v), { label: 'Time end' }))));
        }
        if (w.temperature?.enabled) {
            const t = isObj(d.temperature) ? d.temperature : { value: d.temperature };
            cells.push(h('div', { class: 'cell' }, sceneLbl('Temperature', 'temperature'),
                h('span', null, editable(t.value === undefined ? '' : String(t.value), v => { const n = Number(v); setField('temperature', 'value', Number.isFinite(n) ? n : v); }, { label: 'Temperature' }), `°${t.unit || w.temperature.unit || 'C'}`)));
        }
        if (w.weather?.enabled) {
            const wt = isObj(d.weather) ? d.weather : { forecast: d.weather };
            cells.push(h('div', { class: 'cell wide' }, sceneLbl('Weather', 'weather'),
                h('span', null, editable(wt.emoji ?? '', v => setField('weather', 'emoji', v), { class: 'weather', placeholder: 'sky', label: 'Weather emoji' }), ' ', editable(plain(wt.forecast), v => setField('weather', 'forecast', v), { label: 'Forecast' }))));
        }
        if (w.location?.enabled) cells.push(h('div', { class: 'cell wide' }, sceneLbl('Location', 'location'), editable(plain(d.location), v => setField('location', 'value', v), { label: 'Location' })));

        let events = null;
        if (w.recentEvents?.enabled) {
            const list = Array.isArray(d.recentEvents) ? d.recentEvents.map(plain) : (d.recentEvents ? [plain(d.recentEvents)] : []);
            events = h('div', null, h('h4', null, lockBtn(['infoBox', 'recentEvents'], 'recent events'), 'Recent events'), listEditor(list, (arr) => { ib().recentEvents = arr; commit(); }, 'Add an event'));
        }
        return section('scene', 'Scene', state.open, plain(d.location) || null, h('div', { class: 'rpgc-scene' }, ...cells), events);
    }

    function charCard(c, idx, opt = {}) {
        const pc = S().trackerConfig.presentCharacters;
        const fields = (pc.customFields || []).filter(f => f && f.enabled && f.name);
        const charStats = pc.characterStats?.enabled ? (pc.characterStats.customStats || []).filter(x => x && x.enabled && x.name) : [];
        const emojis = pc.relationshipEmojis || {};

        const cName = plain(c.name);
        const edit = (fn) => { const arr = chars(); fn(arr[idx]); commit(); };
        const relStatus = plain(c.relationship ?? c.Relationship);
        const details = isObj(c.details) ? c.details : {};
        const detailEls = [];
        const shownKeys = new Set();
        for (const f of fields) {
            const key = toSnakeCase(f.name);
            shownKeys.add(key);
            detailEls.push(h('span', { class: 'k' }, f.name), editable(plain(details[key]), v => edit(ch => { ch.details = isObj(ch.details) ? ch.details : {}; ch.details[key] = v; }), { label: f.name }));
        }
        for (const [k, v] of Object.entries(details)) {
            if (shownKeys.has(k)) continue;
            detailEls.push(h('span', { class: 'k' }, labelOf(k)), editable(plain(v), nv => edit(ch => { ch.details[k] = nv; }), { label: labelOf(k) }));
        }
        const statEls = charStats.map(st => {
            const arr = Array.isArray(c.stats) ? c.stats : [];
            const found = arr.find(x => x && String(x.name).toLowerCase() === st.name.toLowerCase());
            const val = found ? found.value : '';
            return h('div', { class: 'rpgc-stat' }, h('span', { class: 'rpgc-stat-name' }, st.name), statBar(val, 100),
                h('span', { class: 'rpgc-stat-val' }, editable(val === '' ? '' : String(val), v => {
                    const n = Number(v);
                    if (!Number.isFinite(n)) { render(); return; }
                    edit(ch => {
                        if (!Array.isArray(ch.stats)) ch.stats = [];
                        const ex = ch.stats.find(x => x && String(x.name).toLowerCase() === st.name.toLowerCase());
                        if (ex) ex.value = n; else ch.stats.push({ name: st.name, value: n });
                    });
                }, { placeholder: '–', label: `${plain(c.name)} ${st.name}` }), '%'));
        });
        const thought = plain(c.thoughts);
            return h('div', { class: 'rpgc-char' + (opt.merged ? ' sub' : '') },
            opt.merged ? h('div', { class: 'rpgc-psub' }, h('span', { class: 'gt' }, 'In the scene'), avatarControls(cName), lockBtn(['characters', lockKey(plain(c.name))], plain(c.name)),
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${plain(c.name) || 'character'} from the scene`, onclick: () => { chars().splice(idx, 1); commit(); } }, '\u2715')) : h('div', { class: 'rpgc-char-head' },
                avatarImg(cName) || editable(plain(c.emoji), v => edit(ch => { ch.emoji = v; }), { class: 'emo', placeholder: 'icon', label: 'Character emoji' }),
                editable(plain(c.name), v => edit(ch => { ch.name = v; }), { class: 'name', placeholder: 'Name', label: 'Character name' }),
                pc.relationships?.enabled !== false ? h('span', { class: 'rpgc-rel' },
                    emojis[relStatus] ? h('span', { 'aria-hidden': 'true' }, emojis[relStatus]) : null,
                    editable(relStatus, v => edit(ch => { ch.relationship = { status: v }; }), { placeholder: 'Relationship', label: 'Relationship' })) : null,
                avatarControls(cName),
                relFor(cName) && relFor(cName).standing ? standingChip(relFor(cName)) : null,
                partyOf() && cName ? (inParty(cName)
                    ? h('span', { class: 'rpgc-chip here', title: 'In your party' }, 'party')
                    : h('button', { class: 'rpgc-avatar-btn', title: `Add ${cName} to the party`, onclick: () => send({ type: 'party_member', chatId: state.chatId, op: 'add', name: cName }) }, '+ Party')) : null,
                lockBtn(['characters', lockKey(plain(c.name))], plain(c.name)),
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${plain(c.name) || 'character'}`, onclick: () => { chars().splice(idx, 1); commit(); } }, '✕')),
                detailEls.length ? h('div', { class: 'rpgc-kv' }, ...detailEls) : null,
            ...statEls,
            pc.thoughts?.enabled ? h('div', { class: 'rpgc-thought' }, editable(thought, v => edit(ch => { ch.thoughts = { content: v }; }), { placeholder: pc.thoughts.name || 'Thoughts', label: 'Thoughts', multiline: true })) : null);
    }

    function itemList(items, onChange, withQty, addLabel, lockPathFor) {
        const listEl = h('ul', { class: 'rpgc-list' }, items.map((it, i) => {
            const name = plain(it.name ?? it);
            return h('li', null,
                lockPathFor ? lockBtn(lockPathFor(name), name) : null,
                h('span', { class: 'grow' }, editable(name, v => { const next = clone(items); if (v) next[i] = { ...(isObj(next[i]) ? next[i] : {}), name: v }; else next.splice(i, 1); onChange(next); }, { label: 'Item name' })),
                withQty ? h('span', { class: 'qty' }, '×', editable(it.quantity === undefined ? '1' : String(it.quantity), v => { const n = parseInt(v); const next = clone(items); next[i] = { ...(isObj(next[i]) ? next[i] : { name }), quantity: Number.isFinite(n) ? n : 1 }; onChange(next); }, { label: `${name} quantity` })) : null,
                it.location ? h('span', { class: 'qty' }, it.location) : null,
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${name}`, onclick: () => { const next = clone(items); next.splice(i, 1); onChange(next); } }, '✕'));
        }));
        const input = h('input', { type: 'text', placeholder: addLabel, 'aria-label': addLabel });
        const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; onChange([...clone(items), withQty ? { name: v, quantity: 1 } : { name: v }]); };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        return [items.length ? listEl : h('p', { class: 'rpgc-note' }, 'Empty.'), h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add'))];
    }

    function renderInventory() {
        const cur = state.data.userStats?.inventory || {};
        const arr = (v) => Array.isArray(v) ? v : [];
        const tabs = [['onPerson', 'On person'], ['clothing', 'Clothing'], ['stored', 'Stored'], ['assets', 'Assets']];
        const tabBar = h('div', { class: 'rpgc-tabs', role: 'tablist' }, tabs.map(([k, label]) => h('button', {
            class: 'rpgc-btn' + (state.invTab === k ? ' on' : ''), role: 'tab', 'aria-selected': state.invTab === k ? 'true' : 'false',
            onclick: () => { state.invTab = k; render(); }
        }, label)));

        let body;
        if (state.invTab === 'stored') {
            const stored = isObj(cur.stored) ? cur.stored : {};
            const blocks = Object.entries(stored).map(([loc, items]) => h('div', null,
                h('div', { class: 'rpgc-loc' }, editable(loc, v => { const i = inv(); if (!v || v === loc) return render(); i.stored[v] = i.stored[loc]; delete i.stored[loc]; commit(); }, { label: 'Storage location' }),
                    h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${loc}`, onclick: () => { delete inv().stored[loc]; commit(); } }, '✕')),
                ...itemList(arr(items), next => { inv().stored[loc] = next; commit(); }, true, `Add to ${loc}`, (n) => ['inventory', 'stored', loc, lockKey(n)])));
            const locInput = h('input', { type: 'text', placeholder: 'New storage location', 'aria-label': 'New storage location' });
            const addLoc = () => { const v = locInput.value.trim(); if (!v) return; const i = inv(); if (!i.stored[v]) i.stored[v] = []; commit(); };
            locInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addLoc(); } });
            body = h('div', { class: 'rpgc-set' }, blocks.length ? blocks : h('p', { class: 'rpgc-note' }, 'No storage locations.'), h('div', { class: 'rpgc-add' }, locInput, h('button', { class: 'rpgc-btn', onclick: addLoc }, 'Add location')));
        } else {
            const key = state.invTab;
            body = h('div', { class: 'rpgc-set' }, ...itemList(arr(cur[key]), next => { inv()[key] = next; commit(); }, key === 'onPerson', key === 'clothing' ? 'Add clothing' : key === 'assets' ? 'Add an asset' : 'Add an item', (n) => ['inventory', key, lockKey(n)]));
        }
        return section('inv', 'Inventory', state.open, null, tabBar, body);
    }

    function renderQuests() {
        const q = state.data.userStats?.quests || {};
        const main = plain(q.main);
        const optional = Array.isArray(q.optional) ? q.optional.map(plain) : [];
        const quests = () => { const u = us(); u.quests = isObj(u.quests) ? u.quests : {}; return u.quests; };
        return section('quests', 'Quests', state.open, null,
            ...renderPlotObjectives(),
            h('div', null, h('h4', null, lockBtn(['quests', 'main'], 'main quest'), 'Main quest'), h('div', { class: 'rpgc-quest-main' }, editable(main === 'None' ? '' : main, v => { quests().main = { title: v || 'None' }; commit(); }, { placeholder: 'No main quest', label: 'Main quest' }))),
            h('div', null, h('h4', null, 'Optional quests'), listEditor(optional, arr => { quests().optional = arr.map(title => ({ title })); commit(); }, 'Add a quest', (t) => ['quests', 'optional', lockKey(t)])));
    }

    // ─────────── settings view ───────────

    // Which connection fights, the tracker, chapter summaries, portrait prompts and the Test zone run on.
    function requestConnections() {
        state.connReq = true;
        send({ type: 'list_connections' });
    }
    function connectionPicker(s) {
        if (!state.connections && !state.connReq) requestConnections();
        const c = state.connections;
        const cur = typeof s.sideConnection === 'string' && s.sideConnection ? s.sideConnection : 'chat';
        const opts = [['chat', 'Same as my chat (recommended)'], ['default', 'Lumiverse’s default connection']];
        if (c && c.available) {
            for (const x of c.list) opts.push([x.id, `${x.name}${x.model ? ' — ' + x.model : ''}${x.isDefault ? ' (default)' : ''}`]);
        }
        if (cur !== 'chat' && cur !== 'default' && !opts.some(o => o[0] === cur)) {
            opts.push([cur, c ? 'A connection that no longer exists' : 'Loading…']);
        }
        const sel = h('select', { 'aria-label': 'Connection for side calls', onchange: (e) => { s.sideConnection = e.target.value; saveSettings(); } },
            opts.map(([v, t]) => h('option', { value: v }, t)));
        sel.value = cur;
        const reload = h('button', { class: 'rpgc-btn', title: 'Reload the list of connections', 'aria-label': 'Reload the list of connections', onclick: requestConnections }, '↻');
        let note;
        if (c && !c.available) note = 'This Lumiverse version cannot list connections, so only the first two choices are offered.';
        else if (c && !c.list.length) note = 'You have no connections yet. Add one in Lumiverse’s Connections panel.';
        else if (cur === 'chat') note = 'Fights, the tracker, chapter summaries, portrait prompts and the Test zone use the connection your own replies in that chat use. Before your first reply it follows the connection you have selected in Lumiverse, then Lumiverse’s default, then your first connection.';
        else if (cur === 'default') note = 'Lumiverse’s default connection. With no default set, your first connection is used instead.';
        else note = 'Every side call uses this connection, whatever your chat runs on. Handy for a cheaper or faster model.';
        return h('div', null,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Use'), sel, reload),
            h('p', { class: 'rpgc-note' }, note));
    }

    function toggle(label, get, set, note) {
        const cb = h('input', { type: 'checkbox', checked: get(), onchange: (e) => { set(e.target.checked); saveSettings(); } });
        return h('div', { class: 'rpgc-row' }, h('label', null, cb, label), note ? h('span', { class: 'rpgc-note' }, note) : null);
    }
    function textInput(label, get, set, attrs = {}) {
        const inp = h('input', { type: 'text', value: get() ?? '', 'aria-label': label, ...attrs, onchange: (e) => { set(e.target.value); saveSettings(); } });
        return h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, label), inp);
    }
    function promptArea(label, key, fallbackNote) {
        const s = S();
        const ta = h('textarea', { value: s[key] || '', placeholder: fallbackNote, 'aria-label': label, onchange: (e) => { s[key] = e.target.value; saveSettings(false); } });
        return h('div', { class: 'rpgc-set' }, h('h4', null, label), ta);
    }

    function renderSettings() {
        const s = S();
        if (!s) return [topBar(), h('p', { class: 'rpgc-note' }, 'Loading…')];
        const cfg = s.trackerConfig;
        const us_ = cfg.userStats;
        const pc = cfg.presentCharacters;
        const w = cfg.infoBox.widgets;

        const modeSel = h('select', { 'aria-label': 'Generation mode', onchange: (e) => { s.generationMode = e.target.value; saveSettings(); } },
            h('option', { value: 'together' }, 'Together (trackers come with the reply)'),
            h('option', { value: 'separate' }, 'Separate (extra call after the reply)'));
        modeSel.value = s.generationMode;

        const general = section('s-general', 'General', state.open, null,
            toggle('Enabled', () => s.enabled, v => { s.enabled = v; }, 'Off: the extension adds nothing to your prompts and runs nothing on its own. The panel and your saved data stay readable.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Mode'), modeSel),
            s.generationMode === 'separate' ? toggle('Update automatically after each reply', () => s.autoUpdate, v => { s.autoUpdate = v; }, 'Separate mode: run the tracker call by itself after every reply. Off: only when you press Refresh.') : null,
            s.generationMode === 'separate' ? h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Messages of history'),
                h('input', { type: 'number', min: '1', max: '50', value: String(s.updateDepth), 'aria-label': 'Messages of history', onchange: (e) => { s.updateDepth = Math.max(1, parseInt(e.target.value) || 4); saveSettings(); } })) : null,
            toggle('Narrator mode', () => s.narratorMode, v => { s.narratorMode = v; }, 'Treat the card as a narrator and infer characters from the story.'),
            h('h4', null, 'Connection for side calls'),
            connectionPicker(s),
            h('h4', null, 'Separate tracker calls (Separate mode and Refresh)'),
            toggle('Let the model think', () => s.trackerThinking, v => { s.trackerThinking = v; }, 'Off is much faster with reasoning models.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Give up after (s)'),
                h('input', { type: 'number', min: '20', max: '1800', value: String(s.trackerTimeoutSec || 180), 'aria-label': 'Give up after (seconds)', onchange: (e) => { s.trackerTimeoutSec = Math.max(20, parseInt(e.target.value) || 180); saveSettings(); } })));

        const panels = section('s-panels', 'Panels', state.open, null,
            // In HMS mode the HUD replaces Your stats, Scene and Inventory, but the other
            // three toggles are still live there — so they stay on show.
            hmsOn() ? null : toggle('Your stats', () => s.showUserStats, v => { s.showUserStats = v; }, 'Your own trackers: health, needs, mood, conditions.'),
            hmsOn() ? null : toggle('Scene', () => s.showInfoBox, v => { s.showInfoBox = v; }, 'Date, time, weather, place and what just happened.'),
            toggle('Present characters', () => s.showCharacterThoughts, v => { s.showCharacterThoughts = v; },
                hmsOn() ? 'Off also stops the extension asking the model for them.' : undefined),
            hmsOn() ? null : toggle('Inventory', () => s.showInventory, v => { s.showInventory = v; }, 'What you carry, wear and own.'),
            toggle('Quests', () => s.showQuests, v => { s.showQuests = v; }, 'Your main and side quests.'),
            toggle('Dice', () => s.showDiceDisplay, v => { s.showDiceDisplay = v; }, 'The roller. It lives in the D&D card.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Bar colors'),
                h('label', null, 'Low', h('input', { type: 'color', value: s.statBarColorLow, 'aria-label': 'Low value color', onchange: (e) => { s.statBarColorLow = e.target.value; saveSettings(); } })),
                h('label', null, 'High', h('input', { type: 'color', value: s.statBarColorHigh, 'aria-label': 'High value color', onchange: (e) => { s.statBarColorHigh = e.target.value; saveSettings(); } }))));

        const extras = section('s-extras', 'Story extras', state.open, null,
            toggle('Immersive HTML', () => s.enableHtmlPrompt, v => { s.enableHtmlPrompt = v; }, 'Lets the model add small visual touches in HTML \u2014 a letter, a sign, a screen \u2014 inside its prose.'),
            toggle('Dialogue coloring', () => s.enableDialogueColoring, v => { s.enableDialogueColoring = v; }, 'Asks the model to give each speaker\u2019s dialogue its own colour.'),
            toggle('Deception tags', () => s.enableDeceptionSystem, v => { s.enableDeceptionSystem = v; }, 'Lies are marked for the model and hidden from you.'),
            toggle('Omniscience filter', () => s.enableOmniscienceFilter, v => { s.enableOmniscienceFilter = v; }, 'Keeps characters from acting on what they could not know: someone else\u2019s thoughts, events they did not see.'),
            toggle('Choose your own adventure', () => s.enableCYOA, v => { s.enableCYOA = v; }, hmsOn() ? 'Off in HMS chats: the engines forbid ending on options (World, not GM). Still applies in other chats.' : undefined),
            toggle('Song suggestions', () => s.enableSpotifyMusic, v => { s.enableSpotifyMusic = v; }, 'Tags are hidden; the music player is not ported yet.'));

        // stats editor
        const statRows = (us_.customStats || []).map((st, i) => h('div', { class: 'rpgc-cfg-item' },
            h('input', { type: 'checkbox', checked: st.enabled, 'aria-label': `Track ${st.name}`, onchange: (e) => { st.enabled = e.target.checked; saveSettings(); } }),
            h('input', { type: 'text', value: st.name, 'aria-label': 'Stat name', onchange: (e) => { st.name = e.target.value.trim() || st.name; saveSettings(); } }),
            us_.statsDisplayMode === 'number' ? h('input', { type: 'number', class: 'num', value: String(st.maxValue || 100), 'aria-label': `${st.name} maximum`, onchange: (e) => { st.maxValue = Math.max(1, parseInt(e.target.value) || 100); saveSettings(); } }) : null,
            h('button', { class: 'rpgc-mini', 'aria-label': `Delete ${st.name}`, onclick: () => { us_.customStats.splice(i, 1); saveSettings(); } }, '✕')));
        const dispSel = h('select', { 'aria-label': 'Stat display', onchange: (e) => { us_.statsDisplayMode = e.target.value; saveSettings(); } },
            h('option', { value: 'percentage' }, 'Percent'), h('option', { value: 'number' }, 'Number out of a maximum'));
        dispSel.value = us_.statsDisplayMode || 'percentage';
        const attrRows = (us_.rpgAttributes || []).map((a, i) => h('div', { class: 'rpgc-cfg-item' },
            h('input', { type: 'checkbox', checked: a.enabled, 'aria-label': `Show ${a.name}`, onchange: (e) => { a.enabled = e.target.checked; saveSettings(); } }),
            h('input', { type: 'text', value: a.name, 'aria-label': 'Attribute name', onchange: (e) => { a.name = e.target.value.trim() || a.name; saveSettings(); } }),
            h('button', { class: 'rpgc-mini', 'aria-label': `Delete ${a.name}`, onclick: () => { us_.rpgAttributes.splice(i, 1); saveSettings(); } }, '✕')));

        const statsCfg = section('s-stats', 'Your stats setup', state.open, null,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Show values as'), dispSel),
            ...statRows,
            h('div', null, h('button', { class: 'rpgc-btn', onclick: () => { us_.customStats.push({ id: 'stat_' + Date.now().toString(36), name: 'New stat', enabled: true, maxValue: 100 }); saveSettings(); } }, 'Add stat')),
            h('h4', null, 'Status'),
            toggle('Track status', () => us_.statusSection.enabled, v => { us_.statusSection.enabled = v; }, 'Conditions such as Bleeding or Exhausted, as a line under your stats.'),
            toggle('Mood emoji', () => us_.statusSection.showMoodEmoji, v => { us_.statusSection.showMoodEmoji = v; }, 'An emoji for your current mood.'),
            textInput('Status fields', () => (us_.statusSection.customFields || []).join(', '), v => { us_.statusSection.customFields = v.split(',').map(x => x.trim()).filter(Boolean); }, { placeholder: 'Conditions, Hunger' }),
            h('h4', null, 'Skills'),
            toggle('Track skills', () => us_.skillsSection.enabled, v => { us_.skillsSection.enabled = v; }, 'Skills and how practised they are.'),
            textInput('Section name', () => us_.skillsSection.label, v => { us_.skillsSection.label = v || 'Skills'; }),
            textInput('Skill list', () => (us_.skillsSection.customFields || []).join(', '), v => { us_.skillsSection.customFields = v.split(',').map(x => x.trim()).filter(Boolean); }, { placeholder: 'Leave empty to let the model decide' }),
            h('h4', null, 'Attributes'),
            toggle('Show attributes', () => us_.showRPGAttributes !== false, v => { us_.showRPGAttributes = v; }, 'STR, DEX and the rest. You edit them in the D&D card.'),
            toggle('Show level', () => us_.showLevel !== false, v => { us_.showLevel = v; }, 'Your level, next to your attributes.'),
            toggle('Send attributes with every reply', () => us_.alwaysSendAttributes, v => { us_.alwaysSendAttributes = v; }, 'Otherwise only dice rolls are sent.'),
            ...attrRows,
            h('div', null, h('button', { class: 'rpgc-btn', onclick: () => { us_.rpgAttributes.push({ id: 'attr_' + Date.now().toString(36), name: 'NEW', enabled: true }); saveSettings(); } }, 'Add attribute')));

        const sceneCfg = section('s-scene', 'Scene setup', state.open, null,
            toggle('Date', () => w.date.enabled, v => { w.date.enabled = v; }, 'The in-story date.'),
            w.date.enabled ? textInput('Date format', () => w.date.format, v => { w.date.format = v || 'Weekday, Month, Year'; }) : null,
            toggle('Weather', () => w.weather.enabled, v => { w.weather.enabled = v; }, 'The weather in the scene.'),
            toggle('Temperature', () => w.temperature.enabled, v => { w.temperature.enabled = v; }, 'How warm or cold it is.'),
            w.temperature.enabled ? h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Unit'), (() => {
                const sel = h('select', { 'aria-label': 'Temperature unit', onchange: (e) => { w.temperature.unit = e.target.value; saveSettings(); } }, h('option', { value: 'C' }, 'Celsius'), h('option', { value: 'F' }, 'Fahrenheit'));
                sel.value = w.temperature.unit || 'C';
                return sel;
            })()) : null,
            toggle('Time', () => w.time.enabled, v => { w.time.enabled = v; }, 'The time of day.'),
            toggle('Location', () => w.location.enabled, v => { w.location.enabled = v; }, 'Where the scene is.'),
            toggle('Recent events', () => w.recentEvents.enabled, v => { w.recentEvents.enabled = v; }, 'One line on what just happened.'));

        const fieldRows = (pc.customFields || []).map((f, i) => h('div', { class: 'rpgc-cfg-item' },
            h('input', { type: 'checkbox', checked: f.enabled, 'aria-label': `Track ${f.name}`, onchange: (e) => { f.enabled = e.target.checked; saveSettings(); } }),
            h('input', { type: 'text', value: f.name, 'aria-label': 'Field name', onchange: (e) => { f.name = e.target.value.trim() || f.name; saveSettings(); } }),
            h('input', { type: 'text', value: f.description || '', placeholder: 'What the model should write', 'aria-label': 'Field description', onchange: (e) => { f.description = e.target.value; saveSettings(); } }),
            h('button', { class: 'rpgc-mini', 'aria-label': `Delete ${f.name}`, onclick: () => { pc.customFields.splice(i, 1); saveSettings(); } }, '✕')));
        const relText = (pc.relationshipFields || []).map(r => `${r}=${(pc.relationshipEmojis || {})[r] || ''}`).join(', ');
        const charsCfg = section('s-chars', 'Characters setup', state.open, null,
            toggle('Relationships', () => pc.relationships?.enabled !== false, v => { pc.relationships = { ...(pc.relationships || {}), enabled: v }; }, 'A relationship label on each character in the scene.'),
            toggle('Let the model choose the wording', () => pc.relationshipFree !== false, v => { pc.relationshipFree = v; }, 'On: it writes the bond in its own words (best for HMS). Off: it must pick one of your categories.'),
            textInput(pc.relationshipFree !== false ? 'Example categories' : 'Categories', () => relText, v => {
                const fieldsOut = [], em = {};
                for (const part of v.split(',')) {
                    const [name, emoji] = part.split('=').map(x => (x || '').trim());
                    if (!name) continue;
                    fieldsOut.push(name);
                    if (emoji) em[name] = emoji;
                }
                pc.relationshipFields = fieldsOut;
                pc.relationshipEmojis = em;
            }, { placeholder: 'Family=🏡, Contracted spirit=🔗, Friend=⭐' }),
            h('h4', null, 'Detail fields'),
            ...fieldRows,
            h('div', null, h('button', { class: 'rpgc-btn', onclick: () => { pc.customFields.push({ id: 'field_' + Date.now().toString(36), name: 'New field', enabled: true, description: '' }); saveSettings(); } }, 'Add field')),
            h('h4', null, 'Thoughts'),
            toggle('Track thoughts', () => pc.thoughts.enabled, v => { pc.thoughts.enabled = v; }, 'Each character\u2019s inner thoughts.'),
            textInput('Instruction', () => pc.thoughts.description, v => { pc.thoughts.description = v; }),
            h('h4', null, 'Character stats'),
            toggle('Track character stats', () => pc.characterStats.enabled, v => { pc.characterStats.enabled = v; }, 'Bars for each character in the scene, from the list below.'),
            textInput('Stat names', () => (pc.characterStats.customStats || []).filter(x => x.enabled).map(x => x.name).join(', '), v => {
                pc.characterStats.customStats = v.split(',').map(x => x.trim()).filter(Boolean).map(name => ({ id: toSnakeCase(name), name, enabled: true }));
            }, { placeholder: 'Health, Arousal' }));

        const prompts = section('s-prompts', 'Custom prompts', closedByDefault('s-prompts'), null,
            h('p', { class: 'rpgc-note' }, 'Leave a box empty to use the built-in prompt.'),
            promptArea('Tracker instructions ({userName} works here)', 'customTrackerInstructionsPrompt', 'Built-in instructions'),
            promptArea('Continue instruction (together mode)', 'customTrackerContinuationPrompt', 'Built-in instruction'),
            promptArea('Scene context note (separate mode)', 'customContextInstructionsPrompt', 'Built-in note'),
            promptArea('Narrator', 'customNarratorPrompt', 'Built-in narrator prompt'),
            promptArea('Immersive HTML', 'customHtmlPrompt', 'Built-in prompt'),
            promptArea('Dialogue coloring', 'customDialogueColoringPrompt', 'Built-in prompt'),
            promptArea('Deception', 'customDeceptionPrompt', 'Built-in prompt'),
            promptArea('Omniscience filter', 'customOmnisciencePrompt', 'Built-in prompt'),
            promptArea('Choose your own adventure', 'customCYOAPrompt', 'Built-in prompt'),
            promptArea('Song suggestions', 'customSpotifyPrompt', 'Built-in prompt'),
            promptArea('Plot twist ({{random::a::b}} picks one option)', 'customPlotRandomPrompt', 'Built-in plot twist prompt'),
            promptArea('Move the story', 'customPlotNaturalPrompt', 'Built-in prompt'),
            promptArea('Move the world (HMS, sent as your turn)', 'customWorldMovesPrompt', 'Built-in nudge'));
        prompts.dataset.openKey = 's-prompts'; prompts.addEventListener('toggle', () => { state.open['s-prompts'] = prompts.open; });

        const danger = section('s-reset', 'Reset', closedByDefault('s-reset'), null,
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn danger', disabled: !state.chatId ? true : null, onclick: async () => {
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Clear trackers for this chat?', message: 'Every saved tracker in this chat is removed. Messages stay as they are.', variant: 'danger', confirmLabel: 'Clear trackers' }) : { confirmed: window.confirm('Clear every saved tracker in this chat?') };
                    if (res?.confirmed) send({ type: 'clear_chat_trackers', chatId: state.chatId });
                } }, 'Clear this chat\'s trackers'),
                h('button', { class: 'rpgc-btn danger', onclick: async () => {
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Reset settings?', message: 'All settings go back to defaults. Attributes and level are kept.', variant: 'danger', confirmLabel: 'Reset settings' }) : { confirmed: window.confirm('Reset all settings to defaults?') };
                    if (res?.confirmed) send({ type: 'reset_settings', chatId: state.chatId });
                } }, 'Reset settings')));
        danger.dataset.openKey = 's-reset'; danger.addEventListener('toggle', () => { state.open['s-reset'] = danger.open; });

        return hmsOn()
            ? [topBar(), renderStyleSettings(), renderModulesSettings(), renderHmsSettings(), renderHmsSystemsSettings(), renderQuestSettings(), renderChapterSettings(), renderChronicleSettings(), renderLoreSettings(), renderEngineSettings(), general, panels, renderDisplaySettings(), charsCfg, renderEncounterSettings(), renderDndSettings(), extras, renderPresetSettings(), prompts, renderHelpSettings(), danger]
            : [topBar(), renderStyleSettings(), renderModulesSettings(), renderHmsSettings(), renderSocialSettings(), renderQuestSettings(), renderChapterSettings(), renderChronicleSettings(), renderLoreSettings(), renderEngineSettings(), general, renderPresetSettings(), panels, renderDisplaySettings(), extras, statsCfg, sceneCfg, charsCfg, renderEncounterSettings(), renderDndSettings(), prompts, renderHelpSettings(), danger];
    }

    // ─────────── locks ───────────

    const LOCK_ON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
    const LOCK_OFF = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>';
    function lockKey(v) { return String(v ?? '').trim().toLowerCase(); }
    function isLocked(path) {
        let node = state.locks || {};
        for (const k of path) {
            if (node === true || !node || typeof node !== 'object') return false;
            node = node[String(k)];
        }
        return node === true;
    }
    function setLockLocal(path, on) {
        if (!state.locks || typeof state.locks !== 'object') state.locks = {};
        let node = state.locks;
        for (let i = 0; i < path.length - 1; i++) {
            const k = String(path[i]);
            if (!isObj(node[k])) node[k] = {};
            node = node[k];
        }
        const last = String(path[path.length - 1]);
        if (on) node[last] = true; else delete node[last];
    }
    function lockBtn(path, what) {
        if (!S()?.showLockIcons || !state.chatId || !path || path.some(p => p === '' || p === undefined)) return null;
        const on = isLocked(path);
        const b = h('button', {
            class: 'rpgc-lock' + (on ? ' on' : ''),
            title: on ? 'Locked: the AI keeps this as it is' : 'Unlocked: the AI may change this',
            'aria-label': `${on ? 'Unlock' : 'Lock'} ${what || path[path.length - 1]}`,
            'aria-pressed': on ? 'true' : 'false',
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setLockLocal(path, !on);
                render();
                send({ type: 'toggle_lock', chatId: state.chatId, path });
            }
        });
        b.innerHTML = on ? LOCK_ON : LOCK_OFF;
        return b;
    }
    function sceneLbl(text, key) {
        return h('span', { class: 'lbl' }, lockBtn(['infoBox', key], text), text);
    }

    // ─────────── story actions (plot + encounter) ───────────

    // Two different ways to fight, plus the legacy window. While one runs the others stay hidden:
    // one fight at a time. A running immersive fight always shows End fight — even with the Fights
    // module switched off, or it could never be stopped.
    function fightButtons() {
        const s = S();
        const out = [];
        if (!s) return out;
        const imm = state.immersive;
        if (imm && imm.active) {
            out.push(h('button', { class: 'rpgc-btn primary', title: 'Stop tracking this fight', onclick: async () => {
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'End the fight?', message: 'The extension stops tracking this fight and stops telling the story about it. Nothing in the chat changes.', confirmLabel: 'End fight' }) : { confirmed: true };
                if (res?.confirmed) send({ type: 'immersive_end', chatId: state.chatId });
            } }, 'End fight'));
            return out;
        }
        if (state.encounterActive) {
            out.push(h('button', { class: 'rpgc-btn primary', onclick: () => openEncounter() }, 'Resume fight'));
            return out;
        }
        if (!s.encounterSettings?.enabled) return out;
        out.push(h('button', { class: 'rpgc-btn', title: 'Keep playing in the chat. The panel tracks everyone\u2019s HP, MP, Stamina and effects, and the story is told what shape they are in.', disabled: state.immBusy ? true : null, onclick: openImmersiveStart }, state.immBusy ? 'Setting up\u2026' : 'Immersive fight'));
        if (dndOn()) out.push(h('button', { class: 'rpgc-btn', title: 'Opens the fight window with D&D rules: initiative, attack rolls, damage dice, spell slots and death saves.', onclick: () => openEncounter('dnd') }, 'Turn-based fight'));
        if (s.encounterSettings.legacyWindow) out.push(h('button', { class: 'rpgc-btn', title: 'The narrative fight window from 1.8: turns and menus, and the model judges each action.', onclick: () => openEncounter('narrative') }, 'Narrative window'));
        return out;
    }

    // One entry point for the input-bar button and the Test zone: pick how to fight.
    let chooserModal = null;
    function openFightChooser() {
        if (!state.chatId || chooserModal) return;
        if (state.immersive && state.immersive.active) { try { tab.activate(); } catch { /* optional */ } return; }
        if (state.encounterActive) { openEncounter(); return; }
        const es = S()?.encounterSettings || {};
        if (es.enabled === false) { state.status = { kind: 'info', text: 'Fights are switched off. Turn them on in Settings \u2192 Modules.' }; render(); return; }
        // With only one kind of fight available there is nothing to choose: open it.
        if (!dndOn() && !es.legacyWindow) { openImmersiveStart(); return; }
        try { chooserModal = ctx.ui.showModal({ title: 'Start a fight', width: 460, maxHeight: 480 }); }
        catch { openImmersiveStart(); return; }
        chooserModal.root.classList.add('rpgc');
        chooserModal.onDismiss(() => { chooserModal = null; });
        // Close this one before opening the next: Lumiverse allows two stacked modals at most.
        const pick = (fn) => { const m = chooserModal; chooserModal = null; try { m && m.dismiss(); } catch { /* gone */ } setTimeout(fn, 60); };
        const opt = (title, text, fn) => h('button', { class: 'rpgc-btn rpgc-choice', onclick: () => pick(fn) }, h('b', null, title), h('span', null, text));
        chooserModal.root.append(h('div', { class: 'rpgc rpgc-chooser' },
            opt('Immersive fight', 'Stay in the chat. You fight by writing, and the side panel tracks everyone\u2019s HP, MP, Stamina and effects as the story moves them.', openImmersiveStart),
            dndOn() ? opt('Turn-based fight', 'A fight window with D&D rules. The extension rolls initiative, attacks, damage and saves; the model narrates the numbers.', () => openEncounter('dnd')) : null,
            es.legacyWindow ? opt('Narrative window (legacy)', 'The 1.8 fight window: turns and menus, and the model judges each action.', () => openEncounter('narrative')) : null));
    }

    function rulesSummary() {
        const es = S()?.encounterSettings || {};
        const style = { engine: 'the engine\u2019s own rules', power: 'power scaling', fiction: 'the fiction alone' }[es.style] || 'the engine\u2019s own rules';
        const diff = { story: 'Story', normal: 'Normal', hard: 'Hard', hardcore: 'Hardcore' }[es.difficulty] || 'Normal';
        return `Resolved by ${style} \u00B7 difficulty ${diff} \u00B7 ${es.fateDice ? `fate dice d${es.combatDiceSides || 20}` : 'no fate dice'}. Change these in Settings \u2192 Fights.`;
    }

    let immModal = null;
    function openImmersiveStart() {
        if (!state.chatId || immModal || state.immBusy) return;
        try { immModal = ctx.ui.showModal({ title: 'Immersive fight', width: 520, maxHeight: 460 }); }
        catch { send({ type: 'immersive_start', chatId: state.chatId, framing: '' }); state.immBusy = true; render(); return; }
        immModal.root.classList.add('rpgc');
        immModal.onDismiss(() => { immModal = null; });
        const framingIn = h('input', { type: 'text', placeholder: 'Optional: who you are fighting, if the scene leaves it unclear', 'aria-label': 'Who you are fighting' });
        const go = () => { send({ type: 'immersive_start', chatId: state.chatId, framing: framingIn.value.trim() }); state.immBusy = true; render(); immModal && immModal.dismiss(); };
        framingIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
        immModal.root.append(h('div', { class: 'rpgc', style: 'padding:12px;display:flex;flex-direction:column;gap:10px' },
            h('p', { class: 'rpgc-note' }, 'No window, no turns. You keep writing in the chat. The extension reads the scene once to find who is fighting and what shape they are in, then tracks everyone\u2019s pools and effects and tells the story, with every message, what those bodies look like.'),
            h('p', { class: 'rpgc-note' }, rulesSummary()),
            framingIn,
            h('div', { class: 'rpgc-top' },
                h('button', { class: 'rpgc-btn primary', onclick: go }, 'Start tracking'),
                h('button', { class: 'rpgc-btn', onclick: () => immModal && immModal.dismiss() }, 'Cancel'))));
        setTimeout(() => framingIn.focus(), 30);
    }

    const IMM_COLORS = { mp: ['#1f2a4a', '#5b8def'], stamina: ['#4a3a12', '#e0a93b'] };
    function immBar(pool, enemy) {
        const pct = Number.isFinite(pool.pct) ? pool.pct : 0;
        const fill = h('i');
        fill.style.width = pct + '%';
        const pair = IMM_COLORS[pool.id];
        fill.style.backgroundColor = pair ? mixColor(pair[0], pair[1], pct / 100)
            : enemy ? mixColor('#6b1d1d', '#d9534f', pct / 100) : mixColor(S().statBarColorLow, S().statBarColorHigh, pct / 100);
        return h('div', { class: 'rpgc-bar', role: 'meter', 'aria-label': pool.label, 'aria-valuemin': '0', 'aria-valuemax': String(pool.max || 0), 'aria-valuenow': String(pool.cur || 0) }, fill);
    }

    // A correction happens in place: the number turns into a field. No browser prompt — the
    // desktop app's window does not always support one.
    function immPoolValue(c, pl, live) {
        const fromHud = pl.src === 'hud';
        const ed = state.immEdit;
        if (live && !fromHud && ed && ed.name === c.name && ed.pool === pl.id) {
            const inp = h('input', { type: 'number', min: '0', max: String(pl.max), value: String(pl.cur), 'aria-label': `${c.name} ${pl.label}` });
            let done = false;
            const commit = (save) => {
                if (done) return; done = true;
                const v = Number(inp.value);
                state.immEdit = null;
                if (save && Number.isFinite(v) && v !== pl.cur) send({ type: 'immersive_adjust', chatId: state.chatId, name: c.name, pool: pl.id, value: v });
                render();
            };
            inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(true); else if (e.key === 'Escape') commit(false); });
            inp.addEventListener('blur', () => commit(true));
            setTimeout(() => { try { inp.focus(); inp.select(); } catch { /* gone */ } }, 0);
            return h('span', { class: 'val editing' }, inp, ` / ${pl.max}`);
        }
        return h('button', { class: 'val', disabled: (!live || fromHud) ? true : null,
            title: fromHud ? 'From the WORLD STATE HUD \u2014 edit the HUD line to change it' : 'Click to correct',
            onclick: () => { state.immEdit = { name: c.name, pool: pl.id }; render(); } }, `${pl.cur} / ${pl.max}`);
    }

    const IMM_OUTCOME = { spared: 'Fight over \u2014 everyone was spared', victory: 'Fight over \u2014 your side stands', defeat: 'Fight over \u2014 your side fell', escaped: 'Fight over \u2014 they got away', fled: 'Fight over \u2014 you got away' };
    const INTEL_LABEL = { intent: 'Intent', weakness: 'Weakness', resist: 'Resists', power: 'True strength', tell: 'Tell', note: 'Note' };

    // The tracker. Every number here is what the story is being told.
    function renderImmersive() {
        const imm = state.immersive;
        if (!imm || !Array.isArray(imm.combatants)) return null;
        const live = !!imm.active;
        const pend = imm.pending || {};
        const rules = imm.rules || {};
        const head = h('div', { class: 'rpgc-imm-head' },
            h('b', null, live ? 'Fight in progress' : (IMM_OUTCOME[imm.outcome] || 'Fight over')),
            live && imm.round ? h('span', { class: 'rpgc-note' }, `${imm.round} repl${imm.round === 1 ? 'y' : 'ies'}`) : null,
            !live ? h('button', { class: 'rpgc-mini', 'aria-label': 'Dismiss', onclick: () => send({ type: 'immersive_dismiss', chatId: state.chatId }) }, '\u2715') : null);
        const rows = [head];
        if (live && rules.styleLabel) rows.push(h('div', { class: 'rpgc-imm-chips' },
            h('span', { title: 'How the story resolves each exchange' }, rules.styleLabel),
            h('span', { title: 'Difficulty' }, rules.difficultyLabel || 'Normal'),
            rules.fateDice ? h('span', { title: 'A true-random die for every fighter with each message' }, `Fate dice d${rules.sides}`) : null));
        if (imm.environment) rows.push(h('div', { class: 'rpgc-imm-env' }, imm.environment));
        if (live && (pend.study || pend.exploit)) {
            rows.push(h('div', { class: 'rpgc-imm-flag', role: 'status' },
                h('span', null, 'With your next message:'),
                pend.study ? h('span', null, `you study ${pend.study}`) : null,
                pend.exploit ? h('span', null, `you act on \u201C${pend.exploit.text}\u201D`) : null,
                h('button', { class: 'rpgc-mini', 'aria-label': 'Clear', title: 'Clear', onclick: () => send({ type: 'immersive_clear', chatId: state.chatId, what: 'all' }) }, '\u2715')));
        }
        for (const side of ['ally', 'enemy']) {
            const list = imm.combatants.filter(c => c.side === side);
            if (!list.length) continue;
            rows.push(h('div', { class: 'rpgc-imm-side' }, side === 'ally' ? 'Your side' : 'Against you'));
            for (const c of list) {
                const enemy = side === 'enemy';
                const studying = pend.study && pend.study === c.name;
                const name = h('div', { class: 'rpgc-imm-name' },
                    h('b', null, c.name),
                    c.isPlayer ? h('span', { class: 'tag' }, 'you') : null,
                    c.level ? (() => {
                        const me = imm.combatants.find(x => x.isPlayer);
                        const gap = !c.isPlayer && me && me.level ? c.level - me.level : null;
                        return h('span', { class: 'tag' + (gap !== null && gap >= 10 ? ' down' : ''), title: gap === null ? 'Level' : gap === 0 ? 'Your level' : `${Math.abs(gap)} level${Math.abs(gap) === 1 ? '' : 's'} ${gap > 0 ? 'above' : 'below'} you` }, `Lv ${c.level}${gap ? ` (${gap > 0 ? '+' : '\u2212'}${Math.abs(gap)})` : ''}`);
                    })() : null,
                    c.down ? h('span', { class: 'tag down' }, 'down') : null,
                    c.spared ? h('span', { class: 'tag spared' }, 'spared') : c.left ? h('span', { class: 'tag' }, 'gone') : null,
                    !c.left && !c.down && c.spareable ? h('span', { class: 'tag mercy', title: 'MERCY would work now' }, 'can be spared') : null,
                    live && enemy && !c.down && !c.left ? h('button', { class: 'rpgc-mini' + (studying ? ' on' : ''), 'aria-pressed': studying ? 'true' : 'false',
                        title: 'Study them with your next message: the story reports what careful observation honestly reveals', onclick: () => send({ type: 'immersive_study', chatId: state.chatId, name: c.name }) }, studying ? 'Studying' : 'Study') : null,
                    live && !c.isPlayer ? h('button', { class: 'rpgc-mini', title: 'Take them out of the fight', 'aria-label': `Remove ${c.name}`, onclick: () => send({ type: 'immersive_remove', chatId: state.chatId, name: c.name }) }, '\u2715') : null);
                const pools = c.pools.map(pl => h('div', { class: 'rpgc-imm-pool' },
                    h('span', null, pl.label, pl.src === 'hud' ? h('span', { class: 'rpgc-imm-src' }, 'HUD') : null),
                    immBar(pl, enemy), immPoolValue(c, pl, live),
                    h('span', { class: 'band' }, pl.band)));
                const fx = (c.statuses || []).length ? h('div', { class: 'rpgc-imm-fx', 'aria-label': 'Effects' },
                    c.statuses.map(st => h('span', { class: st.fresh ? 'new' : '', title: st.fresh ? 'New this reply' : `For ${st.replies} replies` }, st.replies > 1 ? `${st.name} \u00B7 ${st.replies} replies` : st.name))) : null;
                const intel = (c.intel || []).length ? h('div', { class: 'rpgc-imm-intel' },
                    c.intel.map(f => {
                        const usable = live && enemy && !c.down && !c.left && (f.kind === 'weakness' || f.kind === 'tell' || f.kind === 'intent');
                        const on = pend.exploit && pend.exploit.text === f.text;
                        const label = [h('em', null, `${INTEL_LABEL[f.kind] || 'Note'}: `), f.text];
                        return usable ? h('button', { class: on ? 'on' : '', 'aria-pressed': on ? 'true' : 'false', title: 'Act on this with your next message (advantage if it is true)', onclick: () => send({ type: 'immersive_exploit', chatId: state.chatId, name: c.name, text: f.text }) }, ...label)
                            : h('span', null, ...label);
                    })) : null;
                rows.push(h('div', { class: 'rpgc-imm-c' + (c.down ? ' down' : '') }, name,
                    c.note ? h('div', { class: 'rpgc-imm-note' }, c.note) : null,
                    ...(pools.length ? pools : [h('div', { class: 'rpgc-imm-note' }, 'No pools tracked.')]),
                    fx,
                    c.did ? h('div', { class: 'rpgc-imm-did' }, `Last: ${c.did}`) : null,
                    c.tell ? h('div', { class: 'rpgc-imm-tell' }, `Winding up: ${c.tell}`) : null,
                    intel));
            }
        }
        const dice = imm.dice && Array.isArray(imm.dice.rolls) && imm.dice.rolls.length ? imm.dice : null;
        if (live && dice) rows.push(h('div', { class: 'rpgc-imm-dice' }, `Fate dice (d${dice.sides}): ` + dice.rolls.map(r => `${r.name} ${r.value}${r.kept ? ` (${r.kept.join('/')})` : ''}${r.player ? ` \u2014 ${r.band}` : ''}`).join(' \u00B7 ')));
        const last = Array.isArray(imm.last) && imm.last.length ? imm.last
            : (Array.isArray(imm.changes) ? imm.changes.map(x => `${x.name} ${({ hp: 'HP', mp: 'MP', stamina: 'Stamina' })[x.pool] || x.pool} ${Math.round(x.from)}\u2192${Math.round(x.to)}`) : []);
        if (last.length) rows.push(h('div', { class: 'rpgc-imm-chg' }, 'Last reply: ' + last.join(' \u00B7 ')));
        const log = Array.isArray(imm.log) ? imm.log.filter(e => e.lines && e.lines.length) : [];
        if (log.length > 1) {
            const det = h('details', { class: 'rpgc-imm-log' }, h('summary', null, `Fight log (${log.length})`),
                h('ol', null, log.slice().reverse().map(e => h('li', null, h('b', null, `Reply ${e.round}: `), e.lines.join(' \u00B7 ')))));
            det.open = !!state.open['imm-log'];
            det.dataset.openKey = 'imm-log'; det.addEventListener('toggle', () => { state.open['imm-log'] = det.open; });
            rows.push(det);
        }
        return h('div', { class: 'rpgc-imm' + (live ? ' live' : '') }, ...rows);
    }

    function storyRow() {
        const s = S();
        if (!s || !s.enabled || !state.chatId) return null;
        const btns = [];
        if (s.showPlotButtons) {
            btns.push(h('button', { class: 'rpgc-btn', title: 'Continue the last reply with a random twist', disabled: state.plotBusy ? true : null, onclick: () => plot('random') }, 'Plot twist'));
            btns.push(h('button', { class: 'rpgc-btn', title: 'Continue the last reply and push the story forward', disabled: state.plotBusy ? true : null, onclick: () => plot('natural') }, 'Move the story'));
        }
        btns.push(...fightButtons());
        btns.push(rereadButton());
        return btns.length ? h('div', { class: 'rpgc-story' }, btns) : null;
    }

    let plotTimer = null;
    function plot(kind) {
        if (!state.chatId || state.plotBusy) return;
        state.plotBusy = true;
        render();
        send({ type: 'plot', chatId: state.chatId, kind });
        clearTimeout(plotTimer);
        plotTimer = setTimeout(() => { if (state.plotBusy) { state.plotBusy = false; render(); } }, 15000);
    }

    async function runPlot(msg) {
        try {
            const url = msg.endpoint === 'continue' ? '/api/v1/generate/continue' : '/api/v1/generate';
            const body = { chat_id: msg.chatId, regen_feedback: msg.prompt, regen_feedback_position: 'user' };
            if (msg.endpoint === 'continue' && msg.messageId) body.message_id = msg.messageId;
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                let err = '';
                try { err = (await res.json())?.error || ''; } catch { /* not json */ }
                throw new Error(err || `HTTP ${res.status}`);
            }
            state.status = { kind: 'ok', text: msg.kind === 'random' ? 'Plot twist sent. Watch the chat.' : 'The story is moving on in the chat.' };
        } catch (e) {
            state.status = { kind: 'error', text: `Could not start the plot generation: ${e?.message || e}` };
        }
        state.plotBusy = false;
        clearTimeout(plotTimer);
        render();
    }

    // ─────────── settings: display, presets, plot, encounters ───────────

    function selectRow(label, value, options, onChange) {
        const sel = h('select', { 'aria-label': label, onchange: (e) => onChange(e.target.value) }, options.map(([v, t]) => h('option', { value: v }, t)));
        sel.value = value;
        return h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, label), sel);
    }

    function renderDisplaySettings() {
        const s = S();
        return section('s-display', 'Chat and panel extras', state.open, null,
            ...chatDisplaySettings(s),
            toggle('Show lock buttons', () => s.showLockIcons, v => { s.showLockIcons = v; }, 'Locked values stay as they are when the AI updates trackers.'),
            toggle('Show plot buttons', () => s.showPlotButtons, v => { s.showPlotButtons = v; }, hmsOn() ? 'Classic chats only. In HMS chats Move the world replaces them: the random twist list can break canon gating and hand out plot armor.' : undefined),
            toggle('Enable fights', () => s.encounterSettings.enabled, v => { s.encounterSettings.enabled = v; }, 'Shows the fight buttons: Immersive, and Turn-based when D&D is on.'),
            h('h4', null, 'Weather effects'),
            toggle('Animate the weather', () => s.enableDynamicWeather, v => { s.enableDynamicWeather = v; }, 'A light overlay that follows the scene forecast and time.'),
            toggle('Draw it in front of the chat', () => s.weatherForeground, v => { s.weatherForeground = v; }, 'Off keeps it behind the chat.'),
            h('h4', null, 'Character portraits'),
            toggle('Enable portraits', () => s.enableAvatars, v => { s.enableAvatars = v; }, 'Adds a Portrait button to each present character. Uses your Lumiverse image-generation setup.'),
            s.enableAvatars ? promptArea('Portrait style', 'avatarPromptStyle', 'Built-in style instruction') : null);
    }

    // HUD card and dialogue: drawn when a message is shown, so the saved reply never changes.
    function chatDisplaySettings(s) {
        if (!s.chatDisplay || typeof s.chatDisplay !== 'object') s.chatDisplay = {};
        const d = s.chatDisplay;
        const on = (k, def) => (d[k] === undefined ? def : d[k] === true);
        const marks = on('colours', false) || on('emoji', false) || on('names', false);
        const pal = h('textarea', { rows: '8', 'aria-label': 'Emoji families', spellcheck: 'false', style: 'width:100%;font-size:13px;line-height:1.6',
            placeholder: state.paletteDefault || 'joy: 😊 😄 😁', onchange: (e) => { d.palette = e.target.value; saveSettings(false); } });
        pal.value = d.palette || '';
        const under = ['panel', 'thoughts', 'off'].includes(d.states) ? d.states : (s.showThoughtsInChat === false ? 'off' : 'panel');
        return [
            h('h4', null, 'Under each reply'),
            selectRow('Show', under, [['panel', 'Internal states: scene, people, bonds, plot'], ['thoughts', 'Thoughts only'], ['off', 'Nothing']],
                v => { d.states = v; if (v === 'thoughts') s.showThoughtsInChat = true; saveSettings(); }),
            under === 'panel' ? selectRow('Open on', ['scene', 'people', 'bonds', 'plot', 'map'].includes(d.statesTab) ? d.statesTab : 'people',
                [['scene', 'Scene'], ['people', 'People (with thoughts)'], ['bonds', 'Bonds'], ['plot', 'Plot'], ['map', 'Map']], v => { d.statesTab = v; saveSettings(); }) : null,
            under === 'panel' ? toggle('Start open', () => on('statesOpen', true), v => { d.statesOpen = v; }, 'What the side-panel block said about each reply, with what moved. Display only; never sent to the model.') : null,
            h('h4', null, 'Map: where everyone stands'),
            (() => { if (!s.positions || typeof s.positions !== 'object') s.positions = {}; return selectRow('Track positions', ['fights', 'always'].includes(s.positions.mode) ? s.positions.mode : 'off',
                [['off', 'Off'], ['fights', 'Only in fights (recommended)'], ['always', 'Every reply (more tokens, slower)']], v => { s.positions.mode = v; saveSettings(); }); })(),
            h('p', { class: 'rpgc-note' }, 'The model draws each room once, from the location\u2019s lorebook entry when it has one, then only moves people in it. While it is on it costs about 200 tokens of request plus a short answer per reply. The map shows in Internal states and in the side panel.'),
            toggle('Map bank: keep every drawn room for the whole world', () => !s.positions || s.positions.bank !== false, v => { if (!s.positions || typeof s.positions !== 'object') s.positions = {}; s.positions.bank = v; },
                'A place is drawn once: coming back to it, or a new chat with the same bot, uses the saved room. The bank is in the Map card; the Atlas shows a saved map for each place that has one.'),
            h('h4', null, 'HUD card'),
            toggle('Show the HUD as a card', () => on('hudCard', true), v => { d.hudCard = v; },
                'The World State drawn as a card in the chat: time, place, your lines, quests and inline blocks. The saved reply keeps its plain text, so every lorebook entry keeps loading. • marks a line that loads one.'),
            on('hudCard', true) ? selectRow('Card colours', d.hudTheme === 'app' ? 'app' : 'world',
                [['world', 'The bot’s world (Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei)'], ['app', 'Follow Lumiverse']], v => { d.hudTheme = v; saveSettings(); }) : null,
            on('hudCard', true) ? toggle('Start with the text version open', () => on('hudRawOpen', false), v => { d.hudRawOpen = v; }) : null,
            h('h4', null, 'Dialogue'),
            toggle('Emoji before each spoken line', () => on('emoji', false), v => { d.emoji = v; },
                'A reading aid: one emoji for the feeling the speaker shows, from the same family every time, never the same one twice in a row.'),
            toggle('Colour each speaker', () => on('colours', false), v => { d.colours = v; }, 'Each character keeps one colour for the whole chat.'),
            toggle('Speaker’s name before each line', () => on('names', false), v => { d.names = v; }),
            marks ? h('p', { class: 'rpgc-note' }, 'The model now marks each spoken line as ', h('code', null, '[D:Name:mood]"…"[/D]'),
                ' and the extension draws the rest, so turning these on or off needs no new replies. Older messages redraw after you reload the page. This replaces “Dialogue coloring” under Story extras while it is on.') : null,
            on('emoji', false) ? h('div', null,
                h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Emoji families'),
                    h('button', { class: 'rpgc-mini', title: 'Copy the built-in list in, to edit it', onclick: () => { pal.value = state.paletteDefault || ''; d.palette = pal.value; saveSettings(false); } }, 'Edit the built-in list'),
                    h('button', { class: 'rpgc-mini', title: 'Go back to the built-in list', onclick: () => { pal.value = ''; d.palette = ''; saveSettings(false); } }, 'Reset')),
                pal,
                h('p', { class: 'rpgc-note' }, 'One family per line: the feeling, a colon, then its emojis. Empty uses the built-in list (42 feelings). The model is told these feeling names.')) : null
        ];
    }

    function renderPresetSettings() {
        const s = S();
        const pm = s.presetManager || {};
        const presets = Object.values(pm.presets || {}).sort((a, b) => String(a.name).localeCompare(String(b.name)));
        const sel = h('select', { 'aria-label': 'Preset', onchange: (e) => { state.presetSel = e.target.value; render(); } },
            h('option', { value: '' }, presets.length ? 'Choose a preset' : 'No presets yet'),
            presets.map(p => h('option', { value: p.id }, `${p.name}${p.id === pm.defaultPresetId ? ' (default)' : ''}${p.id === pm.activePresetId ? ' • in use' : ''}`)));
        const selected = state.presetSel && pm.presets?.[state.presetSel] ? state.presetSel : (pm.activePresetId && pm.presets?.[pm.activePresetId] ? pm.activePresetId : '');
        sel.value = selected;
        const id = () => sel.value;
        const nameIn = h('input', { type: 'text', placeholder: 'Preset name', 'aria-label': 'Preset name' });
        const op = (o, extra = {}) => send({ type: 'preset', chatId: state.chatId, op: o, id: id(), ...extra });
        const need = (fn) => () => { if (!id()) { state.status = { kind: 'info', text: 'Choose a preset first.' }; render(); return; } fn(); };
        const charId = state.characterId;
        const linked = charId ? pm.characterAssociations?.[charId] : null;
        const fileIn = h('input', { type: 'file', accept: '.json,application/json', style: 'display:none', onchange: async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            try {
                const data = JSON.parse(await f.text());
                send({ type: 'preset', chatId: state.chatId, op: 'import', preset: data });
            } catch {
                state.status = { kind: 'error', text: 'That file is not valid JSON.' };
                render();
            }
            e.target.value = '';
        } });
        const exportPreset = () => {
            const p = pm.presets[id()];
            const blob = new Blob([JSON.stringify({ format: 'rpg-companion-preset', name: p.name, trackerConfig: p.trackerConfig }, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${String(p.name).replace(/[^\w\- ]+/g, '_') || 'preset'}.json`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        };
        return section('s-presets', 'Tracker field presets', closedByDefault('s-presets'), pm.activePresetId && pm.presets?.[pm.activePresetId] ? pm.presets[pm.activePresetId].name : null,
            h('p', { class: 'rpgc-note' }, 'A preset stores your whole tracker setup: stats, status, skills, attributes, scene and character fields.'),
            h('div', { class: 'rpgc-row' }, sel),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn', onclick: need(() => op('load')) }, 'Load'),
                h('button', { class: 'rpgc-btn', onclick: need(() => op('save')) }, 'Save current setup into it'),
                h('button', { class: 'rpgc-btn', onclick: need(exportPreset) }, 'Export')),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn', onclick: need(() => op('set_default')) }, 'Make default'),
                pm.defaultPresetId ? h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'preset', chatId: state.chatId, op: 'set_default', id: null }) }, 'Clear default') : null,
                h('button', { class: 'rpgc-btn danger', onclick: need(async () => {
                    const name = pm.presets[id()]?.name || 'this preset';
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Delete preset?', message: `"${name}" will be removed.`, variant: 'danger', confirmLabel: 'Delete' }) : { confirmed: window.confirm(`Delete "${name}"?`) };
                    if (res?.confirmed) { state.presetSel = ''; op('delete'); }
                }) }, 'Delete')),
            charId ? h('div', { class: 'rpgc-row' },
                linked
                    ? h('span', { class: 'rpgc-note' }, `This character uses "${pm.presets?.[linked]?.name || 'a deleted preset'}".`)
                    : h('span', { class: 'rpgc-note' }, 'No preset linked to this character.'),
                linked
                    ? h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'preset', chatId: state.chatId, op: 'unassociate', characterId: charId }) }, 'Unlink')
                    : h('button', { class: 'rpgc-btn', onclick: need(() => op('associate', { characterId: charId })) }, 'Link selected preset to this character')) : null,
            h('div', { class: 'rpgc-row' }, nameIn,
                h('button', { class: 'rpgc-btn', onclick: () => { const n = nameIn.value.trim(); if (!n) { nameIn.focus(); return; } send({ type: 'preset', chatId: state.chatId, op: 'create', name: n }); } }, 'Save as new'),
                h('button', { class: 'rpgc-btn', onclick: need(() => { const n = nameIn.value.trim(); if (!n) { nameIn.focus(); return; } op('rename', { name: n }); }) }, 'Rename')),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', onclick: () => fileIn.click() }, 'Import preset file'), fileIn));
    }

    const TENSES = [['story', 'Match the story'], ['present', 'Present'], ['past', 'Past']];
    const PERSONS = [['first', 'First person'], ['second', 'Second person'], ['third', 'Third person']];
    const NARRATIONS = [['omniscient', 'Omniscient'], ['limited', 'Limited']];

    function narrativeRows(title, obj) {
        return [
            h('h4', null, title),
            selectRow('Tense', obj.tense, TENSES, v => { obj.tense = v; saveSettings(false); }),
            selectRow('Person', obj.person, PERSONS, v => { obj.person = v; saveSettings(false); }),
            selectRow('Narration', obj.narration, NARRATIONS, v => { obj.narration = v; saveSettings(false); }),
            textInput('Point of view', () => obj.pov, v => { obj.pov = v.trim() || 'narrator'; }, { placeholder: 'narrator' })
        ];
    }

    function renderEncounterSettings() {
        const s = S();
        const es = s.encounterSettings;
        if (!isObj(es.dnd)) es.dnd = { deathSaves: true, crits: true, massiveDamage: true, obedienceRolls: true };
        const I = () => (s.immersive = s.immersive || {});
        const diffSel = h('select', { 'aria-label': 'Difficulty', onchange: (e) => { es.difficulty = e.target.value; saveSettings(false); render(); } },
            h('option', { value: 'story' }, 'Story \u2014 the odds lean your way; a loss is never death'),
            h('option', { value: 'normal' }, 'Normal \u2014 fair odds; death is possible but rare'),
            h('option', { value: 'hard' }, 'Hard \u2014 the odds favour the enemy; a loss can maim or kill'),
            h('option', { value: 'hardcore' }, 'Hardcore \u2014 no mercy; a loss is death'));
        diffSel.value = es.difficulty || 'normal';
        const styleSel = h('select', { 'aria-label': 'How narrative fights resolve', onchange: (e) => { es.style = e.target.value; saveSettings(false); render(); } },
            h('option', { value: 'engine' }, 'Engine rules \u2014 the bot\u2019s own system'),
            h('option', { value: 'power' }, 'Power level, feats, hax and counters'),
            h('option', { value: 'fiction' }, 'Fiction alone'));
        styleSel.value = es.style || 'engine';
        const engageSel = h('select', { 'aria-label': 'When a fight starts in the story', onchange: (e) => { I().autoEngage = e.target.value; saveSettings(false); } },
            h('option', { value: 'off' }, 'Nothing \u2014 I press a button'),
            h('option', { value: 'immersive' }, 'Start an immersive fight'),
            h('option', { value: 'turnbased', disabled: dndOn() ? null : true }, dndOn() ? 'Open the turn-based window' : 'Open the turn-based window (needs D&D)'));
        engageSel.value = ['immersive', 'turnbased'].includes(I().autoEngage) ? I().autoEngage : 'off';
        return section('s-enc', 'Fights', closedByDefault('s-enc'), null,
            h('p', { class: 'rpgc-note' }, 'Two different ways to fight. Immersive: you keep writing in the chat and the side panel tracks everyone. Turn-based: a fight window opens and the extension runs D&D rules.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Difficulty'), diffSel),
            h('p', { class: 'rpgc-note' }, ({ story: 'Immersive: the odds lean your way. Turn-based: enemies are weaker (HP \u00D70.7, AC and to-hit \u22122), fleeing is easier, and three failed death saves leave you out of the fight rather than dead.', normal: 'Fair odds in both.', hard: 'Immersive: the odds favour the enemy. Turn-based: enemies are tougher (HP \u00D71.25, AC and to-hit +1) and fleeing is harder.', hardcore: 'Immersive: no mercy, a loss is death. Turn-based: enemies HP \u00D71.5, AC and to-hit +2, fleeing much harder, and massive damage kills at half your max HP.' })[es.difficulty || 'normal']),

            h('h4', null, 'Immersive fights'),
            h('p', { class: 'rpgc-note' }, 'No window and no turns: you fight by writing in the chat, and HP, MP, Stamina and effects ride along with every message so the story writes the wounds, the slowing blade and the forced spells. Your own HP and MP come from the WORLD STATE HUD when your engine prints them; everyone else, and Stamina, the extension tracks.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'How it resolves'), styleSel),
            h('p', { class: 'rpgc-note' }, {
                engine: 'Follows the bot\u2019s engine: COTE rolls its own dice, Overlord runs on level gaps and tiers, Re:Zero on ranks and Authorities.',
                power: 'Power level and demonstrated feats decide an exchange; hax bypasses raw power only within its rules, and a counter answers hax. Study an enemy to learn their feats, hax and counters.',
                fiction: 'No system: what these fighters could plausibly do to each other decides it. Power gaps still hold.'
            }[es.style || 'engine']),
            toggle('Fate dice', () => !!es.fateDice, v => { es.fateDice = v; }, 'A true-random die for every fighter with each message you send. It leans how well an attempt goes \u2014 never whether the engine allows it. A swipe keeps its dice.'),
            es.fateDice ? h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Die sides'),
                h('input', { type: 'number', min: '2', max: '100', value: String(es.combatDiceSides || 20), 'aria-label': 'Die sides', onchange: (e) => { es.combatDiceSides = Math.max(2, Math.min(100, parseInt(e.target.value, 10) || 20)); saveSettings(); } })) : null,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'When a fight starts in the story'), engageSel),
            h('p', { class: 'rpgc-note' }, 'Watches for a clear opening \u2014 a weapon drawn on you, an attack, a charge \u2014 in a new reply. It never fires twice on the same reply, and never while a fight is running.'),
            toggle('Track effects and how long they last', () => I().statuses !== false, v => { I().statuses = v; }, 'Bleeding, stunned, pinned, inside a barrier\u2026 An effect stays on a fighter until the story ends it.'),
            toggle('Track what each fighter just did', () => I().moves !== false, v => { I().moves = v; }, 'And what each enemy is visibly winding up.'),
            toggle('Enemies keep a hidden plan', () => I().plans !== false, v => { I().plans = v; }, 'The story remembers what each enemy intends from one reply to the next; you only see the telegraph. Study an enemy to learn more.'),
            toggle('Describe everyone\u2019s condition, not only yours', () => I().tellForEveryone !== false, v => { I().tellForEveryone = v; }, 'Off: only your own condition is put into words for the story. Everyone keeps their numbers either way.'),
            toggle('Stop tracking once the fight is decided', () => I().endOnOutcome !== false, v => { I().endOnOutcome = v; }, 'One side down, or one side gone.'),
            toggle('Ask the story to report the fight each reply', () => I().askEachTurn !== false, v => { I().askEachTurn = v; }, 'Off means the numbers only move when you correct them by hand.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Fight log length'),
                h('input', { type: 'number', min: '3', max: '50', value: String(I().logSize ?? 12), 'aria-label': 'Replies kept in the fight log', onchange: (e) => { I().logSize = Math.max(3, Math.min(50, parseInt(e.target.value, 10) || 12)); saveSettings(); } })),

            h('h4', null, 'Turn-based fights'),
            h('p', { class: 'rpgc-note' }, dndOn() ? 'Turn-based fights run D&D rules. Their settings are under Settings \u2192 D&D.' : 'Turn-based fights run D&D rules, and D&D is switched off. Turn it on under Settings \u2192 D&D.'),

            h('h4', null, 'Legacy'),
            toggle('Show the narrative fight window', () => !!es.legacyWindow, v => { es.legacyWindow = v; }, 'The fight window from 1.8, with turns and menus where the model judges each action. It uses the style, fate dice and difficulty above.'));
    }

    // ─────────── encounter window ───────────

    let encModal = null;
    const ENV_HUES = { forest: 125, dungeon: 265, desert: 40, cave: 28, city: 215, ruins: 35, snow: 200, water: 195, castle: 285, wasteland: 22, plains: 85, mountains: 220, swamp: 100, volcanic: 8, spaceship: 190, mansion: 330 };
    const TIME_LIGHT = { dawn: 30, day: 34, dusk: 24, twilight: 20, night: 14 };

    function openEncounter(kind) {
        if (!state.chatId) return;
        if (encModal) return;
        if (kind === 'dnd' || kind === 'narrative') state.encKind = kind;
        else if (!state.encounterActive) state.encKind = 'dnd';
        try {
            encModal = ctx.ui.showModal({ title: state.encounterActive ? 'Fight' : state.encKind === 'narrative' ? 'Narrative fight (legacy)' : 'Turn-based fight', width: 780, maxHeight: 880, persistent: true });
        } catch (e) {
            state.status = { kind: 'error', text: `Could not open the fight window: ${e?.message || e}` };
            render();
            return;
        }
        encModal.root.classList.add('rpgc', 'rpgc-enc');
        encModal.onDismiss(() => { encModal = null; state.encounterNotice = null; });
        state.encounterFor = state.chatId;
        state.showHistory = false;
        renderEncounter();
        send({ type: 'encounter_get', chatId: state.chatId });
    }

    function hpBar(hp, max, enemy) {
        const pct = Math.max(0, Math.min(100, (Number(hp) / (Number(max) || 1)) * 100)) || 0;
        const fill = h('i');
        fill.style.width = pct + '%';
        fill.style.backgroundColor = enemy ? mixColor('#6b1d1d', '#d9534f', pct / 100) : mixColor(S().statBarColorLow, S().statBarColorHigh, pct / 100);
        return h('div', { class: 'rpgc-bar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': String(max || 0), 'aria-valuenow': String(hp || 0) }, fill);
    }

    function encLog(enc) {
        const box = h('div', { class: 'rpgc-enc-log', role: 'log', 'aria-live': 'polite' },
            (enc.entries || []).map(e => h('div', { class: e.type || '' }, e.type === 'player' ? `You: ${e.text}` : e.type === 'roll' ? `\uD83C\uDFB2 ${e.text}` : e.type === 'order' ? `\u2192 Order to ${e.text}` : e.type === 'intel' ? `\uD83D\uDD0D ${e.text}` : e.text,
                e.outcome ? h('span', { class: 'rpgc-outcome ' + e.outcome }, e.outcome === 'fail' ? 'failed' : e.outcome) : null)));
        setTimeout(() => { box.scrollTop = box.scrollHeight; }, 0);
        return box;
    }

    function encSend(payload) {
        state.encPick = null;
        state.encounterBusy = true;
        renderEncounter();
        send({ chatId: state.encounterFor || state.chatId, ...payload });
    }

    function renderEncounterStart() {
        const es = S().encounterSettings;
        const combat = { ...es.combatNarrative };
        const framingIn = h('textarea', { placeholder: 'Leave empty to fight whoever is hostile in the scene. Or describe it: "Garfiel challenges you to a sparring match", "bandits ambush the carriage"…', 'aria-label': 'Describe the fight', style: 'min-height:64px' });
        const summary = { ...es.summaryNarrative };
        const rows = (title, obj) => [
            h('h4', null, title),
            selectRow('Tense', obj.tense, TENSES, v => { obj.tense = v; }),
            selectRow('Person', obj.person, PERSONS, v => { obj.person = v; }),
            selectRow('Narration', obj.narration, NARRATIONS, v => { obj.narration = v; }),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Point of view'), h('input', { type: 'text', 'aria-label': 'Point of view', value: obj.pov || 'narrator', onchange: (e) => { obj.pov = e.target.value.trim() || 'narrator'; } }))
        ];
        return [
            state.encounterNotice ? h('div', { class: 'rpgc-status warning', role: 'status' }, state.encounterNotice) : null,
            state.encKind === 'narrative'
                ? h('p', { class: 'rpgc-note' }, 'Narrative window (legacy): turns and menus, and the model judges each action. It uses your narrative style, fate dice and difficulty from Settings \u2192 Fights.')
                : h('p', { class: 'rpgc-note' }, 'D&D rules: initiative, attack rolls against AC, damage dice, saving throws, spell slots and death saves. The extension rolls every die and applies the numbers; the model narrates them.'),
            h('p', null, 'The game master reads the recent scene, your trackers and the present characters, then sets up the fight. If nobody in the scene is hostile, it tells you instead of inventing an enemy. The aftermath is posted to the chat when it ends.'),
            h('h4', null, 'What is the fight? (optional)'),
            framingIn,
            ...rows('Combat narration', combat),
            ...rows('Aftermath narration', summary),
            h('div', { class: 'rpgc-row', style: 'margin-top:8px' },
                h('button', { class: 'rpgc-btn primary', onclick: () => { state.encounterNotice = null; encSend({ type: 'encounter_start', system: state.encKind === 'narrative' ? 'narrative' : 'dnd', framing: framingIn.value.trim(), narrative: { combatNarrative: combat, summaryNarrative: summary } }); } }, 'Start the fight'),
                h('button', { class: 'rpgc-btn', onclick: () => encModal && encModal.dismiss() }, 'Cancel'))
        ];
    }

    // ─────────── Combat v2: categories, orders, Check, Guard, Flee ───────────

    const COMBAT_TABS = [['physical', 'Physical'], ['magical', 'Magical'], ['abilities', 'Abilities & skills'], ['items', 'Items']];
    const THREAT_LABEL = { trivial: 'looks trivial', weaker: 'looks weaker', even: 'looks evenly matched', stronger: 'looks stronger', overwhelming: 'looks overwhelming' };

    function combatOptionsOf(f, isPlayerView, enc) {
        if (enc.system === 'dnd') {
            const me = isPlayerView ? ((enc.combatStats || {}).party || []).find(m => m && m.isPlayer) || {} : f;
            const sl = me.slots || {};
            return {
                physical: (me.attacks || []).map(a => ({ name: a.name, type: 'single-target', cost: `${a.toHit >= 0 ? '+' : ''}${a.toHit} \u00B7 ${a.damage}`, note: a.note })),
                magical: (me.spells || []).map(sp => ({ name: sp.name, type: sp.heal ? (sp.aoe ? 'self' : 'ally') : (sp.aoe ? 'aoe' : 'single-target'),
                    cost: sp.level ? `L${sp.level}${sl[sp.level] ? ` (${sl[sp.level][0]}/${sl[sp.level][1]})` : ''}` : 'cantrip', note: [sp.save ? `${sp.save.toUpperCase()} save DC ${sp.dc}` : sp.attack !== null ? `+${sp.attack} to hit` : null, sp.damage || sp.heal].filter(Boolean).join(' \u00B7 '),
                    empty: sp.level > 0 && (!sl[sp.level] || sl[sp.level][0] <= 0) })),
                abilities: (me.abilities || []).map(o => typeof o === 'string' ? { name: o, type: 'single-target' } : o),
                items: isPlayerView ? (enc.playerActions?.items || []) : (me.items || [])
            };
        }
        const pa = isPlayerView ? (enc.playerActions || {}) : f;
        const out = {};
        for (const [k] of COMBAT_TABS) {
            if (k === 'items') { out.items = (Array.isArray(pa.items) ? pa.items : []).filter(Boolean); continue; }
            out[k] = (Array.isArray(pa[k]) ? pa[k] : []).filter(Boolean).map(o => typeof o === 'string' ? { name: o, type: 'single-target' } : o);
        }
        // A save from before categories carries one flat list; it reads as physical.
        if (!out.physical.length && !out.magical.length && !out.abilities.length && Array.isArray(pa.attacks)) {
            out.physical = pa.attacks.filter(Boolean).map(o => typeof o === 'string' ? { name: o, type: 'single-target' } : o);
        }
        return out;
    }

    function encKey(n) { return String(n || '').trim().toLowerCase(); }

    function mpBar(f) {
        if (!Number(f.maxMp)) return null;
        const pct = Math.max(0, Math.min(100, (Number(f.mp) / Number(f.maxMp)) * 100));
        const i = h('i', { class: 'mp' }); i.style.width = pct + '%';
        return h('div', { class: 'rpgc-bar rpgc-mpbar', role: 'meter', 'aria-label': `${f.name} MP`, 'aria-valuenow': String(Math.round(pct)) }, i);
    }

    function fighterCard(f, enemy, enc) {
        enc = enc || {};
        const down = Number(f.hp) <= 0;
        const sprite = String(f.sprite || '').trim();
        const shortSprite = sprite && [...sprite].length <= 3;
        const statuses = (Array.isArray(f.statuses) ? f.statuses : []).filter(x => x && (x.emoji || x.name));
        const key = encKey(f.name);
        const intel = enemy && enc.intel ? (enc.intel[key] || []) : [];
        const tele = enemy && enc.intents && enc.intents[key] ? enc.intents[key].telegraph : null;
        const revealedPower = intel.find(x => x.kind === 'power');
        const order = !enemy && !f.isPlayer ? (state.encOrders || {})[f.name] : null;
        return h('div', { class: 'rpgc-fighter' + (down ? ' down' : '') + (enemy ? ' foe' : '') },
            h('div', { class: 'rpgc-fighter-head' },
                enemy && shortSprite ? h('span', { class: 'sprite', 'aria-hidden': 'true' }, sprite) : null,
                h('span', null, f.name || '?'),
                !enemy && f.isPlayer ? h('span', { class: 'you' }, 'You') : null,
                enemy && f.threat ? h('span', { class: 'rpgc-chip threat ' + f.threat, title: 'How they look to you. A Check can tell you more.' }, THREAT_LABEL[f.threat] || f.threat) : null),
            hpBar(f.hp, f.maxHp, enemy),
            h('span', { class: 'hp' }, `${f.hp ?? '?'} / ${f.maxHp ?? '?'} HP${Number(f.maxMp) ? ` \u00B7 ${f.mp ?? '?'} / ${f.maxMp} MP` : ''}${f.dead ? ' \u00B7 dead' : f.stable ? ' \u00B7 stable' : down ? ' \u00B7 down' : ''}`,
                enc.system === 'dnd' && f.ac !== undefined ? h('span', { class: 'rpgc-ac', title: 'Armor Class' }, `AC ${f.ac}`) : null),
            enc.system === 'dnd' && down && !enemy && !f.dead && !f.stable ? h('span', { class: 'rpgc-deathsaves', 'aria-label': `death saves ${f.death?.s || 0} successes ${f.death?.f || 0} failures` },
                '\u2713'.repeat(f.death?.s || 0), h('span', { class: 'off' }, '\u25CB'.repeat(3 - (f.death?.s || 0))), ' ', h('span', { class: 'fail' }, '\u2717'.repeat(f.death?.f || 0)), h('span', { class: 'off' }, '\u25CB'.repeat(3 - (f.death?.f || 0)))) : null,
            enc.system === 'dnd' && f.slots && Object.keys(f.slots).length ? h('span', { class: 'power' }, 'Slots ' + Object.entries(f.slots).map(([lv, v]) => `L${lv} ${v[0]}/${v[1]}`).join(' \u00B7 ')) : null,
            ['feats', 'hax', 'counters'].some(k => Array.isArray(f[k]) && f[k].length) ? h('div', { class: 'rpgc-intel' }, ['feats', 'hax', 'counters'].flatMap(k => (f[k] || []).map(x => h('span', { class: 'rpgc-chip intel ' + (k === 'feats' ? 'power' : k === 'hax' ? 'weakness' : 'resist') }, h('em', null, k.replace(/s$/, '') + ': '), x)))) : null,
            mpBar(f),
            (!enemy && f.power) || revealedPower ? h('span', { class: 'power' }, revealedPower ? revealedPower.text : f.power) : null,
            statuses.length ? h('div', { class: 'rpgc-chips' }, statuses.map(x => h('span', { class: 'rpgc-chip', title: x.duration ? `${x.duration} turn(s) left` : '' }, `${x.emoji || ''} ${x.name || ''}`.trim()))) : null,
            tele && !down ? h('div', { class: 'telegraph', title: 'What they seem to be doing' }, tele) : null,
            intel.length ? h('div', { class: 'rpgc-intel' }, intel.map(k => {
                const usable = ['weakness', 'tell', 'intent', 'resist'].includes(k.kind) && !down && !state.encounterBusy;
                return h(usable ? 'button' : 'span', {
                    class: 'rpgc-chip intel ' + k.kind,
                    title: usable ? 'Act on this — pick how, and you get the advantage it honestly gives' : k.kind,
                    onclick: usable ? () => { state.encExploit = { target: f.name, fact: `${k.kind}: ${k.text}` }; state.encPick = null; state.encOrderFor = null; renderEncounter(); } : null
                }, h('em', null, k.kind + ': '), k.text);
            })) : null,
            enemy && (f.description || (sprite && !shortSprite)) ? h('span', { class: 'desc' }, [f.description, sprite && !shortSprite ? sprite : ''].filter(Boolean).join(' \u00B7 ')) : null,
            !enemy && !f.isPlayer && !down ? h('div', { class: 'rpgc-order' },
                order ? h('span', { class: 'o' }, `Ordered: ${order.text}`) : h('span', { class: 'o own' }, 'Own judgment'),
                order ? h('button', { class: 'rpgc-mini', 'aria-label': `Cancel the order to ${f.name}`, onclick: () => { delete state.encOrders[f.name]; renderEncounter(); } }, '\u2715') : null,
                h('button', { class: 'rpgc-btn', disabled: state.encounterBusy ? true : null, title: `Tell ${f.name} what to do this round`, onclick: () => { state.encOrderFor = f.name; state.encPick = null; state.encExploit = null; renderEncounter(); } }, 'Order')) : null);
    }

    /** Sends the player's action with every pending order, then clears the orders. */
    function sendAct(act) {
        const orders = Object.entries(state.encOrders || {}).map(([member, o]) => ({ member, text: o.text, plan: o.plan || null }));
        state.encOrders = {};
        state.encExploit = null;
        state.encOrderFor = null;
        encSend({ type: 'encounter_action', act: { ...act, orders } });
    }

    /**
     * Target choice for one option. `actor` is null for the player, or an ally's name when
     * building an order; `done` receives the finished sentence and the chosen target.
     */
    function pickTarget(enc, actor, verb, type, done) {
        const cs = enc.combatStats || {};
        const alive = (l) => (l || []).filter(x => x && Number(x.hp) > 0);
        const self = actor ? 'themself' : 'myself';
        if (type === 'aoe') return done(`${verb} on all enemies`, 'all enemies');
        if (type === 'self') return done(`${verb} on ${self}`, actor || 'yourself');
        const opts = [];
        if (type === 'ally') {
            opts.push([actor || 'yourself', actor ? actor : 'Yourself']);
            for (const m of alive(cs.party)) if (!m.isPlayer && m.name !== actor) opts.push([m.name, m.name]);
            if (actor) { const p = alive(cs.party).find(m => m.isPlayer); if (p) opts.push([p.name, `${p.name} (you)`]); }
        } else {
            for (const e of alive(cs.enemies)) opts.push([e.name, e.name]);
        }
        state.encPick = { verb, allowAll: type === 'both', opts, done };
        renderEncounter();
    }

    function targetPickerView() {
        const p = state.encPick;
        return h('div', { class: 'rpgc-enc-actions' },
            h('span', { class: 'lbl' }, `${p.verb}: choose a target`),
            p.allowAll ? h('button', { class: 'rpgc-btn', onclick: () => { const d = p.done; state.encPick = null; d(`${p.verb} on all enemies`, 'all enemies'); } }, 'All enemies') : null,
            p.opts.map(([val, label]) => h('button', { class: 'rpgc-btn', onclick: () => { const d = p.done; state.encPick = null; d(val === 'yourself' ? `${p.verb} on myself` : `${p.verb} on ${val}`, val); } }, label)),
            h('button', { class: 'rpgc-btn', onclick: () => { state.encPick = null; renderEncounter(); } }, 'Back'));
    }

    /** One category's option buttons, for the player or for an ally being given an order. */
    function optionButtons(enc, options, tab, actor, onDone) {
        const list = options[tab] || [];
        if (tab === 'items') {
            return list.map(it => h('button', { class: 'rpgc-btn', onclick: () => pickTarget(enc, actor, `Use ${String(it).replace(/\s*x\d+\s*$/i, '')}`, 'ally', (t, target) => onDone({ text: t, kind: 'item', target })) }, String(it)));
        }
        const shown = list.length ? list : (tab === 'physical' ? [{ name: actor ? 'Attack' : 'Attack with what I have', type: 'single-target' }] : []);
        return shown.map(o => h('button', {
            class: 'rpgc-btn', title: [o.type, o.cost, o.note].filter(Boolean).join(' \u00B7 '), disabled: o.empty ? true : null,
            onclick: () => pickTarget(enc, actor, `${tab === 'magical' ? 'Cast' : tab === 'physical' && enc.system === 'dnd' ? 'Attack with' : 'Use'} ${o.name}`, String(o.type || 'single-target').toLowerCase(), (t, target) => onDone({ text: t, kind: tab, target, use: o.name }))
        }, o.name, o.cost ? h('span', { class: 'cost' }, ` ${o.cost}`) : null));
    }

    function categoryMenu(enc, options, actor, onDone, tabKey) {
        const tabs = COMBAT_TABS.filter(([k]) => k === 'physical' || (options[k] && options[k].length))
            .map(([k, l]) => [k, enc.system === 'dnd' ? ({ physical: 'Attack', magical: 'Spells' }[k] || l) : l]);
        const cur = tabs.some(([k]) => k === state[tabKey]) ? state[tabKey] : tabs[0][0];
        return [
            h('div', { class: 'rpgc-enc-tabs', role: 'tablist' }, tabs.map(([k, label]) => h('button', {
                class: 'rpgc-btn' + (k === cur ? ' primary' : ''), role: 'tab', 'aria-selected': k === cur ? 'true' : 'false',
                onclick: () => { state[tabKey] = k; renderEncounter(); }
            }, label, k !== 'physical' && options[k] ? h('span', { class: 'n' }, ` ${options[k].length}`) : null))),
            h('div', { class: 'rpgc-enc-actions' }, optionButtons(enc, options, cur, actor, onDone))
        ];
    }

    function combatActions(enc) {
        const cs = enc.combatStats || {};
        const out = [];
        if (state.encPick) { out.push(targetPickerView()); return out; }
        if (state.encCheck) {
            const alive = (l) => (l || []).filter(x => x && Number(x.hp) > 0);
            const go = (target, text) => { state.encCheck = false; sendAct({ text: text || `Check ${target}: study it closely`, kind: 'check', target }); };
            const other = h('input', { type: 'text', placeholder: 'Something else \u2014 the door, her sword, the ceiling\u2026', 'aria-label': 'What to check', style: 'flex:1;min-width:0' });
            other.addEventListener('keydown', (e) => { if (e.key === 'Enter' && other.value.trim()) { e.preventDefault(); go(other.value.trim()); } });
            out.push(h('div', { class: 'rpgc-enc-actions' }, h('span', { class: 'lbl' }, 'Check what?'),
                alive(cs.enemies).map(e => h('button', { class: 'rpgc-btn', onclick: () => go(e.name) }, e.name)),
                alive(cs.party).filter(m => !m.isPlayer).map(m => h('button', { class: 'rpgc-btn', title: 'Read an ally: how they are really doing', onclick: () => go(m.name) }, m.name)),
                h('button', { class: 'rpgc-btn', title: 'Terrain, cover, hazards, ways out', onclick: () => go('the surroundings', 'Check the surroundings: terrain, cover, hazards and ways out') }, 'The room / terrain')));
            out.push(h('div', { class: 'rpgc-row' }, other, h('button', { class: 'rpgc-btn', onclick: () => { if (other.value.trim()) go(other.value.trim()); } }, 'Check it'), h('button', { class: 'rpgc-btn', onclick: () => { state.encCheck = false; renderEncounter(); } }, 'Back')));
            return out;
        }
        if (state.encOrderFor) {
            const ally = (cs.party || []).find(m => m && m.name === state.encOrderFor);
            if (!ally) { state.encOrderFor = null; return combatActions(enc); }
            out.push(h('div', { class: 'rpgc-enc-orderhead' }, h('strong', null, `Order for ${ally.name}`),
                h('span', { class: 'rpgc-note' }, S().encounterSettings?.companionsMayRefuse === false ? 'They will carry it out in their own style.' : 'A request: they may hesitate, improvise or refuse, as their character and mood decide.')));
            out.push(...categoryMenu(enc, combatOptionsOf(ally, false, enc), ally.name, (a) => {
                state.encOrders = state.encOrders || {};
                state.encOrders[ally.name] = { text: a.text, plan: { action: a.kind === 'physical' ? 'attack' : a.kind === 'magical' ? 'spell' : a.kind, use: a.use || null, target: a.target || null } };
                state.encOrderFor = null;
                renderEncounter();
            }, 'encOrderTab'));
            const custom = h('input', { type: 'text', placeholder: `Or tell ${ally.name} in your own words…`, 'aria-label': `Custom order for ${ally.name}`, style: 'flex:1;min-width:0' });
            const give = () => { const v = custom.value.trim(); if (!v) return; state.encOrders[ally.name] = { text: v }; state.encOrderFor = null; renderEncounter(); };
            custom.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); give(); } });
            out.push(h('div', { class: 'rpgc-row' }, custom, h('button', { class: 'rpgc-btn', onclick: give }, 'Give order'), h('button', { class: 'rpgc-btn', onclick: () => { state.encOrderFor = null; renderEncounter(); } }, 'Back')));
            return out;
        }
        const options = combatOptionsOf(null, true, enc);
        if (state.encExploit) {
            const ex = state.encExploit;
            out.push(h('div', { class: 'rpgc-enc-orderhead' }, h('strong', null, `Act on what you know about ${ex.target}`), h('span', { class: 'rpgc-note' }, ex.fact)));
            const done = (a) => sendAct({ ...a, text: `${a.text}, acting on what I learned (${ex.fact})`, target: ex.target, exploit: `${ex.target} — ${ex.fact}` });
            // The target is already chosen: every option goes straight at them.
            const tabs = COMBAT_TABS.filter(([k]) => k !== 'items' && (k === 'physical' || (options[k] && options[k].length)));
            out.push(h('div', { class: 'rpgc-enc-actions' }, tabs.flatMap(([k]) => (options[k].length ? options[k] : [{ name: 'Attack with what I have' }]).map(o =>
                h('button', { class: 'rpgc-btn', onclick: () => done({ text: `${k === 'magical' ? 'Cast' : 'Use'} ${o.name} on ${ex.target}`, kind: k }) }, o.name)))));
            out.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', onclick: () => { state.encExploit = null; renderEncounter(); } }, 'Back')));
            return out;
        }
        const me = (cs.party || []).find(m => m && m.isPlayer);
        if (enc.system === 'dnd' && me && Number(me.hp) <= 0) {
            out.push(h('div', { class: 'rpgc-status error', role: 'status' }, me.dead ? 'You are dead.' : me.stable ? 'You are down but stable. Your allies fight on.' : `You are dying. Death saves: ${me.death?.s || 0} \u2713 ${me.death?.f || 0} \u2717. Each round you roll one on your turn.`));
            if (!me.dead) out.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => sendAct({ text: 'Hold on', kind: 'deathsave' }) }, me.stable ? 'Wait' : 'Hold on (roll the round)')));
            return out;
        }
        out.push(...categoryMenu(enc, options, null, sendAct, 'encTab'));
        const enemies = (cs.enemies || []).filter(e => e && Number(e.hp) > 0);
        const downAllies = enc.system === 'dnd' ? (cs.party || []).filter(m => m && !m.isPlayer && Number(m.hp) <= 0 && !m.dead && !m.stable) : [];
        out.push(h('div', { class: 'rpgc-enc-tactics' },
            h('button', { class: 'rpgc-btn', title: 'Spend the round studying something: an enemy, an ally, the room, or anything you name', onclick: () => { state.encCheck = true; renderEncounter(); } }, 'Check'),
            enc.system === 'dnd'
                ? h('button', { class: 'rpgc-btn', title: 'Attacks against you have disadvantage until your next turn', onclick: () => sendAct({ text: 'Dodge', kind: 'guard' }) }, 'Dodge')
                : h('button', { class: 'rpgc-btn', title: 'Brace, or cover an ally, instead of attacking', onclick: () => pickTarget(enc, null, 'Guard', 'ally', (t, target) => sendAct({ text: target === 'yourself' ? 'Guard: brace and defend myself' : `Guard: cover ${target}`, kind: 'guard', target })) }, 'Guard'),
            downAllies.map(a => h('button', { class: 'rpgc-btn', title: `Medicine check DC 10 to stabilise ${a.name}`, onclick: () => sendAct({ text: `Help ${a.name}: stabilise them`, kind: 'help', target: a.name }) }, `Stabilise ${a.name}`)),
            h('button', { class: 'rpgc-btn danger', title: 'Try to escape. Risky: they may be faster, cut you off, or follow.', onclick: async () => {
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Try to flee?', message: 'Escape is judged by speed, distance and terrain. You may get away, be pursued, be cut off, or leave someone behind — and enemies may strike as you turn.', confirmLabel: 'Flee' }) : { confirmed: window.confirm('Try to flee? It is risky.') };
                if (res?.confirmed) sendAct({ text: 'Flee: break away and try to escape with the party', kind: 'flee' });
            } }, 'Flee')));
        const custom = h('input', { type: 'text', placeholder: 'Do or say something else…', 'aria-label': 'Custom action', style: 'flex:1;min-width:0' });
        const sendCustom = () => { const v = custom.value.trim(); if (v) sendAct({ text: v, kind: 'custom' }); };
        custom.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendCustom(); } });
        out.push(h('div', { class: 'rpgc-row' }, custom, h('button', { class: 'rpgc-btn primary', onclick: sendCustom }, 'Act')));
        const orders = Object.entries(state.encOrders || {});
        if (orders.length) out.push(h('p', { class: 'rpgc-note' }, 'Orders go with your next action: ' + orders.map(([m, o]) => `${m} \u2192 ${o.text}`).join(' \u00B7 ')));
        return out;
    }

    function renderEncounterCombat(enc, busy) {
        const cs = enc.combatStats || { party: [], enemies: [] };
        const out = [];
        if (cs.environment) out.push(h('div', { class: 'rpgc-enc-env' }, cs.environment));
        if (enc.system === 'dnd' && Array.isArray(enc.initiative)) out.push(h('div', { class: 'rpgc-initiative', 'aria-label': 'Initiative order' },
            h('b', null, `Round ${enc.round || 1}`), ...enc.initiative.map(i => {
                const c = [...(cs.party || []), ...(cs.enemies || [])].find(x => x && x.name === i.name);
                return h('span', { class: 'slot' + (c && (c.dead || Number(c.hp) <= 0) ? ' out' : '') + (c && c.isPlayer ? ' you' : '') }, `${i.name} ${i.total}`);
            })));
        out.push(h('div', { class: 'rpgc-enc-side' }, h('h4', null, 'Enemies'), h('div', { class: 'rpgc-enc-grid' }, (cs.enemies || []).map(e => fighterCard(e, true, enc)))));
        out.push(h('div', { class: 'rpgc-enc-side' }, h('h4', null, 'Your side'), h('div', { class: 'rpgc-enc-grid' }, (cs.party || []).map(m => fighterCard(m, false, enc)))));
        out.push(encLog(enc));
        if (enc.error) {
            out.push(h('div', { class: 'rpgc-status error', role: 'alert' }, enc.error));
            out.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => encSend({ type: 'encounter_retry' }) }, 'Try again')));
        } else if (busy) {
            out.push(h('div', { class: 'rpgc-status busy', role: 'status' }, 'The game master is working out what happens…'));
        } else {
            out.push(...combatActions(enc));
        }
        out.push(h('div', { class: 'rpgc-row', style: 'margin-top:4px' },
            h('button', { class: 'rpgc-btn', disabled: busy ? true : null, onclick: async () => {
                if (!(enc.log || []).length) {
                    const r0 = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Close the fight?', message: 'No rounds have been played yet, so there is nothing to write an aftermath about. The fight is closed and nothing is posted.', confirmLabel: 'Close fight' }) : { confirmed: window.confirm('No rounds played yet. Close the fight without posting anything?') };
                    if (r0?.confirmed) { send({ type: 'encounter_abandon', chatId: state.encounterFor || state.chatId }); encModal && encModal.dismiss(); }
                    return;
                }
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'End the fight now?', message: 'The game master writes the aftermath from what happened so far and posts it to the chat.', confirmLabel: 'End and summarize' }) : { confirmed: window.confirm('End the fight now and post the aftermath?') };
                if (res?.confirmed) encSend({ type: 'encounter_conclude', result: 'concluded early' });
            } }, 'End fight'),
            pastFightsBtn(),
            h('button', { class: 'rpgc-btn danger', disabled: busy ? true : null, onclick: async () => {
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Abandon the fight?', message: 'Nothing is posted to the chat and the fight is discarded.', variant: 'danger', confirmLabel: 'Abandon' }) : { confirmed: window.confirm('Abandon the fight without a summary?') };
                if (res?.confirmed) { send({ type: 'encounter_abandon', chatId: state.encounterFor || state.chatId }); encModal && encModal.dismiss(); }
            } }, 'Abandon')));
        return out;
    }

    function pastFightsBtn() {
        return h('button', { class: 'rpgc-btn', onclick: () => { send({ type: 'encounter_history', chatId: state.encounterFor || state.chatId }); state.showHistory = true; renderEncounter(); } }, 'Past fights');
    }

    function historyView() {
        const logs = state.encHistory || [];
        return [
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', onclick: () => { state.showHistory = false; renderEncounter(); } }, 'Back')),
            logs.length ? logs.slice().reverse().map(lg => h('details', { class: 'rpgc-sec' },
                h('summary', null, `${new Date(lg.at).toLocaleString()} — ${lg.result || 'ended'}`),
                h('div', { class: 'rpgc-body' },
                    h('div', { class: 'rpgc-enc-log' }, (lg.log || []).map(e => h('div', null, h('div', { class: 'player' }, e.action), h('div', null, e.result), e.roll ? h('div', { class: 'roll' }, `\uD83C\uDFB2 ${e.roll.formula}: ${e.roll.value} — ${e.roll.band}`) : null))),
                    lg.summary ? h('p', { class: 'rpgc-note' }, lg.summary) : null)))
                : h('p', { class: 'rpgc-note' }, 'No past fights in this chat yet.')
        ];
    }

    function renderEncounter() {
        if (!encModal) return;
        if (state.showHistory) { encModal.root.replaceChildren(h('div', { class: 'rpgc-enc-stage' }, historyView())); return; }
        const enc = state.encounter;
        const busy = !!state.encounterBusy;
        let content;
        if (!enc) {
            content = busy ? [h('div', { class: 'rpgc-status busy', role: 'status' }, 'Setting up the fight…')] : renderEncounterStart();
        } else if (enc.phase === 'starting') {
            content = enc.error
                ? [h('div', { class: 'rpgc-status error', role: 'alert' }, enc.error), h('div', { class: 'rpgc-row' },
                    h('button', { class: 'rpgc-btn primary', onclick: () => encSend({ type: 'encounter_retry' }) }, 'Try again'),
                    h('button', { class: 'rpgc-btn', onclick: () => { send({ type: 'encounter_abandon', chatId: state.encounterFor || state.chatId }); encModal && encModal.dismiss(); } }, 'Cancel'))]
                : [h('div', { class: 'rpgc-status busy', role: 'status' }, 'Setting up the fight…')];
        } else if (enc.phase === 'combat') {
            content = renderEncounterCombat(enc, busy);
        } else if (enc.phase === 'ending') {
            content = [encLog(enc), enc.error
                ? h('div', null, h('div', { class: 'rpgc-status error', role: 'alert' }, enc.error), h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => encSend({ type: 'encounter_retry' }) }, 'Try again')))
                : h('div', { class: 'rpgc-status busy', role: 'status' }, 'Writing the aftermath…')];
        } else {
            const label = String(enc.result || 'Over');
            content = [
                h('div', { class: 'rpgc-enc-result' }, label.charAt(0).toUpperCase() + label.slice(1)),
                encLog(enc),
                h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => { send({ type: 'encounter_dismiss', chatId: state.encounterFor || state.chatId }); encModal && encModal.dismiss(); } }, 'Close'))
            ];
        }
        const stage = h('div', { class: 'rpgc-enc-stage' }, content);
        const sn = enc?.combatStats?.styleNotes || {};
        const hue = ENV_HUES[String(sn.environmentType || '').toLowerCase()];
        if (hue !== undefined) {
            const light = TIME_LIGHT[String(sn.timeOfDay || '').toLowerCase()] ?? 26;
            stage.style.background = `linear-gradient(165deg, hsla(${hue}, 45%, ${light}%, .38), transparent 75%)`;
        }
        encModal.root.replaceChildren(stage);
        const kindTitle = ((enc && enc.system) || state.encKind) === 'narrative' ? 'Narrative fight (legacy)' : 'Turn-based fight';
        try { encModal.setTitle(enc && enc.phase === 'combat' ? `${kindTitle} · round ${(enc.log || []).length + 1}` : kindTitle); } catch { /* older host */ }
    }


    // ─────────── weather overlay ───────────

    let weatherLayer = null;
    let weatherKey = '';

    function parseHour(timeStr) {
        if (!timeStr) return null;
        const t = String(timeStr).toLowerCase();
        if (t.includes('dawn') || t.includes('sunrise')) return 6;
        if (t.includes('early morning')) return 7;
        if (t.includes('midday') || t.includes('noon')) return 12;
        if (t.includes('late afternoon')) return 16;
        if (t.includes('afternoon')) return 14;
        if (t.includes('morning')) return 9;
        if (t.includes('evening') || t.includes('dusk') || t.includes('sunset')) return 19;
        if (t.includes('twilight')) return 20;
        if (t.includes('midnight')) return 0;
        if (t.includes('late night')) return 2;
        if (t.includes('night')) return 22;
        const ampm = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
        if (ampm) { let h = parseInt(ampm[1], 10); const pm = ampm[3] === 'pm'; if (pm && h !== 12) h += 12; if (!pm && h === 12) h = 0; return h; }
        const mil = t.match(/(\d{1,2}):(\d{2})/);
        if (mil) return parseInt(mil[1], 10);
        return null;
    }
    function timeOfDay(hour) {
        if (hour === null) return 'day';
        if (hour >= 20 || hour < 5) return 'night';
        if (hour >= 5 && hour < 7) return 'dawn';
        if (hour >= 18 && hour < 20) return 'dusk';
        return 'day';
    }
    const WEATHER_PATTERNS = [
        ['blizzard', ['blizzard']],
        ['storm', ['storm', 'thunder', 'lightning']],
        ['wind', ['wind', 'breeze', 'gust', 'gale']],
        ['snow', ['snow', 'flurries']],
        ['rain', ['rain', 'drizzle', 'shower']],
        ['mist', ['mist', 'fog', 'haze']],
        ['sunny', ['sunny', 'clear', 'bright']],
        ['none', ['cloud', 'overcast', 'indoor', 'inside']]
    ];
    function weatherType(text) {
        if (!text) return 'none';
        const t = String(text).toLowerCase();
        for (const [id, pats] of WEATHER_PATTERNS) if (pats.some(p => t.includes(p))) return id;
        return 'none';
    }
    function currentWeather() {
        const b = state.data.infoBox;
        if (!isObj(b)) return { type: 'none', tod: 'day' };
        const w = b.weather;
        const forecast = isObj(w) ? (plain(w.forecast) || plain(w.emoji)) : plain(w);
        const timeObj = b.time;
        const timeStr = isObj(timeObj) ? (timeObj.end || timeObj.start) : plain(timeObj);
        return { type: weatherType(forecast), tod: timeOfDay(parseHour(timeStr)) };
    }
    function px(el, cls, styles) {
        const d = h('div', { class: 'rpgc-wp ' + cls });
        Object.assign(d.style, styles);
        el.appendChild(d);
        return d;
    }
    function buildWeather(type, tod) {
        const layer = h('div', { class: 'rpgc-weather-layer', 'aria-hidden': 'true' });
        layer.style.zIndex = S().weatherForeground ? '9998' : '0';
        const rnd = (a, b) => a + Math.random() * (b - a);
        const add = (type2) => {
            if (type2 === 'snow') for (let i = 0; i < 40; i++) { const f = px(layer, 'rpgc-snow', { left: rnd(0, 100) + '%', fontSize: rnd(8, 16) + 'px', animationDelay: rnd(0, 10) + 's', animationDuration: rnd(9, 18) + 's' }); f.textContent = '\u2744'; }
            if (type2 === 'rain') for (let i = 0; i < 80; i++) px(layer, 'rpgc-rain', { left: rnd(0, 100) + '%', animationDelay: rnd(0, 2) + 's', animationDuration: rnd(0.5, 1) + 's' });
            if (type2 === 'mist') for (let i = 0; i < 5; i++) px(layer, 'rpgc-mist', { top: rnd(0, 80) + '%', opacity: rnd(0.1, 0.3), animationDelay: (i * 2) + 's', animationDuration: (14 + i * 2) + 's' });
            if (type2 === 'wind') for (let i = 0; i < 22; i++) { const l = px(layer, 'rpgc-leaf', { left: rnd(-10, 40) + '%', top: rnd(0, 70) + '%', fontSize: rnd(8, 14) + 'px', animationDelay: rnd(0, 6) + 's', animationDuration: rnd(4, 9) + 's' }); l.textContent = '\u2022'; }
        };
        if (type === 'storm') { add('rain'); layer.appendChild(h('div', { class: 'rpgc-flash' })); const f = layer.lastChild; f.style.animationDuration = rnd(6, 10) + 's'; }
        else if (type === 'blizzard') { add('snow'); add('wind'); }
        else if (type === 'sunny') {
            const glow = h('div', { class: 'rpgc-glow' });
            if (tod === 'night') { Object.assign(glow.style, { width: '160px', height: '160px', right: '12%', top: '10%', background: 'radial-gradient(circle, rgba(220,225,255,.5), transparent 70%)' }); }
            else if (tod === 'dawn') { Object.assign(glow.style, { width: '200px', height: '200px', left: '10%', bottom: '12%', background: 'radial-gradient(circle, rgba(255,190,140,.45), transparent 70%)' }); }
            else if (tod === 'dusk') { Object.assign(glow.style, { width: '200px', height: '200px', right: '10%', bottom: '12%', background: 'radial-gradient(circle, rgba(255,150,120,.45), transparent 70%)' }); }
            else { Object.assign(glow.style, { width: '220px', height: '220px', right: '8%', top: '6%', background: 'radial-gradient(circle, rgba(255,230,150,.4), transparent 70%)' }); }
            layer.appendChild(glow);
        }
        else add(type);
        return layer;
    }
    function updateWeather() {
        const s = S();
        const wantOn = s && s.enabled && s.enableDynamicWeather && state.chatId && state.view === 'trackers';
        if (!wantOn) { removeWeather(); return; }
        const { type, tod } = currentWeather();
        const key = type + '|' + (type === 'sunny' ? tod : '') + '|' + (s.weatherForeground ? 'fg' : 'bg');
        if (type === 'none') { removeWeather(); weatherKey = ''; return; }
        if (key === weatherKey && weatherLayer) return;
        removeWeather();
        weatherKey = key;
        weatherLayer = buildWeather(type, tod);
        document.body.appendChild(weatherLayer);
    }
    function removeWeather() {
        if (weatherLayer) { weatherLayer.remove(); weatherLayer = null; }
    }

    // ─────────── music card ───────────

    function renderSong() {
        const s = S();
        if (!s || !s.enableSpotifyMusic || !state.song || !state.song.display) return null;
        const song = state.song;
        return h('div', { class: 'rpgc-song' },
            h('span', { class: 'note', 'aria-hidden': 'true' }, '\u266A'),
            h('div', { class: 'info' },
                h('div', { class: 't', title: song.song }, song.song),
                h('div', { class: 'a', title: song.artist }, song.artist)),
            h('a', { class: 'rpgc-btn', href: song.webUrl, target: '_blank', rel: 'noopener noreferrer', title: 'Open in Spotify' }, 'Play'),
            h('button', { class: 'rpgc-mini', 'aria-label': 'Dismiss song', onclick: () => { state.song = null; render(); send({ type: 'dismiss_song', chatId: state.chatId }); } }, '\u2715'));
    }

    // ─────────── avatars ───────────

    function avatarKey(name) { return String(name || '').trim().toLowerCase(); }

    function requestAvatar(name) {
        const key = avatarKey(name);
        state.avatarBusy[key] = true;
        render();
        send({ type: 'generate_avatar', chatId: state.chatId, name });
    }
    function avatarFor(name) {
        const key = avatarKey(name);
        const a = state.avatars[key];
        return a && a.url ? a.url : null;
    }
    function avatarControls(name) {
        if (!S()?.enableAvatars) return null;
        const key = avatarKey(name);
        if (state.avatarBusy[key]) return h('span', { class: 'rpgc-note' }, 'drawing\u2026');
        const url = avatarFor(name);
        const draw = h('button', { class: 'rpgc-avatar-btn', onclick: () => requestAvatar(name) }, url ? 'Redraw' : 'Portrait');
        if (!url) return draw;
        return h('span', { class: 'rpgc-avatar-acts' }, draw,
            h('button', {
                class: 'rpgc-avatar-btn',
                'aria-label': `Remove the portrait of ${name}`,
                title: 'Remove this portrait',
                onclick: () => {
                    delete state.avatars[avatarKey(name)];
                    render();
                    send({ type: 'clear_avatar', chatId: state.chatId, name });
                }
            }, '\u2715'));
    }
    function avatarImg(name) {
        const url = avatarFor(name);
        if (!S()?.enableAvatars || !url) return null;
        return h('div', { class: 'rpgc-avatar-wrap' }, h('img', { class: 'rpgc-avatar', src: url, alt: `Portrait of ${name}`, loading: 'lazy' }));
    }


    // ─────────── HMS: World State panel ───────────

    const PIN_SVG = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M9 3h6l-1 6 4 4H6l4-4z"/><path d="M12 13v8"/></svg>';

    function hmsOn() { return !!(state.hms && state.hms.active); }

    function pinBtn(line) {
        if (!state.chatId) return null;
        const on = !!(state.hms.pins && state.hms.pins[line.key]);
        const b = h('button', {
            class: 'rpgc-pin' + (on ? ' on' : ''),
            title: on ? 'Pinned: kept exactly as it is every turn' : 'Pin this line so it is always carried forward unchanged',
            'aria-label': `${on ? 'Unpin' : 'Pin'} ${line.key.replace(/^module:/, '')}`,
            'aria-pressed': on ? 'true' : 'false',
            onclick: (e) => {
                e.preventDefault();
                if (on) delete state.hms.pins[line.key]; else state.hms.pins[line.key] = line.text;
                render();
                send({ type: 'hud_pin', chatId: state.chatId, key: line.key });
            }
        });
        b.innerHTML = PIN_SVG;
        return b;
    }

    function fracParts(value) {
        const m = String(value || '').match(/^\s*(-?[\d,.]+)\s*\/\s*([\d,.]+)/);
        if (!m) return null;
        const cur = Number(m[1].replace(/,/g, ''));
        const max = Number(m[2].replace(/,/g, ''));
        if (!Number.isFinite(cur) || !Number.isFinite(max) || max <= 1) return null;
        return { cur, max };
    }

    function hudFieldEl(f) {
        const label = f.label;
        const frac = label && !/^(year|month|day|standings|seat)\b/i.test(label) ? fracParts(f.value) : null;
        if (frac) {
            return h('span', { class: 'rpgc-hud-f frac' },
                h('span', { class: 'l' }, label),
                statBar(frac.cur, frac.max),
                h('span', { class: 'v rpgc-stat-val' }, f.value));
        }
        return h('span', { class: 'rpgc-hud-f' }, label ? h('span', { class: 'l' }, label) : null, h('span', { class: 'v' + (label && /^(current\s+)?arc$/i.test(label) ? ' rpgc-hud-arc' : '') }, f.value));
    }

    function hudLineEl(line) {
        let body;
        if (line.kind === 'location') {
            const segs = line.segments && line.segments.length ? line.segments : [line.text];
            const parts = [];
            segs.forEach((sg, i) => {
                if (i) parts.push(h('span', { class: 'sep', 'aria-hidden': 'true' }, '\u203A'));
                parts.push(h('span', { class: 'seg' + (/^\(.*\)$/.test(sg) ? ' fold' : ''), title: /^\(.*\)$/.test(sg) ? 'A folded layer: connective, with no entry of its own' : null }, sg));
            });
            body = h('div', { class: 'body rpgc-hud-path', 'aria-label': 'Location' }, parts);
        } else if (line.kind === 'module') {
            body = h('div', { class: 'body' }, h('span', { class: 'rpgc-hud-mod' }, line.text.replace(/^\[|\]$/g, '')));
        } else {
            body = h('div', { class: 'body' }, (line.fields || [{ label: null, value: line.text }]).map(hudFieldEl));
        }
        const pinned = !!(state.hms.pins && state.hms.pins[line.key]);
        return h('div', { class: 'rpgc-hud-row' + (pinned ? ' pinned' : '') }, pinBtn(line), body);
    }

    function guardEl() {
        const g = state.hms.guard;
        if (!g) return null;
        const parts = [];
        if (g.noHud) {
            parts.push(h('div', { class: 'rpgc-status warning', role: 'status' }, 'The latest reply has no WORLD STATE HUD. The engine treats a missing HUD as a render fault, not a state change.'));
            parts.push(h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn primary', onclick: () => send({ type: 'hud_insert', chatId: state.chatId }) }, 'Put the last HUD back'),
                h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'hud_dismiss', chatId: state.chatId }) }, 'Dismiss')));
        }
        if (g.swapped) {
            parts.push(h('div', { class: 'rpgc-status ok', role: 'status' }, 'The HUD template changed this turn \u2014 a mode swap, not dropped lines. Nothing to restore.'));
        }
        if (g.cleared && g.cleared.length) {
            parts.push(h('div', { class: 'rpgc-cleared' },
                h('span', { class: 'rpgc-note' }, 'Cleared this turn, as their own rules allow: '),
                g.cleared.map(x => h('span', { class: 'rpgc-chip' }, x.text.length > 60 ? x.text.slice(0, 57) + '\u2026' : x.text,
                    h('button', { class: 'rpgc-mini', title: 'If it should still be there, put it back', 'aria-label': `Put back ${x.text}`, onclick: () => send({ type: 'hud_restore', chatId: state.chatId, key: x.key }) }, '\u21BA')))));
        }
        if (g.missing && g.missing.length) {
            parts.push(h('div', { class: 'rpgc-status warning', role: 'status' }, `${g.missing.length} line${g.missing.length === 1 ? '' : 's'} dropped since the last reply. If a line ended by its own rules, dismiss it. Otherwise restore it so its lorebook entry keeps firing.`));
            if (g.missing.some(x => x.carrier)) parts.push(h('div', { class: 'rpgc-status error', role: 'status' }, 'A carrier line is gone. Its printed text is what keeps its entry loaded, so everything that entry holds is dark until it is back.'));
            parts.push(h('div', { class: 'rpgc-guard' }, g.missing.map(x => h('div', { class: 'item' + (x.carrier ? ' carrier' : '') },
                x.carrier ? h('span', { class: 'rpgc-chip carrier', title: 'Carrier line' }, 'carrier') : null,
                h('span', { class: 'line' }, x.text),
                h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'hud_restore', chatId: state.chatId, key: x.key }) }, 'Restore')))));
            parts.push(h('div', { class: 'rpgc-row' },
                g.missing.length > 1 ? h('button', { class: 'rpgc-btn primary', onclick: () => send({ type: 'hud_restore', chatId: state.chatId }) }, 'Restore all') : null,
                h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'hud_dismiss', chatId: state.chatId }) }, 'They ended, dismiss')));
        }
        if (g.restored && g.restored.length) {
            parts.push(h('p', { class: 'rpgc-note' }, `Pinned line${g.restored.length === 1 ? '' : 's'} put back in the last reply: ${g.restored.map(k => k.replace(/^module:/, '')).join(', ')}.`));
        }
        return parts.length ? h('div', { class: 'rpgc-set' }, parts) : null;
    }


    function renderWorldState() {
        const hud = state.hms.hud;
        const content = [];
        // the start handlers' ARC NAME LAW: an Arc line that is no key loads nothing, silently
        const ac = state.hms.arcCheck;
        if (ac && ac.ok === false) {
            content.push(h('div', { class: 'rpgc-status warning', role: 'status' }, `The Arc line "${ac.arc}" loads no arc entry from your lorebooks, so the arc and its quests are not in the story.${ac.suggest ? ` The book spells it "${ac.suggest}".` : ''}`));
            if (ac.suggest) content.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => send({ type: 'arc_fix', chatId: state.chatId, value: ac.suggest }) }, `Use "${ac.suggest}"`)));
        }
        const g = guardEl();
        if (g) content.push(g);
        if (!hud) {
            const d = state.hms.noHud || { reason: 'no-reply' };
            const why = d.reason === 'no-reply' ? 'There is no reply in this chat yet. The HUD appears here as soon as the engine renders one.'
                : d.reason === 'in-thinking' ? 'The model wrote the WORLD STATE inside its thinking, not in the reply, so there is nothing to read in the reply itself.'
                : d.reason === 'not-alone' ? `The reply mentions WORLD STATE, but not as a heading on a line of its own: \u201C${d.wsLine}\u201D. The HUD starts with a line that reads only WORLD STATE (### WORLD STATE ### works).`
                : 'The latest reply has no WORLD STATE heading.';
            content.push(h('p', { class: 'rpgc-note' }, why));
            if (d.head && d.head.length && d.reason !== 'no-reply') content.push(h('p', { class: 'rpgc-note rpgc-diag' }, h('b', null, 'It starts with: '), d.head.join(' \u23CE ')));
            if (d.reason !== 'no-reply') content.push(h('div', { class: 'rpgc-row' }, rereadButton('Read the last reply again')));
        } else {
            const rows = [];
            let blk = null;
            const shownElsewhere = (title) => !!((state.world && S()?.worldCard !== false && (state.world.blocks || []).some(b => String(title).toUpperCase().startsWith(b)))
                || (/^D&D CHARACTER SHEET/i.test(String(title)) && hudSheetNow() && dndOn() && (!isObj(S()?.dnd) || S().dnd.useHud !== false)));
            const pointed = new Set();
            for (const l of hud.lines) {
                if (l.block === 'fence') { blk = null; continue; }
                if (l.block && shownElsewhere(l.block)) {
                    const k = String(l.block).split(/\s+[\u2014\u2013-]\s+/)[0];
                    if (!pointed.has(k)) { pointed.add(k); rows.push(h('div', { class: 'rpgc-hud-block pointer' }, h('div', { class: 'row' }, `${k} \u2014 shown in the ${/D&D/.test(k) ? 'D&D' : state.world.label} card.`))); }
                    blk = null;
                    continue;
                }
                if (l.block) {
                    if (!blk) { blk = h('div', { class: 'rpgc-hud-block', title: 'An inline block: rendered by its own module, not a HUD line. The guard and pins leave it alone.' }); rows.push(blk); }
                    blk.appendChild(h('div', { class: 'row' }, l.text.replace(/^\s{0,2}/, '')));
                    continue;
                }
                blk = null;
                rows.push(hudLineEl(l));
            }
            content.push(h('div', { class: 'rpgc-hud' }, rows));
            const sysw = sysOf();
            if (sysw && sysw.rolls && sysw.rolls.length) content.push(h('div', { class: 'rpgc-rolls' }, sysw.rolls.map(r => h('div', { class: 'rpgc-rollline ' + (/SUCC|CRIT|PASS|HIT/.test(r.result) ? 'win' : /FAIL|MISS/.test(r.result) ? 'lose' : '') },
                '\uD83C\uDFB2 ', h('b', null, r.what), ` ${r.total}${r.dc !== null ? ` vs DC ${r.dc}` : ''} \u2192 `, h('b', null, r.result)))));
            if (sysw && sysw.notices && sysw.notices.length) content.push(h('ul', { class: 'rpgc-notices' }, sysw.notices.map(n => h('li', null, '\u2726 ' + n))));
            if (!Object.keys(state.hms.pins || {}).length) content.push(h('p', { class: 'rpgc-note' }, 'Pin a line to have it carried forward unchanged every turn.'));
        }
        if (hud && hud.fromHtml) content.push(h('p', { class: 'rpgc-note' }, 'This HUD was written in HTML and is read through it. The guard can flag dropped lines here, but cannot put them back into the reply.'));
        return section('world', 'World State', state.open, hud && hud.time ? hud.time : null, ...content);
    }

    function hmsStoryRow() {
        const s = S();
        if (!s || !s.enabled || !state.chatId) return null;
        const btns = [
            h('button', { class: 'rpgc-btn', title: 'Sends a short nudge as your turn: you do nothing new, and one off-screen thread advances a step, within everything the engine already allows', disabled: state.worldBusy ? true : null, onclick: () => {
                state.worldBusy = true;
                render();
                send({ type: 'world_moves', chatId: state.chatId });
                setTimeout(() => { state.worldBusy = false; render(); }, 5000);
            } }, 'Move the world')
        ];
        btns.push(...fightButtons());
        btns.push(rereadButton());
        return h('div', { class: 'rpgc-story' }, btns);
    }
    // Reads the latest reply again \u2014 its HUD and its side-panel block \u2014 the same way a new reply is read.
    // No model call, so it costs nothing: the manual way when the automatic read missed something.
    function rereadButton(label = 'Read again') {
        return h('button', { class: 'rpgc-btn', title: 'Read the latest reply again \u2014 its HUD and side-panel block \u2014 the way a new reply is read. No model call, so it costs nothing.', disabled: state.rereadBusy ? true : null, onclick: () => {
            if (!state.chatId) return;
            state.rereadBusy = true; render();
            send({ type: 'reread', chatId: state.chatId });
            setTimeout(() => { state.rereadBusy = false; render(); }, 2500);
        } }, label);
    }

    // A chat whose world has a preset of its own: offer it once, so a new player is set up in one click.
    function worldHint() {
        const s = S(), w = state.world;
        if (!s || !w || !w.id || s.worldCard === false) return null;
        const pid = 'w-' + w.id;
        const preset = WORLD_STYLES.find(x => x.id === pid);
        const sp = isObj(s.stylePresets) ? s.stylePresets : { presets: {}, active: 'hms' };
        const seen = Array.isArray(sp.hintSeen) ? sp.hintSeen : [];
        if (!preset || sp.active === pid || seen.includes(pid)) return null;
        const mark = (active) => { s.stylePresets = { ...sp, presets: sp.presets || {}, ...(active ? { active } : {}), hintSeen: [...seen, pid] }; };
        return h('div', { class: 'rpgc-status info rpgc-hint', role: 'note' },
            h('p', { class: 'rpgc-note' }, `This chat is ${w.label}. Its world preset sets the panel up for this bot in one click: the right cards, carrier lines, fights and theme. You can change everything after.`),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn primary', onclick: () => { mark(pid); applyStyle(preset.data); } }, `Use the ${w.label} preset`),
                h('button', { class: 'rpgc-btn', onclick: () => { mark(null); saveSettings(false); render(); } }, 'No thanks')));
    }

    function renderHmsTrackers() {
        const s = S();
        const out = [topBar()];
        const hint = worldHint();
        if (hint) out.push(hint);
        const story = hmsStoryRow();
        if (story) out.push(story);
        const immEl = renderImmersive();
        if (immEl) out.push(immEl);
        const songEl = renderSong();
        if (songEl) out.push(songEl);
        const danger = renderDanger();
        if (danger) out.push(danger);
        out.push(renderWorldState());
        for (const el of [renderWorldCard(), renderMap(), renderAtlas(), renderYou(), renderDnd(), renderPeopleAll(), renderPhone(), renderBody(), renderInjuries(), renderMind(), renderSurvival(), renderMagic(), renderAbilities()]) if (el) out.push(el);
        if (s.showQuests) out.push(renderHmsQuests());
        const chron = renderChronicle();
        if (chron) out.push(chron);
        out.push(renderChapter());
        return out;
    }

    function renderHmsQuests() {
        const sys = sysOf();
        const legacy = (state.hms && state.hms.hud && state.hms.hud.quests) || [];
        const quests = sys ? sys.quests : legacy.map(q => ({ name: q.name, state: q.state, cls: 'active' }));
        const objectives = sys ? sys.objectives : [];
        const journal = sys ? sys.journal : [];
        const dropped = journal.filter(j => j.dropped);
        const finished = journal.filter(j => !j.dropped);
        const notes = (state.hms && state.hms.questNotes) || [];
        const items = [...renderPlotObjectives()];
        if (quests.length) {
            items.push(h('h4', null, 'On the HUD'));
            const focus = sys && sys.questFocus;
            const due = (m) => m === null || m === undefined ? null : m < 0 ? h('span', { class: 'rpgc-chip hot' }, 'overdue') : h('span', { class: 'rpgc-chip' + (m < 1440 ? ' hot' : '') }, `due in ${fmtSpan(m)}`);
            const sorted = quests.slice().sort((a, b) => ((b.key === focus) - (a.key === focus)) || ((a.category === 'main' ? 0 : 1) - (b.category === 'main' ? 0 : 1)));
            items.push(h('div', { class: 'rpgc-cards' }, sorted.map(q => h('div', { class: 'rpgc-qcard ' + q.cls + (q.key && q.key === focus ? ' focus' : '') },
                h('div', { class: 'qhead' },
                    q.key ? h('button', { class: 'rpgc-mini star', 'aria-label': q.key === focus ? 'Unfocus this quest' : 'Focus this quest', title: 'Focus quest', onclick: () => send({ type: 'quest_focus', chatId: state.chatId, name: q.name }) }, q.key === focus ? '\u2605' : '\u2606') : null,
                    h('span', { class: 'name' }, q.name),
                    q.category ? h('span', { class: 'rpgc-chip' }, q.category) : null,
                    q.state ? h('span', { class: 'qst ' + q.cls }, q.state) : q.fromStory ? h('span', { class: 'qst active' }, 'in the story') : null),
                q.objective ? h('div', { class: 'obj' }, '\u25B8 ' + q.objective) : null,
                q.progress !== null && q.progress !== undefined ? levelBar(q.progress, 'ok') : null,
                (q.giver || q.where || q.reward || q.dueIn !== undefined) ? h('div', { class: 'rpgc-chips' },
                    q.giver ? h('span', { class: 'rpgc-chip' }, h('em', null, 'From: '), q.giver) : null,
                    q.where ? h('span', { class: 'rpgc-chip' }, h('em', null, 'Where: '), q.where) : null,
                    q.reward ? h('span', { class: 'rpgc-chip' }, h('em', null, 'Reward: '), q.reward) : null,
                    due(q.dueIn)) : null))));
        }
        for (const g of objectives) {
            items.push(h('h4', null, g.title));
            items.push(h('ul', { class: 'rpgc-objs' }, g.items.map(o => h('li', { class: o.status },
                h('span', { class: 'mark', 'aria-hidden': 'true' }, o.status === 'done' ? '\u2713' : o.status === 'active' ? '\u25B8' : '\u25CB'),
                h('span', { class: 'sr' }, o.status === 'done' ? 'Done: ' : o.status === 'active' ? 'In progress: ' : 'Not started: '),
                o.text))));
        }
        if (dropped.length) {
            items.push(h('div', { class: 'rpgc-status warning', role: 'status' }, `${dropped.length === 1 ? 'A quest' : dropped.length + ' quests'} left the HUD while still live. The printed name is what loads a quest\u2019s entry, so if it is not over, the story can no longer see it.`));
            items.push(h('div', { class: 'rpgc-guard' }, dropped.map(j => h('div', { class: 'item' },
                h('span', { class: 'line' }, j.name + (j.last ? ` \u2014 ${j.last}` : '')),
                h('button', { class: 'rpgc-btn', title: 'Write it back onto the Quests line of the latest reply', onclick: () => send({ type: 'quest_restore', chatId: state.chatId, name: j.name, state: j.last || null }) }, 'Put back')))));
        }
        if (finished.length) {
            const list = h('ul', { class: 'rpgc-list rpgc-journal' }, finished.map(j => h('li', null,
                h('span', { class: 'grow' }, j.name),
                h('span', { class: 'qst ' + j.cls }, j.last || 'ended'),
                j.states.length > 1 ? h('span', { class: 'path', title: 'How it moved' }, j.states.map(x => x.state || '\u2014').join(' \u2192 ')) : null)));
            const det = h('details', { class: 'rpgc-subdet' }, h('summary', null, `Journal (${finished.length})`), list);
            det.open = state.open['quest-journal'] === true;
            det.dataset.openKey = 'quest-journal'; det.addEventListener('toggle', () => { state.open['quest-journal'] = det.open; });
            items.push(det);
        }
        items.push(h('h4', null, 'Your notes'));
        if (notes.length) {
            items.push(h('ul', { class: 'rpgc-list' }, notes.map(n => h('li', { class: 'rpgc-quest' },
                h('span', { class: 'grow' }, editable(n.text, v => { if (v) send({ type: 'quest_note', chatId: state.chatId, op: 'edit', id: n.id, text: v }); }, { label: 'Quest note' })),
                h('button', { class: 'st ' + (n.state || 'open'), title: 'Cycle state', onclick: () => send({ type: 'quest_note', chatId: state.chatId, op: 'cycle', id: n.id }) }, n.state || 'open'),
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${n.text}`, onclick: () => send({ type: 'quest_note', chatId: state.chatId, op: 'remove', id: n.id }) }, '\u2715')))));
        }
        const input = h('input', { type: 'text', placeholder: 'Add a quest note', 'aria-label': 'Add a quest note' });
        const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'quest_note', chatId: state.chatId, op: 'add', text: v }); };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        items.push(h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add')));
        items.push(h('p', { class: 'rpgc-note' }, 'Notes are yours and never sent to the model. Quest names are never injected either: in these engines a printed name loads its entry, so only the engine writes them.'));
        const badge = dropped.length ? `${dropped.length} dropped` : quests.length ? String(quests.length) : (notes.length ? String(notes.length) : null);
        if (!items.length) return null;
        return section('quests', 'Quests', state.open, badge, ...items);
    }
    function sysCfg() {
        const s = S();
        return (s && s.hmsSystems) || {};
    }
    function sysOf() {
        return (state.hms && state.hms.systems) || null;
    }
    function fmtSpan(min) {
        if (min === null || min === undefined || !Number.isFinite(min)) return '';
        const m = Math.max(0, Math.round(min));
        if (m < 60) return `${m}m`;
        const hh = Math.floor(m / 60);
        if (hh < 48) return `${hh}h${m % 60 ? ' ' + (m % 60) + 'm' : ''}`;
        const d = Math.floor(hh / 24);
        return `${d}d${hh % 24 ? ' ' + (hh % 24) + 'h' : ''}`;
    }
    function fmtNum(n) {
        return Number(n).toLocaleString('en-US', { maximumFractionDigits: 1 });
    }
    function levelBar(pct, level) {
        const fill = h('i', { class: level || 'ok' });
        fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
        return h('div', { class: 'rpgc-bar rpgc-lvbar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(pct)) }, fill);
    }
    function ladder(rank, max, recovering) {
        const cells = [];
        for (let i = 1; i <= (max || 4); i++) {
            const cls = i <= rank ? (i === max ? 'on top' : 'on') : '';
            cells.push(h('i', { class: cls }));
        }
        return h('span', { class: 'rpgc-ladder' + (recovering ? ' rec' : ''), role: 'img', 'aria-label': `stage ${rank} of ${max}` }, cells);
    }

    function renderDanger() {
        const sys = sysOf();
        if (!sys || !sys.danger || !sys.danger.length) return null;
        return h('div', { class: 'rpgc-danger', role: 'alert' },
            h('strong', null, 'Critical'),
            h('span', null, sys.danger.join(' \u00B7 ')));
    }


    const WOUND_LABEL = { raw: 'untreated', treated: 'stable, still there', healed: 'closed', permanent: 'no restoration path', cosmetic: 'cosmetic', other: '' };

    function renderBody() {
        const sys = sysOf();
        const c = (sysCfg().body) || {};
        if (!sys) return null;
        const wounds = c.wounds === false ? [] : sys.wounds;
        const conds = c.conditions === false ? [] : sys.conditions.filter(x => !x.mind);
        if (!wounds.length && !conds.length && !sys.healed.length && !sys.cleared.filter(n => !sys.conditions.some(x => x.name === n)).length) return null;
        const out = [];
        if (wounds.length) {
            out.push(h('h4', null, 'Wounds'));
            out.push(h('div', { class: 'rpgc-cards' }, wounds.map(w => h('div', { class: 'rpgc-wound ' + w.cls + (w.warn ? ' warn' : '') },
                h('div', { class: 'head' },
                    h('span', { class: 'name' }, w.name),
                    w.tag ? h('span', { class: 'tag ' + w.cls, title: WOUND_LABEL[w.cls] || '' }, w.cls === 'permanent' ? '\uD83D\uDD12 ' + w.tag : w.tag) : null),
                h('div', { class: 'meta' },
                    w.inTag === null || w.inTag === undefined ? null
                        : w.inTag < 1 ? (w.age >= 1 ? `${w.tag || 'Changed'} this turn` : 'New this turn')
                        : `${w.tag || 'This'} for ${fmtSpan(w.inTag)}`,
                    w.age !== null && w.age !== undefined && w.age >= 1 && w.age !== w.inTag ? ` \u00B7 ${fmtSpan(w.age)} old` : null,
                    w.warn ? h('span', { class: 'warn' }, /fractur|broken|break|shatter/i.test(w.name) ? ' \u00B7 a break left unset 3\u20134 days heals crooked \u2014 Permanent' : /burn|scald/i.test(w.name) ? ' \u00B7 a burn left raw this long risks infection' : ' \u00B7 untreated this long risks infection and lasting damage') : null)))));
        }
        if (conds.length) {
            out.push(h('h4', null, 'Conditions'));
            out.push(h('div', { class: 'rpgc-cards' }, conds.map(condCard)));
        }
        const gone = [...sys.healed.map(n => `${n} healed`), ...sys.cleared.filter(n => !sys.conditions.some(x => x.name === n)).map(n => `${n} cleared`)];
        if (gone.length) out.push(h('p', { class: 'rpgc-note' }, 'Since the last reply: ' + gone.join(', ') + '.'));
        return section('body', 'Body', state.open, wounds.length || conds.length ? String(wounds.length + conds.length) : null, ...out);
    }

    function condCard(cd) {
        const arrow = cd.trend === 'up' ? '\u2191 worse' : cd.trend === 'down' ? '\u2193 easing' : cd.trend === 'new' ? 'new' : null;
        return h('div', { class: 'rpgc-cond' + (cd.critical ? ' critical' : '') + (cd.recovering ? ' rec' : '') },
            h('div', { class: 'head' },
                h('span', { class: 'name' }, cd.name),
                cd.rank ? ladder(cd.rank, cd.max, cd.recovering) : null,
                arrow ? h('span', { class: 'trend ' + cd.trend }, arrow) : null),
            h('div', { class: 'meta' },
                cd.stage ? cd.stage : null,
                cd.recovering ? ' \u00B7 recovering' : null,
                cd.detail ? ` \u00B7 ${cd.detail}` : null,
                cd.inStage ? ` \u00B7 ${fmtSpan(cd.inStage)} at this stage` : null));
    }

    const MIND_WORDS = ['calm', 'uneasy', 'agitated', 'frightened', 'panicked', 'broken'];

    function renderMind() {
        const sys = sysOf();
        if (!sys) return null;
        const conds = sys.conditions.filter(x => x.mind);
        const flags = sys.flags.filter(f => f.mind);
        const sv = sys.survival;
        const tracked = sv && !sv.paused && sv.mind && sv.mind.owner === 'tracked' ? sv.mind : null;
        if (!conds.length && !flags.length && !tracked && !sys.immunities.mindDampened) return null;
        const out = [];
        if (conds.length) out.push(h('div', { class: 'rpgc-cards' }, conds.map(condCard)));
        if (flags.length) out.push(h('div', { class: 'rpgc-chips' }, flags.map(f => h('span', { class: 'rpgc-chip mind', title: f.group || 'Status' }, f.group ? h('em', null, f.group + ': ') : null, f.name + (f.detail ? ` (${f.detail})` : '')))));
        if (sys.immunities.mindDampened) out.push(h('p', { class: 'rpgc-note' }, 'Emotion Suppression is active: strong feelings are forced back to calm.'));
        if (tracked) {
            const idx = Math.max(0, MIND_WORDS.indexOf(tracked.value));
            const btns = MIND_WORDS.map((w, i) => h('button', {
                class: 'rpgc-mind-step' + (i === idx ? ' on' : '') + (i >= 4 ? ' hot' : ''),
                'aria-pressed': i === idx ? 'true' : 'false',
                title: `Set state of mind: ${w}`,
                onclick: () => send({ type: 'survival_log', chatId: state.chatId, op: 'mind', value: w })
            }, w));
            out.push(h('div', { class: 'rpgc-mind-scale', role: 'group', 'aria-label': 'State of mind' }, btns));
            out.push(h('p', { class: 'rpgc-note' },
                tracked.src === 'story' ? 'Read from the story.' : tracked.src === 'you' ? 'Set by you.' : 'No reading yet.',
                tracked.since ? ` For ${fmtSpan(tracked.since)}.` : '',
                ((sysCfg().survival || {}).tellModel !== false) ? ' The story is told your state of mind with every message while it is not calm.' : ' Only you see it; the survival clock is not telling the story.'));
        } else if (sv && sv.mind && sv.mind.owner === 'hud') {
            out.push(h('p', { class: 'rpgc-note' }, 'The HUD tracks state of mind here, so the survival clock stays out of it.'));
        }
        return section('mind', 'Mind', state.open, conds.length ? conds.map(c => c.stage ? `${c.name} \u00B7 ${c.stage}` : c.name).join(', ') : (tracked ? tracked.value : null), ...out);
    }

    const TRACK_LABEL = { fatigue: 'Fatigue', hunger: 'Hunger', thirst: 'Thirst' };
    const TRACK_SINCE = { fatigue: 'awake', hunger: 'since a meal', thirst: 'since a drink' };

    function renderSurvival() {
        const sys = sysOf();
        const c = sysCfg().survival || {};
        if (!sys || !c.enabled) return null;
        const sv = sys.survival;
        const out = [];
        if (!sv || sv.paused) {
            out.push(h('p', { class: 'rpgc-note' }, (sv && sv.reason) || 'Waiting for a HUD with a clock.'));
            return section('survival', 'Survival', state.open, 'paused', ...out);
        }
        for (const t of sv.tracks) {
            if (t.owner === 'off') continue;
            let right, bar = null;
            if (t.owner === 'immune') right = h('span', { class: 'own' }, `not needed (${t.immuneReason})`);
            else if (t.owner === 'hud') right = h('span', { class: 'own' }, `the HUD owns this: ${t.hudText}`);
            else {
                right = h('span', { class: 'num' }, t.minutes < 1 ? `${t.stageName} \u00B7 just now` : `${t.stageName} \u00B7 ${fmtSpan(t.minutes)} ${TRACK_SINCE[t.id]}`);
                bar = ladder(t.stage, 4, false);
            }
            out.push(h('div', { class: 'rpgc-surv' + (t.owner === 'tracked' && t.stage >= 3 ? ' hot' : '') },
                h('span', { class: 'lbl' }, TRACK_LABEL[t.id]), bar, right));
        }
        const logBtn = (kind, label, title) => h('button', { class: 'rpgc-btn', title, onclick: () => send({ type: 'survival_log', chatId: state.chatId, op: 'add', kind }) }, label);
        out.push(h('div', { class: 'rpgc-row rpgc-surv-acts' },
            logBtn('slept', 'Slept', 'A proper sleep, logged at the current HUD time'),
            logBtn('rested', 'Rested', `A short break: takes ${c.restCreditHours || 4}h off the awake counter`),
            logBtn('ate', 'Ate', 'A real meal, logged at the current HUD time'),
            logBtn('drank', 'Drank', 'A drink, logged at the current HUD time'),
            h('button', { class: 'rpgc-mini', title: 'Undo the last thing you logged', 'aria-label': 'Undo last log entry', onclick: () => send({ type: 'survival_log', chatId: state.chatId, op: 'undo' }) }, '\u21B6')));
        if (c.askCompanion && !S().hmsCompanion) out.push(h('p', { class: 'rpgc-note' }, 'Automatic tracking rides on the side-panel block, which is switched off. Use the buttons, or turn on \u201CAsk for present characters and thoughts.\u201D'));
        const worst = Math.max(0, ...sv.tracks.filter(t => t.owner === 'tracked').map(t => t.stage));
        out.push(h('p', { class: 'rpgc-note rpgc-tells' }, c.tellModel !== false
            ? 'The story is told these with every message once they are not fine \u2014 tired, hungry, thirsty \u2014 and your state of mind once it is not calm, so it can play them. The buttons log what you did; the story reports it too.'
            : 'Only you see these. Switch on \u201CTell the story\u201D under HMS systems \u2192 Survival clock to send them.'));
        return section('survival', 'Survival', state.open, worst ? sv.tracks.filter(t => t.owner === 'tracked' && t.stage === worst).map(t => t.stageName).join(', ') : 'fine', ...out);
    }

    function renderAbilities() {
        const sys = sysOf();
        const c = sysCfg().abilities || {};
        if (!sys || c.enabled === false || (!sys.abilities.length && !(sys.attributes || []).length)) return null;
        const covers = new Set((state.world && S()?.worldCard !== false && state.world.covers) || []);
        const groups = sys.abilities.map(g => ({ ...g, items: g.items.filter(it => !(it.src && covers.has(String(it.src).toUpperCase()))) })).filter(g => g.items.length);
        if (!groups.length && !(sys.attributes || []).length) return null;
        const out = groups.map(g => h('div', { class: 'rpgc-abil' },
            h('h4', null, g.category),
            h('div', { class: 'rpgc-chips' }, g.items.map(it => h('span', { class: 'rpgc-chip abil', title: [it.label, it.state].filter(Boolean).join(' \u00B7 ') || null },
                it.label ? h('em', null, it.label + ': ') : null,
                it.name,
                it.level ? h('span', { class: 'lv' }, ` Lv ${it.level}`) : null,
                it.state ? h('span', { class: 'st' }, ` (${it.state})`) : null)))));
        for (const g of (sys.attributes || [])) {
            out.push(h('div', { class: 'rpgc-abil' },
                h('h4', null, g.title.replace(/^\[/, '')),
                h('div', { class: 'rpgc-attrs' }, g.items.map(it => h('span', { class: 'rpgc-attr' }, h('b', null, it.name), h('span', null, it.value))))));
        }
        const n = groups.reduce((a, g) => a + g.items.length, 0);
        return section('abilities', 'Abilities', state.open, n ? String(n) : null, ...out);
    }

    function renderHmsSystemsSettings() {
        const s = S();
        if (!s.hmsSystems) s.hmsSystems = {};
        const hs = s.hmsSystems;
        const node = (path) => {
            let o = hs;
            for (const k of path.slice(0, -1)) { if (!isObj(o[k])) o[k] = {}; o = o[k]; }
            return o;
        };
        const get = (path) => node(path)[path[path.length - 1]];
        const set = (path, v) => { node(path)[path[path.length - 1]] = v; };
        const tog = (label, path, note) => toggle(label, () => get(path) !== false, v => set(path, v), note);
        const area = (label, path, note, rows = 4) => h('div', { class: 'rpgc-set' },
            h('h4', null, label),
            note ? h('p', { class: 'rpgc-note' }, note) : null,
            h('textarea', { rows: String(rows), value: get(path) || '', 'aria-label': label, onchange: (e) => { set(path, e.target.value); saveSettings(false); } }));
        const num = (label, path, min, max, note) => h('div', { class: 'rpgc-row' },
            h('span', { class: 'lbl' }, label),
            h('input', { type: 'number', min: String(min), max: String(max), value: String(get(path) ?? ''), 'aria-label': label, onchange: (e) => { const v = Number(e.target.value); if (Number.isFinite(v)) { set(path, v); saveSettings(false); } } }),
            note ? h('span', { class: 'rpgc-note' }, note) : null);
        const txt = (label, path, note) => h('div', { class: 'rpgc-row' },
            h('span', { class: 'lbl' }, label),
            h('input', { type: 'text', value: get(path) || '', 'aria-label': label, onchange: (e) => { set(path, e.target.value); saveSettings(false); } }),
            note ? h('span', { class: 'rpgc-note' }, note) : null);
        const sub = (title) => h('h4', { class: 'rpgc-subhead' }, title);
        const survOn = get(['survival', 'enabled']) === true;
        return section('s-hmssys', 'HMS systems', state.open, null,
            h('p', { class: 'rpgc-note' }, 'Everything here reads what the engine already prints. Nothing edits the HUD except the explicit repair buttons.'),
            sub('Vitals'),
            tog('Show vitals', ['vitals', 'enabled']),
            txt('Resource pools', ['vitals', 'pools'], 'HUD labels read as current/max bars.'),
            txt('Health pools', ['vitals', 'healthPools'], 'The ones that can go critical.'),
            txt('Rising-is-bad meters', ['vitals', 'invertedMeters'], 'Percent meters where high is dangerous.'),
            num('Low below (%)', ['vitals', 'lowPct'], 1, 90),
            num('Critical below (%)', ['vitals', 'criticalPct'], 1, 50),
            tog('Show damage and healing since the last reply', ['vitals', 'showDeltas']),
            sub('Body and mind'),
            tog('Show wounds', ['body', 'wounds']),
            num('Warn when a wound stays Raw (hours)', ['body', 'rawWarnHours'], 1, 2000, 'Fractures set wrong after about 72h in Re:Zero.'),
            tog('Show conditions', ['body', 'conditions']),
            area('Condition ladders', ['body', 'ladders'], 'One per line — Name: first > second > \u2026 > last. Unlisted conditions still read Mild/Moderate/Severe/Critical and Stage N.', 7),
            txt('Mind conditions', ['body', 'mindNames'], 'Conditions, status flags and bracket lines ([MENTAL COUNCIL: \u2026]) shown under Mind.'),
            txt('Labels read as conditions', ['body', 'conditionFields'], 'HUD fields beside the Condition line, like the vampire\u2019s Thirst State.'),
            sub('Abilities'),
            tog('Show abilities', ['abilities', 'enabled']),
            txt('Attributes', ['abilities', 'attributes'], 'Read as NAME value anywhere in the HUD: STR 10, DEX[+3], Academics [B +2].'),
            area('What counts as an ability', ['abilities', 'vocabulary'], 'One category per line — Category: Label, [TAG]. A plain word matches a HUD label (Skills:), [TAG] matches a bracket line ([AUTHORITY: \u2026]). Add your world\u2019s own.', 8),
            h('p', { class: 'rpgc-note' }, 'Quests have their own section: Settings \u2192 Quests.'),
            sub('People'),
            tog('Track relationships', ['relations', 'enabled'], 'Everyone you deal with: how they see you and how they feel about you.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Layout'), (() => {
                const sel = h('select', { 'aria-label': 'People layout', onchange: (e) => { set(['relations', 'layout'], e.target.value); saveSettings(false); render(); } },
                    h('option', { value: 'cards' }, 'Cards with bars'), h('option', { value: 'compact' }, 'Compact list'), h('option', { value: 'hearts' }, 'Hearts and stars'), h('option', { value: 'codex' }, 'Codex grid'));
                sel.value = get(['relations', 'layout']) || 'cards';
                return sel;
            })()),
            txt('Standing ladder (worst to best)', ['relations', 'ladder'], 'One label is picked each reply.'),
            txt('Neutral standing', ['relations', 'neutral'], 'Where a first meeting starts; below it counts as against you.'),
            txt('Bars', ['relations', 'bars'], 'Add \u00B1 to a bar that runs -100 to 100; the rest run 0 to 100.'),
            num('Most a bar moves in one reply', ['relations', 'maxStep'], 1, 100),
            num('People remembered', ['relations', 'keep'], 10, 300, 'The most recently seen are kept.'),
            sub('Phone'),
            tog('Phone and messages', ['comms', 'enabled'], 'Texts, calls and transfers go into the story as your turn. Contacts come from the story.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Kind'), (() => {
                const sel = h('select', { 'aria-label': 'Kind of device', onchange: (e) => { set(['comms', 'kind'], e.target.value); saveSettings(false); render(); } },
                    h('option', { value: 'phone' }, 'Phone — texts, calls, transfers'), h('option', { value: 'mirror' }, 'Conversation mirror — speaks to its twin'),
                    h('option', { value: 'spell' }, 'Message spell — reaches anyone you have met'), h('option', { value: 'radio' }, 'Comms radio — texts and hails'));
                sel.value = get(['comms', 'kind']) || 'phone';
                return sel;
            })()),
            txt('Your device', ['comms', 'device'], 'Leave empty to read it from your HUD or inventory. Name one for a world where it never shows there.'),
            txt('Device words', ['comms', 'deviceWords'], 'What counts as a device on the Equipment, Items or ability lines.'),
            txt('Balance labels', ['comms', 'balanceLabels'], 'The HUD line read as your balance.'),
            sub('Party'),
            tog('Track the party', ['party', 'enabled'], 'Reads party members in the scene through the side-panel block.'),
            tog('Mask: band or mode, holding the act, signature tell', ['party', 'trackMask']),
            tog('Bond: contract stage, jealousy, irritation (and affection and trust when relationships are off)', ['party', 'trackBond']),
            tog('Needs: hunger, fatigue, pain, stress', ['party', 'trackNeeds']),
            tog('Progression phase and vessel front', ['party', 'trackPhase']),
            num('Alert at level (1 slight \u2026 4 extreme)', ['party', 'alertLevel'], 1, 4),
            num('Alert when rising this many replies', ['party', 'risingTurns'], 2, 10),
            h('p', { class: 'rpgc-note' }, 'Register, band, stage and phase are read in the card\u2019s own words and never defined here. A stage or phase is only allowed to move when something with a cost happened; a skipped phase is flagged.'),
            sub('Guard'),
            txt('Carrier lines', ['carriers'], 'Lines whose printed text keeps an entry loaded. Listed first and marked when dropped. [TAG] matches bracket lines.'),
            txt('Lines that clear themselves', ['selfClearing'], 'Gone by the engine\u2019s own rules when their state ends \u2014 healed wounds, a passed condition. Shown as cleared, not dropped.'),
            sub('You'),
            tog('Tell the story when you can level up', ['you', 'tellModel'], 'When the XP the extension tracks reaches your next level, the story is told the level is there to be earned. A HUD that prints its own XP is left alone.'),
            txt('XP for each level', ['you', 'xpCurve'], 'Total XP for level 2, 3, 4\u2026 separated by commas. Used only when the HUD prints no XP of its own.'),
            sub('Injuries'),
            tog('Track injuries', ['injuries', 'enabled'], 'For HUDs that do not keep wounds, on the Re:Zero HUD\u2019s injury law: raw until tended, treated is not healed, healing takes the time its kind and severity need, a break left unset heals crooked, and a healed wound may scar. A HUD that prints its own wounds owns them, and this stands down.'),
            tog('Tell the story about them', ['injuries', 'tellModel'], 'Your injuries go with every message, so the story does not forget them two replies later.'),
            sub('Survival clock'),
            h('p', { class: 'rpgc-note' }, 'For bots whose HUD does not track sleep, food, water or state of mind. It measures elapsed time from the HUD clock and tells the engine the facts; the engine decides the consequences. It stands down for anything the HUD already tracks, and for immune races.'),
            toggle('Use the survival clock', () => get(['survival', 'enabled']) === true, v => set(['survival', 'enabled'], v), 'For bots whose HUD does not track sleep, food and water: it measures time on the HUD clock and tells the story the facts. It stands down for anything the HUD already tracks.'),
            survOn ? tog('Tell the model', ['survival', 'tellModel'], 'Adds a short note of elapsed time when something is past its first stage.') : null,
            survOn ? tog('Read what you did from the story', ['survival', 'askCompanion'], 'Uses the side-panel block. Without it, log with the buttons.') : null,
            survOn ? tog('Track fatigue', ['survival', 'fatigue']) : null,
            survOn ? txt('Fatigue stages (hours awake)', ['survival', 'fatigueHours'], 'Tired, Fatigued, Exhausted, Collapsing.') : null,
            survOn ? tog('Track hunger', ['survival', 'hunger']) : null,
            survOn ? txt('Hunger stages (hours)', ['survival', 'hungerHours']) : null,
            survOn ? tog('Track thirst', ['survival', 'thirst']) : null,
            survOn ? txt('Thirst stages (hours)', ['survival', 'thirstHours']) : null,
            survOn ? num('A rest takes off (hours)', ['survival', 'restCreditHours'], 0, 24) : null,
            survOn ? tog('Track state of mind', ['survival', 'mind']) : null,
            survOn ? h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn danger', onclick: async () => {
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Clear the survival log?', message: 'Removes everything you logged by hand in this chat. What the story reported stays.', variant: 'danger', confirmLabel: 'Clear' }) : { confirmed: window.confirm('Clear the survival log for this chat?') };
                if (res?.confirmed) send({ type: 'survival_log', chatId: state.chatId, op: 'clear' });
            } }, 'Clear this chat\u2019s survival log')) : null);
    }

    // ─────────── Party ───────────

    function partyOf() {
        return (state.hms && state.hms.party) || (state.extras && state.extras.party) || null;
    }
    function inParty(name) {
        const p = partyOf();
        if (!p || !name) return false;
        const k = String(name).trim().toLowerCase();
        const first = k.split(/\s+/)[0];
        return p.members.some(m => m.key === k || (m.aliases || []).some(a => a.toLowerCase() === k) || (first.length >= 3 && m.key.split(/\s+/)[0] === first));
    }
    const PARTY_GROUPS = [['bond', 'Bond'], ['mask', 'The act'], ['needs', 'Needs']];

    function partyMeter(d) {
        const cells = [];
        for (let i = 1; i <= 4; i++) cells.push(h('i', { class: i <= d.level ? (d.bad ? (i >= 3 ? 'on hot' : 'on') : 'on good') : '' }));
        return h('span', { class: 'rpgc-ladder party', role: 'img', 'aria-label': `${d.label}: ${d.word}` }, cells);
    }

    function partyCard(m, opt = {}) {
        const cur = m.cur || {};
        const chips = [];
        const card = (label, val, cls) => { if (val) chips.push(h('span', { class: 'rpgc-chip card ' + (cls || ''), title: `${label}, in the card\u2019s own words` }, h('em', null, label + ': '), val)); };
        if (m.contract) chips.push(h('span', { class: 'rpgc-chip card stage', title: 'A contract on your HUD' }, h('em', null, 'Contract: '), m.contract));
        const rel = relFor(m.name);
        if (!opt.merged && rel && rel.standing) chips.push(standingChip(rel));
        card('Register', cur.register, 'reg');
        card('Band', cur.band, 'band');
        card('Front', cur.front, 'front');
        card('Stage', cur.stage, 'stage');
        card('Phase', cur.phase, 'phase');
        const groups = [];
        for (const [g, title] of PARTY_GROUPS) {
            const ds = m.dims.filter(d => d.group === g);
            if (!ds.length) continue;
            groups.push(h('div', { class: 'rpgc-pgroup' },
                h('span', { class: 'gt' }, title),
                ds.map(d => h('div', { class: 'rpgc-pdim' + (d.bad && d.level >= 3 ? ' hot' : '') },
                    h('span', { class: 'lbl' }, d.label),
                    partyMeter(d),
                    h('span', { class: 'w' }, d.word + (d.id === 'jealousy' && cur.jealousOf && d.level > 0 ? ` of ${cur.jealousOf}` : '')),
                    d.trend ? h('span', { class: 'trend ' + (d.bad === (d.trend === 'up') ? 'worse' : 'better'), 'aria-label': d.trend === 'up' ? 'rising' : 'falling' }, d.trend === 'up' ? '\u2191' : '\u2193') : null,
                    d.since && d.since >= 30 ? h('span', { class: 'dur' }, fmtSpan(d.since)) : null))));
        }
        const presence = m.present ? h('span', { class: 'rpgc-chip here' }, 'here')
            : m.seen ? h('span', { class: 'rpgc-chip away' }, m.lastSeen !== null && m.lastSeen !== undefined ? `away \u00B7 ${fmtSpan(m.lastSeen) || 'just now'}` : 'away')
            : h('span', { class: 'rpgc-chip away' }, 'not read yet');
        const aliasIn = h('input', { type: 'text', value: (m.aliases || []).join(', '), placeholder: 'e.g. Momonga, Ainz Ooal Gown', 'aria-label': `Other names for ${m.name}`,
            onchange: (e) => send({ type: 'party_member', chatId: state.chatId, op: 'aliases', name: m.name, aliases: e.target.value }) });
        const aliasDet = h('details', { class: 'rpgc-subdet' }, h('summary', null, 'Also called'), h('div', { class: 'rpgc-row' }, aliasIn,
            h('span', { class: 'rpgc-note' }, 'Other names the story uses. A shared vessel\u2019s souls go here too.')));
        aliasDet.open = state.open['party-alias-' + m.key] === true;
        aliasDet.dataset.openKey = 'party-alias-' + m.key; aliasDet.addEventListener('toggle', () => { state.open['party-alias-' + m.key] = aliasDet.open; });
        const worst = m.alerts.some(a => a.sev === 'high') ? ' high' : m.alerts.length ? ' warn' : '';
        return h('div', { class: 'rpgc-pcard' + worst + (m.present ? '' : ' away') + (opt.merged ? ' sub' : '') },
            h('div', { class: opt.merged ? 'rpgc-psub' : 'head' },
                opt.merged ? h('span', { class: 'gt' }, 'Party') : avatarImg(m.name),
                opt.merged ? null : h('span', { class: 'name' }, m.name),
                cur.mood && !opt.merged ? h('span', { class: 'mood' }, cur.mood) : null,
                presence,
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${m.name} from the party`, title: 'Remove from the party', onclick: () => send({ type: 'party_member', chatId: state.chatId, op: 'remove', name: m.name }) }, '\u2715')),
            chips.length ? h('div', { class: 'rpgc-chips' }, chips) : null,
            m.alerts.length ? h('ul', { class: 'rpgc-palerts' }, m.alerts.map(a => h('li', { class: a.sev }, a.text))) : null,
            !opt.merged && rel && rel.bars.length ? h('div', { class: 'rpgc-pgroup' }, h('span', { class: 'gt' }, 'Toward you'), rel.bars.filter(b => ['affection', 'trust'].includes(b.id)).map(relBar)) : null,
            ...groups,
            cur.tell ? h('div', { class: 'rpgc-ptell' }, h('em', null, 'Tell: '), cur.tell) : null,
            cur.concern && !opt.skipConcern ? h('div', { class: 'rpgc-pconcern' }, cur.concern) : null,
            m.events && m.events.length ? h('p', { class: 'rpgc-note' }, m.events.join(' \u00B7 ')) : null,
            !m.seen ? h('p', { class: 'rpgc-note' }, `Read the next time ${m.name} is in the scene.`) : null,
            aliasDet);
    }


    // ─────────── People (relationships) ───────────

    function relOf() { return (state.hms && state.hms.relations) || (state.extras && state.extras.relations) || null; }
    function relFor(name) {
        const r = relOf();
        if (!r || !name) return null;
        const k = String(name).trim().toLowerCase();
        return r.people.find(p => p.key === k) || null;
    }
    function standingChip(p) {
        return h('span', { class: 'rpgc-chip standing ' + p.tone, title: 'How they see you' }, p.standing || 'unknown');
    }
    function relBar(b) {
        const wrap = h('div', { class: 'rpgc-relbar' + (b.two ? ' two' : ''), role: 'meter', 'aria-label': `${b.name} ${b.value}`, 'aria-valuenow': String(b.value) });
        const fill = h('i', { class: b.value < 0 ? 'neg' : 'pos' });
        if (b.two) { const w = Math.abs(b.value) / 2; fill.style.width = w + '%'; fill.style.left = b.value < 0 ? (50 - w) + '%' : '50%'; }
        else fill.style.width = Math.max(0, Math.min(100, b.value)) + '%';
        wrap.appendChild(fill);
        return h('div', { class: 'rpgc-reltile' },
            h('div', { class: 'top' }, h('span', { class: 'lbl' }, b.name), h('span', { class: 'v' }, b.two ? `${b.value > 0 ? '+' : ''}${b.value}` : `${b.value}`, h('small', null, b.two ? '' : '/100'))),
            wrap,
            b.delta ? h('div', { class: 'why ' + (b.delta > 0 ? 'up' : 'down') }, `${b.delta > 0 ? '+' : ''}${b.delta}${b.reason ? ' ' + b.reason : ''}`) : null);
    }
    function hearts(n) {
        const full = Math.max(0, Math.min(5, Math.round((n + 100) / 40)));
        return h('span', { class: 'rpgc-hearts', 'aria-label': `${full} of 5 hearts` }, '\u2665'.repeat(full), h('span', { class: 'off' }, '\u2665'.repeat(5 - full)));
    }
    function personMeta(p) {
        return [p.present ? 'here' : p.lastSeen !== null ? `seen ${fmtSpan(p.lastSeen) || 'just now'} ago` : null, p.metAgo ? `met ${fmtSpan(p.metAgo)} ago` : null, p.party ? 'party' : null].filter(Boolean).join(' \u00B7 ');
    }
    function bondEditor(p) {
        const bondIn = h('input', { type: 'text', value: p.pinned && p.pinned.bond ? p.pinned.bond : '', placeholder: p.bond || 'e.g. family — daughter to you', 'aria-label': `Bond with ${p.name}` });
        const minor = h('input', { type: 'checkbox', 'aria-label': `${p.name} is a minor` });
        minor.checked = !!(p.pinned && p.pinned.minor);
        const det = h('details', { class: 'rpgc-subdet' }, h('summary', null, p.pinned ? 'Bond (set by you)' : 'Set the bond'),
            h('p', { class: 'rpgc-note' }, 'When the story reads the relationship wrong, set it here. The model is told, and a minor or a family bond can never be romantic.'),
            h('div', { class: 'rpgc-row' }, bondIn, h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'rel_pin', chatId: state.chatId, name: p.name, bond: bondIn.value }) }, 'Set')),
            h('label', { class: 'rpgc-row' }, minor, h('span', null, 'Minor — no romance, no desire')));
        minor.addEventListener('change', () => send({ type: 'rel_pin', chatId: state.chatId, name: p.name, minor: minor.checked }));
        det.open = state.open['bond-' + p.key] === true;
        det.dataset.openKey = 'bond-' + p.key; det.addEventListener('toggle', () => { state.open['bond-' + p.key] = det.open; });
        return det;
    }
    function personCard(p, opt = {}) {
        const dossier = !opt.noDossier && p.present && p.details ? Object.entries(p.details).filter(([, v]) => v && typeof v !== 'object') : [];
        return h('div', { class: 'rpgc-person ' + p.tone },
            h('div', { class: 'head' }, avatarImg(p.name), h('span', { class: 'name' }, p.name), standingChip(p),
                p.bond ? h('span', { class: 'rpgc-chip bond' + (p.pinned && p.pinned.bond ? ' pinned' : ''), title: 'The kind of relationship' }, p.bond) : null,
                p.minor ? h('span', { class: 'rpgc-chip minor', title: 'A minor: no romance, no desire' }, 'minor') : null,
                h('span', { class: 'meta' }, personMeta(p))),
            p.alerts.length ? h('ul', { class: 'rpgc-palerts' }, p.alerts.map(a => h('li', { class: a.sev }, a.text))) : null,
            p.mood ? h('div', { class: 'rpgc-relmood' }, h('span', { class: 'lbl' }, 'Mood'), h('b', null, p.mood)) : null,
            p.bars.length ? h('div', { class: 'rpgc-relgrid' }, p.bars.map(relBar)) : null,
            dossier.length ? h('div', { class: 'rpgc-dossier' }, dossier.map(([k, v]) => h('div', { class: 'row' + (/secret/i.test(k) ? ' secret' : '') }, h('span', { class: 'k' }, k), h('span', { class: 'v' }, String(v))))) : null,
            p.why ? h('div', { class: 'rpgc-pconcern' }, p.why) : null,
            p.events.length ? h('p', { class: 'rpgc-note' }, p.events.slice(-3).join(' \u00B7 ')) : null,
            bondEditor(p));
    }
    function renderPeopleLayout(list, layout) {
        if (!list.length) return null;
        if (layout === 'compact') return h('ul', { class: 'rpgc-people-compact' }, list.map(p => {
            const aff = p.bars.find(b => b.id === 'affection');
            return h('li', { class: p.tone }, h('span', { class: 'name' }, p.name), standingChip(p), p.bond ? h('span', { class: 'rpgc-chip bond' }, p.bond) : null, aff ? relBar(aff) : null, h('span', { class: 'meta' }, p.present ? 'here' : ''));
        }));
        if (layout === 'hearts') return h('div', { class: 'rpgc-cards' }, list.map(p => {
            const aff = p.bars.find(b => b.id === 'affection'), att = p.bars.find(b => b.id === 'desire' || b.id === 'attraction'), tr = p.bars.find(b => b.id === 'trust');
            return h('div', { class: 'rpgc-person hearts ' + p.tone },
                h('div', { class: 'head' }, avatarImg(p.name), h('span', { class: 'name' }, p.name), standingChip(p)),
                aff ? h('div', { class: 'rpgc-relrow' }, h('span', { class: 'lbl' }, 'Affection'), hearts(aff.value)) : null,
                att ? h('div', { class: 'rpgc-relrow' }, h('span', { class: 'lbl' }, att.name), hearts(att.value * 2 - 100)) : null,
                p.bond ? h('div', { class: 'rpgc-relrow' }, h('span', { class: 'lbl' }, 'Bond'), h('span', null, p.bond)) : null,
                tr ? h('div', { class: 'rpgc-relrow' }, h('span', { class: 'lbl' }, 'Trust'), h('span', { class: 'rpgc-stars' }, '\u2605'.repeat(Math.max(0, Math.round((tr.value + 100) / 40))), h('span', { class: 'off' }, '\u2605'.repeat(5 - Math.max(0, Math.round((tr.value + 100) / 40)))))) : null,
                p.why ? h('div', { class: 'rpgc-pconcern' }, p.why) : null);
        }));
        if (layout === 'codex') return h('div', { class: 'rpgc-codex' }, list.map(p => h('div', { class: 'rpgc-codex-tile ' + p.tone, title: [p.standing, p.why].filter(Boolean).join(' \u2014 ') },
            avatarImg(p.name) || h('span', { class: 'glyph', 'aria-hidden': 'true' }, (p.name || '?').charAt(0)),
            h('span', { class: 'name' }, p.name), h('span', { class: 'st' }, p.standing || '?'))));
        return h('div', { class: 'rpgc-cards' }, list.map(p => personCard(p)));
    }

    // ─────────── Phone ───────────

    function renderPhone() {
        const p = (state.hms && state.hms.comms) || (state.extras && state.extras.comms) || null;
        const c = (sysCfg().comms) || {};
        if (!p || c.enabled === false) return null;
        const out = [];
        out.push(h('div', { class: 'rpgc-phone-head' },
            h('span', null, p.device ? `${p.icon || '\uD83D\uDCF1'} ${p.device.name}${p.device.from === 'you' || p.device.from === 'chat' ? ' (set by you)' : p.device.from === 'inventory' ? ' (in your inventory)' : p.device.from === 'standard' ? ' (standard issue)' : ''}` : 'No device'),
            p.balance ? h('span', { class: 'bal' }, `${p.balance.label}: ${p.balance.value}`) : null));
        // your own device for this chat: for a story that gave you one the HUD never prints
        const devIn = h('input', { type: 'text', placeholder: p.kind === 'mirror' ? 'Conversation mirror' : p.kind === 'spell' ? 'Message spell' : 'Phone', 'aria-label': 'Your device', maxlength: '40', style: 'flex:1;min-width:0' });
        const setDev = () => { const v = devIn.value.trim(); if (v) send({ type: 'comms', chatId: state.chatId, op: 'set_device', name: v }); };
        devIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') setDev(); });
        if (!p.device) {
            out.push(h('p', { class: 'rpgc-note' }, 'You have nothing to reach anyone with. When the story gives you a phone, a paired mirror or the like \u2014 and it shows on your HUD \u2014 this wakes up. If the story already gave you one, name it here:'));
            out.push(h('div', { class: 'rpgc-row' }, devIn, h('button', { class: 'rpgc-btn primary', onclick: setDev }, 'I have this')));
            return section('phone', p.title || 'Phone', state.open, null, ...out);
        }
        const devSet = h('details', { class: 'rpgc-subdet' }, h('summary', null, p.device.from === 'chat' ? 'Your device (set by you)' : 'Use another device'),
            h('p', { class: 'rpgc-note' }, 'For this chat only. The story still decides whether a message gets through.'),
            h('div', { class: 'rpgc-row' }, devIn, h('button', { class: 'rpgc-btn', onclick: setDev }, 'Set'),
                p.device.from === 'chat' ? h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'comms', chatId: state.chatId, op: 'clear_device' }) }, 'Clear') : null));
        if (p.device.from === 'chat') devIn.value = p.device.name;
        const open = state.phoneWith;
        const th = open ? p.threads.find(t => t.name.toLowerCase() === open.toLowerCase()) : null;
        if (open) {
            const contact = p.contacts.find(x => x.name.toLowerCase() === open.toLowerCase());
            out.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', onclick: () => { state.phoneWith = null; render(); } }, '\u2190 Contacts'), h('strong', null, open), contact && contact.how ? h('span', { class: 'rpgc-note' }, contact.how) : null));
            out.push(h('div', { class: 'rpgc-thread', role: 'log' }, th && th.items.length ? th.items.map(it => h('div', { class: 'msg ' + it.dir + ' ' + it.kind },
                it.kind === 'call' ? `\uD83D\uDCDE ${it.dir === 'out' ? 'You called' : 'Call'}${it.text ? ': ' + it.text : ''}` : it.kind === 'pay' ? `\uD83D\uDCB8 You sent ${it.text}` : it.text)) : h('p', { class: 'rpgc-note' }, 'No messages yet.')));
            const input = h('input', { type: 'text', placeholder: `Message ${open}\u2026`, 'aria-label': `Message to ${open}`, style: 'flex:1;min-width:0' });
            const sendText = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'comms', chatId: state.chatId, op: 'text', to: open, text: v }); };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendText(); } });
            const callLabel = { phone: '\uD83D\uDCDE Call', mirror: '\uD83E\uDE9E Speak', spell: '\u2728 Message', radio: '\uD83D\uDCE1 Hail' }[p.kind] || '\uD83D\uDCDE Call';
            const callBtn = h('button', { class: 'rpgc-btn' + (p.canText ? '' : ' primary'), title: `Reach ${open}`, onclick: () => { const v = p.canText ? '' : input.value.trim(); input.value = ''; send({ type: 'comms', chatId: state.chatId, op: 'call', to: open, text: v }); } }, callLabel);
            if (!p.canText) input.placeholder = `What you say to ${open}\u2026 (optional)`;
            out.push(h('div', { class: 'rpgc-row' }, input, p.canText ? h('button', { class: 'rpgc-btn primary', onclick: sendText }, 'Send') : null, callBtn));
            if (p.balance && p.canPay) {
                const amt = h('input', { type: 'text', placeholder: 'Amount', 'aria-label': 'Amount to send', style: 'width:90px' });
                out.push(h('div', { class: 'rpgc-row' }, amt, h('button', { class: 'rpgc-btn', onclick: () => { const v = amt.value.trim(); if (v) send({ type: 'comms', chatId: state.chatId, op: 'pay', to: open, amount: v }); } }, `Send ${p.balance.label}`)));
            }
            out.push(h('p', { class: 'rpgc-note' }, 'Everything you send goes into the story as your turn. Whether it reaches them, and what they do, is the story\u2019s call.'));
            return section('phone', p.title || 'Phone', state.open, open, ...out);
        }
        const unknown = p.threads.filter(t => !t.known && t.items.some(i => i.dir === 'in'));
        if (!p.contacts.length) out.push(h('p', { class: 'rpgc-note' }, p.kind === 'spell' ? 'A Message reaches someone you know. Everyone you meet appears here.' : p.kind === 'mirror' ? 'A conversation mirror reaches only its paired twin. When the story hands you one, it appears here.' : 'No contacts yet. You get them in the story \u2014 swap numbers, get added to a group chat \u2014 and they appear here.'));
        out.push(h('ul', { class: 'rpgc-list rpgc-contacts' }, p.contacts.map(ct => {
            const t = p.threads.find(x => x.name.toLowerCase() === ct.name.toLowerCase());
            const last = t && t.items.length ? t.items[t.items.length - 1] : null;
            return h('li', null,
                h('button', { class: 'rpgc-linkbtn grow', onclick: () => { state.phoneWith = ct.name; render(); } }, h('b', null, ct.name), last ? h('span', { class: 'prev' }, ` ${last.dir === 'in' ? '' : 'You: '}${String(last.text || last.kind).slice(0, 40)}`) : null),
                ct.from === 'you' ? h('span', { class: 'rpgc-chip', title: 'Added by you, not by the story' }, 'yours') : ct.from === 'met' ? h('span', { class: 'rpgc-chip', title: 'Someone you have met' }, 'met') : ct.from === 'inbox' ? h('span', { class: 'rpgc-chip', title: 'They messaged you, so you can answer' }, ct.how === 'group chat' ? 'group' : 'messaged you') : null,
                ct.from === 'you' ? h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${ct.name}`, onclick: () => send({ type: 'comms', chatId: state.chatId, op: 'remove_contact', name: ct.name }) }, '\u2715') : null);
        })));
        if (unknown.length) out.push(h('p', { class: 'rpgc-note' }, `Messages from people not in your contacts: ${unknown.map(t => t.name).join(', ')}.`));
        if (p.notices && p.notices.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, '\uD83D\uDD14 Notices'),
            h('ul', { class: 'rpgc-list' }, p.notices.slice(0, 5).map(n => h('li', { style: 'display:block' }, h('b', null, n.from), ` \u2014 ${n.text}`)))));
        const nameIn = h('input', { type: 'text', placeholder: 'Name', 'aria-label': 'Contact name', style: 'flex:1;min-width:0' });
        out.push(h('details', { class: 'rpgc-subdet' }, h('summary', null, 'Add a contact by hand'),
            h('p', { class: 'rpgc-note' }, 'Only for a number the story really gave you and the tracker missed.'),
            h('div', { class: 'rpgc-row' }, nameIn, h('button', { class: 'rpgc-btn', onclick: () => { const v = nameIn.value.trim(); if (v) send({ type: 'comms', chatId: state.chatId, op: 'add_contact', name: v }); } }, 'Add'))));
        out.push(devSet);
        return section('phone', p.title || 'Phone', state.open, p.contacts.length ? String(p.contacts.length) : null, ...out);
    }

    // ─────────── Play-style presets and themes ───────────

    // What a saved preset remembers: the look, how HMS runs, the panels, fights and every system.
    const STYLE_PATHS = ['positions', 'uiTheme', 'uiDensity', 'uiTextSize', 'hmsMode', 'hmsCompanion', 'hmsGuard', 'hmsPinReminder', 'showDiceDisplay', 'showCharacterThoughts', 'showQuests', 'enableDynamicWeather', 'encounterSettings', 'hmsSystems', 'immersive', 'dnd', 'chapters', 'worldCard', 'lore', 'hmsCore', 'memory'];
    // Worlds: everything a bot's world needs, so one click makes the panel belong to it.
    const HMS_ON = { hmsMode: 'on', hmsCompanion: true, hmsGuard: true, hmsPinReminder: true, showCharacterThoughts: true, showQuests: true };
    const WORLD_STYLES = [
        { id: 'w-rezero', name: 'Re:Zero \u2014 The Living World', hms: true,
            desc: 'HMS always on. Carriers for Authorities, Spirit Contracts, the Mental Council and WHDAAA reels; Authorities, Divine Protections and Spirit Contracts as abilities; Corruption read as a rising danger and Od Integrity as a falling one; Return by Death rewinds understood, and every life kept as a Loops chapter alongside the arcs. Conversation mirrors instead of phones. The party tracks Affect Bands, gated phases and bond stages. The world card, and D&D for the bot\u2019s D&D mode. Engine-rule immersive fights; the HUD owns wounds and conditions, so no survival clock.',
            data: { ...HMS_ON, uiTheme: 'rezero', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, loops: true, arcs: true }, dnd: { enabled: true, useHud: true },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP, MP, Mana, Od, Integrity, Vitality, Health', healthPools: 'HP, Health, Vitality', invertedMeters: 'Corruption, Strain, Overload', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: '' },
                    abilities: { enabled: true, attributes: 'STR, DEX, CON, INT, WIS, CHA, AGI, VIT, PER, LUK',
                        vocabulary: 'Authorities: [AUTHORITY], [WITCH FACTOR]\nDivine Protections: [DIVINE PROTECTION]\nContracts: [SPIRIT CONTRACT], [CONTRACT]\nMagic: Magic, Gate, Pool, Spirit Affinity\nSkills: Skills\nClasses: Class\nTraits: [HEAVENLY SWORD], [AXIOM]\nTitles: Titles, Title\nRoles: Role, Academic Rank, Academic Role' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives, [MAIN QUEST], [SIDE QUEST], [QUEST]', journal: true },
                    carriers: 'Arc, Memory, Quests, Game Mode, Now Playing, [AUTHORITY], [DIVINE PROTECTION], [SPIRIT CONTRACT], [MENTAL COUNCIL]',
                    selfClearing: 'Injuries, Condition, [STATUS], [WARNING], [EVENT]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: true, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: true, kind: 'mirror', device: '', deviceWords: 'conversation mirror, dialogue mirror, metia, mirror', balanceLabels: 'Gold, Silver, Coins, Holy Coins, Money' },
                    survival: { enabled: false } } } },
        { id: 'w-overlord', name: 'Overlord \u2014 The Living World', hms: true,
            desc: 'HMS always on. Carriers for Gamemode and Blessings; the Abilities line read as passives and Skills as actions; Martial Arts, talents, world items, Runecraft and Perfect Warrior understood; Focus, Super-Tier Slots and the vampire\u2019s Blood Pool as resources, Thirst State as a condition. The Message spell reaches anyone you have met (clear the device if your character cannot cast it). The world card with its framework check, arcs as chapters. Engine-rule immersive fights: every combatant has a level and the level gap is physics. No D&D: YGGDRASIL runs on its own levels.',
            data: { ...HMS_ON, uiTheme: 'overlord', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP, MP, Focus, Super-Tier Slots, Spell Slots, Blood Pool, Integrity', healthPools: 'HP', invertedMeters: 'Corruption, Strain', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: 'Thirst State' },
                    abilities: { enabled: true, attributes: 'STR, DEX, CON, INT, WIS, CHA',
                        vocabulary: 'Skills: Skills\nPassives: Abilities, Passives\nMartial Arts: Martial Arts\nMagic: System, Tradition, Traditions, Wild Magic, Blood Tradition\nClasses: Classes, Class, Racial Lvl\nTalents: Talent, Talents, [TALENT]\nCrafts: Runecraft\nWorld Items: [WORLD ITEM]\nBlessings: Blessings\nTraits: [PERFECT WARRIOR], [OVER MAGIC]\nRoles: Role, Adventurer, Worker' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives', journal: true },
                    carriers: 'Arc, Current Arc, Gamemode, Blessings, Memory, Quests',
                    selfClearing: 'Injuries, Condition, [STATUS], [WARNING], [EVENT]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: false, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: true, kind: 'spell', device: 'Message spell', deviceWords: 'Message, scroll of Message', balanceLabels: 'Gold, Coins, Money' },
                    survival: { enabled: false } } } },
        { id: 'w-cote', name: 'Classroom of the Elite \u2014 HMS Render Engine', hms: true,
            desc: 'HMS always on. Carriers for Arc, Quests, Memory and Game Mode; Exams and resolved statuses clear themselves; OAA ratings, the School Database and Godmother stats read as attributes; the Protection Point as an asset. School smartphones with texts, calls and Private Point transfers. Relationships up front, with facades tracked for the people who wear them. The world card with the Standings, the Godmother and the School Database; the school months and arcs as chapters. The School Database rolls its own dice, so no D&D and no roller of yours.',
            data: { ...HMS_ON, uiTheme: 'cote', showDiceDisplay: false, enableDynamicWeather: false, worldCard: true, chapters: { enabled: true, months: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP, Stamina, Energy', healthPools: 'HP', invertedMeters: 'Stress, Suspicion, Exposure', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: '' },
                    abilities: { enabled: true, attributes: 'ACA, JUD, PRE, PHY, AGI, END, Academics, Academic, Intellect, Judgment, Presence, Physical, Agility, Endurance, Cooperation',
                        vocabulary: 'Roles: Role, Committee, Club\nSkills: Skills\nTitles: Titles, Title\nAssets: Protection Point' },
                    quests: { enabled: true, labels: 'Quests, Quest', journal: true },
                    carriers: 'Arc, Quests, Memory, Game Mode',
                    selfClearing: 'Injuries, Condition, Exam, [STATUS], [EVENT]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: false, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: true, kind: 'phone', device: '', deviceWords: 'smartphone, phone, school phone, cellphone', balanceLabels: 'Private Points, PP' },
                    survival: { enabled: false } } } },
        { id: 'w-mushoku', name: 'Mushoku Tensei \u2014 The Six-Faced World', hms: true,
            desc: 'HMS always on. Carriers for the Arc, Memory, the Man-God and Demon Eye lines and Game Mode; sword styles, magic schools, Touki, casting and contracts read as abilities; Injuries and conditions are the HUD\u2019s own, so no survival clock. No phones in this world. The world card follows the K. calendar, your age, your ranks on both ladders, languages, and writes down the Man-God\u2019s advice; arcs as chapters. No D&D. Engine-rule immersive fights.',
            data: { ...HMS_ON, uiTheme: 'mushoku', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'Mana, MP', healthPools: '', invertedMeters: '', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: 'Drain Syndrome' },
                    abilities: { enabled: true, attributes: '',
                        vocabulary: 'Martial: Martial Style, Touki, Active Stance\nMagic: Magic School, Casting Method, Mana Capacity\nContracts: Contracts, [SUMMON PACT], [SPIRIT]\nEyes: [DEMON EYE]\nMarks: [CURSE], [BLESSING]\nRoles: Role, Term, Adventurer' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives', journal: true },
                    carriers: 'Current Arc, Arc, Memory, [HITOGAMI], [DEMON EYE], Game Mode',
                    selfClearing: 'Injuries, Condition, Active Stance, [STATUS]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: true, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: false },
                    survival: { enabled: false } } } },
        { id: 'w-undertale', name: 'Undertale \u2014 The Underground', hms: true,
            desc: 'HMS always on. Carriers for the Route, the SOUL, the SAVE point and Game Mode; LV, EXP, AT and DF on the world card, KR as a rising danger; items and ACTs as abilities. Cell phones, with Papyrus\u2019s number waiting. SAVE, LOAD and RESET understood as rewinds, and each timeline kept as a Loops chapter. The world card shows your SOUL, LV, the route and its kills. Engine-rule immersive fights, where sparing a monster ends it as well as winning.',
            data: { ...HMS_ON, uiTheme: 'undertale', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, loops: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP', healthPools: 'HP', invertedMeters: 'KR, Karma', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: '' },
                    abilities: { enabled: true, attributes: '',
                        vocabulary: 'SOUL: SOUL\nMagic: Magic, Attacks\nACT: ACT, ACTs\nItems: Items\nEquipment: Weapon, Armor\nRoute: Route, Kills\nTitles: Title, Titles' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives', journal: true },
                    carriers: 'Route, SOUL, SAVE, Arc, Memory, Game Mode',
                    selfClearing: 'Condition, [STATUS], [EVENT]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: false, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: true, kind: 'phone', device: '', deviceWords: 'Cell Phone, cell phone, phone', balanceLabels: 'G, Gold' },
                    survival: { enabled: false } } } },
        { id: 'w-darksouls', name: 'Dark Souls \u2014 The Age of Fire', hms: true,
            desc: 'HMS always on. Carriers for the Bonfire, the Covenant, the area and Game Mode; the nine stats read as attributes; HP, FP and Stamina as pools \u2014 the HUD owns your Stamina in fights \u2014 with Estus as flasks on the world card; Hollowing, Curse, Bleed, Poison and Frostbite as rising dangers. No phones. The world card shows your souls, your bloodstain, Estus, Humanity and the bonfire you rested at. Hard difficulty, engine-rule immersive fights.',
            data: { ...HMS_ON, uiTheme: 'darksouls', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true, difficulty: 'hard' },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP, FP, Stamina', healthPools: 'HP', invertedMeters: 'Hollowing, Curse, Bleed, Poison, Toxic, Frostbite', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: '' },
                    abilities: { enabled: true, attributes: 'VIG, VIT, ATT, END, STR, DEX, RES, INT, FTH, LCK',
                        vocabulary: 'Covenant: Covenant\nSpells: Sorceries, Miracles, Pyromancies, Spells, Attuned\nRings: Rings, Ring\nEquipment: Weapon, Shield, Armor, Catalyst\nEmbers: Humanity, Form, Hollowing\nRoles: Class, Origin, Title' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives, Lords of Cinder, Bells of Awakening, Lord Souls', journal: true },
                    carriers: 'Bonfire, Covenant, Arc, Memory, Game Mode',
                    selfClearing: 'Condition, [STATUS], [EVENT], Buildup',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: false, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: false },
                    survival: { enabled: false } } } },
        { id: 'w-skyrim', name: 'Skyrim \u2014 The Last Dragonborn', hms: true,
            desc: 'HMS always on. Carriers for the Hold, Quests, factions and Game Mode; Health, Magicka and Stamina as pools \u2014 the HUD owns yours in fights; shouts, skills, perks, the Standing Stone, powers and afflictions as abilities. No phones: couriers carry letters. Followers in the party. The world card shows your level, dragon souls, every shout\u2019s words, your skills, bounties by hold and carry weight. Arcs as chapters, engine-rule immersive fights. Switch the survival clock on for Survival Mode.',
            data: { ...HMS_ON, uiTheme: 'skyrim', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'Health, Magicka, Stamina, HP, MP', healthPools: 'Health, HP', invertedMeters: 'Hunger, Fatigue, Cold, Blood Starvation', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: 'Disease' },
                    abilities: { enabled: true, attributes: '',
                        vocabulary: 'Shouts: Shouts, Shout, [SHOUT]\nSkills: Skills\nPerks: Perks\nStanding Stone: Standing Stone\nSpells: Spells\nPowers: Powers, Racial Power\nFactions: Factions, Faction\nAfflictions: Affliction, [AFFLICTION], Vampirism, Lycanthropy\nRoles: Race, Title, Thane' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives, Main Quest, Side Quests, Miscellaneous', journal: true },
                    carriers: 'Hold, Quests, Factions, Arc, Memory, Game Mode',
                    selfClearing: 'Condition, [STATUS], [EVENT], Disease',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: true, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: false },
                    survival: { enabled: false } } } }
    ];
    const BUILTIN_STYLES = [
        { id: 'hms', name: 'HMS Narrative', desc: 'The default. HMS always on; your engine decides immersive fights; party and relationships tracked; the world card and chapters on; no survival clock.',
            data: { ...HMS_ON, 'positions.mode': 'off', 'worldCard': true, 'chapters.enabled': true, 'encounterSettings.style': 'engine', 'encounterSettings.fateDice': false, 'encounterSettings.companionsMayRefuse': true, 'hmsSystems.relations.enabled': true, 'hmsSystems.party.enabled': true, 'hmsSystems.survival.enabled': false, 'uiTheme': 'host', 'showDiceDisplay': true } },
        { id: 'dnd', name: 'D&D', desc: 'HMS always on, with full tabletop rules: your sheet and the roller, and turn-based fights with initiative, attack rolls against AC, damage dice, criticals, saving throws, spell slots and death saves. The extension rolls and does the math. The map tracks positions in fights.',
            data: { ...HMS_ON, 'encounterSettings.system': 'dnd', 'dnd.enabled': true, 'positions.mode': 'fights', 'encounterSettings.dnd': { deathSaves: true, crits: true, massiveDamage: true, obedienceRolls: true }, 'showDiceDisplay': true, 'hmsSystems.abilities.enabled': true, 'uiTheme': 'parchment' } },
        { id: 'power', name: 'Power scaling', desc: 'HMS always on. Immersive fights settled by power level, feats, hax and counters, with fate dice for close matches.',
            data: { ...HMS_ON, 'encounterSettings.style': 'power', 'encounterSettings.fateDice': true, 'positions.mode': 'fights', 'uiTheme': 'midnight' } },
        { id: 'story', name: 'Pure narrative', desc: 'HMS always on. No dice anywhere: no roller, no D&D, no fate dice. The fiction decides, and fights ask the story for the least \u2014 lightest on tokens.',
            data: { ...HMS_ON, 'positions.mode': 'off', 'encounterSettings.style': 'fiction', 'encounterSettings.fateDice': false, 'showDiceDisplay': false, 'dnd.enabled': false, 'immersive.moves': false, 'immersive.plans': false } },
        { id: 'gritty', name: 'Gritty survival', desc: 'HMS always on. Survival clock on, wounds flagged sooner, companions question orders, hard difficulty, engine-rule fights.',
            data: { ...HMS_ON, 'encounterSettings.difficulty': 'hard', 'positions.mode': 'fights', 'hmsSystems.survival.enabled': true, 'hmsSystems.survival.tellModel': true, 'hmsSystems.body.rawWarnHours': 48, 'encounterSettings.style': 'engine', 'encounterSettings.companionsMayRefuse': true, 'uiTheme': 'host' } },
        { id: 'social', name: 'Social & romance', desc: 'HMS always on. Relationships up front in the hearts layout, party moods and bonds tracked closely, the phone on.',
            data: { ...HMS_ON, 'positions.mode': 'off', 'hmsSystems.comms.enabled': true, 'hmsSystems.relations.enabled': true, 'hmsSystems.relations.layout': 'hearts', 'hmsSystems.party.enabled': true, 'hmsSystems.party.trackBond': true, 'hmsSystems.party.trackMask': true, 'uiTheme': 'sakura' } }
    ];
    const THEMES = [['host', 'Lumiverse (follow the app)'], ['rezero', 'Re:Zero (wiki)'], ['overlord', 'Overlord (wiki)'], ['cote', 'Classroom of the Elite (wiki)'], ['mushoku', 'Mushoku Tensei (wiki)'], ['undertale', 'Undertale'], ['darksouls', 'Dark Souls'], ['skyrim', 'Skyrim'],
        ['dnd', 'D&D'], ['heaven', 'Heaven'], ['horror', 'Horror'], ['hell', 'Hell'], ['space', 'Space'], ['parchment', 'Parchment'], ['midnight', 'Midnight'], ['terminal', 'Terminal'], ['sakura', 'Sakura']];

    function pathGet(o, path) { return path.split('.').reduce((a, k) => (a && typeof a === 'object' ? a[k] : undefined), o); }
    function pathSet(o, path, v) {
        const ks = path.split('.');
        let cur = o;
        for (const k of ks.slice(0, -1)) { if (!isObj(cur[k])) cur[k] = {}; cur = cur[k]; }
        const last = ks[ks.length - 1];
        // Deep: a preset changes what it names and leaves everything else as you had it.
        const merge = (base, add) => {
            if (!isObj(base) || !isObj(add)) return JSON.parse(JSON.stringify(add));
            const out = { ...base };
            for (const [k, x] of Object.entries(add)) out[k] = isObj(x) && isObj(base[k]) ? merge(base[k], x) : JSON.parse(JSON.stringify(x));
            return out;
        };
        cur[last] = merge(cur[last], v);
    }
    // A preset changes only what it names. A section it names is merged into yours, not swapped for it:
    // your chapter budget, your D&D rules and your XP curve stay as you set them.
    function applyStyle(data) {
        const s = S();
        const merge = (dst, src) => { for (const [k, v] of Object.entries(src)) { if (isObj(v) && isObj(dst[k])) merge(dst[k], v); else dst[k] = clone(v); } return dst; };
        for (const [path, v] of Object.entries(data || {})) {
            const cur = pathGet(s, path);
            if (isObj(v) && isObj(cur)) merge(cur, v);
            else pathSet(s, path, clone(v));
        }
        saveSettings(false);
        render();
    }
    function captureStyle() {
        const s = S(), out = {};
        for (const path of STYLE_PATHS) { const v = pathGet(s, path); if (v !== undefined) out[path] = JSON.parse(JSON.stringify(v)); }
        return out;
    }
    function themeClass() {
        const s = S() || {};
        const t = s.uiTheme;
        return (t && t !== 'host' ? ' theme-' + t : '') + (s.uiDensity === 'compact' ? ' density-compact' : '') + (s.uiTextSize && s.uiTextSize !== 'normal' ? ' text-' + s.uiTextSize : '');
    }

    function renderStyleSettings() {
        const s = S();
        if (!isObj(s.stylePresets)) s.stylePresets = { presets: {}, active: 'hms' };
        const sp = s.stylePresets;
        const user = Object.entries(sp.presets || {}).map(([id, p]) => ({ id, ...p })).sort((a, b) => String(a.name).localeCompare(String(b.name)));
        const sel = h('select', { 'aria-label': 'Play style preset', onchange: (e) => { state.stylePick = e.target.value; render(); } },
            h('optgroup', { label: 'Worlds' }, WORLD_STYLES.map(b => h('option', { value: b.id }, b.name))),
            h('optgroup', { label: 'Play styles' }, BUILTIN_STYLES.map(b => h('option', { value: b.id }, b.name))),
            user.length ? h('optgroup', { label: 'Yours' }, user.map(u => h('option', { value: 'user:' + u.id }, u.name))) : null);
        const pick = state.stylePick || sp.active || 'hms';
        sel.value = pick;
        const chosen = pick.startsWith('user:') ? user.find(u => 'user:' + u.id === pick) : [...WORLD_STYLES, ...BUILTIN_STYLES].find(b => b.id === pick);
        const nameIn = h('input', { type: 'text', placeholder: 'Name your preset', 'aria-label': 'Preset name', style: 'flex:1;min-width:0' });
        const themeSel = h('select', { 'aria-label': 'Panel theme', onchange: (e) => { s.uiTheme = e.target.value; saveSettings(false); render(); } }, THEMES.map(([v, l]) => h('option', { value: v }, l)));
        themeSel.value = s.uiTheme || 'host';
        return section('s-style', 'Play style', state.open, chosen ? chosen.name : null,
            h('p', { class: 'rpgc-note' }, 'One click sets fights, trackers and the look to fit how you want to play. Everything stays adjustable afterwards.'),
            h('div', { class: 'rpgc-row' }, sel, h('button', { class: 'rpgc-btn primary', disabled: chosen ? null : true, onclick: () => { if (!chosen) return; sp.active = pick; applyStyle(chosen.data); } }, 'Apply')),
            chosen ? h('p', { class: 'rpgc-note' }, chosen.desc || (chosen.at ? `Saved ${new Date(chosen.at).toLocaleString()}.` : '')) : null,
            chosen && pick.startsWith('user:') ? h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn', title: 'Overwrite it with your current settings', onclick: () => { sp.presets[chosen.id] = { ...sp.presets[chosen.id], data: captureStyle(), at: Date.now() }; saveSettings(false); render(); } }, 'Update from current'),
                h('button', { class: 'rpgc-btn danger', onclick: () => { delete sp.presets[chosen.id]; state.stylePick = 'hms'; saveSettings(false); render(); } }, 'Delete')) : null,
            h('div', { class: 'rpgc-row' }, nameIn, h('button', { class: 'rpgc-btn', onclick: () => {
                const n = nameIn.value.trim();
                if (!n) return;
                const id = 'p' + Date.now().toString(36);
                sp.presets[id] = { name: n.slice(0, 40), data: captureStyle(), at: Date.now() };
                sp.active = 'user:' + id; state.stylePick = 'user:' + id;
                saveSettings(false); render();
            } }, 'Save current as preset')),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Theme'), themeSel),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Density'), (() => { const x = h('select', { 'aria-label': 'Panel density', onchange: (e) => { s.uiDensity = e.target.value; saveSettings(false); render(); } }, h('option', { value: 'comfortable' }, 'Comfortable'), h('option', { value: 'compact' }, 'Compact')); x.value = s.uiDensity || 'comfortable'; return x; })()),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Text size'), (() => { const x = h('select', { 'aria-label': 'Text size', onchange: (e) => { s.uiTextSize = e.target.value; saveSettings(false); render(); } }, h('option', { value: 'small' }, 'Small'), h('option', { value: 'normal' }, 'Normal'), h('option', { value: 'large' }, 'Large')); x.value = s.uiTextSize || 'normal'; return x; })()));
    }

    /** Classic chats: the People, Phone and Party parts of the systems settings, nothing that needs a HUD. */
    function renderSocialSettings() {
        const secEl = renderHmsSystemsSettings();
        secEl.querySelector('summary').childNodes[0].textContent = 'People, party & phone';
        const body = secEl.querySelector('.rpgc-body') || secEl;
        let keep = false;
        for (const el of [...body.children]) {
            if (el.classList.contains('rpgc-subhead')) keep = ['People', 'Phone', 'Party'].includes(el.textContent);
            else if (el.tagName === 'P' && !keep && !el.previousElementSibling) { el.textContent = 'Everyone you deal with, your party, and any way you have to reach people. In a chat without a HUD they are read from the tracker reply.'; continue; }
            if (!keep && !(el.tagName === 'P' && !el.previousElementSibling)) el.remove();
        }
        return secEl;
    }

    // ─────────── Test zone ───────────

    const SANDBOX_ID = '__rpgc_test_zone__';
    function enterSandbox() {
        state.sandbox = true;
        state.chatId = SANDBOX_ID;
        state.characterId = null;
        state.view = 'sandbox';
        state.hms = null; state.extras = null;
        state.data = { userStats: null, infoBox: null, characters: null };
        render();
        send({ type: 'get_state', chatId: SANDBOX_ID });
    }
    function leaveSandbox() {
        state.sandbox = false;
        state.chatId = null; state.characterId = null;
        state.view = 'trackers';
        state.hms = null; state.extras = null; state.sandboxInfo = null;
        syncChat();
        render();
    }
    function renderSandbox() {
        const info = state.sandboxInfo || { none: true };
        const out = [topBar()];
        const worldSel = h('select', { 'aria-label': 'Test world', onchange: (e) => { state.tzWorld = e.target.value; } },
            h('option', { value: 'rezero' }, 'Re:Zero'), h('option', { value: 'overlord' }, 'Overlord'), h('option', { value: 'cote' }, 'Classroom of the Elite'), h('option', { value: 'mushoku' }, 'Mushoku Tensei'), h('option', { value: 'undertale' }, 'Undertale'), h('option', { value: 'darksouls' }, 'Dark Souls'), h('option', { value: 'skyrim' }, 'Skyrim'), h('option', { value: 'classic' }, 'A classic chat (no HUD)'));
        worldSel.value = state.tzWorld || info.world || 'rezero';
        const modeSel = h('select', { 'aria-label': 'Test mode', onchange: (e) => { state.tzMode = e.target.value; if (!info.none) send({ type: 'sandbox_mode', chatId: SANDBOX_ID, mode: e.target.value }); } },
            h('option', { value: 'demo' }, 'Demo — scripted turns, no tokens'), h('option', { value: 'live' }, 'Live — your model plays the world'));
        modeSel.value = state.tzMode || info.mode || 'demo';
        const start = () => send({ type: 'sandbox_start', chatId: SANDBOX_ID, world: worldSel.value, mode: modeSel.value });
        const box = [h('div', { class: 'rpgc-tz-banner' }, h('strong', null, 'Test zone'), h('span', null, 'A practice chat inside the extension. Everything runs exactly as in a real chat — prompts, replies, the guard, fights, the phone — and none of it touches your chats.')),
            h('div', { class: 'rpgc-row' }, worldSel, modeSel),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', disabled: info.busy ? true : null, onclick: start }, info.none ? 'Start' : 'Start over'),
                !info.none ? h('button', { class: 'rpgc-btn danger', onclick: () => send({ type: 'sandbox_reset', chatId: SANDBOX_ID }) }, 'Clear') : null)];
        if (!info.none) {
            box.push(h('p', { class: 'rpgc-note' }, `${info.worldName || info.world} · ${info.mode === 'live' ? 'Live: replies cost tokens' : 'Demo: scripted, free'}${info.busy ? ' · writing…' : ''}`));
            box.push(h('div', { class: 'rpgc-tz-log', role: 'log' }, (info.messages || []).map(m => h('div', { class: 'msg ' + m.role },
                h('span', { class: 'who' }, m.role === 'user' ? 'You' : 'Story'), m.hud ? h('span', { class: 'rpgc-chip', title: 'This reply carried a WORLD STATE HUD' }, 'HUD') : null, h('span', { class: 'txt' }, m.text || '…')))));
            const input = h('input', { type: 'text', placeholder: 'Act or speak, as in a real chat…', 'aria-label': 'Your turn in the test zone', style: 'flex:1;min-width:0' });
            const say = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'sandbox_say', chatId: SANDBOX_ID, text: v }); };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); say(); } });
            box.push(h('div', { class: 'rpgc-row' }, input, h('button', { class: 'rpgc-btn primary', disabled: info.busy ? true : null, onclick: say }, 'Send')));
            box.push(h('div', { class: 'rpgc-row' },
                info.mode !== 'live' ? h('button', { class: 'rpgc-btn', disabled: info.busy ? true : null, onclick: () => send({ type: 'sandbox_say', chatId: SANDBOX_ID, text: 'Continue.' }) }, 'Next turn') : null,
                h('button', { class: 'rpgc-btn', onclick: openFightChooser }, 'Test a fight'),
                h('button', { class: 'rpgc-btn', onclick: () => { for (const k of ['phone', 'people', 'party']) state.open[k] = true; render(); } }, 'Open phone, people & party')));
        }
        out.push(h('div', { class: 'rpgc-tz' }, box));
        if (!info.none) out.push(...renderTrackers().slice(1));
        return out;
    }

    // ─────────── Injuries, on the Re:Zero HUD's injury law, for HUDs that do not keep wounds ───────────
    function renderInjuries() {
        const iv = state.injuries;
        if (!iv || !iv.on || iv.hudOwns) return null;          // a HUD with its own wounds: the Body card shows them
        const STATUS = { raw: ['Raw', 'hot'], treated: ['Treated', 'warm'], permanent: ['\uD83D\uDD12 Permanent', 'perm'], scar: ['Scar', ''] };
        const out = [];
        if (iv.list.length) out.push(h('div', { class: 'rpgc-injuries' }, iv.list.map(x => {
            const [label, cls] = STATUS[x.status] || STATUS.raw;
            const d = Number.isFinite(x.inStatus) ? x.inStatus : null;
            return h('div', { class: `rpgc-injury ${x.severity} ${x.status}` },
                h('div', { class: 'rpgc-wrow' },
                    h('span', { class: 'rpgc-chip ' + cls }, label),
                    x.where ? h('b', null, x.where) : null,
                    h('span', null, x.what),
                    h('span', { class: 'rpgc-chip' }, `${x.severity}${x.kind && x.kind !== 'wound' && x.kind !== 'other' ? ' ' + x.kind : ''}`),
                    d !== null ? h('span', { class: 'rpgc-note' }, `${label.replace(/^\S+ /, '')} for ${fmtSpan(d) || 'moments'}`) : null),
                x.status === 'treated' && x.window ? h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Healing'), levelBar(x.progress || 0, x.progress >= 100 ? 'ok' : 'low'),
                    h('span', { class: 'val' }, `${x.window[0]}\u2013${x.window[1]} days`)) : null,
                x.warn ? h('p', { class: 'rpgc-status warning', role: 'status' }, x.warn) : null,
                x.note ? h('p', { class: 'rpgc-note' }, x.note) : null,
                h('div', { class: 'rpgc-row' },
                    x.status === 'raw' ? h('button', { class: 'rpgc-mini', title: 'Bandaged, splinted, stitched: basic field care', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'treat', key: x.key }) }, 'Treated') : null,
                    x.status === 'treated' ? h('button', { class: 'rpgc-mini', title: 'Torn open again: back to raw', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'treat', key: x.key }) }, 'Back to raw') : null,
                    x.status === 'raw' || x.status === 'treated' ? h('button', { class: 'rpgc-mini', title: 'Healed: take it off the list', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'heal', key: x.key }) }, 'Healed') : null,
                    (x.status === 'raw' || x.status === 'treated') && x.severity !== 'minor' ? h('button', { class: 'rpgc-mini', title: 'Healed, but it left a mark: cosmetic, no penalty', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'heal', key: x.key, scar: true }) }, 'Healed with a scar') : null,
                    x.status === 'raw' || x.status === 'treated' ? h('button', { class: 'rpgc-mini', title: 'Lost for good: time will not heal it', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'permanent', key: x.key }) }, 'Permanent') : null,
                    x.status === 'scar' || x.status === 'permanent' ? h('button', { class: 'rpgc-mini', title: 'Take it off the list (a healer undid it)', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'heal', key: x.key }) }, 'Remove') : null));
        })));
        else out.push(h('p', { class: 'rpgc-note' }, 'Unhurt. When you are injured, the story reports it here.'));
        const where = h('input', { type: 'text', placeholder: 'Where', 'aria-label': 'Where the injury is', size: '10' });
        const what = h('input', { type: 'text', placeholder: 'What happened', 'aria-label': 'The injury' });
        const kind = h('select', { 'aria-label': 'What kind' }, ...['wound', 'fracture', 'sprain', 'burn', 'internal', 'other'].map(k => h('option', { value: k }, k)));
        const sev = h('select', { 'aria-label': 'How bad' }, ...['minor', 'moderate', 'severe', 'critical'].map(k => h('option', { value: k }, k)));
        const add = () => { if (!what.value.trim()) return; send({ type: 'injury', chatId: state.chatId, op: 'add', where: where.value, what: what.value, kind: kind.value, severity: sev.value }); where.value = ''; what.value = ''; };
        what.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        out.push(h('div', { class: 'rpgc-add' }, where, what, kind, sev, h('button', { class: 'rpgc-btn', onclick: add }, 'Add')));
        out.push(h('p', { class: 'rpgc-note' }, 'How wounds work here: raw until tended, treated is not healed, each kind and severity heals in its own time, a break left unset 3\u20134 days heals crooked for good, and a healed wound may leave a scar. ',
            iv.tell ? 'The story is told these with every message.' : 'Only you see these \u2014 switch on \u201CTell the story about them\u201D under HMS systems \u2192 Injuries to send them.'));
        const worst = iv.list.some(x => x.status === 'raw' && (x.severity === 'critical' || x.warn)) ? 'raw' : iv.list.length ? String(iv.list.filter(x => x.status !== 'scar').length || iv.list.length) : null;
        return section('injuries', 'Injuries', state.open, worst, ...out);
    }

    // ─────────── 1.9.11: the plot and your objectives, on top of the quests ───────────
    function renderPlotObjectives() {
        const pv = state.plotView;
        if (!pv) return [];
        const out = [];
        const STATE_LABEL = { open: 'open', advanced: 'moved', resolved: 'resolved' };
        if (pv.on.plot && (pv.now || pv.threads.length || pv.resolved.length)) {
            out.push(h('div', { class: 'rpgc-set rpgc-plot' }, h('h4', null, 'The plot'),
                pv.now ? h('p', { class: 'rpgc-plotnow' }, pv.now) : null,
                pv.threads.length ? h('ul', { class: 'rpgc-threads' }, pv.threads.map(t => h('li', { class: t.state },
                    h('span', { class: 'rpgc-chip ' + (t.state === 'advanced' ? 'ok' : t.state === 'resolved' ? '' : 'hot') }, STATE_LABEL[t.state] || t.state), ' ', h('b', null, t.name), t.note ? h('span', { class: 'rpgc-note' }, ` \u2014 ${t.note}`) : null))) : null,
                pv.resolved.length ? (() => {
                    const d = h('details', { class: 'rpgc-spells' }, h('summary', null, `Resolved (${pv.resolved.length})`), h('ul', { class: 'rpgc-threads' }, pv.resolved.map(t => h('li', { class: 'resolved' }, h('b', null, t.name), t.note ? h('span', { class: 'rpgc-note' }, ` \u2014 ${t.note}`) : null))));
                    d.open = !!state.open['plot-resolved']; d.dataset.openKey = 'plot-resolved'; d.addEventListener('toggle', () => { state.open['plot-resolved'] = d.open; }); return d;
                })() : null));
        }
        if (pv.on.objectives) {
            const ICON = { active: '\u25B8', done: '\u2713', failed: '\u2717' };
            const input = h('input', { type: 'text', placeholder: 'Add an objective of your own', 'aria-label': 'Add an objective of your own' });
            const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'objective_mine', chatId: state.chatId, op: 'add', text: v }); };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
            out.push(h('div', { class: 'rpgc-set rpgc-objectives' }, h('h4', null, 'Objectives'),
                pv.objectives.length ? h('ul', { class: 'rpgc-checklist' }, pv.objectives.map(o => h('li', { class: o.state === 'done' ? 'met' : o.state === 'active' ? 'active' : 'failed' },
                    h('span', { 'aria-hidden': 'true' }, ICON[o.state] || '\u25B8'), ` ${o.text}`, o.quest ? h('span', { class: 'rpgc-chip' }, o.quest) : null))) : null,
                pv.mine.length ? h('ul', { class: 'rpgc-checklist mine' }, pv.mine.map(o => h('li', { class: o.done ? 'met' : '' },
                    (() => { const cb = h('input', { type: 'checkbox', 'aria-label': `Done: ${o.text}` }); cb.checked = !!o.done; cb.addEventListener('change', () => send({ type: 'objective_mine', chatId: state.chatId, op: 'toggle', id: o.id })); return cb; })(),
                    ` ${o.text} `, h('button', { class: 'rpgc-mini', 'aria-label': `Remove: ${o.text}`, onclick: () => send({ type: 'objective_mine', chatId: state.chatId, op: 'remove', id: o.id }) }, '\u2715')))) : null,
                !pv.objectives.length && !pv.mine.length ? h('p', { class: 'rpgc-note' }, 'What you are trying to do right now shows here as the story sets it. Your own go below, just for you.') : null,
                h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add'))));
        }
        return out;
    }

    // ─────────── 1.9.5: a card of its own for each of the four worlds ───────────

    const ladderBar = (step, total) => {
        const wrap = h('span', { class: 'rpgc-ladder', role: 'img', 'aria-label': `step ${step + 1} of ${total}` });
        for (let i = 0; i < total; i++) wrap.appendChild(h('i', { class: i <= step ? 'on' : '' }));
        return wrap;
    };
    const fmtLeft = (m) => {
        if (m === null || m === undefined) return null;
        if (m < 0) return `${fmtSpan(-m) || 'moments'} past`;
        return `${fmtSpan(m) || 'under a minute'} left`;
    };
    const loreNote = (text) => text ? h('p', { class: 'rpgc-note rpgc-wlore' }, text) : null;
    const wDetails = (key, summary, ...body) => {
        const det = h('details', { class: 'rpgc-spells' }, h('summary', null, summary), ...body);
        det.open = !!state.open[key];
        det.dataset.openKey = key; det.addEventListener('toggle', () => { state.open[key] = det.open; });
        return det;
    };
    // A school or style on its rank ladder; open it to see what each rank you hold lets you use.
    const rankedList = (title, list, keyPrefix, noun) => h('div', { class: 'rpgc-set' }, h('h4', null, title),
        ...list.map(m => {
            const row = h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, m.name), m.step !== null ? ladderBar(m.step, 7) : null, h('span', { class: 'val' }, m.rank));
            if (!m.spells || !m.spells.length) return row;
            return wDetails(keyPrefix + m.name, row,
                ...m.spells.map(r => h('p', { class: 'rpgc-note' }, h('b', null, `${r.rank}: `), r.spells.join(' \u00B7 '))),
                m.nextRank ? h('p', { class: 'rpgc-note next' }, h('b', null, `Next \u2014 ${m.nextRank.rank}: `), m.nextRank.spells.join(' \u00B7 ')) : null);
        }),
        list.some(m => m.spells && m.spells.length) ? h('p', { class: 'rpgc-note' }, `Open one to see the ${noun} you have, from your own index.`) : null);
    const stageLadder = (label, s) => {
        if (!s) return null;
        const n = s.stages.length || 5;
        const cur = s.stages.find(x => x.stage === s.stage);
        const next = s.stages.find(x => x.stage === (s.stage || 0) + 1);
        return h('div', { class: 'rpgc-set' },
            h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, label), s.stage ? ladderBar(s.stage - 1, n) : null, h('b', null, `${s.pct}%`), h('span', null, cur ? `Stage ${cur.stage}: ${cur.name}` : s.text)),
            cur && cur.note ? h('p', { class: 'rpgc-note' }, cur.note) : null,
            next ? h('p', { class: 'rpgc-note next' }, `Next \u2014 Stage ${next.stage}: ${next.name} (${next.lo === next.hi ? `${next.lo}%` : `${Math.min(next.lo, next.hi)}\u2013${Math.max(next.lo, next.hi)}%`})`) : null);
    };
    const wRow = (label, ...value) => h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, label), h('span', { class: 'val' }, ...value));

    function renderWorldCard() {
        const w = state.world;
        if (!w || !w.id || S()?.worldCard === false) return null;
        const out = [];
        if (w.id === 'rezero') {
            if (w.deaths !== null || w.savePoint || w.scent) out.push(h('div', { class: 'rpgc-wgrid' },
                w.deaths !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.deaths)), h('span', null, 'deaths')) : null,
                w.scent ? h('div', { class: 'rpgc-wstat' }, h('b', null, w.scent), h('span', null, 'witch\u2019s scent')) : null,
                w.loops.current ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.loops.current)), h('span', null, 'current loop')) : null));
            if (w.savePoint) out.push(wRow('Save point', w.savePoint));
            if (!w.loops.tracking && w.deaths !== null) out.push(h('p', { class: 'rpgc-note' }, 'Switch on Loops under Settings \u2192 Chapters and every life is kept: how it ended, and what you uncovered.'));
            if (w.loops.ended.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'How each life ended'),
                h('ol', { class: 'rpgc-wlist', reversed: true }, w.loops.ended.map(l => h('li', null, h('b', null, `Loop ${l.no || '?'}`), ` \u2014 ${l.ended || l.title}`)))));
            if (w.loops.known) out.push(h('p', { class: 'rpgc-note' }, `You carry ${w.loops.known} thing${w.loops.known === 1 ? '' : 's'} from earlier loops \u2014 see Chapters.`));
            for (const a of w.authorities) out.push(h('div', { class: 'rpgc-wability' },
                h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' }, 'Authority'), h('b', null, a.name), h('span', { class: 'rpgc-chip ' + (/awakened/i.test(a.state) ? 'ok' : 'hot') }, a.state), a.power ? h('span', { class: 'rpgc-note' }, a.power) : null),
                loreNote(a.lore)));
            for (const p of w.protections) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' }, 'Divine Protection'), h('b', null, p.name)), loreNote(p.lore)));
            if (w.contracts.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Spirit contracts'),
                ...w.contracts.map(c => h('div', { class: 'rpgc-wability' },
                    h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, c.name), c.step >= 0 ? ladderBar(c.step, 5) : null, h('span', { class: 'val' }, c.rank)),
                    c.means ? loreNote(c.means) : null))));
            if (w.affinity) out.push(wRow('Spirit affinity', h('b', null, w.affinity)));
            if (w.magic) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Magic'),
                wRow('Element', ...w.magic.elements.map(e => h('span', { class: 'rpgc-chip' }, e))),
                h('div', { class: 'rpgc-wability' }, wRow('Gate', h('b', null, w.magic.gate)), loreNote(w.magic.gateMeans)),
                h('div', { class: 'rpgc-wability' }, wRow('Pool', h('b', null, w.magic.pool)), loreNote(w.magic.poolMeans)),
                ...w.magic.spells.map(sp => wDetails('rz-spells-' + sp.element, h('span', null, `${sp.element} spells`),
                    ...sp.series.map(se => h('p', { class: 'rpgc-note' }, h('b', null, `${se.name}: `), ...se.spells.map((x, i) => h('span', { title: x.text }, (i ? ' \u00B7 ' : '') + x.name))))))));
            out.push(stageLadder('Od Integrity', w.od));
            out.push(stageLadder('Corruption', w.corruption));
            for (const cu of w.curses || []) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind hot' }, 'Curse'), h('b', null, cu.name)), loreNote(cu.lore)));
            if (w.council.length) out.push(wRow('Mental Council', ...w.council.map(x => h('span', { class: 'rpgc-chip' }, x.sin ? `${x.name} \u00B7 ${x.sin}` : x.name))));
            if (w.arc0) {
                const pct = (w.arc0.year + 20) / 20 * 100;
                const bar = h('div', { class: 'rpgc-arc0', role: 'img', 'aria-label': `Year ${w.arc0.year} of the prequel, ${-w.arc0.year} years before Arc 1` },
                    ...w.arc0.marks.map(m => h('span', { class: 'mark', style: `left:${(m.year + 20) / 20 * 100}%`, title: `Year ${m.year}: ${m.text}` })),
                    h('i', { style: `left:${pct}%` }));
                out.push(h('div', { class: 'rpgc-set' }, h('h4', null, w.arc0.part ? `Arc 0 \u2014 Part ${w.arc0.part}${w.arc0.partName ? `: ${w.arc0.partName}` : ''}` : 'Arc 0 \u2014 the prequel years'),
                    bar, h('div', { class: 'rpgc-wrow' }, h('span', null, 'Year \u221220'), h('b', { style: 'margin:0 auto' }, `Year ${w.arc0.year} \u00B7 ${w.arc0.year === 0 ? 'the eve of Arc 1' : `${-w.arc0.year} year${w.arc0.year === -1 ? '' : 's'} before Arc 1`}`), h('span', null, 'Year 0')),
                    h('ul', { class: 'rpgc-wlist' }, w.arc0.marks.map(m => h('li', { class: m.year <= w.arc0.year ? 'past' : '' }, h('b', null, `Year ${m.year}`), ` \u2014 ${m.text}`)))));
            }
            if (w.theater) out.push(h('div', { class: 'rpgc-set rpgc-theater' }, h('h4', null, 'The Theater of Despair'),
                w.theater.reel ? wRow('Now playing', h('b', null, w.theater.season ? `Season ${w.theater.season}, episode ${w.theater.episode}${w.theater.cut ? ` (${w.theater.cut})` : ''}` : w.theater.reel)) : null,
                w.theater.scene ? wRow('Scene', w.theater.scene) : null,
                w.theater.star ? wRow('Screen star', w.theater.star) : null,
                w.theater.audience.length ? wRow('Audience', w.theater.audience.join(', ')) : null,
                w.theater.memory ? wRow('Memory', w.theater.memory) : null));
        } else if (w.id === 'overlord') {
            if (w.overall !== null) out.push(h('div', { class: 'rpgc-wgrid' },
                h('div', { class: 'rpgc-wstat' }, h('b', null, `${w.overall}`), h('span', null, 'overall level')),
                w.racialSum ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.racialSum)), h('span', null, 'racial')) : null,
                w.job !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.job)), h('span', null, 'job')) : null));
            if (w.overall !== null) out.push(levelBar(Math.min(100, w.overall), 'ok'));
            if (w.levelsAddUp === false) out.push(h('p', { class: 'rpgc-status warning' }, `The HUD's levels do not add up: racial ${w.racialSum} + job ${w.job} is not ${w.overall}.`));
            if (w.checks && w.checks.length) out.push(h('div', { class: 'rpgc-status warning', role: 'status' }, h('b', null, 'Framework check'),
                h('ul', { class: 'rpgc-wlist' }, w.checks.map(c => h('li', null, c)))));
            if (w.race) out.push(wRow('Race', h('b', null, w.race), w.category ? h('span', { class: 'rpgc-chip' }, w.category) : null, w.origin ? h('span', { class: 'rpgc-note' }, w.origin) : null));
            if (w.racial.length) out.push(wRow('Racial', w.racial.map(t => `${t.name} ${t.lv}`).join(' \u2192 ')));
            if (w.classes.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Job classes'),
                ...w.classes.map(t => h('div', { class: 'rpgc-wrow' + (t.info && t.info.legendary ? ' legendary' : '') },
                    h('span', { class: 'lbl' }, t.name),
                    t.info && t.info.max ? levelBar(Math.min(100, t.lv / t.info.max * 100), t.lv >= t.info.max ? 'ok' : 'low') : null,
                    h('span', { class: 'val' }, t.info && t.info.max ? `${t.lv} / ${t.info.max}` : String(t.lv)),
                    t.info ? h('span', { class: 'rpgc-chip' + (t.info.legendary ? ' legendary' : '') }, t.info.tier) : null))));
            if (w.traditions && w.traditions.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Traditions'),
                ...w.traditions.map(t => {
                    const row = h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, t.name), ladderBar(Math.min(10, t.lv) - 1, 10), h('span', { class: 'rpgc-chip' + (t.lv >= 11 ? ' ok' : '') }, `LV ${t.lv}${t.lv >= 11 ? ' \u00B7 super-tier' : ''}`));
                    if (!t.spells || !t.spells.length) return row;
                    return wDetails('ov-spells-' + t.name, row, ...t.spells.map(s => h('p', { class: 'rpgc-note' }, h('b', null, `${s.tier === 11 ? 'Super-Tier' : `Tier ${s.tier}`}: `), s.spells.join(' \u00B7 '))));
                }),
                w.traditions.some(t => t.spells && t.spells.length) ? h('p', { class: 'rpgc-note' }, 'Open a tradition to see its spells up to your LV, from your own magic core.') : null));
            if (w.karma && w.karma.value !== null) {
                const pct = Math.max(0, Math.min(100, (w.karma.value + 500) / 10));
                out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Karma'),
                    h('span', { class: 'rpgc-karma', role: 'meter', 'aria-valuemin': '-500', 'aria-valuemax': '500', 'aria-valuenow': String(w.karma.value) }, h('i', { style: `left:${pct}%` })),
                    h('span', { class: 'val' }, `${w.karma.value}${w.karma.label ? ` \u00B7 ${w.karma.label}` : ''}`)));
            }
            if (w.superTier) out.push(wRow('Super-Tier', h('b', null, `${w.superTier.cur} / ${w.superTier.max}`), w.superTier.cooldown ? h('span', { class: 'rpgc-chip' + (/active/i.test(w.superTier.cooldown) ? ' hot' : '') }, w.superTier.cooldown) : null));
            if (w.role) out.push(wRow('Role', h('b', null, w.role)));
            if (w.adventurer) out.push(wRow('Adventurer', h('b', null, w.adventurer.rank), w.adventurer.team ? ` \u00B7 ${w.adventurer.team}` : ''));
            if (w.worker) out.push(wRow('Worker', w.worker));
            for (const it of w.worldItems) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' }, 'World Item'), h('b', null, it.name)), loreNote(it.lore)));
        } else if (w.id === 'cote') {
            if (w.calendar) out.push(wRow('Calendar', h('b', null, `Year ${w.calendar.year} \u00B7 Month ${w.calendar.month}`), ` \u00B7 ${w.calendar.date}`,
                h('span', { class: 'rpgc-chip', title: 'Class Points are announced on the first of the month' }, `announcement ${w.calendar.next} \u2014 in ${w.calendar.daysToNext} day${w.calendar.daysToNext === 1 ? '' : 's'}`)));
            if (w.cohort) out.push(wRow('Cohort', h('b', null, w.cohort), w.standing ? ` \u00B7 ${w.standing}` : '', w.seat ? ` \u00B7 seat ${w.seat}` : ''));
            if (w.standings && w.standings.rows.length) {
                const max = Math.max(1, ...w.standings.rows.map(r => r.cp || 0));
                out.push(h('div', { class: 'rpgc-set' }, h('h4', null, `Standings \u00B7 ${w.standings.date}`),
                    ...w.standings.rows.map(r => h('div', { class: 'rpgc-wrow' + (r.mine ? ' mine' : '') },
                        h('span', { class: 'lbl' }, `${r.callsign} (${r.letter})`), levelBar(Math.max(0, (r.cp || 0) / max * 100), r.mine ? 'ok' : 'low'),
                        h('span', { class: 'val' }, `${fmtNum(r.cp)}${r.delta ? ` (${r.delta > 0 ? '+' : '\u2212'}${fmtNum(Math.abs(r.delta))})` : ''}`))),
                    w.standings.since ? h('p', { class: 'rpgc-note' }, `Changes since ${w.standings.since}.`) : null));
            }
            if (w.pp) out.push(wRow('Private Points', h('b', null, fmtNum(w.pp.value)), w.pp.delta ? h('span', { class: 'delta ' + (w.pp.delta < 0 ? 'down' : 'up') }, ` ${w.pp.delta > 0 ? '+' : '\u2212'}${fmtNum(Math.abs(w.pp.delta))}`) : null));
            if (w.surveillance) out.push(wRow('Surveillance', h('span', { class: 'rpgc-chip ' + (w.surveillance.watched ? 'hot' : 'ok') }, w.surveillance.state), w.surveillance.source ? h('span', { class: 'rpgc-note' }, ` ${w.surveillance.source}`) : null));
            for (const f of w.flags) if (f.alarm) out.push(h('p', { class: 'rpgc-status warning', role: 'status' }, f.text));
            if (w.exam) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, w.exam.name), levelBar(Math.min(100, w.exam.day / Math.max(1, w.exam.of) * 100), 'ok'),
                h('p', { class: 'rpgc-note' }, `Day ${w.exam.day} of ${w.exam.of}${w.exam.state ? ` \u00B7 ${w.exam.state}` : ''}`)));
            if (w.oaa.length) out.push(wRow('OAA', ...w.oaa.map(o => h('span', { class: 'rpgc-chip' }, `${o.name} ${o.grade}`))));
            if (w.protection) out.push(wRow('Protection Point', w.protection));
            const g = w.godmother;
            if (g) {
                const left = g.decree ? fmtLeft(g.decree.minutesLeft) : null;
                out.push(h('div', { class: 'rpgc-set rpgc-godmother' }, h('h4', null, `The Godmother \u00B7 Lv ${g.level}`),
                    g.xpMax ? h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'XP'), levelBar(Math.min(100, g.xp / g.xpMax * 100), 'ok'), h('span', { class: 'val' }, `${fmtNum(g.xp)} / ${fmtNum(g.xpMax)} \u00B7 ${g.sp} SP \u00B7 ${g.sk} SK`)) : null,
                    g.stats.length ? wRow('Stats', g.stats.map(s => `${s.name} ${s.value}`).join(' \u00B7 ')) : null,
                    g.decree ? h('div', { class: 'rpgc-decree' + (g.decree.minutesLeft !== null && g.decree.minutesLeft <= 120 ? ' urgent' : '') },
                        h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Decree'), h('b', null, g.decree.name)),
                        h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Midnight'), h('span', null, g.decree.due), left ? h('span', { class: 'rpgc-chip ' + (g.decree.minutesLeft <= 120 ? 'hot' : '') }, left) : null),
                        g.conditions.length ? h('ul', { class: 'rpgc-checklist' }, g.conditions.map(c => h('li', { class: c.state }, h('span', { 'aria-hidden': 'true' }, c.state === 'met' ? '\u2713' : c.state === 'active' ? '\u25B8' : '\u25CB'), ` ${c.text}`))) : null) : null,
                    g.owed !== null ? wRow('Owed', h('b', null, fmtNum(g.owed))) : null,
                    g.reckoning ? h('p', { class: 'rpgc-status warning' }, `Reckoning: ${g.reckoning.name} \u2014 ${g.reckoning.at}`) : null));
            }
            const d = w.database;
            if (d) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'School Database'),
                h('div', { class: 'rpgc-dnd-abils' }, d.stats.map(s => {
                    const prof = d.proficient.some(p => p.toLowerCase() === s.name.toLowerCase());
                    const def = d.deficient.some(p => p.toLowerCase() === s.name.toLowerCase());
                    return h('div', { class: 'rpgc-dnd-abil hud', title: prof ? 'Proficient' : def ? 'Deficient' : s.name },
                        h('span', { class: 'ab' }, s.name), h('span', { class: 'mod' }, `${s.grade} ${s.mod >= 0 ? '+' : '\u2212'}${Math.abs(s.mod)}`),
                        prof ? h('span', { class: 'rpgc-chip ok' }, `prof${d.pb ? ' ' + (d.pb >= 0 ? '+' : '') + d.pb : ''}`) : def ? h('span', { class: 'rpgc-chip hot' }, 'deficient') : null);
                })),
                d.defect ? h('p', { class: 'rpgc-note' }, `Defect: ${d.defect.name} \u2014 ${d.defect.when}`) : null,
                h('p', { class: 'rpgc-note' }, 'The engine rolls these itself; the sheet is read from its block.')));
        } else if (w.id === 'mushoku') {
            if (w.year !== null) out.push(h('div', { class: 'rpgc-wgrid' },
                h('div', { class: 'rpgc-wstat' }, h('b', null, `K. ${w.year}`), h('span', null, w.day ? `day ${w.day}${w.period ? ' \u00B7 ' + w.period : ''}` : 'year')),
                w.age !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.age)), h('span', null, 'years old')) : null,
                w.adventurer ? h('div', { class: 'rpgc-wstat' }, h('b', null, `${w.adventurer.rank}-Rank`), h('span', null, w.adventurer.party || (w.adventurer.solo ? 'solo' : 'adventurer'))) : null));
            if (w.race) out.push(wRow('Born', `K. ${w.birth} \u00B7 ${w.race}`, w.origin ? h('span', { class: 'rpgc-chip' + (/outworlder/i.test(w.origin) ? ' hot' : '') }, w.origin) : null));
            if (w.mana) out.push(h('div', { class: 'rpgc-wability' }, wRow('Mana capacity', h('b', null, w.mana)), loreNote(w.manaLore)));
            if (w.casting) out.push(wRow('Casting', w.casting));
            if (w.touki) out.push(h('div', { class: 'rpgc-wability' }, wRow('Touki', w.touki), loreNote(w.toukiLore)));
            if (w.martial.length) { out.push(rankedList('Sword styles', w.martial, 'mt-tech-', 'techniques')); if (w.triangle) out.push(h('p', { class: 'rpgc-note' }, h('b', null, 'The triangle: '), w.triangle)); }
            if (w.magic.length) out.push(rankedList('Magic', w.magic, 'spells-', 'spells'));
            if (w.languages.length) out.push(wRow('Languages', ...w.languages.map(l => h('span', { class: 'rpgc-chip' }, l.fluency ? `${l.name} \u00B7 ${l.fluency}` : l.name))));
            if (w.contracts) out.push(wRow('Contracts', w.contracts));
            for (const e of w.eyes) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' }, 'Demon Eye'), h('b', null, e.text)), loreNote(e.lore)));
            for (const m of w.marks) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' + (m.kind === 'CURSE' ? ' hot' : '') }, m.kind === 'CURSE' ? 'Curse' : 'Blessing'), h('b', null, m.name)), loreNote(m.lore)));
            if (w.drain) out.push(h('p', { class: 'rpgc-status warning' }, `Drain Syndrome: ${w.drain.stage}${w.drain.onset ? ` \u00B7 onset ${w.drain.onset}` : ''}`));
            if (w.term) out.push(wRow('Ranoa', `${w.term.term} \u00B7 ${w.term.role}`));
            if (w.hitogami) {
                out.push(h('div', { class: 'rpgc-set rpgc-hitogami' }, h('h4', null, 'The Man-God'),
                    wRow('Standing', h('b', null, w.hitogami.state)),
                    w.advice.length ? h('ul', { class: 'rpgc-wlist' }, w.advice.map(a => h('li', { class: a.followed === true ? 'followed' : a.followed === false ? 'ignored' : '' },
                        a.dream ? h('span', { class: 'rpgc-chip kind' }, `Dream ${a.dream}`) : null, ` \u201C${a.text}\u201D `,
                        h('span', { class: 'rpgc-row', role: 'group', 'aria-label': 'Did you follow it?' },
                            h('button', { class: 'rpgc-mini' + (a.followed === true ? ' on' : ''), 'aria-pressed': a.followed === true ? 'true' : 'false', onclick: () => send({ type: 'hitogami_mark', chatId: state.chatId, msgId: a.msgId, followed: a.followed === true ? null : true }) }, 'Followed'),
                            h('button', { class: 'rpgc-mini' + (a.followed === false ? ' on' : ''), 'aria-pressed': a.followed === false ? 'true' : 'false', onclick: () => send({ type: 'hitogami_mark', chatId: state.chatId, msgId: a.msgId, followed: a.followed === false ? null : false }) }, 'Ignored'))))) :
                        h('p', { class: 'rpgc-note' }, 'His advice is written down here the next time he speaks.')));
            }
        } else if (w.id === 'undertale') {
            const UT_HEX = { red: '#ff2020', cyan: '#42fcff', orange: '#fca600', blue: '#2d6bff', purple: '#d535d9', green: '#1fd11f', yellow: '#ffe600' };
            out.push(h('div', { class: 'rpgc-wgrid' },
                w.lv !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, `LV ${w.lv}`), h('span', null, 'LOVE')) : null,
                w.exp !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, fmtNum(w.exp)), h('span', null, 'EXP')) : null,
                w.gold !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, `${fmtNum(w.gold)} G`), h('span', null, 'gold')) : null));
            if (w.exp !== null && w.next !== null) out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Next LV'), levelBar(Math.min(100, w.exp / Math.max(1, w.exp + w.next) * 100), 'ok'), h('span', { class: 'val' }, `${fmtNum(w.next)} EXP to go`)));
            if (w.soul) out.push(wRow('SOUL', h('span', { class: 'rpgc-soul', 'aria-hidden': 'true', style: `color:${UT_HEX[w.soulColor] || 'currentColor'}` }, '\u2665'), h('b', null, w.soulTrait || w.soul), w.soulColor ? h('span', { class: 'rpgc-note' }, w.soulColor) : null));
            if (w.route) out.push(h('div', { class: 'rpgc-set' },
                wRow('Route', h('span', { class: 'rpgc-chip ' + (/genocide/i.test(w.route) ? 'hot' : /pacifist/i.test(w.route) ? 'ok' : '') }, w.route), w.kills !== null ? h('span', { class: 'rpgc-note' }, `kills: ${w.kills}`) : null),
                w.killsOf ? h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'This area'), levelBar(Math.min(100, w.killsNow / w.killsOf * 100), 'critical'), h('span', { class: 'val' }, `${w.killsNow} / ${w.killsOf}`)) : null));
            if (w.savePoint) out.push(wRow('SAVE', h('span', { class: 'rpgc-savestar', 'aria-hidden': 'true' }, '\u2726'), w.savePoint));
            if (w.at || w.df) out.push(wRow('Stats', w.at ? `AT ${w.at.base}${w.at.bonus ? ` (${w.at.bonus})` : ''}` : '', w.at && w.df ? ' \u00B7 ' : '', w.df ? `DF ${w.df.base}${w.df.bonus ? ` (${w.df.bonus})` : ''}` : ''));
            if (w.weapon || w.armor) out.push(wRow('Equipped', [w.weapon, w.armor].filter(Boolean).join(' \u00B7 ')));
            if (w.kr) out.push(wRow('KR', h('span', { class: 'rpgc-chip hot' }, `${w.kr} karmic retribution`)));
            if (w.resets) out.push(wRow('Resets', h('b', null, String(w.resets)), h('span', { class: 'rpgc-note' }, 'Switch on Loops under Settings \u2192 Chapters to keep each timeline.')));
        } else if (w.id === 'darksouls') {
            out.push(h('div', { class: 'rpgc-wgrid' },
                w.level !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.level)), h('span', null, 'soul level')) : null,
                w.souls !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, fmtNum(w.souls)), h('span', null, 'souls')) : null,
                w.deaths !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.deaths)), h('span', null, 'deaths')) : null));
            if (w.bloodstain) out.push(h('p', { class: 'rpgc-status warning', role: 'status' }, `${fmtNum(w.bloodstain.souls)} souls lie at ${w.bloodstain.where}. Reach them before you die again, or they are gone.`));
            const pips = (cur, max) => h('span', { class: 'rpgc-pips', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': String(max), 'aria-valuenow': String(cur) }, ...Array.from({ length: max }, (_, i) => h('i', { class: i < cur ? 'on' : '' })));
            if (w.estus) out.push(wRow('Estus Flask', pips(w.estus.cur, w.estus.max), h('span', { class: 'val' }, `${w.estus.cur} / ${w.estus.max}${w.estus.plus ? ` \u00B7 +${w.estus.plus}` : ''}`)));
            if (w.ashen) out.push(wRow('Ashen Estus', pips(w.ashen.cur, w.ashen.max), h('span', { class: 'val' }, `${w.ashen.cur} / ${w.ashen.max}`)));
            if (w.humanity !== null || w.form || w.hollowing !== null) out.push(wRow('Humanity', w.humanity !== null ? h('b', null, String(w.humanity)) : null,
                w.form ? h('span', { class: 'rpgc-chip ' + (/hollow/i.test(w.form) ? 'hot' : /embered|human/i.test(w.form) ? 'ok' : '') }, w.form) : null,
                w.hollowing !== null ? h('span', { class: 'rpgc-note' }, `hollowing ${w.hollowing}`) : null));
            if (w.bonfire) out.push(wRow('Bonfire', h('span', { class: 'rpgc-ember', 'aria-hidden': 'true' }, '\u2736'), w.bonfire));
            if (w.covenant) out.push(h('div', { class: 'rpgc-wability' }, wRow('Covenant', h('b', null, w.covenant.name), w.covenant.rank ? h('span', { class: 'rpgc-chip' }, `rank ${w.covenant.rank}`) : null), loreNote(w.covenant.lore)));
            if (w.weapon) out.push(wRow('Weapon', w.weapon));
        } else if (w.id === 'skyrim') {
            out.push(h('div', { class: 'rpgc-wgrid' },
                w.level !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.level)), h('span', null, 'level')) : null,
                w.dragonSouls !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.dragonSouls)), h('span', null, 'dragon souls')) : null,
                w.perks !== null ? h('div', { class: 'rpgc-wstat' + (w.perks ? ' ready' : '') }, h('b', null, String(w.perks)), h('span', null, 'perks to spend')) : null));
            if (w.nextPct !== null) out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Next level'), levelBar(w.nextPct, 'ok'), h('span', { class: 'val' }, `${w.nextPct}%`)));
            if (w.race || w.stone) out.push(wRow('Race', w.race ? h('b', null, w.race) : null, w.stone ? h('span', { class: 'rpgc-chip' }, w.stone) : null));
            if (w.shouts.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Shouts'),
                ...w.shouts.map(s => h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, s.name), ladderBar(s.words - 1, 3), h('span', { class: 'val' }, `${s.words} of 3 words`)), loreNote(s.lore)))));
            if (w.skills.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Skills'),
                ...w.skills.slice(0, 8).map(s => h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, s.name), levelBar(Math.min(100, s.lv), s.lv >= 100 ? 'ok' : 'low'), h('span', { class: 'val' }, String(s.lv)))),
                w.skills.length > 8 ? wDetails('sk-skills', h('span', null, `${w.skills.length - 8} more`), ...w.skills.slice(8).map(s => h('p', { class: 'rpgc-note' }, `${s.name} ${s.lv}`))) : null));
            if (w.bounties.length) out.push(wRow('Bounty', ...w.bounties.map(x => h('span', { class: 'rpgc-chip hot' }, `${x.hold} ${fmtNum(x.gold)}`))));
            if (w.factions.length) out.push(wRow('Factions', ...w.factions.map(x => h('span', { class: 'rpgc-chip' }, x.rank ? `${x.name} \u00B7 ${x.rank}` : x.name))));
            if (w.gold !== null) out.push(wRow('Gold', h('b', null, `${fmtNum(w.gold)} septims`)));
            if (w.carry) out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Carry weight'), levelBar(Math.min(100, w.carry.cur / Math.max(1, w.carry.max) * 100), w.carry.cur > w.carry.max ? 'critical' : 'ok'), h('span', { class: 'val' }, `${fmtNum(w.carry.cur)} / ${fmtNum(w.carry.max)}${w.carry.cur > w.carry.max ? ' \u00B7 over-encumbered' : ''}`)));
            for (const a of w.afflictions) out.push(h('p', { class: 'rpgc-status warning' }, a));
        }
        if (!out.length) return null;
        const badge = w.id === 'rezero' ? (w.deaths !== null ? `${w.deaths} death${w.deaths === 1 ? '' : 's'}` : w.theater ? 'Theater' : null)
            : w.id === 'overlord' ? (w.overall !== null ? `Lv ${w.overall}` : null)
            : w.id === 'cote' ? (w.godmother && w.godmother.decree && w.godmother.decree.minutesLeft !== null ? fmtLeft(w.godmother.decree.minutesLeft) : w.pp ? `${fmtNum(w.pp.value)} PP` : null)
            : w.id === 'undertale' ? (w.lv !== null ? `LV ${w.lv}` : null)
            : w.id === 'darksouls' ? (w.souls !== null ? `${fmtNum(w.souls)} souls` : null)
            : w.id === 'skyrim' ? (w.level !== null ? `Level ${w.level}` : null)
            : (w.year !== null ? `K. ${w.year}` : null);
        return section('worldcard', w.label, state.open, badge, ...out);
    }

    // ─────────── 1.9.3: one card per person, and chapters ───────────

    function partyMemberFor(name) {
        const p = partyOf();
        if (!p || !name) return null;
        const k = String(name).trim().toLowerCase();
        const first = k.split(/\s+/)[0];
        return p.members.find(m => m.key === k || (m.aliases || []).some(a => a.toLowerCase() === k) || (first.length >= 3 && m.key.split(/\s+/)[0] === first)) || null;
    }

    // Present characters, Party and People describe the same people. One card each: the relationship
    // first, then what the party reading adds, then who they are in the scene right now.
    function renderPeopleAll() {
        const s = S();
        if (!s) return null;
        const r = relOf();
        const rc = (sysCfg().relations) || {};
        const relOn = !!r && rc.enabled !== false;
        const p = partyOf();
        const pcfg = (sysCfg().party) || {};
        const partyOn = !!p && pcfg.enabled !== false && s.enabled;
        const charsOn = !!s.showCharacterThoughts;
        const charList = charsOn && Array.isArray(state.data.characters) ? state.data.characters : [];
        if (!relOn && !partyOn && !charsOn) return null;
        const people = new Map();
        const keyOf = (name) => { const m = partyMemberFor(plain(name)); return m ? 'p:' + m.key : 'n:' + String(plain(name) || '').trim().toLowerCase(); };
        const put = (name, patch) => {
            if (!plain(name)) return;
            const k = keyOf(name);
            if (!people.has(k)) people.set(k, { key: k, name: plain(name) });
            Object.assign(people.get(k), patch);
        };
        if (relOn) for (const pp of r.people) put(pp.name, { rel: pp });
        if (partyOn) for (const m of p.members) put(m.name, { member: m });
        charList.forEach((c, idx) => put(c.name, { char: c, charIdx: idx }));
        const all = [...people.values()];
        const here = (x) => !!((x.rel && x.rel.present) || (x.member && x.member.present) || x.char);
        const f = state.peopleFilter || 'all';
        const list = all.filter(x => f === 'all' || (f === 'here' && here(x)) || (f === 'party' && x.member) || (f === 'foes' && x.rel && x.rel.tone === 'neg'));
        // people in the scene first, then the party, then everyone else
        list.sort((a, b) => (here(b) - here(a)) || (!!b.member - !!a.member));
        const layout = rc.layout || (r && r.layout) || 'cards';
        const out = [h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Show' },
            [['all', 'All'], ['here', 'Here'], ['party', 'Party'], ['foes', 'Against you']].map(([k, l]) => h('button', { class: 'rpgc-btn' + (k === f ? ' primary' : ''), 'aria-pressed': k === f ? 'true' : 'false', onclick: () => { state.peopleFilter = k; render(); } }, l)))];
        if (partyOn && !s.hmsCompanion && hmsOn()) out.push(h('p', { class: 'rpgc-note' }, 'Party readings ride on the side-panel block, which is switched off. Turn it on in Settings \u2192 HMS engine.'));
        if (!all.length) out.push(h('p', { class: 'rpgc-note' }, 'Everyone you deal with shows up here: who is in the scene, how they feel about you, and \u2014 for your party \u2014 their mood, needs and the states their card names.'));
        else if (!list.length) out.push(h('p', { class: 'rpgc-note' }, 'Nobody matches.'));
        else if (layout !== 'cards' && relOn) {
            // The compact, hearts and codex views are relationship views; people without a reading use a card.
            const relOnly = list.filter(x => x.rel);
            const rest = list.filter(x => !x.rel);
            const view = renderPeopleLayout(relOnly.map(x => x.rel), layout);
            if (view) out.push(view);
            if (rest.length) out.push(h('div', { class: 'rpgc-cards' }, rest.map(personMerged)));
        } else out.push(h('div', { class: 'rpgc-cards' }, list.map(personMerged)));
        if (partyOn) {
            const input = h('input', { type: 'text', placeholder: 'Add a party member', 'aria-label': 'Add a party member' });
            const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'party_member', chatId: state.chatId, op: 'add', name: v }); };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
            if (p.members.length < (p.max || 8)) out.push(h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add to party')));
            if (p.suggest && p.suggest.length) out.push(h('div', { class: 'rpgc-row rpgc-suggest' }, h('span', { class: 'rpgc-note' }, 'Suggested:'),
                p.suggest.map(n => h('button', { class: 'rpgc-btn', title: `Add ${n} to the party`, onclick: () => send({ type: 'party_member', chatId: state.chatId, op: 'add', name: n }) }, '+ ' + n))));
        }
        if (charsOn) out.push(h('div', null, h('button', { class: 'rpgc-btn', onclick: () => { chars().push({ name: 'New character', emoji: '\uD83D\uDE42' }); commit(); } }, 'Add someone to the scene')));
        const alerts = all.reduce((a, x) => a + (x.member ? x.member.alerts.length : 0) + (x.rel ? x.rel.alerts.filter(y => y.sev === 'warn').length : 0), 0);
        const high = all.some(x => x.member && x.member.alerts.some(a => a.sev === 'high'));
        const nHere = all.filter(here).length;
        const sec = section('people', 'People', state.open, alerts ? `${alerts} alert${alerts === 1 ? '' : 's'}` : all.length ? `${nHere} here \u00B7 ${all.length}` : null, ...out);
        if (high) sec.classList.add('alarm');
        return sec;
    }

    function personMerged(x) {
        const thoughtsShown = !!(x.char && S().trackerConfig?.presentCharacters?.thoughts?.enabled && plain(x.char.thoughts));
        let card;
        if (x.rel) card = personCard(x.rel, { noDossier: !!x.char });
        else if (x.member) card = partyCard(x.member, { skipConcern: thoughtsShown });
        else return charCard(x.char, x.charIdx);
        if (x.rel && x.member) card.appendChild(partyCard(x.member, { merged: true, skipConcern: thoughtsShown }));
        if (x.char) card.appendChild(charCard(x.char, x.charIdx, { merged: true }));
        if (x.member && x.member.alerts.some(a => a.sev === 'high')) card.classList.add('high');
        return card;
    }

    // ── chapters ──

    const CH_KIND = { manual: 'Chapter', loop: 'Loop', arc: 'Arc', day: 'Day', month: 'Month' };
    function chapterSpan(c) {
        const a = c.start && (c.start.time || c.start.where) ? [c.start.time, c.start.arc].filter(Boolean).join(', ') : null;
        const b = c.end && c.end.time ? c.end.time : null;
        const msgs = c.messages ? `${c.messages} message${c.messages === 1 ? '' : 's'}` : null;
        return [a && b ? `${a} \u2192 ${b}` : a, msgs].filter(Boolean).join(' \u00B7 ');
    }


    // ─────────── 1.9.26: New game (the bot's catalog), the OOC guide ───────────
    // The bot's greeting pages are its catalog: pick a start, stack what you like on it, and the
    // command goes in from the Canvas page with the handler line on top, the way the hub asks.
    function ngText() {
        const ng = state.ng; const c = state.catalog;
        if (!ng) return '';
        if (ng.edited !== null && ng.edited !== undefined) return ng.edited;
        let body = String(ng.start || '').trim();
        for (const m of ng.mods || []) body = body ? (/^with\b/i.test(m) ? `${body} ${m}` : `${body}, ${m}`) : m;
        return c && c.handler ? `${c.handler}\n${body}` : body;
    }
    function ngCheckSoon() {
        clearTimeout(state.ngTimer);
        state.ngTimer = setTimeout(() => send({ type: 'catalog_check', chatId: state.chatId, text: ngText() }), 250);
    }
    function ngPick(it, value) {
        const ng = state.ng;
        const cmd = value || it.cmd;
        if (it.kind === 'example') { ng.start = cmd; ng.mods = []; }
        else if (it.kind === 'start') ng.start = ng.start === cmd ? '' : cmd;
        else ng.mods = ng.mods.includes(cmd) ? ng.mods.filter(x => x !== cmd) : [...ng.mods, cmd];
        ng.edited = null; ng.fill = null;
        ngCheckSoon(); render();
    }
    function renderNewGame() {
        const info = state.newGame;
        if (!info || S()?.showNewGame === false) return null;
        const C = state.catalog && state.catalog.chatId === state.chatId ? state.catalog : null;
        if (!C && !state.catReq && state.open.newgame !== false) { state.catReq = true; send({ type: 'catalog_get', chatId: state.chatId }); }
        if (!C) return section('newgame', 'New game', state.open, `${info.pages} catalog pages`, h('p', { class: 'rpgc-note' }, 'Reading the bot’s catalog…'));
        if (C.none || !C.pages.length) return null;
        if (!state.ng) state.ng = { page: 0, start: '', mods: [], edited: null, fill: null, warnings: [], filter: '' };
        const ng = state.ng;
        const pg = C.pages[Math.min(ng.page, C.pages.length - 1)];
        const out = [h('p', { class: 'rpgc-note' }, `Built from this bot’s own catalog (its greeting pages). Pick one start, add anything that stacks on it, then Start. The command goes in from the Canvas page${C.handler ? `, with ${C.handler} on the first line` : ''}, as the bot’s hub asks.`)];
        out.push(h('div', { class: 'rpgc-ng-pages', role: 'tablist', 'aria-label': 'Catalog pages' }, C.pages.map((p, i) => h('button', { class: 'rpgc-btn' + (i === ng.page ? ' primary' : ''), role: 'tab', 'aria-selected': i === ng.page ? 'true' : 'false', title: p.note || p.title, onclick: () => { ng.page = i; ng.fill = null; render(); } }, p.title.toLowerCase().replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toUpperCase())))));
        if (pg.note) out.push(h('p', { class: 'rpgc-note' }, pg.note));
        const fIn = h('input', { type: 'search', placeholder: 'Find on this page', 'aria-label': 'Find on this page', value: ng.filter || '' });
        fIn.addEventListener('input', () => { ng.filter = fIn.value; clearTimeout(state.ngF); state.ngF = setTimeout(render, 200); });
        if (pg.items.length > 12) out.push(fIn);
        const f = (ng.filter || '').toLowerCase();
        const groups = new Map();
        const READY = 'Ready-made (a start and its add-ons in one)';
        for (const it of pg.items) {
            if (f && !`${it.cmd} ${it.label} ${it.desc}`.toLowerCase().includes(f)) continue;
            const key = it.kind === 'example' ? READY : it.section;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(it);
        }
        // the page's own options first, its worked examples last
        if (groups.has(READY)) { const r = groups.get(READY); groups.delete(READY); groups.set(READY, r); }
        const many = pg.items.length > 20 && !f;
        let firstOpen = true;
        const KIND = { start: 'start', mod: 'add-on', example: 'ready' };
        for (const [sec, items] of groups) {
            const okey = `ng:${pg.index}:${sec}`;
            const openNow = state.open[okey] !== undefined ? state.open[okey] : (!many || (firstOpen && sec !== READY));
            if (sec !== READY) firstOpen = false;
            const det = h('details', { class: 'rpgc-ng-sec' }, h('summary', null, h('span', { class: 'lbl', style: 'display:inline' }, `${sec} (${items.length})`)), ...items.map(it => {
                const on = ng.start === it.cmd || ng.mods.includes(it.cmd);
                const fill = ng.fill && ng.fill.cmd === it.cmd;
                const btn = h('button', { class: 'rpgc-ng-item' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', onclick: () => {
                    if (it.fields && it.fields.length && !on) { ng.fill = { cmd: it.cmd, values: {} }; render(); return; }
                    ngPick(it);
                } },
                    h('span', { class: 'k' }, KIND[it.kind] || it.kind), h('span', { class: 'c' }, it.cmd),
                    it.label && it.label !== sec && it.label !== it.cmd ? h('span', { class: 'rpgc-note' }, ` · ${it.label}`) : null,
                    it.desc ? h('span', { class: 'd' }, it.desc) : null);
                if (!fill) return btn;
                // the blanks in [brackets]: fill them, or leave an optional one empty
                const ins = it.fields.map(name => { const i = h('input', { type: 'text', placeholder: name, 'aria-label': name }); i.addEventListener('input', () => { ng.fill.values[name] = i.value; }); return i; });
                const done = () => {
                    let v = it.cmd;
                    for (const name of it.fields) { const val = String(ng.fill.values[name] || '').trim(); v = v.split(`[${name}]`).join(val); }
                    ngPick(it, v.replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',').trim());
                };
                return h('div', null, btn, h('div', { class: 'rpgc-row' }, ...ins, h('button', { class: 'rpgc-btn primary', onclick: done }, 'Add')));
            }));
            det.open = !!openNow || !!f;
            det.addEventListener('toggle', () => { state.open[okey] = det.open; });
            out.push(det);
        }
        if (!groups.size) out.push(h('p', { class: 'rpgc-note' }, 'Nothing on this page matches.'));
        // what you have so far
        const chosen = [ng.start ? h('span', { class: 'rpgc-chip', style: 'font-weight:600' }, ng.start, ' ', h('button', { class: 'rpgc-mini', 'aria-label': 'Remove the start', onclick: () => { ng.start = ''; ng.edited = null; ngCheckSoon(); render(); } }, '✕')) : h('span', { class: 'rpgc-note' }, 'No start yet.'),
            ...ng.mods.map(m => h('span', { class: 'rpgc-chip' }, m, ' ', h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${m}`, onclick: () => { ng.mods = ng.mods.filter(x => x !== m); ng.edited = null; ngCheckSoon(); render(); } }, '✕')))];
        const ta = h('textarea', { class: 'rpgc-ng-cmd', 'aria-label': 'Your start command', value: ngText(), rows: '3' });
        ta.addEventListener('input', () => { ng.edited = ta.value; ngCheckSoon(); });
        out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Your start'), h('div', { class: 'rpgc-chips' }, ...chosen), ta,
            ...(ng.warnings || []).map(w => h('p', { class: 'rpgc-ng-warn' }, '⚠ ' + w,
                /"with RBD"/.test(w) ? h('button', { class: 'rpgc-btn', style: 'margin-left:6px', onclick: () => { if (!ng.mods.includes('with RBD')) ng.mods = ['with RBD', ...ng.mods]; ng.edited = null; ngCheckSoon(); render(); } }, 'Add "with RBD"') : null)),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn primary', disabled: !ngText().trim() ? true : null, onclick: () => send({ type: 'newgame_start', chatId: state.chatId, text: ngText() }) }, 'Start the game'),
                h('button', { class: 'rpgc-btn', onclick: async () => { try { await navigator.clipboard.writeText(ngText()); } catch { /* no clipboard */ } } }, 'Copy'),
                h('button', { class: 'rpgc-btn', onclick: () => { state.ng = null; render(); } }, 'Clear'))));
        // A story from another chat: the bot's Start Continuer line, the old HUD, and the last messages.
        if (C.continuer) {
            const rs = state.ngResume || (state.ngResume = { hud: '', tail: '', sum: '', warn: false });
            const hudTa = h('textarea', { rows: '6', 'aria-label': 'The last HUD from your old chat', placeholder: 'Paste the last WORLD STATE HUD from your old chat (from ### WORLD STATE ### down to ***)', style: 'width:100%;box-sizing:border-box' });
            hudTa.value = rs.hud;
            hudTa.addEventListener('input', () => { rs.hud = hudTa.value; });
            const tailTa = h('textarea', { rows: '4', 'aria-label': 'Your last few messages', placeholder: 'Optional: paste your last few messages, so the story picks up mid-scene', style: 'width:100%;box-sizing:border-box' });
            tailTa.value = rs.tail;
            tailTa.addEventListener('input', () => { rs.tail = tailTa.value; });
            const sumTa = h('textarea', { rows: '4', 'aria-label': 'A summary of the story so far', placeholder: 'Optional: a summary of the story so far (the old chat\u2019s Summary, or your own notes)', style: 'width:100%;box-sizing:border-box' });
            sumTa.value = rs.sum || '';
            sumTa.addEventListener('input', () => { rs.sum = sumTa.value; });
            const resumeText = () => `${C.continuer}\nResume from this HUD.\n\n${rs.hud.trim()}${rs.tail.trim() ? `\n\nMy last messages:\n${rs.tail.trim()}` : ''}${(rs.sum || '').trim() ? `\n\nThe story so far:\n${rs.sum.trim()}` : ''}`;
            const det = h('details', { class: 'rpgc-ng-sec' },
                h('summary', null, h('span', { class: 'lbl', style: 'display:inline' }, 'Resume an old campaign instead')),
                h('p', { class: 'rpgc-note' }, `For a story you began in another chat. Paste its last HUD: that is the save file. Add your last few messages and a summary of the story if you have them, so it picks up mid-scene. The line ${C.continuer} goes first, as the bot asks.`),
                hudTa, tailTa, sumTa,
                rs.warn ? h('p', { class: 'rpgc-ng-warn' }, '⚠ Paste the HUD first: it must include the WORLD STATE heading.') : null,
                h('div', { class: 'rpgc-row' },
                    h('button', { class: 'rpgc-btn primary', onclick: () => {
                        if (!/WORLD STATE/i.test(rs.hud)) { rs.warn = true; render(); return; }
                        rs.warn = false;
                        send({ type: 'newgame_start', chatId: state.chatId, text: resumeText() });
                    } }, 'Resume the campaign'),
                    h('button', { class: 'rpgc-btn', onclick: async () => { try { await navigator.clipboard.writeText(resumeText()); } catch { /* no clipboard */ } } }, 'Copy')));
            det.open = state.open['ng:resume'] === true || !!rs.warn;
            det.addEventListener('toggle', () => { state.open['ng:resume'] = det.open; });
            out.push(det);
        }
        return section('newgame', 'New game', state.open, `${C.pages.length} pages`, ...out);
    }

    // The bot's OOC guide: a question outside the story, answered in voice, the story untouched.
    function renderOoc() {
        const o = state.ooc;
        if (!o || (!o.guide && !(o.log && o.log.length)) || S()?.showOoc === false) return null;
        const busy = !!o.busy || (state.status && state.status.kind === 'busy' && /guide/i.test(state.status.text || ''));
        const qIn = h('textarea', { rows: '2', placeholder: o.guide ? `Ask ${o.guide} anything about the world, the rules or the commands` : 'Ask about the world, the rules or the commands', 'aria-label': 'Your OOC question', style: 'width:100%;box-sizing:border-box' });
        if (state.oocDraft) qIn.value = state.oocDraft;
        qIn.addEventListener('input', () => { state.oocDraft = qIn.value; });
        const gIn = h('input', { type: 'text', placeholder: o.guide ? `Guide: ${o.guide}` : 'Guide (optional)', 'aria-label': 'Another guide (optional)', value: state.oocGuide || '', style: 'flex:1;min-width:0' });
        gIn.addEventListener('input', () => { state.oocGuide = gIn.value; });
        const ask = (inChat) => { const q = qIn.value.trim(); if (!q) return; send({ type: inChat ? 'ooc_chat' : 'ooc_ask', chatId: state.chatId, question: q, guide: (state.oocGuide || '').trim() }); state.oocDraft = ''; qIn.value = ''; };
        const out = [h('p', { class: 'rpgc-note' }, `${o.guide ? `${o.guide} is this bot’s guide. ` : ''}Ask here and the answer stays in this panel: no HUD, no time passes, the story never sees it. "Ask in the story" posts it in the chat as ${o.trigger.startsWith('[') ? `${o.trigger} …]` : `${o.trigger} …`} instead.`), qIn,
            h('div', { class: 'rpgc-row' }, gIn,
                h('button', { class: 'rpgc-btn primary', disabled: busy ? true : null, onclick: () => ask(false) }, busy ? 'Asking…' : 'Ask'),
                h('button', { class: 'rpgc-btn', title: 'Post it in the chat with the bot’s own trigger; that turn gets no HUD and no side-panel block', onclick: () => ask(true) }, 'Ask in the story'))];
        for (const x of (o.log || []).slice().reverse().slice(0, 8)) out.push(h('div', null, h('div', { class: 'rpgc-ooc-q' }, `❓ ${x.q}`), h('div', { class: 'rpgc-ooc-a' }, h('b', null, `${x.guide}: `), x.a)));
        if (o.log && o.log.length) out.push(h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'ooc_clear', chatId: state.chatId }) }, 'Clear the answers'));
        return section('ooc', `OOC guide${o.guide ? ` — ${o.guide}` : ''}`, closedByDefault('ooc'), o.log && o.log.length ? String(o.log.length) : null, ...out);
    }

    // ─────────── 1.9.24: the Chronicle ───────────
    // The story's timeline: key moments, milestones, relationship history and plot points, newest first,
    // grouped by loop and day. What is already in the Memory Cortex is ticked; the latest reply waits
    // until you answer it, because a swipe could still change it.
    const CHRON_ICON = { moment: '★', note: '✎', bond: '💞', plot: '🧭', milestone: '◆', place: '📍' };
    const CHRON_FILTERS = [['all', 'All'], ['moment', '★ Moments'], ['bond', '💞 Bonds'], ['plot', '🧭 Plot'], ['milestone', '◆ Milestones'], ['place', '📍 Places']];
    const CHRON_MODE = { off: 'writes nothing by itself', key: 'writes only the biggest moments', most: 'writes key moments, bonds, plot and milestones', all: 'writes everything, places too' };
    function chronTime(ms) { if (!ms) return ''; const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
    function renderChronicle() {
        const info = state.chronicle;
        if (!info || S()?.showChronicle === false || (isObj(S()?.chronicle) && S().chronicle.enabled === false)) return null;
        const D = state.chronData && state.chronData.chatId === state.chatId ? state.chronData : null;
        const fresh = D && D.version === info.version;
        if (!fresh && !state.chronReq && state.open.chronicle !== false) { state.chronReq = true; send({ type: 'chronicle_get', chatId: state.chatId }); }
        if (!D) return section('chronicle', 'Chronicle', state.open, null, h('p', { class: 'rpgc-note' }, 'Reading the story…'));
        const all = D.entries || [];
        const f = state.chronFilter || 'all';
        const showHidden = !!state.chronHidden;
        const who = state.chronWho || null;
        const list = all.filter(e => (showHidden || !e.hidden) && (f === 'all' || e.kind === f || (f === 'moment' && (e.kind === 'note' || e.star)))
            && (!who || (e.who || []).some(n => n.toLowerCase() === who.toLowerCase()))).slice().reverse();
        const limit = state.chronShow || 40;
        const out = [];
        out.push(h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Show' },
            CHRON_FILTERS.map(([k, l]) => h('button', { class: 'rpgc-btn' + (k === f ? ' primary' : ''), 'aria-pressed': k === f ? 'true' : 'false', onclick: () => { state.chronFilter = k; state.chronShow = 40; render(); } }, l))));
        const noteIn = h('input', { type: 'text', placeholder: 'Add a moment of your own', 'aria-label': 'Add a moment of your own', maxlength: '240' });
        const addNote = () => { const t = noteIn.value.trim(); if (!t) return; send({ type: 'chronicle_edit', chatId: state.chatId, op: 'note', text: t }); noteIn.value = ''; };
        noteIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') addNote(); });
        out.push(h('div', { class: 'rpgc-chron-add' }, noteIn, h('button', { class: 'rpgc-btn', onclick: addNote }, 'Add')));
        // one person's timeline: everything between you and them, from the first meeting on
        if (who) out.push(h('div', { class: 'rpgc-row' }, h('span', { class: 'rpgc-note' }, 'Only '), h('b', null, who),
            h('button', { class: 'rpgc-mini', 'aria-label': 'Show everyone', title: 'Show everyone', onclick: () => { state.chronWho = null; render(); } }, '\u2715')));
        if (!all.length) out.push(h('p', { class: 'rpgc-note' }, 'Nothing yet. The Chronicle fills itself from the story: a new arc, a rank or level, a power gained, a death and its loop, quests, first meetings, how people come to feel about you, and the key moments the story flags.'));
        else if (!list.length) out.push(h('p', { class: 'rpgc-note' }, 'Nothing matches.'));
        let loop = undefined, day = undefined, ul = null;
        for (const e of list.slice(0, limit)) {
            if (D.loops && e.loop !== loop) { loop = e.loop; day = undefined; out.push(h('div', { class: 'rpgc-chron-loop' }, e.loop ? `Loop ${e.loop}` : 'Before the loops')); }
            const dpart = (e.when || '').split(',')[0].trim();
            if (dpart !== day || !ul) { day = dpart; if (dpart) out.push(h('div', { class: 'rpgc-chron-day' }, dpart)); ul = h('ul', { class: 'rpgc-chron-list' }); out.push(ul); }
            const tpart = (e.when || '').includes(',') ? e.when.split(',').slice(1).join(',').trim() : (/^\d{1,2}:\d{2}/.test(e.when || '') ? e.when : '');
            const status = e.sent ? h('span', { class: 'st sent', title: 'In the Memory Cortex', 'aria-label': 'In the Memory Cortex' }, '✓')
                : !e.settled ? h('span', { class: 'st wait', title: 'Waits until you answer this reply — a swipe could still change it', 'aria-label': 'Waits for your answer' }, '⏳')
                : e.goes && !e.hidden ? h('span', { class: 'st wait', title: 'Goes into the Memory Cortex with the next write', 'aria-label': 'Next write' }, '•')
                : h('span', { class: 'st', title: 'Stays in the Chronicle (below what you chose to write)', 'aria-label': 'Stays here' }, '');
            const cls = ['rpgc-chron-item', e.kind, e.star ? 'star' : '', e.imp >= 8 ? 'big' : '', e.hidden ? 'hidden' : ''].filter(Boolean).join(' ');
            ul.appendChild(h('li', { class: cls },
                h('span', { class: 'ic', 'aria-hidden': 'true' }, CHRON_ICON[e.kind] || '•'),
                h('span', { class: 'tx' }, tpart ? h('span', { class: 'tm' }, tpart) : null, e.text,
                    e.who && e.who.length ? h('span', { class: 'who' }, e.who.map(n => h('button', { class: 'rpgc-chip', style: 'cursor:pointer;background:none;color:inherit;font:inherit;font-size:11px', title: `Only ${n}: their timeline with you`, onclick: () => { state.chronWho = n; state.chronShow = 40; render(); } }, n))) : null),
                h('span', { class: 'act' }, status,
                    h('button', { class: 'rpgc-mini star', title: e.star ? 'Unstar' : 'Star: a key moment, always written', 'aria-label': e.star ? `Unstar: ${e.text}` : `Star: ${e.text}`, onclick: () => send({ type: 'chronicle_edit', chatId: state.chatId, op: 'star', id: e.id }) }, e.star ? '★' : '☆'),
                    e.user && e.noteId ? h('button', { class: 'rpgc-mini', title: 'Delete your note', 'aria-label': `Delete your note: ${e.text}`, onclick: () => send({ type: 'chronicle_edit', chatId: state.chatId, op: 'unnote', noteId: e.noteId }) }, '🗑')
                        : h('button', { class: 'rpgc-mini', title: e.hidden ? 'Show it again' : 'Hide it: never written to the Memory Cortex', 'aria-label': e.hidden ? `Show again: ${e.text}` : `Hide: ${e.text}`, onclick: () => send({ type: 'chronicle_edit', chatId: state.chatId, op: 'hide', id: e.id }) }, e.hidden ? '↺' : '✕'))));
        }
        if (list.length > limit) out.push(h('button', { class: 'rpgc-btn', onclick: () => { state.chronShow = limit + 60; render(); } }, `Show ${Math.min(60, list.length - limit)} more`));
        if (all.some(e => e.hidden)) out.push(h('label', { class: 'rpgc-row' }, (() => { const cb = h('input', { type: 'checkbox', 'aria-label': 'Show hidden entries' }); cb.checked = showHidden; cb.addEventListener('change', () => { state.chronHidden = cb.checked; render(); }); return cb; })(), h('span', { class: 'rpgc-note' }, `Show hidden (${all.filter(e => e.hidden).length})`)));
        // the Memory Cortex
        const c = D.cortex || {};
        const busy = !!c.busy || (state.status && state.status.kind === 'busy' && /Chronicle/.test(state.status.text || ''));
        const waiting = all.filter(e => !e.settled && e.goes && !e.hidden).length;
        out.push(h('div', { class: 'rpgc-chron-cortex' },
            h('div', null, h('b', null, 'Memory Cortex: '), c.on === true ? h('span', { class: 'on' }, 'on') : c.on === false ? h('span', { class: 'off' }, 'not available') : h('span', null, 'unknown'),
                ` · ${CHRON_MODE[c.mode] || ''}`),
            c.note ? h('p', { class: 'rpgc-note' }, c.note) : null,
            h('p', { class: 'rpgc-note' }, `${c.sent || 0} written${c.last ? `, last at ${chronTime(c.last)}` : ''}.${waiting ? ` ${waiting} wait${waiting === 1 ? 's' : ''} until you answer the latest reply.` : ''} ✓ written · ⏳ waits for your answer · • next write`),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn primary', disabled: busy ? true : null, onclick: () => send({ type: 'chronicle_sync', chatId: state.chatId }) }, busy ? 'Writing…' : 'Write now'),
                h('button', { class: 'rpgc-btn', disabled: busy ? true : null, title: 'Use this after a Memory Cortex rebuild. The Cortex skips facts it already has, so nothing doubles.', onclick: async () => {
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Write everything again?', message: 'Every entry goes to the Memory Cortex once more. Facts it already has are skipped, so nothing doubles. Useful after a Cortex rebuild.', confirmLabel: 'Write again' }) : { confirmed: true };
                    if (res?.confirmed) send({ type: 'chronicle_sync', chatId: state.chatId, again: true });
                } }, 'Write everything again'))));
        const sent = all.filter(e => e.sent).length;
        return section('chronicle', 'Chronicle', state.open, `${all.filter(e => !e.hidden).length}${sent ? ` · ${sent} in the Cortex` : ''}`, ...out);
    }

    function renderChronicleSettings() {
        const s = S();
        const C = () => (s.chronicle = isObj(s.chronicle) ? s.chronicle : {});
        const mode = h('select', { 'aria-label': 'Write to the Memory Cortex', onchange: (e) => { C().cortex = e.target.value; saveSettings(false); } },
            h('option', { value: 'off' }, 'Off — only when I press Write now'),
            h('option', { value: 'key' }, 'Only the biggest moments'),
            h('option', { value: 'most' }, 'Key moments, bonds, plot and milestones (recommended)'),
            h('option', { value: 'all' }, 'Everything, places too'));
        mode.value = ['off', 'key', 'most', 'all'].includes(C().cortex) ? C().cortex : 'most';
        return section('s-chronicle', 'Chronicle', closedByDefault('s-chronicle'), null,
            h('p', { class: 'rpgc-note' }, 'The story’s timeline, read from the chat: a new arc, a rank or level, a power gained, a death and the loop it ends, quests, the first time at a place, first meetings and how people come to feel about you, and the key moments the story flags. A swipe or an edit changes it with the chat.'),
            toggle('Chronicle', () => C().enabled !== false, v => { C().enabled = v; }),
            toggle('Ask the story for its key moments', () => C().moments !== false, v => { C().moments = v; }, 'A promise, a confession, a betrayal, a death, a secret learned. About 60 tokens of request in the side-panel block; most replies answer [].'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Write to the Memory Cortex'), mode),
            h('p', { class: 'rpgc-note' }, 'A reply is written once you answer it, so a swipe never leaves a wrong memory behind. Each entry becomes a fact on the people it is about (the place too, for a key moment), with an importance tag the Cortex keeps when it trims. Relationships become one "relationship" link per person toward you. Your own milestones go on you. A loop undone by Return by Death is written as undone. The Cortex only adds: what was written stays, even if you change the chat later — hide an entry before it is written to keep it out. Needs the Memory Cortex switched on in Lumiverse and the extension’s "Memories" permission.'),
            h('p', { class: 'rpgc-note' }, 'Without the Memory Cortex: {{rpgc_chronicle}} in a preset gives the key moments so far, one line each.'));
    }

    function renderChapter() {
        if (isObj(S()?.chapters) && S().chapters.enabled === false) return null;
        const cs = state.chapters || { list: [], knowledge: [], open: {} };
        const busy = !!cs.busy || (state.status && state.status.kind === 'busy' && /chapter summary/i.test(state.status.text || ''));
        const titleIn = h('input', { type: 'text', placeholder: 'Title (optional)', 'aria-label': 'Chapter title' });
        const out = [
            h('p', { class: 'rpgc-note' }, 'A chapter is a stretch of the story with a summary that rides along with every message, on top of the history \u2014 nothing is removed. End one where the story turns: a death and a rewind, the end of an arc, the end of a day.'),
            h('div', { class: 'rpgc-row' }, titleIn,
                h('button', { class: 'rpgc-btn primary', disabled: busy ? true : null, onclick: () => send({ type: 'chapter_end', chatId: state.chatId, title: titleIn.value.trim(), summarize: true }) }, busy ? 'Summarising\u2026' : 'End chapter and summarise'),
                h('button', { class: 'rpgc-btn', disabled: busy ? true : null, onclick: () => send({ type: 'chapter_end', chatId: state.chatId, title: titleIn.value.trim(), summarize: false }) }, 'End chapter'))
        ];
        const openNow = cs.list.filter(c => c.status === 'open');
        if (openNow.length) out.push(h('p', { class: 'rpgc-note' }, 'Now: ' + openNow.map(c => `${c.title}${c.start && c.start.time ? ` since ${c.start.time}` : ''}`).join(' \u00B7 ')));
        for (const c of cs.list.slice().reverse()) {
            const editing = state.chEdit === c.id;
            const ta = editing ? h('textarea', { rows: '6', 'aria-label': `Summary of ${c.title}`, value: c.summary }) : null;
            const tIn = editing ? h('input', { type: 'text', value: c.title, 'aria-label': 'Chapter title' }) : null;
            const det = h('details', { class: 'rpgc-chapter ' + c.kind + (c.summarized ? '' : ' unsummarised') },
                h('summary', null, h('span', { class: 'rpgc-chip kind' }, CH_KIND[c.kind] || 'Chapter'), h('b', null, c.title),
                    h('span', { class: 'rpgc-note' }, ` ${chapterSpan(c)}`), c.status === 'open' ? h('span', { class: 'rpgc-chip here' }, 'open') : null,
                    !c.summarized ? h('span', { class: 'rpgc-chip' }, 'not summarised') : c.inPrompt ? null : h('span', { class: 'rpgc-chip' }, 'left out')),
                editing ? h('div', { class: 'rpgc-set' }, tIn, ta, h('div', { class: 'rpgc-row' },
                    h('button', { class: 'rpgc-btn primary', onclick: () => { send({ type: 'chapter_edit', chatId: state.chatId, id: c.id, title: tIn.value, summary: ta.value }); state.chEdit = null; } }, 'Save'),
                    h('button', { class: 'rpgc-btn', onclick: () => { state.chEdit = null; render(); } }, 'Cancel')))
                    : c.summary ? h('p', { class: 'rpgc-chsum' }, c.summary) : h('p', { class: 'rpgc-note' }, 'No summary yet.'),
                !editing && c.ended ? h('p', { class: 'rpgc-note' }, `It ended: ${c.ended}`) : null,
                !editing && c.learned && c.learned.length ? h('div', { class: 'rpgc-set' }, h('h4', null, 'What you uncovered'), h('ul', null, c.learned.map(l => h('li', null, l)))) : null,
                !editing ? h('div', { class: 'rpgc-row' },
                    h('button', { class: 'rpgc-btn', disabled: busy ? true : null, onclick: () => send({ type: 'chapter_summarize', chatId: state.chatId, id: c.id }) }, c.summarized ? 'Summarise again' : 'Summarise'),
                    h('button', { class: 'rpgc-btn', onclick: () => { state.chEdit = c.id; state.open['ch-' + c.id] = true; render(); } }, 'Edit'),
                    c.summarized ? h('label', { class: 'rpgc-row' }, (() => { const cb = h('input', { type: 'checkbox', 'aria-label': 'Send with every message' }); cb.checked = c.inPrompt; cb.addEventListener('change', () => send({ type: 'chapter_edit', chatId: state.chatId, id: c.id, inPrompt: cb.checked })); return cb; })(), h('span', null, 'Send with every message')) : null,
                    h('button', { class: 'rpgc-btn danger', onclick: async () => {
                        const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Delete this chapter?', message: `"${c.title}" and its summary are removed. The messages stay.`, variant: 'danger', confirmLabel: 'Delete' }) : { confirmed: true };
                        if (res?.confirmed) send({ type: 'chapter_delete', chatId: state.chatId, id: c.id });
                    } }, 'Delete')) : null);
            det.open = !!state.open['ch-' + c.id] || editing;
            det.dataset.openKey = 'ch-' + c.id; det.addEventListener('toggle', () => { state.open['ch-' + c.id] = det.open; });
            out.push(det);
        }
        if (cs.knowledge && cs.knowledge.length) {
            const kIn = h('input', { type: 'text', placeholder: 'Add something you know', 'aria-label': 'Add something you know' });
            kIn.addEventListener('keydown', (e) => { if (e.key === 'Enter' && kIn.value.trim()) { send({ type: 'knowledge_edit', chatId: state.chatId, op: 'add', text: kIn.value.trim() }); kIn.value = ''; } });
            out.push(h('div', { class: 'rpgc-set rpgc-knowledge' }, h('h4', null, 'What you know from earlier loops'),
                h('p', { class: 'rpgc-note' }, 'Only you remember these. They ride along with every message, so the story knows what you know.'),
                h('ul', null, cs.knowledge.map(k => h('li', null, k.loop ? h('span', { class: 'rpgc-chip kind' }, `Loop ${k.loop}`) : null, ' ', k.text,
                    h('button', { class: 'rpgc-mini', 'aria-label': `Forget: ${k.text}`, onclick: () => send({ type: 'knowledge_edit', chatId: state.chatId, op: 'remove', text: k.text }) }, '\u2715')))),
                kIn));
        }
        const cp = state.checkpoint;
        if (cp) out.push(h('div', { class: 'rpgc-set' }, h('p', { class: 'rpgc-note' }, `From an older version: ${cp.hiddenCount} message${cp.hiddenCount === 1 ? ' is' : 's are'} hidden from the prompt before #${cp.index}.`),
            h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'clear_checkpoint', chatId: state.chatId }) }, 'Show them again')));
        const n = cs.list.filter(c => c.summarized && c.inPrompt).length;
        return section('chapter', 'Chapters', state.open, cs.list.length ? `${cs.list.length}${n ? ` \u00B7 ${n} in the prompt` : ''}` : null, ...out);
    }

    function renderChapterSettings() {
        const s = S();
        const C = () => (s.chapters = isObj(s.chapters) ? s.chapters : {});
        const len = h('select', { 'aria-label': 'Summary length', onchange: (e) => { C().length = e.target.value; saveSettings(false); } },
            h('option', { value: 'short' }, 'Short \u2014 a few sentences'), h('option', { value: 'medium' }, 'Medium \u2014 a paragraph or two'), h('option', { value: 'long' }, 'Long \u2014 several paragraphs'));
        len.value = C().length || 'medium';
        return section('s-chapters', 'Chapters', closedByDefault('s-chapters'), null,
            h('p', { class: 'rpgc-note' }, 'Memory at the scale the story is cut at. You can always end a chapter by hand. The kinds below are found by the extension from the HUD, so they work in HMS chats.'),
            toggle('Loops (Return by Death)', () => !!C().loops, v => { C().loops = v; }, 'A new loop starts when the HUD clock goes back. Its summary is sent as what it is \u2014 undone, remembered only by you \u2014 and what you uncovered collects into one list.'),
            toggle('Arcs', () => !!C().arcs, v => { C().arcs = v; }, 'A new chapter each time the Arc line changes.'),
            toggle('Days', () => !!C().days, v => { C().days = v; }, 'A new chapter each in-story day.'),
            toggle('Months', () => !!C().months, v => { C().months = v; }, 'A new chapter each month of the calendar \u2014 the school year in Classroom of the Elite.'),
            toggle('Summarise a chapter as soon as it closes', () => !!C().autoSummarize, v => { C().autoSummarize = v; }, 'One model call per closed chapter. Off: press Summarise in the Chapters card.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Summary length'), len),
            toggle('Send summaries with every message', () => C().inPrompt !== false, v => { C().inPrompt = v; }, 'On top of the history; nothing is removed from the prompt.'),
            toggle('Give them to fights too', () => C().inFights !== false, v => { C().inFights = v; }, 'Fight setups read the story so far, so a fight remembers who these people are to you.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Budget (chars)'),
                h('input', { type: 'number', min: '500', max: '40000', step: '500', value: String(C().budget ?? 4000), 'aria-label': 'Chapter budget', onchange: (e) => { C().budget = Math.max(500, parseInt(e.target.value, 10) || 4000); saveSettings(); } })),
            h('p', { class: 'rpgc-note' }, 'When the summaries run past the budget, the newest chapters are kept.'));
    }

    // ─────────── 1.9.2: D&D, Quests settings, pop-out styling ───────────

    const DND_ABIL_LIST = [['str', 'STR', 'Strength'], ['dex', 'DEX', 'Dexterity'], ['con', 'CON', 'Constitution'], ['int', 'INT', 'Intelligence'], ['wis', 'WIS', 'Wisdom'], ['cha', 'CHA', 'Charisma']];
    const DND_SKILL_LIST = [['acrobatics', 'Acrobatics', 'dex'], ['animal', 'Animal Handling', 'wis'], ['arcana', 'Arcana', 'int'], ['athletics', 'Athletics', 'str'], ['deception', 'Deception', 'cha'], ['history', 'History', 'int'],
        ['insight', 'Insight', 'wis'], ['intimidation', 'Intimidation', 'cha'], ['investigation', 'Investigation', 'int'], ['medicine', 'Medicine', 'wis'], ['nature', 'Nature', 'int'], ['perception', 'Perception', 'wis'],
        ['performance', 'Performance', 'cha'], ['persuasion', 'Persuasion', 'cha'], ['religion', 'Religion', 'int'], ['sleight', 'Sleight of Hand', 'dex'], ['stealth', 'Stealth', 'dex'], ['survival', 'Survival', 'wis']];
    const signed = (n) => (n >= 0 ? '+' : '\u2212') + Math.abs(n);
    function hudSheetNow() { return state.hudSheet || (state.world && state.world.dndSheet) || null; }
    function dndOn() { const s = S(); return !!s && (!isObj(s.dnd) || s.dnd.enabled !== false); }
    function dndSheet() {
        const hs = hudSheetNow();
        const d0 = state.dnd;
        if (hs && (!isObj(S()?.dnd) || S().dnd.useHud !== false)) {
            // STATE IS GOD: the bot's own sheet \u2014 level, proficiency, saves and skills as it prints them.
            const base = d0 && isObj(d0.scores) ? d0 : { scores: {}, saves: {}, skills: {}, level: 1 };
            const saves = {}, skills = {};
            for (const [a] of DND_ABIL_LIST) saves[a] = hs.saves.includes(a);
            for (const [k, name] of DND_SKILL_LIST) skills[k] = hs.skills[name.toLowerCase()] || 0;
            return { ...base, level: hs.level || base.level, saves, skills, hud: true, pb: hs.pb };
        }
        const d = d0;
        if (d && isObj(d.scores)) return d;
        const s = S() || {};
        const scores = {}, saves = {}, skills = {};
        for (const [a] of DND_ABIL_LIST) { scores[a] = Number(s.classicStats?.[a]) || 10; saves[a] = false; }
        for (const [k] of DND_SKILL_LIST) skills[k] = 0;
        return { scores, saves, skills, level: Number(s.level) || 1 };
    }
    const dndProf = (level) => { const hs = hudSheetNow(); if (hs && Number.isFinite(hs.pb) && (!isObj(S()?.dnd) || S().dnd.useHud !== false)) return hs.pb; return 2 + Math.floor((Math.max(1, Math.min(20, level)) - 1) / 4); };
    const dndMod = (score) => Math.floor((Number(score) - 10) / 2);

    /** STATE IS GOD: ability scores (or modifiers) the bot's HUD prints win over the sheet. */
    function dndHudAbils() {
        const s = S();
        if (!hmsOn() || (isObj(s?.dnd) && s.dnd.useHud === false)) return {};
        const hs = hudSheetNow();
        if (hs && hs.mods && Object.keys(hs.mods).length) {
            const out = {};
            for (const [id, v] of Object.entries(hs.mods)) out[id] = { mod: v, text: (v >= 0 ? '+' : '') + v };
            return out;
        }
        const sys = sysOf();
        const out = {};
        for (const g of (sys && sys.attributes) || []) {
            for (const it of g.items || []) {
                const name = String(it.name || '').toLowerCase();
                const hit = DND_ABIL_LIST.find(([id, short, long]) => name === short.toLowerCase() || name === long.toLowerCase() || name === id);
                if (!hit || out[hit[0]]) continue;
                const v = String(it.value || '').trim();
                if (/^[+-]\d+$/.test(v)) out[hit[0]] = { mod: Number(v), text: v };
                else if (/^\d+$/.test(v)) out[hit[0]] = { score: Number(v), mod: dndMod(Number(v)), text: v };
            }
        }
        return out;
    }
    function dndAbilMod(sheet, hud, id) { return hud[id] ? hud[id].mod : dndMod(sheet.scores[id]); }

    function dndSave(mut) {
        const sheet = JSON.parse(JSON.stringify(dndSheet()));
        mut(sheet);
        state.dnd = sheet;
        send({ type: 'dnd_set', chatId: state.chatId, sheet });
        render();
    }

    state.dndRoll = state.dndRoll || { what: 'skill:perception', adv: 'none', bonus: 0, dc: '', count: 1, sides: 20 };
    function dndDoRoll() {
        const s = S();
        const r = state.dndRoll;
        const sheet = dndSheet();
        const hud = dndHudAbils();
        const prof = dndProf(sheet.level);
        const bonus = Number(r.bonus) || 0;
        const dc = Number(r.dc) > 0 ? Number(r.dc) : null;
        const d = (n) => Math.floor(Math.random() * n) + 1;
        let roll;
        if (r.what === 'dice') {
            const n = Math.max(1, Math.min(100, Number(r.count) || 1)), sd = Math.max(2, Math.min(1000, Number(r.sides) || 20));
            const rolls = Array.from({ length: n }, () => d(sd));
            const sum = rolls.reduce((a, b) => a + b, 0);
            roll = { formula: `${n}d${sd}`, rolls, total: sum + bonus, label: `${n}d${sd}`, breakdown: `${n}d${sd} (${rolls.join(' + ')})${bonus ? ` ${signed(bonus)} bonus` : ''}` };
        } else {
            const [kind, id] = r.what.split(':');
            const rolls = r.adv === 'none' ? [d(20)] : [d(20), d(20)];
            const kept = r.adv === 'adv' ? Math.max(...rolls) : r.adv === 'dis' ? Math.min(...rolls) : rolls[0];
            let abil, label, profPart = 0;
            if (kind === 'skill') {
                const sk = DND_SKILL_LIST.find(x => x[0] === id) || DND_SKILL_LIST[11];
                abil = sk[2]; label = `a ${sk[1]} check (${abil.toUpperCase()})`;
                profPart = (sheet.skills[sk[0]] || 0) * prof;
            } else if (kind === 'save') {
                abil = id; label = `a ${id.toUpperCase()} saving throw`;
                profPart = sheet.saves[id] ? prof : 0;
            } else if (kind === 'init') { abil = 'dex'; label = 'initiative'; }
            else { abil = id; label = `a ${id.toUpperCase()} check`; }
            const mod = dndAbilMod(sheet, hud, abil);
            const parts = [`d20 ${kept}${rolls.length > 1 ? ` (${rolls.join(' / ')}, ${r.adv === 'adv' ? 'advantage' : 'disadvantage'})` : ''}${kept === 20 ? ', natural 20' : kept === 1 ? ', natural 1' : ''}`, `${abil.toUpperCase()} ${signed(mod)}${hud[abil] ? ' (HUD)' : ''}`];
            if (profPart) parts.push(`${profPart === 2 * prof ? 'expertise' : 'proficiency'} ${signed(profPart)}`);
            if (bonus) parts.push(`bonus ${signed(bonus)}`);
            roll = { formula: '1d20', rolls, total: kept + mod + profPart + bonus, label, breakdown: parts.join(' ') };
        }
        if (dc) { roll.dc = dc; roll.outcome = roll.total >= dc ? 'success' : 'failure'; }
        s.lastDiceRoll = { ...roll, chatId: state.chatId, timestamp: Date.now() };
        saveSettings();
    }

    function dndRoller() {
        const s = S();
        if (s.showDiceDisplay === false) return null;
        const r = state.dndRoll;
        const what = h('select', { 'aria-label': 'What to roll', onchange: (e) => { r.what = e.target.value; render(); } },
            h('optgroup', { label: 'Skills' }, DND_SKILL_LIST.map(([id, name, ab]) => h('option', { value: `skill:${id}` }, `${name} (${ab.toUpperCase()})`))),
            h('optgroup', { label: 'Ability checks' }, DND_ABIL_LIST.map(([id, short, long]) => h('option', { value: `check:${id}` }, `${long} check`))),
            h('optgroup', { label: 'Saving throws' }, DND_ABIL_LIST.map(([id, short, long]) => h('option', { value: `save:${id}` }, `${long} save`))),
            h('optgroup', { label: 'Other' }, h('option', { value: 'init:dex' }, 'Initiative'), h('option', { value: 'dice' }, 'Plain dice')));
        what.value = r.what;
        const adv = h('select', { 'aria-label': 'Advantage', onchange: (e) => { r.adv = e.target.value; } },
            h('option', { value: 'none' }, 'Normal'), h('option', { value: 'adv' }, 'Advantage'), h('option', { value: 'dis' }, 'Disadvantage'));
        adv.value = r.adv;
        const num = (label, key, attrs) => h('label', { class: 'rpgc-dnd-num' }, h('span', null, label),
            h('input', { type: 'number', value: String(r[key] ?? ''), 'aria-label': label, ...attrs, onchange: (e) => { r[key] = e.target.value; } }));
        const roll = s.lastDiceRoll && (!s.lastDiceRoll.chatId || s.lastDiceRoll.chatId === state.chatId) ? s.lastDiceRoll : null;
        return h('div', { class: 'rpgc-dnd-roller' },
            h('div', { class: 'rpgc-dnd-roll' },
                what,
                r.what === 'dice' ? h('span', { class: 'rpgc-dice' },
                    h('input', { type: 'number', min: '1', max: '100', value: String(r.count), 'aria-label': 'Number of dice', onchange: (e) => { r.count = e.target.value; } }), 'd',
                    h('input', { type: 'number', min: '2', max: '1000', value: String(r.sides), 'aria-label': 'Sides per die', onchange: (e) => { r.sides = e.target.value; } })) : adv,
                num('Bonus', 'bonus', { step: '1' }), num('DC', 'dc', { min: '0', placeholder: '\u2014' }),
                h('button', { class: 'rpgc-btn primary', onclick: dndDoRoll }, 'Roll')),
            roll ? h('div', { class: 'rpgc-dnd-result', role: 'status' },
                h('b', null, String(roll.total)),
                h('span', null, roll.label ? ` ${roll.label}: ${roll.breakdown}` : ` ${roll.formula}`),
                roll.dc ? h('span', { class: 'rpgc-chip ' + (roll.outcome === 'success' ? 'ok' : 'hot') }, `DC ${roll.dc} \u2014 ${roll.outcome}`) : null,
                h('button', { class: 'rpgc-mini', 'aria-label': 'Clear roll', onclick: () => { s.lastDiceRoll = null; saveSettings(); } }, '\u2715')) : null,
            h('p', { class: 'rpgc-note' }, roll ? 'This roll goes into your next reply.' : 'Your roll goes into your next reply, with its whole sum.'));
    }

    function renderDnd() {
        if (!dndOn() || !state.chatId) return null;
        const sheet = dndSheet();
        const hud = dndHudAbils();
        const prof = dndProf(sheet.level);
        const abils = h('div', { class: 'rpgc-dnd-abils' }, DND_ABIL_LIST.map(([id, short, long]) => {
            const fromHud = hud[id];
            const mod = dndAbilMod(sheet, hud, id);
            const save = h('input', { type: 'checkbox', 'aria-label': `Proficient in ${long} saves` });
            save.checked = !!sheet.saves[id];
            if (sheet.hud) save.disabled = true;
            save.addEventListener('change', () => dndSave(x => { x.saves[id] = save.checked; }));
            return h('div', { class: 'rpgc-dnd-abil' + (fromHud ? ' hud' : ''), title: fromHud ? `From the WORLD STATE HUD: ${fromHud.text}` : long },
                h('span', { class: 'ab' }, short, fromHud ? h('span', { class: 'rpgc-imm-src' }, 'HUD') : null),
                h('span', { class: 'mod' }, signed(mod)),
                fromHud ? h('span', { class: 'score' }, fromHud.score ? String(fromHud.score) : 'mod') : h('span', { class: 'score' },
                    h('button', { class: 'rpgc-mini', 'aria-label': `Lower ${long}`, onclick: () => dndSave(x => { x.scores[id] = Math.max(1, x.scores[id] - 1); }) }, '\u2212'),
                    h('span', null, String(sheet.scores[id])),
                    h('button', { class: 'rpgc-mini', 'aria-label': `Raise ${long}`, onclick: () => dndSave(x => { x.scores[id] = Math.min(30, x.scores[id] + 1); }) }, '+')),
                h('label', null, save, 'Save ' + signed(mod + (sheet.saves[id] ? prof : 0))));
        }));
        const PROF_LABEL = ['\u2014', 'Prof', 'Expert'];
        const skills = h('div', { class: 'rpgc-dnd-skills' }, DND_SKILL_LIST.map(([id, name, ab]) => {
            const p = sheet.skills[id] || 0;
            const total = dndAbilMod(sheet, hud, ab) + p * prof;
            return h('div', { class: 'rpgc-dnd-skill' },
                h('span', { class: 'md' }, signed(total)),
                h('span', { class: 'nm' }, name, h('span', { class: 'ab' }, ` ${ab.toUpperCase()}`)),
                h('button', { class: 'rpgc-mini p' + p, disabled: sheet.hud ? true : null, 'aria-label': `${name}: ${['not proficient', 'proficient', 'expertise'][p]}`, title: sheet.hud ? 'From the HUD\u2019s D&D sheet' : 'Not proficient \u2192 proficient \u2192 expertise',
                    onclick: () => dndSave(x => { x.skills[id] = ((x.skills[id] || 0) + 1) % 3; }) }, PROF_LABEL[p]));
        }));
        const passive = 10 + dndAbilMod(sheet, hud, 'wis') + (sheet.skills.perception || 0) * prof;
        return section('dnd', 'D&D', state.open, `Lv ${sheet.level} \u00B7 prof ${signed(prof)}`,
            dndRoller(),
            h('div', { class: 'rpgc-row' },
                h('span', { class: 'lbl' }, 'Level'),
                h('button', { class: 'rpgc-mini', 'aria-label': 'Lower level', disabled: sheet.hud ? true : null, onclick: () => dndSave(x => { x.level = Math.max(1, x.level - 1); }) }, '\u2212'),
                h('b', null, String(sheet.level)),
                h('button', { class: 'rpgc-mini', 'aria-label': 'Raise level', disabled: sheet.hud ? true : null, onclick: () => dndSave(x => { x.level = Math.min(30, x.level + 1); }) }, '+'),
                h('span', { class: 'rpgc-note' }, `Proficiency ${signed(prof)} \u00B7 Passive Perception ${passive}`)),
            abils,
            (() => { const d = h('details', { class: 'rpgc-dnd-skillbox' }, h('summary', null, 'Skills'), skills); d.open = !!state.open['dnd-skills']; d.dataset.openKey = 'dnd-skills'; d.addEventListener('toggle', () => { state.open['dnd-skills'] = d.open; }); return d; })(),
            sheet.hud ? h('p', { class: 'rpgc-note' }, `Read from the HUD\u2019s D&D character sheet${hudSheetNow().klass ? ` (${hudSheetNow().klass})` : ''}: level, proficiency, saves and skills are the bot\u2019s own.`)
                : Object.keys(hud).length ? h('p', { class: 'rpgc-note' }, 'Scores marked HUD come from the WORLD STATE and cannot be changed here.') : null);
    }

    function renderDndSettings() {
        const s = S();
        const D = () => (s.dnd = isObj(s.dnd) ? s.dnd : {});
        const es = s.encounterSettings;
        if (!isObj(es.dnd)) es.dnd = { deathSaves: true, crits: true, massiveDamage: true, obedienceRolls: true };
        const on = D().enabled !== false;
        const dt = (label, key, note) => toggle(label, () => es.dnd[key] !== false, v => { es.dnd[key] = v; }, note);
        return section('s-dnd', 'D&D', closedByDefault('s-dnd'), on ? 'on' : 'off',
            h('p', { class: 'rpgc-note' }, 'Everything D&D in one place: your sheet (ability scores, saving throws, the 18 skills, proficiency from your level), the roller, and turn-based fights. Switch it off and all of it leaves the panel \u2014 the Turn-based fight button too.'),
            toggle('D&D', () => D().enabled !== false, v => { D().enabled = v; }, 'Off hides the D&D card, the roller and Turn-based fights.'),
            on ? toggle('The roller', () => s.showDiceDisplay !== false, v => { s.showDiceDisplay = v; }, 'Checks, saves, skills and initiative with your modifiers, advantage or disadvantage and a DC. The whole sum goes into your next reply.') : null,
            on ? toggle('Use the HUD\u2019s scores when it prints them', () => D().useHud !== false, v => { D().useHud = v; }, 'STATE IS GOD: where the bot\u2019s HUD prints STR, DEX and the rest, the sheet reads them instead of your own numbers.') : null,
            on ? h('p', { class: 'rpgc-note' }, 'Each chat keeps its own sheet. A chat that has none starts from the stats you set before.') : null,
            on ? h('h4', null, 'Turn-based fights') : null,
            on ? h('p', { class: 'rpgc-note' }, 'Initiative order, attack rolls against AC, damage dice, saving throws, spell slots and death saves. Every die is rolled by the extension and HP is applied here; the model narrates the numbers and plans what the other side does next.') : null,
            on ? dt('Death saving throws', 'deathSaves', 'Party members at 0 HP roll each turn: three successes stabilise, three failures kill.') : null,
            on ? dt('Critical hits', 'crits', 'A natural 20 doubles the damage dice.') : null,
            on ? dt('Massive damage', 'massiveDamage', 'Damage past 0 HP equal to max HP kills outright.') : null,
            on ? dt('Companions roll to obey', 'obedienceRolls', 'An irritated or distrustful companion may do it their own way.') : null,
            on ? toggle('Companions may question orders', () => es.companionsMayRefuse !== false, v => { es.companionsMayRefuse = v; }, 'An order is a request: a companion answers it as their card and current mood say.') : null,
            on ? toggle('Let the model think each combat turn', () => !!es.combatThinking, v => { es.combatThinking = v; }, 'Sharper tactics, slower turns.') : null,
            on ? h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Messages of history'),
                h('input', { type: 'number', min: '1', max: '50', value: String(es.historyDepth || 8), 'aria-label': 'Messages of chat history a fight reads', onchange: (e) => { es.historyDepth = Math.max(1, parseInt(e.target.value, 10) || 8); saveSettings(); } })) : null,
            ...(on ? narrativeRows('Combat narration', es.combatNarrative) : []),
            ...(on ? narrativeRows('Aftermath narration', es.summaryNarrative) : []),
            on ? promptArea('Combat prose rules ({userName} works here)', 'customCombatNarrativePrompt', 'Built-in prose rules') : null);
    }

    function renderQuestSettings() {
        const s = S();
        if (!isObj(s.hmsSystems)) s.hmsSystems = {};
        const Q = () => (s.hmsSystems.quests = isObj(s.hmsSystems.quests) ? s.hmsSystems.quests : {});
        return section('s-quests', 'Quests', closedByDefault('s-quests'), s.showQuests === false ? 'off' : null,
            h('p', { class: 'rpgc-note' }, 'Everything about quests in one place. In HMS chats the Quests line on the HUD decides which quests exist; the extension reads it, keeps the details and the journal, and never invents a quest.'),
            toggle('Show the Quests panel', () => s.showQuests !== false, v => { s.showQuests = v; }, 'In HMS chats and classic chats alike.'),
            toggle('Ask for quest details', () => Q().details !== false, v => { Q().details = v; }, 'Objective, progress, giver, where, deadline and reward, carried in the side-panel block. HMS chats.'),
            toggle('Track the plot', () => Q().plot !== false, v => { Q().plot = v; }, 'Where the main story stands, and its open threads \u2014 moved or resolved as the story goes. Kept apart from quests.'),
            toggle('Track objectives', () => Q().objectives !== false, v => { Q().objectives = v; }, 'What you are trying to do right now, as the story sets it. You can add your own; those stay with you and are not sent.'),
            toggle('Keep a journal of quests that left the HUD', () => Q().journal !== false, v => { Q().journal = v; }, 'Finished, failed and dropped quests stay readable; a quest that vanishes while active is flagged.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Quest line labels'),
                h('input', { type: 'text', value: Q().labels || '', 'aria-label': 'Quest line labels', onchange: (e) => { Q().labels = e.target.value; saveSettings(false); } })),
            h('div', { class: 'rpgc-set' }, h('h4', null, 'Quest states'),
                h('p', { class: 'rpgc-note' }, 'class: words. Classes active, closing, done, ended, failed, hidden colour the badges; a quest leaving the HUD while active or closing is flagged.'),
                h('textarea', { rows: '4', value: Q().states || '', 'aria-label': 'Quest states', onchange: (e) => { Q().states = e.target.value; saveSettings(false); } })));
    }

    // ── the pop-out window wears Lumiverse's own look: its styles, fonts, variables and theme ──
    function syncPopoutLook(win) {
        if (!win || win.closed) return;
        const pd = win.document;
        try {
            if (!pd.getElementById('rpgc-host-base')) {
                const base = pd.createElement('base'); base.id = 'rpgc-host-base'; base.href = ((typeof window !== 'undefined' && window.location && window.location.origin) || '') + '/';
                pd.head.prepend(base);
                const sheets = [];
                for (const n of document.querySelectorAll('link[rel~="stylesheet"], style')) {
                    if (n.tagName === 'LINK') { const l = pd.createElement('link'); l.rel = 'stylesheet'; l.href = n.href; sheets.push(l); continue; }
                    let css = n.textContent || '';
                    if (!css && n.sheet) { try { css = [...n.sheet.cssRules].map(r => r.cssText).join('\n'); } catch { css = ''; } }
                    if (css) { const st = pd.createElement('style'); st.textContent = css; sheets.push(st); }
                }
                for (const sh of (document.adoptedStyleSheets || [])) {
                    try { const st = pd.createElement('style'); st.textContent = [...sh.cssRules].map(r => r.cssText).join('\n'); sheets.push(st); } catch { /* cross-origin */ }
                }
                const own = pd.createElement('style'); own.id = 'rpgc-own'; own.textContent = CSS;
                for (const sh of sheets) pd.head.appendChild(sh);
                pd.head.appendChild(own);   // ours last, so the panel's own rules win
            }
            const src = document.documentElement, dst = pd.documentElement;
            for (const a of [...src.attributes]) if (a.name === 'class' || a.name === 'style' || a.name.startsWith('data-')) dst.setAttribute(a.name, a.value);
            if (document.body) pd.body.className = document.body.className;
            const cs = getComputedStyle(src);
            let vars = '';
            for (let i = 0; i < cs.length; i++) { const p = cs[i]; if (p.startsWith('--')) vars += `${p}:${cs.getPropertyValue(p)};`; }
            const bs = document.body ? getComputedStyle(document.body) : null;
            let v = pd.getElementById('rpgc-host-vars');
            if (!v) { v = pd.createElement('style'); v.id = 'rpgc-host-vars'; pd.head.appendChild(v); }
            v.textContent = `:root{${vars}color-scheme:${cs.colorScheme || 'normal'};}
html,body{height:100%!important;margin:0;overflow:hidden!important;}
body{background:${bs ? bs.backgroundColor : '#111'};color:${bs ? bs.color : '#ddd'};font-family:${bs ? bs.fontFamily : 'system-ui, sans-serif'};font-size:${bs ? bs.fontSize : '14px'};}
#rpgc-pop-scroll{position:fixed!important;inset:0!important;zoom:1!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y;outline:none;}
#rpgc-pop-scroll > .rpgc{max-width:860px;margin:0 auto;zoom:var(--lumiverse-ui-scale, 1);}`;
        } catch (e) { state.status = { kind: 'warning', text: `The pop-out window could not copy Lumiverse\u2019s look: ${e?.message || e}` }; }
    }

    // ─────────── 1.9: You, Magic, Modules, bug report, mini panel ───────────

    function youOf() { return (state.hms && state.hms.you) || null; }
    function magicOf() { return (state.hms && state.hms.magic) || null; }
    const LEVEL_WORDS = ['none', 'slight', 'moderate', 'high', 'extreme'];

    function renderYou() {
        const y = youOf();
        const c = sysCfg().you || {};
        const vc = sysCfg().vitals || {};
        const sys = sysOf();
        const showYou = !!y && c.enabled !== false;
        const showVitals = !!sys && vc.enabled !== false;
        if (!showYou && !showVitals) return null;
        const out = [];
        if (showYou) {
            const top = h('div', { class: 'rpgc-you-head' },
                y.mood ? h('span', { class: 'rpgc-chip' }, h('em', null, 'Mood: '), y.mood) : null,
                y.stress !== null && y.stress !== undefined ? h('span', { class: 'rpgc-chip' + (y.stress >= 3 ? ' hot' : '') }, h('em', null, 'Stress: '), LEVEL_WORDS[y.stress]) : null,
                y.balance ? h('span', { class: 'rpgc-chip' }, h('em', null, y.balance.label + ': '), y.balance.value) : null);
            if (top.childNodes.length) out.push(top);
        }
        // The body: the HUD's pools with what the last reply changed, then its meters. One place, not two.
        if (showVitals) {
            for (const v of sys.vitals) {
                const d = v.delta;
                out.push(h('div', { class: 'rpgc-vital ' + v.level },
                    h('div', { class: 'head' },
                        h('span', { class: 'lbl' }, v.label),
                        h('span', { class: 'num' }, `${fmtNum(v.cur)} / ${fmtNum(v.max)}`),
                        d ? h('span', { class: 'delta ' + (d < 0 ? 'down' : 'up'), title: 'Change since the last reply' }, (d > 0 ? '+' : '\u2212') + fmtNum(Math.abs(d))) : null),
                    levelBar(v.pct, v.level)));
            }
            for (const m of sys.meters) {
                out.push(h('div', { class: 'rpgc-vital ' + m.level },
                    h('div', { class: 'head' }, h('span', { class: 'lbl' }, m.label), h('span', { class: 'num' }, `${fmtNum(m.pct)}%`), m.stage ? h('span', { class: 'stage' }, m.stage) : null),
                    levelBar(m.pct, m.level)));
            }
        } else if (showYou) {
            for (const v of y.vitals || []) out.push(h('div', { class: 'rpgc-vital ' + v.level }, h('div', { class: 'head' }, h('span', { class: 'lbl' }, v.label), h('span', { class: 'num' }, `${fmtNum(v.cur)} / ${fmtNum(v.max)}`)), levelBar(v.pct, v.level)));
        }
        let x = {};
        if (showYou) {
            if (y.sanity !== null && y.sanity !== undefined) out.push(h('div', { class: 'rpgc-vital ' + (y.sanity <= 15 ? 'critical' : y.sanity <= 40 ? 'low' : 'ok') }, h('div', { class: 'head' }, h('span', { class: 'lbl' }, 'Sanity'), h('span', { class: 'num' }, `${y.sanity} / 100`)), levelBar(y.sanity, y.sanity <= 15 ? 'critical' : y.sanity <= 40 ? 'low' : 'ok')));
            x = y.xp || {};
            if (x.mode === 'hud' || x.total || x.level) {
                const lv = x.level || x.derivedLevel;
                const span = x.mode === 'hud' ? x.max : (x.nextAt ? x.nextAt - (x.prevAt || 0) : null);
                const into = x.mode === 'hud' ? x.total : x.total - (x.prevAt || 0);
                out.push(h('div', { class: 'rpgc-vital' + (x.levelUp ? ' levelup' : '') },
                    h('div', { class: 'head' }, h('span', { class: 'lbl' }, lv ? `Level ${lv}` : 'Experience'), h('span', { class: 'num' }, span ? `${fmtNum(into)} / ${fmtNum(span)} XP` : `${fmtNum(x.total)} XP`),
                        x.levelUp ? h('span', { class: 'rpgc-chip levelup' }, 'level-up ready') : null),
                    span ? levelBar(Math.max(0, Math.min(100, into / span * 100)), 'ok') : null,
                    x.lastGain ? h('p', { class: 'rpgc-note' }, `Last: +${x.lastGain.xp}${x.lastGain.why ? ' \u2014 ' + x.lastGain.why : ''}`) : null,
                    x.mode === 'tracked' ? h('div', { class: 'rpgc-row' }, h('span', { class: 'rpgc-note' }, 'Adjust:'),
                        [-100, -10, 10, 100].map(dd => h('button', { class: 'rpgc-mini', 'aria-label': `${dd > 0 ? 'Add' : 'Remove'} ${Math.abs(dd)} XP`, onclick: () => send({ type: 'xp_adjust', chatId: state.chatId, delta: dd }) }, (dd > 0 ? '+' : '') + dd))) : null));
            }
        }
        // Wounds and conditions have their own card; repeat them here only when that card is off.
        const bc = sysCfg().body || {};
        if (sys && bc.enabled === false) {
            const conds = (sys.conditions || []).map(cd => cd.stage ? `${cd.name} (${cd.stage})` : cd.name);
            const wounds = (sys.wounds || []).map(w => w.name + (w.tag ? ` \u2014 ${w.tag}` : ''));
            if (conds.length || wounds.length) out.push(h('p', { class: 'rpgc-note' }, [...wounds, ...conds].join(' \u00B7 ')));
        }
        if (showVitals) for (const n of sys.notes) out.push(h('p', { class: 'rpgc-note' }, n));
        if (showYou && y.equipment) out.push(h('p', { class: 'rpgc-note' }, y.equipment));
        if (showYou) out.push(...renderCarried(y));
        if (!out.length) return null;
        const worst = showVitals ? sys.vitals.find(v => v.health) : null;
        return section('you', 'You', state.open, x.levelUp ? 'level-up ready' : ((showYou && y.mood) || (worst ? `${worst.label} ${Math.round(worst.pct)}%` : null)), ...out);
    }

    // Where everyone stands, from the latest reply that said so (Settings → Chat and panel extras → Map).
    // a map drawn by the backend (numbers and escaped names only), in the world's card colours
    function mapBox(svg, vars, label) {
        const box = h('div', { class: 'rpgc-map', role: 'img', 'aria-label': label || 'Map' });
        box.innerHTML = svg;
        if (vars) box.setAttribute('style', `${vars};background:var(--rh-bg);color:var(--rh-fg);border:1px solid var(--rh-line);border-radius:10px;padding:6px 4px`);
        return box;
    }
    function viewBanked(key) {
        if (state.mapView && state.mapView.key === key) { state.mapView = null; render(); return; }
        send({ type: 'mapbank_view', chatId: state.chatId, key });
    }
    // The map bank: every room drawn in this world, so a place is drawn once.
    function renderMapBank() {
        const bank = state.hms && state.hms.mapBank;
        if (!bank || !bank.rooms || !bank.rooms.length) return null;
        const n = bank.rooms.length;
        const det = h('details', { class: 'rpgc-subdet' }, h('summary', null, `\uD83D\uDDC2\uFE0F Map bank \u2014 ${n} room${n === 1 ? '' : 's'} in this world`),
            h('p', { class: 'rpgc-note' }, 'Every room the story has drawn here is kept for this world, so a place is drawn once \u2014 coming back, or a new chat with the same bot, uses the saved room and spends no tokens drawing it. Forget a room and the story draws it fresh the next time you are there.'),
            h('ul', { class: 'rpgc-list' }, bank.rooms.map(r => h('li', { style: 'display:block' },
                h('div', { class: 'rpgc-row', style: 'gap:6px;flex-wrap:nowrap' },
                    h('span', { style: 'flex:1;min-width:0' }, h('b', null, r.name), r.place && r.place !== r.name ? h('span', { class: 'rpgc-note' }, ` \u00B7 ${r.place}`) : null, r.w ? h('span', { class: 'rpgc-note' }, ` \u00B7 ${r.w}\u00D7${r.h}`) : null),
                    r.here ? h('span', { class: 'rpgc-chip' }, 'you are here') : null,
                    h('button', { class: 'rpgc-mini', 'aria-label': `${state.mapView && state.mapView.key === r.key ? 'Hide' : 'View'} ${r.name}`, onclick: () => viewBanked(r.key) }, state.mapView && state.mapView.key === r.key ? 'Hide' : 'View'),
                    h('button', { class: 'rpgc-mini', title: 'Forget it: the story draws it fresh next time', 'aria-label': `Forget ${r.name}`, onclick: () => send({ type: 'mapbank_edit', chatId: state.chatId, op: 'forget', key: r.key }) }, '\u2715')),
                state.mapView && state.mapView.key === r.key ? mapBox(state.mapView.svg, state.mapView.vars, `Saved map of ${r.name}`) : null))),
            h('div', { class: 'rpgc-row' },
                bank.chatRoom ? h('button', { class: 'rpgc-btn', title: 'The room you are in, as it is in this chat now, becomes the bank\u2019s drawing of the place', onclick: () => send({ type: 'mapbank_edit', chatId: state.chatId, op: 'save' }) }, 'Save this room as it is now') : null,
                h('button', { class: 'rpgc-btn danger', onclick: async () => {
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Clear the map bank?', message: 'Every saved room of this world is forgotten. The story draws each one again when you are there with the map on.', variant: 'danger', confirmLabel: 'Clear' }) : { confirmed: true };
                    if (res?.confirmed) send({ type: 'mapbank_edit', chatId: state.chatId, op: 'clear' });
                } }, 'Clear this world\u2019s bank')));
        det.open = !!state.open.mapbank; det.addEventListener('toggle', () => { state.open.mapbank = det.open; });
        return det;
    }
    function renderMap() {
        const m = state.hms && state.hms.map;
        const bankEl = renderMapBank();
        if (!m) return bankEl ? section('map', 'Map', state.open, null, h('p', { class: 'rpgc-note' }, 'No positions in the latest replies.'), bankEl) : null;
        const box = mapBox(m.svg, m.vars, m.name ? `Map of ${m.name}` : 'Map');
        const col = { you: '#e8b030', ally: '#3fae6a', foe: '#e05050', other: '#9a9ab0' };
        const me = (m.pos || []).find(p => p.side === 'you');
        const dist = (p) => (me && p !== me ? Math.max(Math.abs(p.x - me.x), Math.abs(p.y - me.y)) : null);
        const legend = h('div', { class: 'rpgc-chips', style: 'justify-content:center;margin-top:4px' }, (m.pos || []).map(p => { const k = dist(p);
            return h('span', { class: 'rpgc-chip', title: p.note || '' }, h('span', { class: 'rpgc-map-dot', style: `background:${col[p.side] || col.other}` }),
                `${p.name} (${p.x},${p.y})${k === null ? '' : k === 1 ? ' \u00B7 next to you' : ` \u00B7 ${k} sq`}`); }));
        return section('map', 'Map', state.open, m.name || null, box, legend,
            m.latest ? null : h('p', { class: 'rpgc-note' }, 'From an earlier reply: the latest one did not say where everyone stands.'), bankEl);
    }

    // ─────────── Atlas: the bot's location book as a map you can walk through ───────────
    const SURV = { full: ['#d9534f', '\uD83D\uDCF9', 'covered, no blind spot'], watched: ['#e0902f', '\uD83D\uDCF9', 'watched'], partial: ['#c9a300', '\uD83D\uDCF9', 'blind spots'], blind: ['#3fae6a', '\uD83D\uDD76\uFE0F', 'no cameras'], unknown: ['#9a9ab0', '\uD83D\uDCF9', 'see notes'] };
    function survBadge(sv) {
        if (!sv || !SURV[sv.level]) return null;
        const [c, ic, lbl] = SURV[sv.level];
        return h('span', { class: 'rpgc-surv', style: `color:${c}`, title: sv.text || lbl }, ic, ' ', lbl);
    }
    function floorRank(label, name) {
        const t = String(label || '').toLowerCase(), n = String(name || '').toLowerCase();
        if (!t) return /roof/.test(n) ? 99 : /basement|cellar/.test(n) ? -1 : null;
        const nums = { basement: -1, ground: 0, first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8 };
        const hits = Object.keys(nums).filter(k => new RegExp(`\\b${k}\\b`).test(t)).map(k => nums[k]);
        if (/\bfloor|basement|storey|level\b/.test(t) && hits.length) return hits.reduce((a, b) => a + b, 0) / hits.length;
        return null;
    }
    function renderAtlas() {
        const info = state.hms && state.hms.atlas;
        if (!info || !info.count || S()?.showAtlas === false) return null;
        const A = state.atlasData && state.atlasData.version === info.version ? state.atlasData : null;
        if (!A && !state.atlasReq && state.open.atlas !== false) { state.atlasReq = true; send({ type: 'atlas_get', chatId: state.chatId }); }
        const idx = state.atlasIndex || new Map();
        const hereId = info.here ? info.here.id : null;
        const onPath = new Set((info.trail || []).map(t => t.id));
        const trail = h('div', { class: 'rpgc-atlas-trail', 'aria-label': 'Where you are' }, '\uD83D\uDCCD ',
            ...(info.trail || []).flatMap((t, i) => [i ? h('span', { class: 'sep' }, '\u203A') : null,
                // a room with nothing inside opens as its place among its neighbours, selected
                h('button', { class: t.id === hereId ? 'here' : '', onclick: () => { const n = idx.get(t.id); state.atlasFocus = n && !n.children.length && n.parent != null ? n.parent : t.id; state.atlasSel = t.id; render(); } }, t.name)]),
            info.here && info.here.transit != null ? h('span', { class: 'rpgc-note' }, ` \u203A on the road${info.here.transit ? ` to ${info.here.transit}` : ''}`) : null,
            info.here && info.here.past && info.here.past.length ? h('span', { class: 'rpgc-note', title: 'The HUD names a place the location book does not have' }, ` \u203A ${info.here.past.join(' \u203A ')} (not in the book)`) : null,
            info.surv ? survBadge(info.surv) : null);
        if (!A) return section('atlas', 'Atlas', state.open, `${info.count} places`, trail, h('p', { class: 'rpgc-note' }, 'Opening the location book\u2026'));
        // what to show: the place you chose, or the one around you
        const here = hereId != null ? idx.get(hereId) : null;
        let focusId = state.atlasFocus != null && idx.has(state.atlasFocus) ? state.atlasFocus : null;
        if (focusId != null && !idx.get(focusId).children.length && idx.get(focusId).parent != null) { state.atlasSel = focusId; focusId = idx.get(focusId).parent; }
        if (focusId == null) focusId = here ? (here.children.length ? here.id : (here.parent != null ? here.parent : here.id)) : (A.roots.length ? A.roots[0] : null);
        const focus = focusId != null ? idx.get(focusId) : null;
        if (!focus) return section('atlas', 'Atlas', state.open, `${info.count} places`, trail);
        const selId = state.atlasSel != null && idx.has(state.atlasSel) ? state.atlasSel : (hereId != null && focus.children.includes(hereId) ? hereId : focus.id);
        const tile = (id) => {
            const n = idx.get(id);
            if (!n) return null;
            const kids = n.children.filter(c => idx.has(c)).length;
            const sv = n.surv && SURV[n.surv.level];
            const cls = ['rpgc-atlas-tile', n.generic ? 'generic' : '', n.stub ? 'stub' : '', id === hereId ? 'here' : onPath.has(id) ? 'onpath' : '', id === selId ? 'sel' : ''].filter(Boolean).join(' ');
            return h('button', { class: cls, title: (focus.notes && focus.notes[id]) || n.summary || n.name,
                onclick: () => { state.atlasSel = id; if (n.children.length) state.atlasFocus = id; render(); } },
                sv ? h('span', { class: 'bar', style: `background:${sv[0]}` }) : null,
                h('span', { class: 'nm' }, id === hereId ? '\uD83D\uDCCD ' : '', n.name),
                h('span', { class: 'sub' }, kids ? h('span', null, `\u25B8 ${kids}`) : null, n.generic ? h('span', null, 'any') : null,
                    (n.flags || []).filter(f => /EVENT/i.test(f)).map(f => h('span', null, f.replace(/^EVENT\s*[\u2014\u2013-]?\s*/i, '').toLowerCase() || 'event')),
                A.maps && A.maps[id] ? h('span', { title: 'A saved map of this place' }, '\uD83D\uDDFA\uFE0F') : null, sv ? h('span', { style: `color:${sv[0]}` }, n.surv.level === 'full' ? 'no blind spot' : sv[2]) : null));
        };
        // group the places inside by floor, top floor first; anything else keeps the book's order
        const groups = new Map();
        for (const id of focus.children) {
            const n = idx.get(id); if (!n) continue;
            const r = floorRank(n.level, n.name);
            const key = n.level ? n.level : r === 99 ? 'Roof' : r === -1 ? 'Basement' : '';
            if (!groups.has(key)) groups.set(key, { label: key, rank: r === null ? (key ? 50 : -50) : r, ids: [] });
            groups.get(key).ids.push(id);
        }
        const ordered = [...groups.values()].sort((a, b) => b.rank - a.rank);
        const floors = ordered.length > 1 || (ordered[0] && ordered[0].label);
        const body = ordered.map(g => h('div', { class: 'rpgc-atlas-floor' }, floors ? h('span', { class: 'lbl' }, g.label || 'On this level') : null, h('div', { class: 'rpgc-atlas-grid' }, g.ids.map(tile))));
        const sel = idx.get(selId) || focus;
        const det = h('div', { class: 'rpgc-atlas-det' },
            h('div', { class: 'rpgc-atlas-head' }, h('b', null, sel.name), sel.kind ? h('span', { class: 'rpgc-chip' }, `Tier ${sel.tier} \u00B7 ${sel.kind.toLowerCase()}`) : null, sel.level ? h('span', { class: 'rpgc-chip' }, sel.level) : null, survBadge(sel.surv)),
            sel.summary ? h('p', null, sel.summary) : null,
            sel.surv && sel.surv.text ? [h('span', { class: 'k' }, 'Surveillance'), h('p', null, sel.surv.text)] : null,
            Object.entries(sel.meta || {}).map(([k, v]) => [h('span', { class: 'k' }, k.charAt(0) + k.slice(1).toLowerCase()), h('p', null, v)]),
            sel.anchors && sel.anchors.length ? [h('span', { class: 'k' }, 'Scene anchors'), h('ul', { style: 'margin:2px 0 0 16px;padding:0' }, sel.anchors.map(a => h('li', null, h('b', null, a.name), a.note ? ` \u2014 ${a.note}` : '')))] : null,
            sel.linked && sel.linked.length ? [h('span', { class: 'k' }, 'Linked'), h('p', null, sel.linked.join(' \u00B7 '))] : null,
            sel.stub ? h('p', { class: 'rpgc-note' }, 'Listed in the book without an entry of its own.') : null,
            A.maps && A.maps[sel.id] ? [h('button', { class: 'rpgc-btn', style: 'margin-top:6px', onclick: () => viewBanked(A.maps[sel.id]) }, state.mapView && state.mapView.key === A.maps[sel.id] ? 'Hide the saved map' : '\uD83D\uDDFA\uFE0F Saved map'),
                state.mapView && state.mapView.key === A.maps[sel.id] ? mapBox(state.mapView.svg, state.mapView.vars, `Saved map of ${sel.name}`) : null] : null);
        const focusBox = h('div', { class: 'rpgc-atlas-focus' },
            h('div', { class: 'rpgc-atlas-head' },
                focus.parent != null ? h('button', { class: 'rpgc-mini', title: 'Up one level', onclick: () => { state.atlasFocus = focus.parent; state.atlasSel = focus.id; render(); } }, '\u2191 Up') : null,
                h('b', null, focus.name), survBadge(focus.surv),
                hereId != null && here && focusId !== (here.children.length ? here.id : (here.parent != null ? here.parent : here.id)) ? h('button', { class: 'rpgc-mini', onclick: () => { state.atlasFocus = null; state.atlasSel = null; render(); } }, 'Where am I?') : null),
            focus.children.length ? body : h('p', { class: 'rpgc-note' }, 'Nothing listed inside this place.'),
            det);
        return section('atlas', 'Atlas', state.open, `${info.count} places`, trail, focusBox);
    }

    // What you carry beyond the HUD: what the bot assumes (standard issue) and what the story handed you.
    function renderCarried(y) {
        const out = [];
        const carried = Array.isArray(y.carried) ? y.carried : [];
        if (y.standard && y.standard.items && y.standard.items.length) {
            out.push(h('div', { class: 'rpgc-row', title: y.standard.note || '' }, h('span', { class: 'lbl' }, 'Standard issue'),
                h('span', { class: 'rpgc-chips' }, y.standard.items.map(n => h('span', { class: 'rpgc-chip' }, n)))));
        }
        out.push(h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Carried'),
            carried.length ? h('span', { class: 'rpgc-chips' }, carried.map(it => h('span', { class: 'rpgc-chip', title: it.from === 'you' ? 'Added by you' : 'Handed over in the story' }, it.name, ' ',
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${it.name}`, title: 'Not carried any more', onclick: () => send({ type: 'pocket', chatId: state.chatId, op: 'remove', key: it.key }) }, '\u2715'))))
                : h('span', { class: 'rpgc-note' }, 'Nothing yet. Things you are handed in the story land here.')));
        const inp = h('input', { type: 'text', placeholder: 'Add something you carry', 'aria-label': 'Add something you carry', style: 'flex:1;min-width:0' });
        const add = () => { const v = inp.value.trim(); if (!v) return; inp.value = ''; send({ type: 'pocket', chatId: state.chatId, op: 'add', name: v }); };
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        out.push(h('div', { class: 'rpgc-row' }, inp, h('button', { class: 'rpgc-mini', onclick: add }, 'Add')));
        return out;
    }

    function renderMagic() {
        const m = magicOf();
        const c = sysCfg().magic || {};
        if (!m || c.enabled === false) return null;
        const out = [];
        for (const v of m.pools) out.push(h('div', { class: 'rpgc-vital ' + v.level }, h('div', { class: 'head' }, h('span', { class: 'lbl' }, v.label), h('span', { class: 'num' }, `${fmtNum(v.cur)} / ${fmtNum(v.max)}`)), levelBar(v.pct, v.level)));
        for (const v of m.meters) out.push(h('div', { class: 'rpgc-vital ' + v.level }, h('div', { class: 'head' }, h('span', { class: 'lbl' }, v.label), h('span', { class: 'num' }, `${fmtNum(v.pct)}%`), v.stage ? h('span', { class: 'stage' }, v.stage) : null), levelBar(v.pct, v.level)));
        for (const g of m.arts) out.push(h('div', { class: 'rpgc-abil' }, h('h4', null, g.category), h('div', { class: 'rpgc-chips' }, g.items.map(it => h('span', { class: 'rpgc-chip abil' }, it.label ? h('em', null, it.label + ': ') : null, it.name, it.level ? h('span', { class: 'lv' }, ` Lv ${it.level}`) : null, it.state ? h('span', { class: 'st' }, ` (${it.state})`) : null)))));
        for (const cd of m.cooldowns) out.push(h('p', { class: 'rpgc-note' }, '\u23F3 ' + cd));
        if (m.spellbook.length) out.push(h('div', { class: 'rpgc-abil' }, h('h4', null, `Spellbook (${m.spellbook.length})`),
            h('div', { class: 'rpgc-chips' }, m.spellbook.map(sp => h('span', { class: 'rpgc-chip abil', title: [sp.note, sp.from === 'fight' ? 'seen in a fight' : 'seen in the story', sp.seen > 1 ? `${sp.seen} times` : null].filter(Boolean).join(' \u00B7 ') },
                sp.name, sp.cost ? h('span', { class: 'st' }, ` ${sp.cost}`) : null)))));
        return section('magic', 'Magic', state.open, m.spellbook.length ? `${m.spellbook.length} spells` : null, ...out);
    }

    // Every feature in one place. Each switch writes the setting the feature already obeys.
    const MODULES = [
        ['Trackers', [['You', 'hmsSystems.you.enabled'], ['Magic', 'hmsSystems.magic.enabled'], ['Party (in People)', 'hmsSystems.party.enabled'], ['People', 'hmsSystems.relations.enabled'], ['Phone', 'hmsSystems.comms.enabled'],
            ['Vitals (in You)', 'hmsSystems.vitals.enabled'], ['Wounds', 'hmsSystems.body.wounds'], ['Conditions', 'hmsSystems.body.conditions'], ['Abilities', 'hmsSystems.abilities.enabled'], ['Quest details', 'hmsSystems.quests.details'], ['Survival clock', 'hmsSystems.survival.enabled', false]]],
        ['Story tools', [['Fights', 'encounterSettings.enabled'], ['Present characters (in People)', 'showCharacterThoughts'], ['Quests', 'showQuests'], ['D&D', 'dnd.enabled'], ['Weather', 'enableDynamicWeather', false], ['Portraits', 'enableAvatars', false], ['Thoughts in chat', 'showThoughtsInChat', false], ['Atlas (the location book)', 'showAtlas'], ['Chronicle', 'chronicle.enabled'], ['New game builder', 'showNewGame'], ['OOC guide', 'showOoc']]],
        ['Extras', [['World card', 'worldCard'], ['Injuries', 'hmsSystems.injuries.enabled'], ['Chapters', 'chapters.enabled'], ['Lorebook context', 'lore.enabled'], ['Long-term memory', 'memory.enabled'], ['Test zone button', 'uiTestZone'], ['Recover a HUD from the model\u2019s thinking', 'recoverFromThinking']]]
    ];
    function renderModulesSettings() {
        const s = S();
        const groups = MODULES.map(([title, list]) => h('div', { class: 'rpgc-modgroup' }, h('h4', { class: 'rpgc-subhead' }, title),
            h('div', { class: 'rpgc-modgrid' }, list.map(([label, path, def]) => {
                const cur = pathGet(s, path);
                const on = cur === undefined ? def !== false : cur !== false;
                const box = h('input', { type: 'checkbox', 'aria-label': label });
                box.checked = on;
                box.addEventListener('change', () => { pathSet(s, path, box.checked); saveSettings(false); render(); });
                return h('label', { class: 'rpgc-mod' + (on ? ' on' : '') }, box, h('span', null, label));
            }))));
        const place = h('select', { 'aria-label': 'Where the side-panel request goes', onchange: (e) => { s.injectPlacement = e.target.value; saveSettings(false); } },
            h('option', { value: 'system' }, 'Its own message before yours (recommended)'), h('option', { value: 'append' }, 'Added to your message (1.8 and earlier)'));
        place.value = s.injectPlacement === 'append' ? 'append' : 'system';
        return section('s-modules', 'Modules', closedByDefault('s-modules'), null,
            h('p', { class: 'rpgc-note' }, 'Switch off anything you do not use: it leaves the panel and the prompt, and costs no tokens.'),
            ...groups,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Request placement'), place),
            h('p', { class: 'rpgc-note' }, 'With the HMS Reporter preset, the request sits in the preset\u2019s own slot after the chat and is not added again, so this setting does not apply. Any other preset can do the same with ',
                h('code', null, '{{if::{{matches::{{rpgc_on}}::^1$}}}}{{rpgc_request}}{{/if}}'), '.'));
    }

    // The guide (GUIDE.md, shipped inside the extension): one section per part, a find box, Start here open.
    function renderGuide() {
        const find = String(state.guideFind || '').trim().toLowerCase();
        const { intro, secs } = guideSections(GUIDE_MD);
        const out = [topBar()];
        if (!secs.length) { out.push(h('p', { class: 'rpgc-note' }, 'The guide is missing from this build. GUIDE.md in the extension folder has the same text.')); return out; }
        const box = h('input', { type: 'search', placeholder: 'Find in the guide (for example: pin, OOC, emoji)', 'aria-label': 'Find in the guide', value: state.guideFind || '', style: 'width:100%;box-sizing:border-box' });
        box.addEventListener('input', () => { state.guideFind = box.value; clearTimeout(state.guideT); state.guideT = setTimeout(() => { render(); const b = root.querySelector('input[aria-label="Find in the guide"]'); if (b) { b.focus(); b.setSelectionRange(b.value.length, b.value.length); } }, 250); });
        const wrap = h('div', { class: 'rpgc-guide' });
        wrap.appendChild(h('div', { class: 'rpgc-guide-intro' }, guideBlocks(intro, null)));
        wrap.appendChild(box);
        let shown = 0;
        secs.forEach((sec, i) => {
            const text = (sec.title + '\n' + sec.lines.join('\n')).toLowerCase();
            if (find && !text.includes(find)) return;
            shown++;
            const key = 'g-' + i;
            const d = section(key, sec.title, state.open, null, ...guideBlocks(sec.lines, find || null));
            if (find) d.open = true;
            else if (state.open[key] === undefined) d.open = i === 0;      // Start here opens; the rest wait
            wrap.appendChild(d);
        });
        if (find && !shown) wrap.appendChild(h('p', { class: 'rpgc-note' }, `Nothing in the guide matches \u201C${state.guideFind.trim()}\u201D.`));
        out.push(wrap);
        return out;
    }

    function renderHelpSettings() {
        const inc = h('input', { type: 'checkbox', 'aria-label': 'Include the latest reply' });
        const out = h('textarea', { rows: '6', readonly: true, 'aria-label': 'Bug report', placeholder: 'Your report appears here.', style: 'width:100%;font-family:ui-monospace,monospace;font-size:11px' });
        state.diagTarget = out;
        return section('s-help', 'Help & bug report', closedByDefault('s-help'), state.version ? 'v' + state.version : null,
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => { state.view = 'guide'; render(); } }, 'Open the guide'), h('span', { class: 'rpgc-note' }, 'How the bot, the HMS Reporter preset and this panel fit together, and what every card and setting does.')),
            h('p', { class: 'rpgc-note' }, h('b', null, 'How it fits together. '), 'In an HMS chat the World State is your bot\u2019s own HUD, read line by line: pin a line to keep it, and the guard flags a line that vanishes. The cards below read the same HUD \u2014 You, the world card for your bot, People, Quests and the rest. Fights: Immersive keeps you in the chat with the panel as the tracker; Turn-based opens the D&D window. Chapters keep summaries of the story so far. The Test zone is a practice chat that costs no tokens in Demo. Anything you do not use can be switched off under Modules.'),
            h('p', { class: 'rpgc-note' }, 'Found a bug? Copy a report and paste it in the Discord. It holds the version, your settings, what the extension read from the latest reply and recent problems \u2014 no chat text unless you tick the box.'),
            h('label', { class: 'rpgc-row' }, inc, h('span', null, 'Include the latest reply')),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => send({ type: 'diagnostics', chatId: state.chatId, includeReply: inc.checked }) }, 'Copy bug report')),
            out);
    }
    function onDiagnostics(msg) {
        const txt = '```json\n' + JSON.stringify({ ...msg.report, browser: navigator.userAgent, panel: S()?.uiPanelMode || 'drawer', theme: S()?.uiTheme || 'host' }, null, 1) + '\n```';
        if (state.diagTarget) state.diagTarget.value = txt;
        try { navigator.clipboard.writeText(txt).then(() => { state.status = { kind: 'ok', text: 'Bug report copied. Paste it in the Discord.' }; render(); }, () => {}); } catch { /* shown in the box */ }
    }

    // ── the mini panel: float it, minimise it, or pop it out to a second screen ──
    let floatBox = null, popWin = null, popLookObs = null;
    function panelMode() { return (S() && S().uiPanelMode) || 'drawer'; }
    function setPanelMode(mode) { const s = S(); s.uiPanelMode = mode; saveSettings(false); applyPanelMode(); render(); }
    function drawerNote(text, action) {
        tab.root.replaceChildren(h('div', { class: 'rpgc rpgc-parked' + themeClass() }, h('p', { class: 'rpgc-note' }, text), h('button', { class: 'rpgc-btn primary', onclick: action }, 'Bring it back here')));
    }
    function applyPanelMode() {
        const mode = panelMode();
        if (mode === 'float') {
            if (popWin) { try { popWin.close(); } catch { /* gone */ } popWin = null; }
            if (!floatBox) {
                const f = (S() && S().uiFloat) || {};
                floatBox = h('div', { class: 'rpgc-float', role: 'dialog', 'aria-label': 'RPG Companion' });
                const bar = h('div', { class: 'rpgc-float-bar' }, h('span', { class: 'ttl' }, 'RPG Companion'),
                    h('button', { class: 'rpgc-mini', 'aria-label': 'Minimise', title: 'Minimise', onclick: () => { floatBox.classList.toggle('min'); saveFloat(); } }, '\u2013'),
                    h('button', { class: 'rpgc-mini', 'aria-label': 'Enlarge', title: 'Enlarge', onclick: () => { floatBox.classList.toggle('big'); saveFloat(); } }, '\u25A1'),
                    h('button', { class: 'rpgc-mini', 'aria-label': 'Pop out to a new window', title: 'Pop out (second screen)', onclick: () => setPanelMode('popout') }, '\u2197'),
                    h('button', { class: 'rpgc-mini', 'aria-label': 'Back to the drawer', title: 'Back to the drawer', onclick: () => setPanelMode('drawer') }, '\u21E5'));
                floatBox.appendChild(bar);
                floatBox.style.left = (f.x ?? 80) + 'px'; floatBox.style.top = (f.y ?? 80) + 'px';
                if (f.w) floatBox.style.width = f.w + 'px'; if (f.h) floatBox.style.height = f.h + 'px';
                if (f.min) floatBox.classList.add('min'); if (f.big) floatBox.classList.add('big');
                let drag = null;
                bar.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; drag = { x: e.clientX - floatBox.offsetLeft, y: e.clientY - floatBox.offsetTop }; bar.setPointerCapture?.(e.pointerId); });
                bar.addEventListener('pointermove', (e) => { if (!drag) return; floatBox.style.left = Math.max(0, e.clientX - drag.x) + 'px'; floatBox.style.top = Math.max(0, e.clientY - drag.y) + 'px'; });
                bar.addEventListener('pointerup', () => { if (drag) { drag = null; saveFloat(); } });
                document.body.appendChild(floatBox);
            }
            floatBox.appendChild(root);
            drawerNote('The panel is floating. Drag it by its bar; minimise or enlarge it there.', () => setPanelMode('drawer'));
        } else if (mode === 'popout') {
            if (!popWin || popWin.closed) {
                popWin = window.open('', 'rpgc_popout', 'width=460,height=860');
                if (!popWin) { state.status = { kind: 'warning', text: 'The browser blocked the pop-out window. Allow pop-ups for Lumiverse and try again.' }; const s = S(); s.uiPanelMode = 'drawer'; return applyPanelMode(); }
                popWin.document.title = 'RPG Companion HMS Edition 2.0 beta';
                syncPopoutLook(popWin);
                try { if (!popLookObs) { popLookObs = new MutationObserver(() => syncPopoutLook(popWin)); popLookObs.observe(document.documentElement, { attributes: true }); if (document.body) popLookObs.observe(document.body, { attributes: true, attributeFilter: ['class'] }); } } catch { /* optional */ }
                popWin.addEventListener('beforeunload', () => { popWin = null; if (panelMode() === 'popout') { const s = S(); s.uiPanelMode = 'drawer'; saveSettings(false); applyPanelMode(); render(); } });
            }
            if (floatBox) { floatBox.remove(); floatBox = null; }
            let scroller = popWin.document.getElementById('rpgc-pop-scroll');
            if (!scroller) { scroller = popWin.document.createElement('div'); scroller.id = 'rpgc-pop-scroll'; scroller.tabIndex = -1; popWin.document.body.appendChild(scroller); }
            scroller.appendChild(root);
            try { scroller.focus({ preventScroll: true }); } catch { /* optional */ }
            drawerNote('The panel is in its own window.', () => setPanelMode('drawer'));
        } else {
            if (floatBox) { floatBox.remove(); floatBox = null; }
            if (popWin) { const w = popWin; popWin = null; try { w.close(); } catch { /* gone */ } }
            tab.root.replaceChildren(root);
        }
    }
    function saveFloat() {
        if (!floatBox) return;
        const s = S(); s.uiFloat = { x: floatBox.offsetLeft, y: floatBox.offsetTop, w: floatBox.offsetWidth || null, h: floatBox.offsetHeight || null, min: floatBox.classList.contains('min'), big: floatBox.classList.contains('big') };
        saveSettings(false);
    }
    function closedByDefault(id) { if (state.open[id] === undefined) state.open[id] = false; return state.open; }

    function renderLoreSettings() {
        const s = S();
        const L = () => (s.lore = s.lore || {});
        const rep = state.lore || null;
        // The status line is the point of this panel: it says what the last side call actually
        // carried, so "the fight ignored my lorebook" becomes something you can see.
        let note;
        if (!s.lore || s.lore.enabled === false) note = 'Off.';
        else if (!rep) note = 'Nothing sent yet.';
        else if (rep.names && rep.names.length) note = `${rep.names.length} entr${rep.names.length === 1 ? 'y' : 'ies'} sent${rep.where ? ` to the ${rep.where}` : ''}.`;
        else if (!rep.pooled) note = 'No world books are reaching this chat. Attach one to the character, the persona or the chat, or activate it globally.';
        else note = 'Nothing matched the last call. Check that your entries\' keywords appear in the scene.';

        return section('s-lore', 'Lorebook context', state.open, rep && rep.names && rep.names.length ? `${rep.names.length}` : null,
            h('p', { class: 'rpgc-note' }, 'Lumiverse gives the chat\'s own reply its world books. It does not give them to the extension\'s calls — those are direct calls to the model. Without this, fights, the tracker and the companion block ran with no lore at all.'),
            toggle('Send lore with the extension\'s calls', () => s.lore?.enabled !== false, v => { L().enabled = v; }, 'Your world books go with fights, the tracker and the side-panel block. Without this, those calls see none of your lore.'),
            toggle('Fights', () => L().inCombat !== false, v => { L().inCombat = v; }, 'The setup, every round and the aftermath.'),
            toggle('Tracker and companion block', () => L().inTracker !== false, v => { L().inTracker = v; }, 'What the panels are read from.'),
            toggle('Portraits', () => !!L().inPortraits, v => { L().inPortraits = v; }, 'Off by default: most lore is rules, not faces.'),
            toggle('Watch the chat\u2019s world info', () => L().watch !== false, v => { L().watch = v; },
                'Lets fights and the tracker pull entries the chat itself never triggered \u2014 an enemy\u2019s own entry, an ability\u2019s rules. The cost: while any extension watches world info, Lumiverse builds every prompt on its main thread instead of its faster worker pool, for every chat on this server. Turning it off takes effect when the extension restarts (disable and enable it in the Extensions panel); turning it on works at once.'),
            toggle('Also match the scene itself', () => L().matchSceneTerms !== false, v => { L().matchSceneTerms = v; },
                'Lumiverse matches lore against the chat. A fight happens outside the chat, so its enemies and abilities would never pull their own entries without this.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Most entries'),
                h('input', { type: 'number', min: '1', max: '80', value: String(L().maxEntries ?? 20), 'aria-label': 'Most entries', onchange: (e) => { L().maxEntries = Math.max(1, parseInt(e.target.value) || 20); saveSettings(); } })),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Character budget'),
                h('input', { type: 'number', min: '500', max: '60000', step: '500', value: String(L().maxChars ?? 6000), 'aria-label': 'Character budget', onchange: (e) => { L().maxChars = Math.max(500, parseInt(e.target.value) || 6000); saveSettings(); } })),
            toggle('Report what was sent', () => L().showInPanel !== false, v => { L().showInPanel = v; }, 'The panel lists which entries each call carried, so a missing entry is easy to spot.'),
            h('p', { class: 'rpgc-note' }, note),
            rep && rep.names && rep.names.length ? h('p', { class: 'rpgc-note' }, rep.names.join(' · ')) : null,
            rep && rep.exact === false ? h('p', { class: 'rpgc-note' }, 'Without the "world books" permission the extension approximates activation itself. Grant it in the Extensions panel for the host\'s exact result.') : null);
    }

    function renderEngineSettings() {
        const s = S();
        const C = () => (s.hmsCore = s.hmsCore || {});
        const M = () => (s.memory = s.memory || {});
        const rep = state.lore || null;
        return section('s-engine', 'Engine core & memory', state.open, null,
            h('h4', null, 'The engine core in fights'),
            h('p', { class: 'rpgc-note' }, 'Your bot keeps its combat law in the card — the rank hierarchy, STATE IS GOD, the lethality gate, how power is actually compared. The fight calls always received the card, but as "information about the characters", so a rules engine read as flavour. It is now sent as the engine, and binding.'),
            toggle('Run the core in fights', () => C().inCombat !== false, v => { C().inCombat = v; },
                'The setup, every round and the aftermath. The aftermath renders the HUD; the JSON calls are told not to.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Core budget (chars)'),
                h('input', { type: 'number', min: '2000', max: '200000', step: '1000', value: String(C().maxChars ?? 80000), 'aria-label': 'Core budget', onchange: (e) => { C().maxChars = Math.max(2000, parseInt(e.target.value) || 80000); saveSettings(); } })),
            h('p', { class: 'rpgc-note' }, 'The cores run roughly 30–52k characters (~8–13k tokens), so the default carries the largest whole. It is real cost on every fight call — but it is the same core the chat itself runs on every turn. Lowering it truncates the core, which is worse than leaving it off.'),

            h('h4', null, 'Long-term memory'),
            h('p', { class: 'rpgc-note' }, 'Lumiverse feeds the chat\'s own reply from the Memory Cortex and the vectorised chunk store. A fight got neither, so it knew only the last few messages. This retrieves what is relevant to the fight rather than widening the history window.'),
            toggle('Use memory', () => M().enabled !== false, v => { M().enabled = v; }, 'Lumiverse\u2019s long-term memory goes with the extension\u2019s calls.'),
            toggle('In fights', () => M().inCombat !== false, v => { M().inCombat = v; }, 'Fight setups recall what matters about the people in them.'),
            toggle('In the tracker and companion block', () => !!M().inTracker, v => { M().inTracker = v; }, 'Off by default: the tracker reads the latest reply, where recall rarely helps.'),
            toggle('Memory Cortex (entities, relations, arc)', () => M().cortex !== false, v => { M().cortex = v; }, 'Who is who and how they relate, from Lumiverse\u2019s Memory Cortex.'),
            toggle('Long-term chat chunks', () => M().longTerm !== false, v => { M().longTerm = v; }, 'Passages from far back in this chat that match the scene.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'How many to recall'),
                h('input', { type: 'number', min: '1', max: '30', value: String(M().topK ?? 6), 'aria-label': 'How many to recall', onchange: (e) => { M().topK = Math.max(1, parseInt(e.target.value) || 6); saveSettings(); } })),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Memory budget (chars)'),
                h('input', { type: 'number', min: '500', max: '40000', step: '500', value: String(M().maxChars ?? 4000), 'aria-label': 'Memory budget', onchange: (e) => { M().maxChars = Math.max(500, parseInt(e.target.value) || 4000); saveSettings(); } })),
            rep && rep.memory && rep.memory.length ? h('p', { class: 'rpgc-note' }, `Last call recalled: ${rep.memory.join(' · ')}.`)
                : rep && rep.memoryOn === false ? h('p', { class: 'rpgc-note' }, 'Memory is off, or the "memories" permission has not been granted.')
                : h('p', { class: 'rpgc-note' }, 'Nothing recalled yet.'));
    }

    function renderHmsSettings() {
        const s = S();
        const modeSel = h('select', { 'aria-label': 'HMS mode', onchange: (e) => { s.hmsMode = e.target.value; saveSettings(); } },
            h('option', { value: 'auto' }, 'Automatic (on when the chat has a WORLD STATE HUD)'),
            h('option', { value: 'on' }, 'Always on'),
            h('option', { value: 'off' }, 'Off (classic RPG Companion)'));
        modeSel.value = s.hmsMode || 'auto';
        return section('s-hms', 'HMS engine', state.open, hmsOn() ? 'active' : 'not detected',
            h('p', { class: 'rpgc-note' }, 'In HMS chats the WORLD STATE HUD is the tracker. The extension reads it and never asks the model for a competing one.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Mode'), modeSel),
            toggle('Ask for present characters and thoughts', () => s.hmsCompanion, v => { s.hmsCompanion = v; }, 'A small block after the prose, hidden from the chat. Off means the extension adds nothing to the reply at all.'),
            toggle('Fetch a forgotten side-panel block', () => s.catchUp !== false, v => { s.catchUp = v; }, 'Some models leave the block out now and then. Only then, it is fetched with a quick second call, so the panel does not go stale. Three misses running and the panel suggests Separate mode.'),
            toggle('Watch for dropped HUD lines', () => s.hmsGuard, v => { s.hmsGuard = v; }, 'Flags lines that vanish between replies, with a one-click restore.'),
            toggle('Remind the model of pinned lines', () => s.hmsPinReminder, v => { s.hmsPinReminder = v; }, 'Your pinned HUD lines are repeated in the prompt, so they are less likely to drop in the first place.'));
    }


    // ── start ──
    render();
    syncChat();
    if (!state.chatId) requestState();

    return () => {
        try { if (floatBox) floatBox.remove(); if (popWin && !popWin.closed) popWin.close(); } catch { /* gone */ }
        clearInterval(pollTimer);
        clearTimeout(saveTimer);
        clearTimeout(settingsTimer);
        evUnsubs.forEach(u => { try { u(); } catch { /* ignore */ } });
        try { unsubBackend(); } catch { /* ignore */ }
        try { refreshAction.destroy(); } catch { /* ignore */ }
        try { openAction.destroy(); } catch { /* ignore */ }
        try { fightAction.destroy(); } catch { /* ignore */ }
        try { worldAction.destroy(); } catch { /* ignore */ }
        try { if (encModal) encModal.dismiss(); } catch { /* ignore */ }
        clearTimeout(plotTimer);
        try { tab.destroy(); } catch { /* ignore */ }
        removeWeather();
        removeStyle();
    };
}
