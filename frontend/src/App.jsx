import { useState } from "react";
import MasinaList from "./components/MasinaList.jsx";

// Datele inițiale ale temei
const MASINI_INITIALE = [
  { id: 1, model: "Dacia Duster 1.5 dCi", disponibil: true, segment: "suv" },
  { id: 2, model: "Volkswagen Golf 8 2.0 TDI", disponibil: false, segment: "economic" },
  { id: 3, model: "Audi A6 40 TDI Quattro", disponibil: true, segment: "premium" }
];

// Tema de pornire: detectată din setarea sistemului de operare
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [masini, setMasini] = useState(MASINI_INITIALE);
  const [tema, setTema] = useState(temaInitiala);

  // Actualizare imutabilă: comutare stare disponibil/închiriat
  function handleToggle(id) {
    setMasini((prev) =>
      prev.map((m) => (m.id === id ? { ...m, disponibil: !m.disponibil } : m))
    );
  }

  // Actualizare imutabilă: ștergere vehicul
  function handleDelete(id) {
    setMasini((prev) => prev.filter((m) => m.id !== id));
  }

  // Comutare temă și aplicare pe <html>
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  // Valoare derivată recalculată la fiecare randare
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

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={handleTema}
            aria-pressed={tema === "dark"}
          >
            {tema === "dark" ? "Mod luminos" : "Mod întunecat"}
          </button>

          <p className="app-count">
            {masini.length} vehicule, dintre care {disponibile} disponibile
          </p>
        </div>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Vehicule în flotă</h2>
          <MasinaList
            masini={masini}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="app-footer">Proiect Tehnologii Web</footer>
    </>
  );
}