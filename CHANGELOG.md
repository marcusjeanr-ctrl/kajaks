# Changelog — RPG Companion HMS Edition

## 2.0 beta — the official beta
- **The guide is built in.** A **Guide** button in the top bar opens the whole guide in the panel, with a find
  box; the same text is `GUIDE.md`. It explains the three parts (bot, preset, extension), who is in charge,
  setup, a new game, each turn, every card, OOC questions, memory, every setting, and fixes for common problems.
- **The Cosmic Hierarchy is removed**: its module, card, settings, world preset and the Nexus theme. Saved
  settings drop it by themselves (a chosen Nexus theme falls back to Lumiverse's own).
- **Each part stays in its lane.**
  - Injuries: a bot that keeps its own wounds (Re:Zero, Mushoku Tensei) owns them for the whole chat, also on
    turns where its HUD shows none. The extension used to step in on those turns and could remind the model of
    a wound the HUD had already healed.
  - Experience is asked only where the HUD shows a level. Re:Zero, Mushoku Tensei and Classroom of the Elite
    no longer get an XP question every reply.
  - **Move the world** is no longer marked OOC (an OOC message is now answered outside the story, with no HUD).
    The Test zone's plot buttons likewise.
  - The **Chronicle** switch in Modules really stops it (it used to hide only the card while still asking and
    writing).
  - The Man-God's advice is asked only while the world card is on.
- **New game**: start lines in capitals are found (`MUSHOKU_TENSEI_START_HANDLER`), and from the lorebook when
  the catalog pages do not name them. **Resume an old campaign** builds the bot's Start Continuer message from
  the old chat's last HUD, your last messages and a summary.
- **A world preset in one click**: after the first reply, the panel offers the preset for the bot it found
  (once per world).
- **Settings open as a short list**: every section starts closed.
- **Fixes**: a time like `12:40` showed as a label "12" in the World State card; the world card shared its
  open/closed state with the World State card; a quest deadline given as a bare time ("08:40") counted to the
  next day instead of showing overdue; a turn-based fight's aftermath now keeps the plot, objectives, key
  moments, inbox and injuries like any reply; search boxes take the panel's colours.
- **HMS Reporter beta** (the preset, was 0.5): renamed, with a plain description of who owns what.
- Version: the manifest says 2.0.0; the panel and bug reports say 2.0.0-beta.

- 1.9.26: New game, the OOC guide, the Arc line guard; emoji have one owner.
  - **New game builder** from the bot's own catalog pages and start handler line (see above).
  - **OOC guide** in the panel, or in the chat with the bot's trigger; OOC turns are left alone.
  - **Arc line guard** with a one-click fix to the lorebook's spelling.
  - **Emoji: one owner.** The extension draws them from the dialogue markers; HMS Reporter 0.5 no
    longer has an emoji block or asks the model for any.
  - Catalog descriptions no longer repeat their label.
- 1.9.25: The map bank, and fixes from the first Chronicle test.
  - **Map bank.** A room drawn once is kept for its world and used on every later visit and in every
    chat with that bot, so it is never drawn (or paid for) twice. View, forget, save the current
    version, or clear the bank from the Map card; the Atlas shows 🗺️ on places with a saved map and
    opens it in the details. Setting: Chat and panel extras → Map bank.
  - **Windows belong to walls.** A window the model gives as a block is drawn as a blue line in the wall
    it names, touches or is nearest to; the request says so too.
  - **One look for both maps.** The side-panel map uses the same world colours as the map under the
    reply.
  - **Atlas tiles readable in every panel theme** (they were dark boxes in the light themes).
  - **A room with nothing inside** opens among its neighbours in the Atlas, selected.
  - **The phone reads the story.** Texts, group chats and school or app notices that reach your phone
    are an optional `"inbox"` in the side-panel block (asked only when you have a device that takes
    messages). Notices show on the Phone card, people who messaged you become contacts you can answer,
    and Internal states shows them under Phone. Messages are no longer filed as things you carry.
  - **Your own device, per chat.** Name a phone (or mirror) on the Phone card when the story gave you one
    the HUD never prints.
- 1.9.24: The Chronicle.
  - **A timeline of the story**, read from the chat as it stands, so a swipe or an edit changes it too:
    milestones from the HUD (arc, rank, class, level, standing, powers gained, deaths and loops, quests,
    first visits), relationship history from the People readings (first meetings, standing and bond
    changes with their reason), plot threads opened and resolved, and key moments.
  - **Key moments** are one optional key in the side-panel block (`"moments"`, about 60 tokens of
    request, usually answered with `[]`). They show on the Plot tab of Internal states too.
  - **Chronicle card**: newest first, grouped by loop and day; filters for moments, bonds, plot,
    milestones and places; a name opens that person's timeline with you; star, hide, add your own;
    ✓ written, ⏳ waits for your answer.
  - **Written back into the Memory Cortex** once a reply is settled: facts with importance tags on the
    people, places and you; one `relationship` link per person toward you with its label and feeling;
    loops undone by Return by Death written as undone. Write now and Write everything again (after a
    Cortex rebuild; nothing doubles). Setting: Off, only the biggest, most (default), everything.
  - `{{rpgc_chronicle}}`: the key moments so far, for presets.
  - **Fix:** fights read the Memory Cortex's facts about the people in them again (the snapshot calls
    them `topFacts`).
