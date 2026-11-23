# Etapa 8: Jurnal AI

## Instrumente
- Gemini

## Conversații
- Configurarea rutării cu `react-router-dom`, crearea paginilor dedicate (`MasiniPage`, `MasinaDetaliuPage`, `DesprePage`, `NotFoundPage`), modularizarea stilurilor cu CSS Modules, adăugarea `fetchMasina(id)` în `api.js` și depanarea erorilor Vite.

## Solicitări cheie
### 1. Rutare și păstrarea structurii existente (`React Router`)
- Cerut: Cum integrăm rutele, componenta `Layout` cu `<Outlet />` și pagina de detaliu (`/masini/:id`) fără să pierdem header-ul și comutarea temei dark/light din `App.jsx`?
- Primit: Configurarea `<Routes>` și `<Route>` în `App.jsx`, crearea barei de navigare cu `NavLink` în `Layout.jsx`, utilizarea `useParams` în `MasinaDetaliuPage.jsx` și adăugarea funcției `fetchMasina(id)` în `api.js`.

### 2. Modularizarea stilurilor (CSS Modules) și aspectul interfeței
- Cerut: Cum trecem componentele (`Layout`, `MasinaCard`, `MasinaList`, `MasinaForm`) pe fișiere `.module.css` și cum îmbunătățim design-ul aplicației?
- Primit: Separarea claselor per componentă în fișiere `.module.css`, importarea lor prin obiectul `styles` și finisarea temei globale în `index.css` cu variabile CSS, umbre și tranziții.

### 3. Depanarea erorilor de rulare
- Cerut: De ce apar erorile Vite/PostCSS legate de `index.css`, `Layout.module.css` și exportul `fetchMasina`?
- Primit: Refacerea fișierului `src/index.css`, curățarea caracterelor invalide din `Layout.module.css` și exportarea funcției `fetchMasina(id)` folosind helper-ul `request` din `api.js`.