# Etapa 3: Jurnal AI

## Instrumente
- Gemini

## Conversații
- Inițializarea proiectului React cu Vite, curățarea șablonului demonstrativ și afișarea datelor brute în JSX.

## Solicitări cheie
### 1. Curățarea fișierelor demonstrative și rezolvarea erorilor de import
- Cerut: Ce fișiere trebuie șterse din structura generată de Vite și cum se leagă stilurile CSS?
- Primit: Eliminarea folderului `assets`, a fișierului `index.css` și a iconițelor din `public`, redirecționând importul către `App.css` în `main.jsx`.
- Modificat sau respins: Am păstrat o singură coloană pe clasa `.container` pentru a acomoda panoul unic din această etapă.

### 2. Calculul dinamic în componentă
- Cerut: Cum se afișează corect numărul de elemente active în antet folosind React?
- Primit: Plasarea array-ului de mașini în afara funcției `App` și calculul proprietății `disponibile` folosind `.filter()` înainte de return.
- Modificat sau respins: Am structurat antetul cu Flexbox pentru alinierea separată a titlului și a etichetei de contor.

## Ce am învățat / ce nu a funcționat
Am înțeles modul în care Vite gestionează modulul rădăcină în `index.html` și diferențele cheie între HTML și JSX (cum ar fi obligativitatea `className` și închiderea etichetelor).