- 1.9.23: The Atlas reads every bot's book.
  - **Re:Zero-style books.** Sections written as `**Label:**` lines (Appearance & Atmosphere, Function
    & Properties, Availability), lists written as `- **Name** *(note)*`, `◈ TIER n NAVIGATION ADDENDUM`
    and `◈ ADDITIONAL TIER n` lists, and `◆ POPULATION & FAUNA OVERLAY` entries (added to their place).
  - **One place, many spellings.** Paths that name a place differently in different entries become one
    place: short and long names, a name with its other name in brackets, `[Pocket Dimension]` flags,
    groups across cities (`[Royal Capital / Flanders / Costuul]`), a META copy of the root.
  - **No wrong links.** A listed room is looked for inside its own place and next to it, never across
    the world (Lugunica's throne room is not Vollachia's). A room listed under one name and written
    under another ("Maids' Rooms" / "Maids' Quarters") is one tile, not two.
  - **Cleaner text.** The details pane shows the book without markdown marks, list items as bullets.
  - **On the road.** `[In Transit: Lugunica → Vollachia]` stays one HUD segment; the Atlas shows you
    at the start of the trip, "on the road to Vollachia", and no room is drawn.
- 1.9.22: The Atlas.
  - **The location book as a map.** Every `◆ TIER` / `◈ PATH` entry becomes a place in one graph:
    parents from the paths, children in the book's navigation order, floors from `(Second Floor)`-style
    segments, surveillance graded (covered, watched, blind spots, no cameras), access and hours, who is
    usually there, scene anchors and links. The HUD's ◆ line is found in it, with the deepest known place
    and anything past the book shown as such. Built for all four HMS bots' shared format; tested on the
    Classroom of the Elite book (112 places).
  - **Atlas card** in the side panel: trail, floors, places as tiles coloured by how watched they are,
    and a details pane. Modules → Atlas switches it off.
  - **The map draws rooms from the book**: a new room's request carries its walls (or its shell's), its
    anchors and where it opens, once per room.
  - Internal states' Scene tab adds a Cameras line for the current place.
