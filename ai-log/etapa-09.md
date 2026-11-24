# Etapa 9 — Backend Express + Extindere UI & Funcționalități

## Ce s-a realizat

1. **Migrare de la `json-server` la backend propriu Express (`backend/`)**:
   - Structurat API-ul în `src/server.js`, `src/app.js`, `src/validation.js` și `src/routes/masini.js`.
   - Implementat rutele `GET /health`, `GET /masini`, `GET /masini/:id`, `POST /masini`, `PATCH /masini/:id`, `DELETE /masini/:id`.
   - Adăugat validare pe server cu mesaje de eroare clare și păstrarea compatibilității cu câmpurile de bază (`model`, `segment`, `disponibil`).
   - Eliminat `json-server` și `db.json` din `frontend/` și actualizat `frontend/src/api.js` pentru a prelua mesajele de eroare din răspunsul Express.

2. **Extinderea modelului de date și a interfeței**:
   - Populată flota cu 20 de vehicule reale pe 6 segmente (`economic`, `suv`, `premium`, `sport`, `electric`, `van`).
   - Adăugate câmpuri opționale cu valori implicite: `an`, `combustibil`, `transmisie`, `putere`, `km`, `pretZi`, `nrInmatriculare`, `zileRamase`.
   - Implementate căutare live, filtrare pe categorii, sortare după preț/an și paginare (10 / 20 vehicule pe pagină) în `MasiniPage.jsx`.
   - Implementat calculatorul interactiv de închiriere în `MasinaDetaliuPage.jsx` cu buton direct de închiriere/returnare prin `PATCH /masini/:id`.
   - Îmbunătățit design-ul general (carduri, badge-uri colorate pe categorii, plăcuțe de înmatriculare, adaptare completă Dark/Light Mode).

## Probleme întâmpinate și rezolvări

- **Eroare `MODULE_NOT_FOUND` la pornirea serverului**: fișierul `server.js` nu era plasat în `backend/src/`; mutat în structura corectă.
- **Controalele de sortare/paginare nu apăreau inițial**: ruta `/` din `App.jsx` randa direct `MasinaForm` și `MasinaList` în loc de `MasiniPage`; actualizat `App.jsx` să randeze `MasiniPage`.
- **Aliniere și contrast formular în Dark Mode**: ajustat `MasinaForm.module.css` cu `min-width: 0`, `width: 100%` și variabilele temei pentru `input`/`select`.