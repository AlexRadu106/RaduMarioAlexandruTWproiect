# Etapa 1: Jurnal AI

## Instrumente
- Gemini

## Conversații
- Arhitectura mockup-ului pentru panoul de gestiune al unui parc auto, structura pe două coloane cu CSS Grid și configurarea unei teme întunecate accesibile prin variabile CSS.

## Solicitări cheie
### 1. Structură semantică și alinierea formularului
- Cerut: Cum să construiesc o structură HTML5 curată, cu un layout CSS Grid (1fr 2fr), pentru o pagină de monitorizare a vehiculelor din flotă.
- Primit: Schelet semantic compus din `<header>`, `<main>`, `<section>` și `<form>`, alături de Flexbox aplicat pentru alinierea verticală a etichetelor, câmpurilor de text și cardurilor din listă.
- Modificat sau respins: Am definit clase proprii pentru etichetele auto (`badge-economic`, `badge-suv`, `badge-premium`) în locul celor generice de sarcini.

### 2. Implementarea modului întunecat (Dark Mode)
- Cerut: Care este cea mai eficientă metodă de a suporta tema întunecată fără a duplica regulile de layout din CSS?
- Primit: Definirea paletei complete de culori în `:root` și suprascrierea exclusivă a variabilelor în interiorul interogării media `@media (prefers-color-scheme: dark)`.
- Modificat sau respins: Am ales o bordură cu un contrast mai ridicat (`#334155`) pentru carduri, asigurând lizibilitatea pe fundaluri închise la culoare.

## Ce am învățat / ce nu a funcționat
Folosirea regulii globale `box-sizing: border-box` pe toate elementele este esențială pentru a preveni depășirea lățimii coloanelor din containerul Grid de către câmpurile formularului. De asemenea, emularea temei întunecate direct din fila Rendering a instrumentelor Chrome DevTools a scurtat considerabil timpul de verificare.