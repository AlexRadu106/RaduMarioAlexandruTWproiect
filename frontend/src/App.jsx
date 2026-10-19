import MasinaList from "./components/MasinaList.jsx";

const masini = [
  { id: 1, model: "Dacia Duster 1.5 dCi", disponibil: true, segment: "suv" },
  { id: 2, model: "Volkswagen Golf 8 2.0 TDI", disponibil: false, segment: "economic" },
  { id: 3, model: "Audi A6 40 TDI Quattro", disponibil: true, segment: "premium" }
];

export default function App() {
  const disponibile = masini.filter((m) => m.disponibil).length;

  return (
    <>
      <header className="app-header">
        <div>
          <h1>FleetManager</h1>
          <p>Gestiunea flotei auto, disponibilitate și categorii de vehicule.</p>
        </div>

        
        <img 
          src="/fleet-logo.jpg" 
          alt="FleetManager Banner" 
          className="header-banner" 
        />

        <p className="app-count">
          {masini.length} vehicule, dintre care {disponibile} disponibile
        </p>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Vehicule în flotă</h2>
          <MasinaList masini={masini} />
        </section>
      </main>

      <footer className="app-footer">Proiect Tehnologii Web</footer>
    </>
  );
}