- 1.9.21: The map.
  - **Positions and the room map**, off by default: *Only in fights* or *Every reply*. Rooms are drawn
    once per place (from the location's lorebook entry when it is loaded) and kept; each reply then
    only moves people, with the last positions sent back for continuity. A Map tab in Internal states
    and a Map card in the side panel: walls, furniture, labelled ways out, and you, allies, foes and
    others in their own colours.
  - The D&D, Power scaling and Gritty play styles turn it on for fights; the others leave it off.
- 1.9.20: Internal states, and what you carry.
  - **Internal states panel** under each reply: Scene, People (with thoughts), Bonds (what moved, and
    why) and Plot, as tabs. Replaces the thoughts block by default; *Thoughts only* brings it back.
  - **Standard issue.** In Classroom of the Elite the phone, ID, uniform, dorm key and textbooks are
    assumed by the bot and never on its HUD; the Phone card now finds the phone, and the You card lists
    them.
  - **Carried.** The side-panel block now reports things handed over or lost on screen (`got` / `lost`);
    they collect in the You card, follow swipes, and can be removed or added by hand.
- 1.9.19: The HUD card and dialogue display.
  - **HUD card** in the chat (on by default), in the bot's world colours or Lumiverse's, with the plain
    text one click away. Display only: the saved HUD never changes.
  - **Dialogue colours, emoji reading cues and speaker names** (off by default) from `[D:Name:mood]`
    markers, drawn when shown. 42 emoji families, editable; per-chat speaker colours.
  - New macros `{{rpgc_marks}}` and `{{rpgc_emoji}}` so a preset's own emoji instruction can stand down.
  - The Test zone log hides the markers.
- 1.9.18: The preset handshake.
  - **`{{rpgc_request}}`, `{{rpgc_on}}`, `{{rpgc_fight}}`.** A preset with the slot (HMS Reporter v0.2)
    carries the side-panel request where its own reply shape expects it; the extension sees it there and
    does not add a second copy. Without the slot, nothing changes. If the slot fails or is slow, the
    extension adds its own message as before.
  - **A smaller request.** Last reply's characters go back as names and looks only — their old
    thoughts and moods were the part that grew with every character in the scene, and invited repeats.
    Spells are asked for only where the HUD shows magic (not in Classroom of the Elite). In the slot the
    request also drops the lines the preset already covers. A Classroom of the Elite scene with five
    people: about 1,690 → 1,375 tokens.
  - Settings → Modules explains that Request placement does not apply when the preset carries it.
- 1.9.17: Fixes from the first HMS Reporter test.
  - **The WORLD STATE header written twice** (the preset's opening plus the model's own, seen with GLM)
    is now one header. The reply is cleaned when it lands and on screen, and the second header is never
    read as a HUD line — that was the false "a HUD line was dropped" alarm on the next reply.
  - **The same quest twice.** The HUD writes `Name #1572188`, the story block just `Name`; quests are now
    matched without the barcode, quotes or capitals, so the story's details join the HUD's quest instead
    of adding an "in the story" copy.
  - **Bond history** no longer logs a "change" that is only capital letters, punctuation or spacing.
  - The Injuries note no longer names the Re:Zero HUD in other worlds.
- 1.9.16: Choose the connection.
  - **Connection for side calls** (Settings → General). Fights, the tracker, chapter summaries, portrait
    prompts and the Test zone used to run on Lumiverse's *default* connection only — not the one you had
    selected — and failed with "No connection profile found" when no default was set, which is why a
    turn-based fight could not start. Every call now names its connection. **Same as my chat** (the
    default) follows the connection your own replies in that chat use; you can also pick Lumiverse's
    default, or any one connection, for example a cheaper model for side calls.
  - With nothing to follow yet it falls back to the connection selected in Lumiverse, then the default,
    then your first connection. A chosen connection that was deleted falls back the same way and says so.
  - The fight window now explains a missing connection in plain words instead of showing Lumiverse's raw
    error.
- 1.9.15: Fixes from the first round of real play.
  - **Operator-scoped installs**: reading world info, long-term memory and portraits failed with "userId is
    required for operator-scoped extensions". Every user-scoped call now carries the user.
  - **One-request-at-a-time providers** (free plans): the extension's own calls collided with your reply and
    came back 429. They now wait four seconds after a reply, stand aside if you have already sent the next
    message, and try a busy provider again twice; if it is still busy, the panel says so in plain words.
  - **Read again**: a new button that reads the latest reply again — HUD and side-panel block — without a model
    call. The manual way when the automatic read missed something.
  - **The World State says why it is empty**, and shows how the reply starts. A reply still being written no
    longer blanks it, and a HUD written in HTML is read through the markup.
  - **Fixed**: starting the Test zone over while a live turn was being written crashed it ("sandbox.busy").
- 1.9.14: Injuries on the Re:Zero HUD's injury law.
  - The Injuries card (for HUDs without wounds) now runs on the Re:Zero lorebook's own rules: raw → treated
    → healed; each kind and severity heals in its window (wounds, fractures, sprains, burns); a break left
    unset 3–4 days heals crooked and turns Permanent; a wound or burn left raw risks infection; internal
    bleeding needs a healer; Permanent never heals with time; a healed moderate-or-worse wound may scar.
  - The story is told each injury's state and the day it is on ("broken shin, severe fracture, treated, day 6
    of 70–112"), and the side-panel block asks for kind, severity and status in the same words.
  - Your controls: Treated, Back to raw, Healed, Healed with a scar, Permanent; add your own with a kind and
    severity. Injuries saved by 1.9.13 are read the new way.
  - The Body card (a HUD that keeps its own wounds) warns in the law's words: an unset break heals crooked.
- 1.9.13: From the players: what the cards send, forgetful models, injuries — and the whole Cosmic Hierarchy.
  - **What the story is told, said plainly.** The Survival and Mind cards now say it: once you are tired, hungry
    or thirsty, or your state of mind is not calm, the story is told with every message so it can play it.
    The buttons log what you did; the story reports it too. With "Tell the story" off, they say only you see them.
  - **Models that forget the side-panel block.** When a reply leaves it out, it is fetched with one quick second
    call, only then, so the panel does not go stale. Three misses running and the panel suggests Separate mode.
  - **Injuries**, for HUDs that do not keep wounds: the story reports every injury you carry; the Injuries card
    shows how bad each is, whether it was treated and for how long; you can add one, mark it treated or healed;
    and the story is told them with every message. A HUD that prints its own wounds owns them.
  - **Fixed**: Separate mode (and Refresh in an HMS chat) dropped the plot, objectives, the Cosmos reading and
    the Man-God's advice it had read. It keeps everything now.
  - **The Cosmic Hierarchy, from its full lorebook**: Kael, Malachi and Janus (Gaius and Malus) join the family,
    with the nine servitor orders; the Creator is your persona; six pulls instead of four (Memory–Oblivion and
    Good–Evil); the gated arcs tracked phase by phase, with a warning when one skips; the Dice of Fate move the
    world, never the Creator himself; and the veil line steps aside when the lorebook already carries it.
- 1.9.12: The Cosmic Hierarchy, and sections that no longer close by themselves.
  - **Fixed**: a section could snap shut (or back open) on its own. It saved its new state on the browser's
    toggle event, which arrives a moment after the click; if a reply landed or the panel refreshed in that
    moment, the panel was rebuilt in the old state. The state is now saved on the click itself.
  - **The Cosmic Hierarchy module**: the Dice of Fate (Aurora and Moira roll with every exchange and lean the
    next beat), who of the hierarchy is present and the omens mortals notice, the balance between the
    Firstborn's domains, the realm and its Overseer, the knowledge veil, and an editable roster from the lore
    bible. Off by default; its own preset turns it on, with the new Nexus theme.
- 1.9.11: The plot and objectives, and the three new worlds checked.
  - **The Quests card opens with the plot** — where the main story stands and its open threads, marked moved or
    resolved as the story goes, the resolved ones kept below — **and objectives**: what you are trying to do right
    now as the story sets it, plus your own, which stay with you and are never sent. HMS and classic chats. They
    add about 190 tokens to the side-panel request; switch either off under Settings → Quests.
  - **Undertale's MERCY** in immersive fights: a monster that can be spared is marked, and sparing everyone ends
    the fight as spared, not as an escape.
  - **Each thing in one place**: what a world card shows — Authorities, classes, shouts, skills, the covenant — the
    Abilities card no longer lists a second time. Switch the world card off and it lists them again.
  - **The three new presets, checked**: Dark Souls no longer shows Estus twice (as a bar and as flasks); Undertale's
    LV, EXP, AT and DF live on the world card only; Skyrim's perk count is not read as an ability.
- 1.9.10: The presets, checked, and three more worlds.
  - **Every preset turns HMS on** (Always mode, the side-panel block, the guard, pin reminders) — the play styles
    did not touch it before.
  - **Fixed**: a world preset *replaced* whole sections of your settings instead of changing only what it names.
    Applying Overlord, say, reset your chapter budget, your D&D rules, the legacy window switch and your XP
    curve to their defaults. A preset now merges into your settings.
  - **Fixed**: the four wiki themes (1.9.0) were partly overwritten by the older world themes further down the
    stylesheet, so Re:Zero, Overlord, Classroom of the Elite and Mushoku showed a mix of the two looks —
    Mushoku's cream wiki cards with the old dark theme's pale text. The old rules are gone; each shows as
    designed.
  - **The world presets, reviewed**: Overlord gets its world card, Arcs chapters and engine-rule fights (it had
    power scaling, and no world card); Overlord, Classroom of the Elite and Mushoku switch D&D off (their own
    systems replace it) and Classroom of the Elite drops your roller (the School Database rolls); Re:Zero keeps
    D&D for its D&D mode and adds Arcs to Loops; every world keeps its arcs as chapters.
  - **The play styles, reviewed**: Pure narrative now really has no dice (no roller, no D&D) and asks fights for
    the least; Gritty survival plays on Hard; Social & romance turns the phone on.
  - **Undertale, Dark Souls and Skyrim**: a world preset, a theme, a world card and a Test zone world each.
    Undertale's SAVE, LOAD and RESET count as rewinds, so each timeline can be a chapter.
  - **Fights**: a HUD that prints your Stamina (Dark Souls, Skyrim) owns it, like HP and MP; FP and Magicka are
    read as MP.
- 1.9.9: A full diagnosis of 1.9.8, top to bottom.
  - **Every switch explains itself.** 37 settings switches had no line saying what they do; each has one now.
  - **Settings with no control**: the You module's level-up note and the XP needed for each level could only be
    changed by editing files. They are under HMS systems → You.
  - **Faster in long chats**: the panel re-read every system of every HUD in the chat to build the quest journal,
    about 440 ms per refresh on a 1,200-message chat. It reads only the quest lines now and remembers HUDs it
    has read: about 80 ms.
  - **Bounded memory**: the per-chat caches grew with every chat you opened; they keep the recent ones now.
  - **Plain-language errors**: a missing permission read "PERMISSION_DENIED: generation"; it now names the
    permission and where to grant it. A timeout says how long it waited and where to raise it.
  - **Dead code removed**: the old Chapter card was still in the file, hidden behind the new one.
  - **Modules** now cover Chapters, Lorebook context and Long-term memory too; switched off, a card leaves the
    panel and its text leaves the prompt, as everywhere else.
  - **Help & bug report** opens with a short guide to how the panel fits together, and its version always
    matches the build (it used to be typed in by hand).
  - **Fixed**: ending a turn-based fight before a single round closed the window without a word; the panel now
    says nothing was posted and why.
  - **Fixed**: a Godmother Decree due at midnight on January 1, set on December 31, showed as eleven months past.
  - **Fixed**: with the world card switched off, the D&D card stopped reading the D&D sheet the HUD prints.
  - **Fixed**: a level the HUD prints could be "raised" by hand in the D&D card, with no effect. Those buttons
    are locked now, like the rest of a HUD-owned sheet.
  - With only one kind of fight available, the fight button opens it straight away instead of a one-item chooser.
  - The README's settings map covers every section of Settings, and the panels are listed once each, in the
    order the panel shows them.
  - **Tested further**: every Test zone world in Live mode; a classic chat in Separate mode; both fight
    windows played by clicking; the floating panel; the model answering with garbage, nothing, the wrong
    shape, an error or never; each permission missing; every view scanned for leftover program text.
- 1.9.8: The world cards read the rulebooks and lorebooks behind each world.
  - **Re:Zero**: magic (element, what the Gate and Pool ranks mean, the element's spell series), Spirit
    Affinity, what each spirit rank is, Od Integrity and Corruption on their named stages with the next one,
    and curses. Entries marked SECRET — the sealed Sovereign forms — never reach the panel.
  - **Overlord**: each tradition's spells up to its LV from your magic core, and a framework check against the
    Being Framework, Traditions and Super-Tier rules. The Test zone's Overlord build now follows those rules.
  - **Mushoku Tensei**: sword techniques per style and rank from your technique index, the matchup triangle,
    and what your Mana Capacity and Touki stage mean.
  - **Fixed**: an ability description could come from a module's rulebook (how the engine heals a curse)
    instead of the entry about the thing itself.
- 1.9.7: A full pass over everything since 1.9.1.
  - **Fixed**: a clock going back was read as Return by Death in every story, so a new school year in
    Classroom of the Elite could close a "loop", and a new K. year in Mushoku Tensei could drop a fight as a
    rewind. Only a story with Return by Death rewinds now.
  - **Fixed**: your own presets forgot everything added since 1.8 — immersive fights, D&D, Chapters, the world
    card, Lorebook context, the engine core and memory. They remember all of it now.
  - **Fixed**: with "Watch the chat's world info" off, a world card showed no ability descriptions, class caps
    or spell lists until the first fight or tracker call. It reads the lorebook as soon as the card appears.
  - **Fixed**: amber text (enemy telegraphs, legendary classes) was hard to read on the light themes.
  - The bug report now says which systems are in play: the world card, chapters, a fight, D&D, the lore pool.
  - Modules name where merged parts live ("Party (in People)"), and the README is brought up to date:
    install permissions, presets, the Test zone, engines tested.
- 1.9.6: The world cards, built out from the bots' own start handlers, central controls and registries.
  Re:Zero shows the Arc 0 prequel year on the handler's −20 → 0 axis with its Part and milestones. Overlord
  reads each job class's tier and cap from your class registry, marks legendary classes, and shows traditions
  with their LV. Classroom of the Elite shows the school calendar and the days to the next Class Point
  announcement, and Chapters can follow the school months. Mushoku Tensei lists what you can cast in each
  school from your Master Spell Index, and what the next rank opens. The Test zone plays Mushoku Tensei, and
  its Re:Zero, Overlord and CotE scripts print the bots' current HUDs, so their world cards show there too.
- 1.9.5: A card of its own for each of the four worlds — Re:Zero, Overlord, Classroom of the Elite and Mushoku
  Tensei — found from the HUD. Overlord fights know every combatant's level and the gap to yours. The D&D card
  reads a D&D character sheet the HUD prints. The Mushoku Tensei preset is an HMS preset now (carriers,
  abilities, no survival clock, no phone); the Re:Zero preset switches Loops chapters on.
- 1.9.4: The pop-out window scrolls again. Lumiverse's own page rules (which the window copies so it matches
  the app) make the page itself unscrollable; the panel now scrolls in a container of its own, with the mouse
  wheel, touch and the keyboard.
- 1.9.3: Chapters, one card per person, and nothing asked twice.
  - **Chapters** are memory at the story's own scale: by hand (the default), or — switched on — per loop
    under Return by Death, per arc, per day. Summaries ride on top of the history; nothing is removed. A
    finished loop is sent as undone and remembered only by you, and what you uncovered collects into one list.
    The old "hide everything before this message" chapter is gone; a chat still using one can show its
    messages again from the Chapters card.
  - **One card per person.** Present characters, Party and People showed the same person three times; they
    are one card under People now.
  - **Nothing asked twice.** A party member was asked their mood twice, what is on their mind twice (as
    "thoughts" and as "concern") and their jealousy twice on two scales. Each is asked once now and the
    party reading is filled from the others. With the survival clock on, your stress is read from your state
    of mind instead of being asked separately.
  - **Fixed**: in an immersive fight with fate dice, a roll you made yourself and your fate die both went to
    the model for the same action. Your own roll now replaces your fate die.
- 1.9.2: From the first look at 1.9.1.
  - **D&D is one section with one switch**: a per-chat sheet (ability scores, saves, the 18 skills,
    proficiency from your level), a roller that adds your modifiers, advantage and a DC and sends the whole
    sum into your next reply, and turn-based fights. Switched off, the Turn-based fight button goes too.
  - **You and Vitals are one card.** The same HP bar was shown twice.
  - **Quests have their own Settings section.**
  - **The panel's place is chosen in the top bar**, next to Test zone and Settings.
  - **Fixed**: the pop-out window used unstyled text boxes and default fonts; it now copies Lumiverse's own
    look and follows its theme. Dropdown lists were white with pale text in dark themes (and pale on white
    in light ones); they are readable in every theme now. The Test zone called you "User" instead of your
    persona. A roll made in one chat went into the next reply of whichever chat you used next.
- 1.9.1: One extension again, and fights split into two different things.
  - **Merged**: the lore, engine and memory work that had been numbered 1.9–1.11 on its own line is
    folded into this build. Fights, the tracker and the companion block now carry your world books
    (Lorebook context), your engine core as binding law (Engine core & memory), and the Memory Cortex.
  - **Fights are two things now.** *Immersive*: you fight in the chat and the panel tracks everyone —
    HP, MP, Stamina, effects and how long they have lasted, each fighter's last move, enemy telegraphs,
    hidden enemy plans, Study, acting on a weakness, fate dice, a fight log. *Turn-based*: the D&D
    window. The narrative window is a legacy option under Settings → Fights. Your style, fate dice and
    difficulty carry over to immersive fights. Auto-start stays off by default.
  - **Fixed** in immersive fights: the fight froze in HMS chats whenever Present characters, Party,
    People and Phone were all switched off (the numbers only came back through their block). A reply
    that only carried the fight numbers was ignored and left raw JSON in the chat. The note to the model
    told it not to render "a status block", which made classic chats drop their trackers — the likely
    cause of "No trackers yet" during a fight. Swipes inflated the reply count. Every enemy fleeing never
    ended the fight, and you getting away was not an outcome. An enemy knocked out with HP left was never
    down. The auto-start notice used a host call that does not exist, so it never showed. Correcting a
    number used a browser prompt the desktop app may not show. Switching Fights off mid-fight hid End
    fight while the fight kept running, and auto-start ignored the switch. The Test zone's Demo spent
    tokens on an immersive fight.
  - **Fixed**: in Separate mode, the companion call was told to "add the block after the prose" instead of
    describing the latest reply (a wording change in 1.9.0 broke it). Granting the memories permission
    mid-session did nothing until a restart. With no watched pool, the lore fallback read every book you
    own, so a fight in one world could pull another world's lore; it now reads only the books the chat uses.
  - **New switch**: Watch the chat's world info — see Lorebooks for what it costs.
  - Settings move to v8: "Turn-based" now always means the D&D window.
- 1.9.0: The pre-2.0 build, from playtest feedback.
  - **Fixed**: the side-panel request was appended to your own message (~1,170 tokens on a one-line turn),
    which shortened replies and pushed some models to write the HUD into their thinking. It now has its own
    system message before your turn, framed as an extra, and is trimmed.
  - **Fixed**: a HUD or block written into the model's thinking is moved back into the reply; a reply that
    still carries a raw block is processed later — never while it is still being written.
  - **Fixed**: Fights, Tracker field presets, Custom prompts and Reset closed themselves a few seconds after
    opening. A HUD drafted inside <think> was read as the state. A block with only our newer keys, or an empty
    fence, could show in chat. Move the world posted a visible OOC message (now a short marker). Plot buttons
    failed in the test zone. An edited HUD value of the same length could be served stale.
  - **Fixed**: in HMS chats, present characters no longer ask for per-character stats (Health, Arousal) — and
    the minor guard now covers character stats too. People tracks feelings; it no longer pulls NPCs toward
    neutral, and never steers how they are written.
  - **New**: You (with XP and level-ups), Magic, richer Quests, Check what?, Difficulty, Modules, wiki-style
    world themes plus D&D / Heaven / Horror, the floating mini panel and pop-out window, and the bug report.
- 1.8.0: World presets that set everything, and the test zone.
  - **Living World presets**: Re:Zero — The Living World, Overlord — The Living World and Classroom of the
    Elite — HMS Render Engine now configure HMS (always on), carriers, vocabularies, meters, quest tags, party
    depth, phone kind, fights and theme for their bot. Presets merge deeply: they change only what they name.
    Your own presets now remember every system, not just a few switches; presets saved by 1.6 still apply.
  - **Test zone**: a practice chat inside the extension, in Demo (scripted, free) or Live (your model) mode.
  - Density and text size.
  - Every chat call now goes through one layer, which is what lets the test zone run the real code paths.
- 1.7.0: Relationships done right, every chat, and worlds.
  - **Fixed: closeness was read as romance.** The ladder ended in Lover, so deep affection became a
    romantic label — it called Beatrice, a child-appearing spirit whose card makes her bond daughter-
    and-parent, a lover. Standing now measures closeness only (it tops out at Devoted); the kind of bond is
    tracked apart, from the character's own entry and contract; minors and family bonds are guarded from
    romance and desire by the extension itself; and the bond can be set by hand. Untouched v1.6 lists
    upgrade automatically.
  - Relationship cards: mood, bond, Desire / Tension / Jealousy bars, the reason under the bar that moved,
    and the present-character dossier.
  - **People, Party and Phone in classic chats**, with their own settings section. Before, they only
    existed in HMS chats, so any bot the HUD detector did not recognise never showed them.
  - Phone kinds: phone, conversation mirror, Message spell, comms radio. The device can come from the
    inventory in classic chats.
  - World presets (Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei) and six new themes.
- 1.6.0: People, the phone, two combat systems, and play-style presets.
  - **People**: a relationship tracker for everyone you deal with — standing on a ladder, six bars,
    what changed, alerts, and four layouts. Party members take affection and trust from here.
  - **Phone**: device and balance from the HUD, contacts earned in the story, threads from the chat;
    texts, calls and transfers go into the story, where the engine decides whether they connect.
  - **Fights split in two**: Narrative (engine rules, power level with feats, hax and counters, or
    fiction; fate dice; outcome badges) and D&D (a rules engine in the extension: initiative, attack
    rolls against AC, damage dice, crits, saving throws, spell slots, Dodge, death saves, massive
    damage, stabilising, and companions rolling to obey). Your v1.5 choice carries over.
  - **Play-style presets** and **themes**. Tracker presets were renamed Tracker field presets.
- 1.5.0: Fights rebuilt, and a full audit against every source.
  - **Fights**: Physical / Magical / Abilities & skills menus, orders for allies (a request their
    card and mood answer), Check with lasting intel and exploit-with-advantage, Guard, a risky
    Flee, hidden enemy plans with visible telegraphs, apparent threat vs true power, four
    resolution modes, and true-random dice for every combatant.
  - Fixed: the aftermath of an HMS fight crashed when the side-panel block was on (a v1.4
    regression). A combatant a reply forgot to restate vanished from the fight. Try again
    re-rolled the dice. The fight settings' defaults were stored where nothing read them.
  - **Audit** against the three engines, their HUD modules, the original extension and the card
    toolkit: Gamemode, Now Playing and the Mental Council are carriers; Blood Pool, Thirst State,
    talents' Status, multi-Authority brackets, `[… - state]`, world items, Runecraft, Passives,
    `[MAIN QUEST: …]`, `[EVENT: …]`, Exam lines, attributes, the engine's own dice rolls and ✦
    notices are all read; self-clearing lines show as cleared; the corrected HUD after an
    (OOC: Correction) is the one read.
  - **Stands down in HMS chats**: Choose your own adventure (the engines forbid ending on
    options), and the plot buttons (Move the world replaces them). Styling prompts keep the HUD
    plain text. Move the world can no longer trip The World Moves.
  - README rewritten; LICENSE added with the modification notice AGPL asks for.
- 1.4.0: The party.
  - **Keep tabs on the people travelling with you.** Add them by name, from the suggestions
    (a contract on the HUD, or someone present in most recent replies), or with **+ Party** on
    a present character. Each reply, members in the scene are read through the side-panel
    block; the absent keep their last reading and read in the past tense ("was very hungry
    when last seen, 40m ago").
  - **Built on the V7.0 card toolkit.** Every state a card names for itself is reported in the
    card's own words: State Register (Territorial), Affect Band or behavioural mode (Band 1),
    contract stage, gated progression phase, vessel front, signature tell. The extension
    defines none of them and never restates card content into the prompt — it carries short
    labels forward so readings stay continuous.
  - **Universal levels** for what cards do not name: affection, trust, jealousy (and of whom),
    irritation, how hard they are holding an act, hunger, fatigue, pain, stress — none,
    slight, moderate, high, extreme.
  - **Alerts.** A strain at the alert level ("Honami is very jealous of Kikyo — for 40m"), a
    strain climbing several replies in a row, affection or trust dropping sharply, and a
    **skipped phase or stage** — which a V7.0 card forbids. The request itself tells the
    model a stage or phase moves only after an event with a cost. Durations run on the HUD
    clock. A member in agony, starving or about to drop joins the Critical banner; social
    strain stays in the Party panel.
  - **Other names.** Aliases per member ("Momonga", "Ainz Ooal Gown"); a shared vessel's souls go
    here too.
  - Each group (mask, bond, needs, phase) can be switched off, which removes it from the request.
  - **The side-panel block no longer depends on Present Characters.** The party and the survival
    clock can ride it on their own.
- 1.3.0: Vitals, body, mind, abilities, quests — and an optional survival clock.
  - **Read, never computed.** Every new panel reads what the engine already prints. HP, wounds
    and conditions stay the engine's; the extension shows them, tracks them over time, and
    never edits them.
  - **Vitals.** Resource pools (HP, MP, Focus, Super-Tier Slots…) as bars, with damage and
    healing since the last reply. Percent meters (Corruption, Od Integrity) with their stage,
    rising-is-bad ones inverted. Health pools can go critical.
  - **Body.** Wounds by tag — Raw, Treated, Magic-Healed, Permanent — with how long each has
    sat in its tag. A wound left Raw past a threshold (72h default, the malunion window) is
    flagged. Conditions on their own ladders (Blood Loss, Shock, Exhaustion, Starvation, Dread…)
    with stage, trend and time at stage. Unlisted conditions still read Mild…Critical and
    Stage N. Healed wounds and cleared conditions are noted.
  - **Mind.** Psychological conditions and status flags (Dread, Blood Frenzy, Emotion
    Suppression) in their own panel.
  - **Abilities.** Authorities, Divine Protections, Contracts, Blessings, Skills, Martial Arts,
    magic systems, classes, traits — grouped by category. What counts as an ability is a
    vocabulary you edit per world.
  - **Quests.** State badges, objective checklists (a Godmother Decree, a D&D Milestone), and a
    journal of quests that left the HUD. **A quest that leaves the line while still live is
    flagged**, with a one-click put-back: its printed name is what loads its entry, so a silent
    drop darkens it. Quest names are never injected into the prompt.
  - **Carrier lines.** When the guard catches a dropped Arc, Quests, Memory, Blessings, Game
    Mode, Authority, Divine Protection or Contract line, it is listed first and marked.
  - **Inline blocks respected.** Rows inside a ─── fenced block (Godmother, School
    Database, D&D sheet) are no longer diffed or pinned. Before, every XP tick flagged two false
    drops, and Restore would have written the stale header back in. Blocks now show as their own
    card, and restored lines never land inside one.
  - **Folded path layers** like `(Eastern Provinces)` show dimmed.
  - **Survival clock (off by default).** For bots whose HUD does not track sleep, food, water or
    state of mind. It measures elapsed time from the HUD clock — the arithmetic models are bad
    at — and tells the engine the facts; the engine decides the consequences. It stands down
    for anything the HUD already tracks, for immune races (Undead), and resets on a Return by
    Death rewind. Events come from the side-panel block or the Slept / Rested / Ate / Drank
    buttons.
  - Everything is configurable under Settings → HMS systems.
  - Fixed: quests after a ` | ` separator were cut from the Quests line.
- 1.2.0: Audit pass — correctness, reachability and honouring your own switches.
  - **HUD line identity is now content-based, not positional.** A HUD may legitimately
    carry several lines under one tag (Re:Zero's seven `[SPIRIT CONTRACT: …]` lines, two
    `[STATUS: …]` lines in Overlord). Those were keyed by tag alone and disambiguated by
    order, so when one dropped the survivors renumbered: the guard named a line that was
    still present, missed the one that actually vanished, and Restore wrote a duplicate
    into the saved reply. Pins had the same fault. Both fixed and covered by tests.
  - **A HUD template swap is no longer read as dropped lines.** Entering or leaving
    Re:Zero's WHDAAA theater replaces the whole HUD by design; the guard used to flag
    every standard line at once, and Restore would have spliced twelve stale lines into
    a theater HUD the module forbids touching. The swap is now detected and reported as
    a template change with nothing to restore. Ordinary drops are unaffected.
  - **Switching the extension off now actually stops it.** Refresh, Move the world,
    fights, plot nudges and portraits used to run regardless: Refresh spent tokens,
    Move the world posted to the chat, a fight could write its aftermath. Those actions
    are refused while it is off, and the three input-bar buttons grey out. Reading the
    panel, editing saved data and changing settings still work.
  - **Refresh honours “Ask for present characters and thoughts.”** With it off, a manual
    Refresh in an HMS chat used to fire the companion call anyway, against the promise
    that off means nothing is added. It now says there is nothing to fetch.
  - **Three settings became reachable in HMS mode.** Present characters, Quests, Dice and
    the bar colours are all live in HMS, but their controls sat in a panel HMS mode hid.
    Turning one off elsewhere left no way to turn it back on — worst for Present
    characters, which also gates the companion request. The section now appears in HMS
    with the toggles that apply there. Quests also honours its own toggle now.
  - **Portraits can be removed.** The backend could always clear one; nothing ever asked
    it to. There is now an ✕ next to Redraw.
  - **Leaked preset reasoning is stripped wherever it lands**, not only in the run
    directly after `***`. Prose that merely mentions the words is still untouched.
  - Settings carry a version and migrate on load. Stale HMS detection is cleared when
    messages are deleted. Unlabelled numeric inputs got labels. Dead CSS removed.
- 1.1.2: Panel auto-updates after every reply without a manual Refresh. It now listens for the
  reply-ended event, self-heals if a push is missed, and a repaint deferred while you're editing
  a field flushes correctly on blur (the applied data is never lost).
- 1.1.1: Safety net for a preset that spills its reasoning into the reply — a leaked
  fn:/page:/REPORT CARD/VIOLATION LOOP block sitting between the HUD's *** and the prose is
  stripped from the saved message and hidden live. Only fires when those markers appear right
  after the separator; ordinary prose that mentions the words is untouched. This is a
  backstop; the real fix is preset-side (keep that reasoning in the Thinking panel).
- 1.1.0: Relationship field widened and free-form by default (no more wrong "Lover" for a
  contracted or family bond); Quests panel (reads a HUD `Quests:` line and keeps your own
  notes); combat gains a per-fight thinking toggle, optional dice/skill checks, abilities read
  from the HUD each turn, and a Past fights log.
- 1.0.0: HMS Edition. Reads the WORLD STATE HUD instead of competing with it; HUD Guard
  with restore; pins; Move the world; fights and aftermaths on HMS rules; companion block
  for characters; automatic HMS detection with classic fallback.
