# Etapa 7: Jurnal AI

## Instrumente
- Gemini

## Conversații
- Implementarea unui formular controlat cu validare, utilizarea funcției comune `request` în `api.js` pentru metodele POST, PATCH și DELETE, și legarea operațiilor CRUD direct cu serverul JSON.

## Solicitări cheie
### 1. Formular controlat și validare
- Cerut: Cum scriem un formular controlat care validează datele înainte de trimitere și afișează erorile lângă câmpuri?
- Primit: Utilizarea stărilor locale pentru model și segment, funcția de validare care verifică lungimea și prezența textului, și dezactivarea butonului în timpul trimiterii.

### 2. Sincronizarea cu serverul (`json-server`)
- Cerut: Cum ne asigurăm că adăugarea, bifarea și ștergerea modifică datele pe server și supraviețuiesc unui refresh?
- Primit: Trimiterea cererilor prin funcții asincrone și actualizarea stării React doar după confirmarea primită de la server.