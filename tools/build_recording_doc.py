#!/usr/bin/env python3
"""Build the master recording document + import map from ALL course data.

Reads the parsed course JSON (CURRICULUM / EXERCISES / EXAMS / PHRASE_SETS) and
collects every distinct Spanish utterance a voice should cover: phrasebook
phrases, vocab words, vocab example sentences, speaking prompts, sentence-build
answers, and single-word vocab from multiple-choice / match / fill items.

Outputs:
  RECORDING-SCRIPT.md    organized by section + a flat numbered master list
  tools/recording-map.json   number -> phrase -> slug/file (drives the importer)
"""
import json, re, unicodedata, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = json.load(open("/tmp/esptalk_data.json", encoding="utf-8"))

def slug(text):
    t = unicodedata.normalize("NFKD", text.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t or "clip"

# English glosses for items the data doesn't carry a translation for.
GLOSS = {
    # example sentences
    '¡Hola! ¿Cómo estás?': 'Hello! How are you?',
    '¡Buenos días a todos!': 'Good morning, everyone!',
    'Tengo tres hermanos.': 'I have three brothers.',
    'El tomate es rojo.': 'The tomato is red.',
    '¡Hola! ¿Cómo te llamas?': "Hello! What's your name?",
    'El lunes tengo clase de español.': 'On Monday I have Spanish class.',
    'Mi madre es muy amable.': 'My mother is very kind.',
    # speaking prompts
    '¿Cuál es tu color favorito?': 'What is your favorite color?',
    'Me llamo Alex. ¿Y tú?': 'My name is Alex. And you?',
    '¿Tienes hermanos?': 'Do you have siblings?',
    # build answers
    'Buenos días ¿cómo estás?': 'Good morning, how are you?',
    'Tengo dos hermanos': 'I have two brothers',
    'El cielo es azul': 'The sky is blue',
    'Me llamo Alex': 'My name is Alex',
    'Hoy es lunes': 'Today is Monday',
    'Tengo una hermana': 'I have a sister',
    # single-word vocab from mc / fill / match distractors
    'nueve': 'nine', 'siete': 'seven', 'cinco': 'five', 'cuatro': 'four', 'diez': 'ten', 'uno': 'one',
    'manzana': 'apple', 'pan': 'bread', 'agua': 'water',
    'farmacia': 'pharmacy', 'mercado': 'market', 'banco': 'bank', 'cine': 'cinema',
    'abuelo': 'grandfather', 'abuela': 'grandmother', 'hijo': 'son', 'hermana': 'sister',
    'tia': 'aunt', 'tío': 'uncle', 'tía': 'aunt', 'prima': 'cousin (f)', 'primo': 'cousin (m)',
    'domingo': 'Sunday', 'sabado': 'Saturday', 'sábado': 'Saturday', 'martes': 'Tuesday',
    'jueves': 'Thursday', 'viernes': 'Friday', 'miércoles': 'Wednesday',
    '¿Cómo está usted?': 'How are you? (formal)',
    'amarillo': 'yellow', 'blanco': 'white',
    'Hasta mañana': 'See you tomorrow',
    'llamo': 'I call (myself)',
}

SPANISH_DIACRITICS = set("áéíóúñü¿¡ÁÉÍÓÚÑÜ")
KNOWN_ENGLISH = {'three','six','five','four','red','blue','green','yellow','monday','friday',
                 'sunday','thursday','tuesday','wednesday','one','ten','seven','nine',
                 'market','hospital','school','library','mother','son','grandfather','sister',
                 'good morning','hello','see you later','thank you','how are you?',
                 "what's your name?",'where are you from?','how old are you?','goodbye',
                 'nice to meet you','how much does it cost?','where is it?','what is it?',
                 'who has it?','de nada','por favor','lo siento','mucho gusto'}

def is_spanish_word(w):
    lw = w.lower().strip()
    if lw in KNOWN_ENGLISH:
        return False
    if any(c in SPANISH_DIACRITICS for c in w):
        return True
    if lw in GLOSS or lw in {g.lower() for g in GLOSS}:
        return True
    return False  # conservative: skip ambiguous English-looking options

# ── collect, preserving first-seen section for the organized doc ───────────
sections = []            # (section_title, [ (es, ph, en) ])
seen_slug = set()
master = []              # dedup list in recording order

def add(bucket, es, ph="", en=""):
    es = es.strip()
    if not es:
        return
    en = en or GLOSS.get(es, "")
    bucket.append((es, ph, en))

# 1) Phrasebook sets
for s in DATA['PHRASE_SETS']:
    b = []
    for p in s['phrases']:
        add(b, p['es'], p.get('ph',''), p.get('en',''))
    sections.append((f"Phrasebook · {s['icon']} {s['title']}", b))

# 2) Course lessons (exercises)
curr_name = {c['id']: c['name'] for c in DATA['CURRICULUM']}
def lesson_title(cid, lid):
    for c in DATA['CURRICULUM']:
        if c['id']==cid:
            for l in c['lessons']:
                if l['id']==lid: return l['title']
    return f"Lesson {cid}-{lid}"

for key, items in DATA['EXERCISES'].items():
    cid, lid = map(int, key.split('-'))
    b = []
    for it in items:
        t = it['type']
        if t == 'vocab':
            add(b, it['spanish'], it.get('phonetic',''), it.get('english',''))
            if it.get('example'): add(b, it['example'])
        elif t == 'speak':
            add(b, it['prompt'], "", it.get('translation',''))
        elif t == 'build':
            add(b, it['answer'])
        elif t == 'fill':
            if is_spanish_word(it.get('answer','')): add(b, it['answer'])
        elif t == 'mc':
            for opt in it.get('options',[]):
                if is_spanish_word(opt): add(b, opt)
        elif t == 'match':
            for pair in it.get('pairs',[]):
                add(b, pair[0], "", pair[1])
    sections.append((f"Course {cid+1}: {curr_name[cid]} · {lesson_title(cid,lid)}", b))

# 3) Exams (Spanish options + fill answers)
for ek, exam in DATA['EXAMS'].items():
    b = []
    for q in exam['questions']:
        if q['type']=='mc':
            for opt in q.get('options',[]):
                if is_spanish_word(opt): add(b, opt)
        elif q['type']=='fill':
            if is_spanish_word(q.get('answer','')): add(b, q['answer'])
    if b: sections.append((f"{exam['title']} · review vocab", b))

# ── build master numbered list (dedup by slug across everything) ───────────
for title, b in sections:
    for es, ph, en in b:
        s = slug(es)
        if s in seen_slug: continue
        seen_slug.add(s)
        master.append({"num": f"{len(master)+1:03d}", "phrase": es, "ph": ph,
                       "en": en, "slug": s, "file": f"audio/{s}.m4a"})

# ── write the document ─────────────────────────────────────────────────────
slug_to_num = {m['slug']: m['num'] for m in master}
lines = ["# EspTalk — Master Recording Script", "",
         f"**{len(master)} unique clips to record.** Record each as its own file and name it by its "
         "number (e.g. `001`, `002`). Any format (m4a / wav / mp3). Same voice, quiet room, "
         "natural pace — I auto-trim silence and even out volume on import.", "",
         "The **#** column is the filename to send. Sections group the phrases by where they appear "
         "in the app; the same phrase used in two places is listed once (at its first appearance).",
         ""]
master_by_slug = {m['slug']: m for m in master}
for title, b in sections:
    rows = []
    seen_here = set()
    for es, ph, en in b:
        s = slug(es)
        if s in seen_here: continue      # one row per phrase per section
        seen_here.add(s)
        m = master_by_slug[s]            # canonical number / pronunciation / meaning
        rows.append((m['num'], m['phrase'], m['ph'], m['en']))
    if not rows: continue
    lines.append(f"## {title}")
    lines.append("")
    lines.append("| # | Say this (Spanish) | Pronunciation | Meaning |")
    lines.append("|---|---|---|---|")
    for n, es, ph, en in rows:
        lines.append(f"| {n} | **{es}** | {ph} | {en} |")
    lines.append("")

doc = "\n".join(lines).replace("\\'", "'")
(ROOT/"RECORDING-SCRIPT.md").write_text(doc, encoding="utf-8")
json.dump(master, open(ROOT/"tools"/"recording-map.json","w",encoding="utf-8"),
          ensure_ascii=False, indent=2)

print(f"{len(master)} unique clips across {len(sections)} sections")
print("Wrote RECORDING-SCRIPT.md and tools/recording-map.json")
