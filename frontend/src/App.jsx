import { useEffect, useState } from "react";
import MasinaList from "./components/MasinaList.jsx";
import MasinaForm from "./components/MasinaForm.jsx";
import { fetchMasini, createMasina, updateMasina, deleteMasina } from "./api.js";

// Tema de pornire: detectată din setarea sistemului de operare
function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [masini, setMasini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tema, setTema] = useState(temaInitiala);

  // Preluarea datelor de la API la montarea componentei
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await fetchMasini();
        if (!ignore) {
          setMasini(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  // Adăugare pe server (Etapa 7)
  async function handleAdd(masinaNoua) {
    const creat = await createMasina(masinaNoua);
    setMasini((prev) => [...prev, creat]);
  }

  // Modificare pe server - bifare (Etapa 7)
  async function handleToggle(id) {
    const masina = masini.find((m) => m.id === id);
    try {
      const actualizat = await updateMasina(id, { disponibil: !masina.disponibil });
      setMasini((prev) =>
        prev.map((m) => (m.id === id ? actualizat : m))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Ștergere pe server (Etapa 7)
  async function handleDelete(id) {
    try {
      await deleteMasina(id);
      setMasini((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  // Comutare temă
  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  // Valoare derivată
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
        {/* Panoul din stânga: Formularul de adăugare */}
        <section className="panel">
          <h2>Adaugă vehicul</h2>
          <MasinaForm onAdd={handleAdd} />
        </section>

        {/* Panoul din dreapta: Lista de mașini */}
        <section className="panel">
          <h2>Vehicule în flotă</h2>

          {loading && <p className="info">Se încarcă...</p>}
          
          {error && (
            <p className="error">
              Nu am putut încărca datele: {error}. Rulează <code>npm run api</code>?
            </p>
          )}

          {!loading && !error && (
            <MasinaList
              masini={masini}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">Proiect Tehnologii Web</footer>
    </>
  );
}