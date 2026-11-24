import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { fetchMasini, createMasina, updateMasina, deleteMasina } from "./api.js";

import Layout from "./components/Layout.jsx";
import Toast from "./components/Toast.jsx";
import MasiniPage from "./pages/MasiniPage.jsx";
import MasinaDetaliuPage from "./pages/MasinaDetaliuPage.jsx";
import DesprePage from "./pages/DesprePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import HartaPage from "./pages/HartaPage.jsx";
import SmartFinderPage from "./pages/SmartFinderPage.jsx";

function temaInitiala() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [masini, setMasini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tema, setTema] = useState(temaInitiala);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  function showToast(message, type = "success") {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 3200);
  }

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

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

  async function handleAdd(masinaNoua) {
    const creat = await createMasina(masinaNoua);
    setMasini((prev) => [...prev, creat]);
    showToast(`${creat.model} a fost adăugat în flotă.`, "success");
  }

  async function handleToggle(id) {
    const masina = masini.find((m) => m.id === id);
    try {
      const actualizat = await updateMasina(id, { disponibil: !masina.disponibil });
      setMasini((prev) =>
        prev.map((m) => (m.id === id ? actualizat : m))
      );
      if (actualizat.disponibil) {
        showToast(`${actualizat.model} a fost marcat ca disponibil.`, "info");
      } else {
        showToast(
          `${actualizat.model} a fost închiriat (${actualizat.zileRamase || 3} zile).`,
          "success"
        );
      }
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Eroare la actualizare.", "error");
    }
  }

  async function handleDelete(id) {
    const masina = masini.find((m) => m.id === id);
    try {
      await deleteMasina(id);
      setMasini((prev) => prev.filter((m) => m.id !== id));
      showToast(`${masina?.model || "Vehiculul"} a fost șters din flotă.`, "error");
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Eroare la ștergere.", "error");
    }
  }

  function handleUpdateLocal(actualizat) {
    setMasini((prev) =>
      prev.map((m) => (m.id === actualizat.id ? actualizat : m))
    );
    if (actualizat.disponibil) {
      showToast(`${actualizat.model} a fost returnat în flotă.`, "info");
    } else {
      const z = actualizat.zileRamase || 1;
      showToast(
        `${actualizat.model} a fost închiriat pentru ${z} ${z === 1 ? "zi" : "zile"}.`,
        "success"
      );
    }
  }

  function handleTema() {
    const noua = tema === "dark" ? "light" : "dark";
    setTema(noua);
    document.documentElement.dataset.theme = noua;
  }

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
  }, [tema]);

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
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <MasiniPage
                  masini={masini}
                  loading={loading}
                  error={error}
                  onAdd={handleAdd}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              }
            />
            <Route
              path="/masini/:id"
              element={<MasinaDetaliuPage onUpdate={handleUpdateLocal} />}
            />
            <Route path="/despre" element={<DesprePage />} />
            <Route path="/harta" element={<HartaPage masini={masini} />} />
            <Route path="/finder" element={<SmartFinderPage masini={masini} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </main>

      <footer className="app-footer">Proiect Tehnologii Web</footer>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}