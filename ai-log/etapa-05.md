# Etapa 5: Jurnal AI

## Instrumente
- Gemini

## Conversații
- Trecerea la state local cu `useState`, tratarea acțiunilor prin funcții transmise prin props (`onToggle`, `onDelete`), actualizări imutabile de state și implementarea comutării de temă prin atributul `data-theme` pe elementul `<html>`.

## Solicitări cheie
### 1. State local și actualizare imutabilă
- Cerut: Cum păstrăm lista de vehicule în stare React și cum modificăm starea la bifare și ștergere fără mutații directe?
- Primit: Utilizarea formei cu funcție `setMasini((prev) => ...)` cu `.map()` pentru comutarea stării vehiculului și `.filter()` pentru eliminarea din listă.
- Modificat sau respins: Am păstrat `disponibil` ca proprietate booleană, astfel încât checkbox-ul bifat indică vehicul închiriat/indisponibil.

### 2. Checkbox controlat și buton de ștergere accesibil
- Cerut: Cum implementăm checkbox-ul și butonul de ștergere pe fiecare card fără erori de randare?
- Primit: Folosirea atributelor `checked` și `onChange` pe input, legarea la un container `<label>` pentru clic ușor pe tot titlul și adăugarea `aria-label` descriptiv pe butonul de ștergere.

### 3. Comutare temă (Light/Dark mode)
- Cerut: Cum adăugăm un comutator de temă accesibil care să funcționeze indiferent de setarea sistemului de operare?
- Primit: Păstrarea temei curente în state (`useState(temaInitiala)`), scrierea atributului `data-theme` pe `document.documentElement` și adaptarea selectorilor CSS cu `:root[data-theme="dark"]` și `:root:not([data-theme="light"])`.

## Ce am învățat / ce nu a funcționat
Am înțeles importanța valorilor derivate (contorul din antet recalculat la fiecare randare fără un al doilea state) și prevenirea randărilor infinite folosind funcții anonime la `onClick={() => onDelete(masina.id)}`.