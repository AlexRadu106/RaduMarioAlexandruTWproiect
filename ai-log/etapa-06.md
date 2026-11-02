# Etapa 6: Jurnal AI

## Instrumente
- Gemini

## Conversații
- Mutarea datelor statice dintr-o aplicație React într-un server JSON local, utilizarea `useEffect` pentru preluarea asincronă a datelor la montarea componentei, configurarea `fetch` cu `async/await` și gestionarea completă a celor trei stări (loading, succes, eroare).

## Solicitări cheie
### 1. Configurare `json-server` și `api.js`
- Cerut: Cum izolăm apelurile `fetch` într-un fișier dedicat și cum preluăm adresa API-ului dintr-o variabilă de mediu?
- Primit: Crearea fișierului `frontend/src/api.js` care exportă funcția de fetch și utilizarea variabilei `import.meta.env.VITE_API_URL ?? "http://localhost:3001"`.

### 2. Încărcare asincronă cu `useEffect` și stări
- Cerut: Cum gestionăm stările de încărcare și eroare, prevenind în același timp efectele secundare duble din modul de dezvoltare React?
- Primit: Utilizarea variabilei `ignore` în interiorul `useEffect`, implementarea blocului `try...catch...finally` și randarea condiționată bazată pe stările `loading`, `error` și lista de date.

## Ce am învățat / ce nu a funcționat
Am înțeles importanța verificării `res.ok` (deoarece `fetch` nu aruncă eroare nativ la coduri de eroare HTTP precum 404 sau 500) și utilitatea curățării efectului prin funcția returnată pentru a evita actualizarea stării pe componente demontate.