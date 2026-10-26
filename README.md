# FleetManager
A vehicle fleet management application designed to track vehicle availability, manage rental states, and organize cars by market segment.

## Data model
| Field | Type | Notes |
| :--- | :--- | :--- |
| model | text | required, max 100 chars |
| disponibil | boolean | toggled from the list, default true |
| segment | fixed values | economic, suv, premium |
| categorie | relation | Diesel, Benzina, Electric (from week 10) |
| gestionar | relation | the owner of the item (from week 11) |

Sample data used across all stages:
1. Dacia Duster 1.5 dCi, active, suv
2. Volkswagen Golf 8 2.0 TDI, done, economic
3. Audi A6 40 TDI Quattro, active, premium

## How to run
Open `index.html` directly in any modern browser. No build step, no server. Press `F12` or `Ctrl + Shift + J` to inspect the JavaScript test output in the browser console.

## AI usage
| Tool | Used for |
| :--- | :--- |
| Gemini | HTML5 semantics, CSS Grid/Flexbox layout, dark theme variables, immutable JS operations |

Details per stage: see the `ai-log/` folder.

## Status
- [x] Stage 1: static mockup
- [x] Stage 2: data logic in JavaScript
- [x] Stage 3: Vite and React project
- [x] Stage 4: Components rendered from data

## Etapa 1 Checklist
| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S1-R1 | README: description, fields, sample data, how to run | [README.md](README.md) | read |
| S1-R2 | AI usage section | [README.md](README.md) | read |
| S1-R3 | AI log for stage 1 | [ai-log/etapa-01.md](ai-log/etapa-01.md) | read |
| S1-R4 | header, form (text + select), 3 cards with own data | [index.html](index.html) | open the page |
| S1-R5 | finished card looks different | [style.css](style.css) | look at the card (`.done`) |
| S1-R6 | 2 columns on desktop, 1 under 700px | [style.css](style.css) | resize window < 700px |
| S1-R7 | visible focus, readable dark theme | [style.css](style.css) | Tab; dark mode emulation |
| S1-R8 | commit "Stage 1" pushed | commit history | commit history |

## Etapa 2: data logic
Plain JavaScript, no DOM. `masini.js` holds the array and the functions that read and change it. Results are printed in the browser console (F12).

## Etapa 2 Checklist
| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S2-R1 | JS file linked, logs on page load | [index.html](index.html) | open page, F12 console |
| S2-R2 | 3+ items with id, name, state, tag | [masini.js](masini.js) | read initial array |
| S2-R3 | list, count, search, add, toggle, delete | [masini.js](masini.js) | console output |
| S2-R4 | add rejects empty name and invalid tag | [masini.js](masini.js) | last 2 console lines |
| S2-R5 | original array unchanged after add | [masini.js](masini.js) | console output |
| S2-R6 | README Stage 2 section + AI log | [README.md](README.md), [ai-log/etapa-02.md](ai-log/etapa-02.md) | read |
| S2-R7 | commit "Stage 2" pushed | commit history | commit history |

## Stage 3: Vite and React project
The app now lives in `frontend/`, built with Vite. The data from stage 2 moved into the main component; the list is still printed raw.

## How to run
```bash
cd frontend
npm install
npm run dev
```
## Stage 4: components
The list is rendered from the data, through two components:
- `MasinaList` receives the whole array and renders one card per item
- `MasinaCard` receives a single item through props and displays it

## Stage 4 Checklist
| ID | Requirement | Where (permalink) | How to check |
| :--- | :--- | :--- | :--- |
| S4-R1 | 2+ components in src/components/ | [frontend/src/components/](frontend/src/components/) | open folder |
| S4-R2 | card receives data through props | [frontend/src/components/MasinaCard.jsx](frontend/src/components/MasinaCard.jsx) | read |
| S4-R3 | map + key={id}, no console warnings | [frontend/src/components/MasinaList.jsx](frontend/src/components/MasinaList.jsx) | F12, Console |
| S4-R4 | message for empty list | [frontend/src/components/MasinaList.jsx](frontend/src/components/MasinaList.jsx) | set array to [] |
| S4-R5 | state changes the card look | [frontend/src/components/MasinaCard.jsx](frontend/src/components/MasinaCard.jsx) | toggle a done flag |
| S4-R6 | README Stage 4 section + AI log | [README.md](README.md), [ai-log/etapa-04.md](ai-log/etapa-04.md) | read |
| S4-R7 | commit "Stage 4" pushed | commit history | commit history |