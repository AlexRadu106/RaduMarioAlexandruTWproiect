# Etapa 4: Jurnal AI

## Instrumente
- Gemini

## Conversații
- Descompunerea interfeței React în componente atomice (`MasinaList` și `MasinaCard`), transmiterea datelor prin props, randare condiționată pentru lista goală și utilizarea corectă a atributului `key`.

## Solicitări cheie
### 1. Ierarhia componentelor și transmiterea de props
- Cerut: Cum structurăm randarea listei de mașini în componente separate și cum se pasează proprietățile de la părinte la copil?
- Primit: Crearea `MasinaList` (care primește colecția `masini`) și `MasinaCard` (care primește un singur obiect `masina`), destructurând props-urile direct în signatura funcțiilor.
- Modificat sau respins: Am mapat denumirile segmentelor auto printr-un obiect dicționar `ETICHETE_SEGMENT` pentru afișarea cu majusculă pe interfață.

### 2. Atributul `key` și randarea listei goale
- Cerut: Unde se plasează atributul `key` și cum gestionăm afișarea unui mesaj când array-ul nu conține elemente?
- Primit: Plasarea obligatorie a `key={masina.id}` direct pe componenta `MasinaCard` returnată de `.map()`, împreună cu un `return` timpuriu (`if (masini.length === 0)`) în `MasinaList`.
- Modificat sau respins: Am păstrat clasa CSS `.empty` pentru uniformitatea stilului definit în etapele anterioare.

## Ce am învățat / ce nu a funcționat
Am înțeles de ce utilizarea indexului de array pentru `key` este o practică greșită ce cauzează anomalii la ștergere, importanța id-urilor unice și stabile, precum și faptul că componentele copil nu trebuie să modifice props-urile primite.