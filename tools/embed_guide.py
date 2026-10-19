#!/usr/bin/env python3
"""Copies GUIDE.md into dist/frontend.js, so the in-panel Guide shows the same text.

Run it after editing GUIDE.md:   python3 tools/embed_guide.py
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
guide = (ROOT / "GUIDE.md").read_text(encoding="utf-8")
fe_path = ROOT / "dist" / "frontend.js"
fe = fe_path.read_text(encoding="utf-8")
pat = re.compile(r"/\* GUIDE:BEGIN \*/.*?/\* GUIDE:END \*/", re.S)
if not pat.search(fe):
    sys.exit("frontend.js has no GUIDE:BEGIN / GUIDE:END markers")
# ensure_ascii keeps the file plain ASCII; </ is split so the text can never close a script tag
blob = json.dumps(guide, ensure_ascii=True).replace("</", "<\\/")
fe = pat.sub(lambda _: f"/* GUIDE:BEGIN */ {blob} /* GUIDE:END */", fe, count=1)
fe_path.write_text(fe, encoding="utf-8")
print(f"GUIDE.md ({len(guide)} characters) is now inside dist/frontend.js")
