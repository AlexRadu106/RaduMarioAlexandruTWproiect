# Etapa 2: Jurnal AI

## Instrumente
- Gemini

## Conversații
- Logica de date în JavaScript nativ, transformări imutabile de stare folosind metode de array (`map`, `filter`, `reduce`) și testarea rezultatelor în consola browserului.

## Solicitări cheie
### 1. Generarea unui identificator unic (ID)
- Cerut: De ce formula `lista.length + 1` este problematică la generarea unui ID nou și cum se poate rezolva corect și imutabil?
- Primit: O explicație privind coliziunile de chei apărute după ștergerea elementelor intermediare, alături de soluția bazată pe `lista.reduce((max, item) => Math.max(max, item.id), 0) + 1`.
- Modificat sau respins: Am extras calculul într-o funcție auxiliară separată `nextId(lista)` care nu alterează starea externă.

### 2. Modificatori de stare imutabili
- Cerut: Cum se scriu funcțiile de adăugare, comutare și ștergere fără a modifica array-ul inițial `masini` și fără a apela metode DOM.
- Primit: Implementări ce folosesc operatorul spread (`[...lista, item]`), metoda `.filter()` pentru eliminare și clonarea obiectelor la comutare (`{ ...item, disponibil: !item.disponibil }`).
- Modificat sau respins: Am adăugat curățarea textului cu `.trim()` și validarea riguroasă a segmentului auto pe baza listei predefinite `SEGMENTE`, transmițând mesaje explicite de eroare în consolă.

## Ce am învățat / ce nu a funcționat
Am înțeles diferența dintre mutarea directă a unui array (`.push()`, atribuire directă pe proprietăți) și returnarea unei referințe noi de memorie. Principiul imutabilității este esențial pentru etapele viitoare, deoarece React determină re-randarea interfeței comparând referințele stărilor.