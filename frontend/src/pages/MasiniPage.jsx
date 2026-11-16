import { useEffect, useState } from "react";
import MasinaList from "../components/MasinaList.jsx";
import MasinaForm from "../components/MasinaForm.jsx";
import { fetchMasini, createMasina, updateMasina, deleteMasina } from "../api.js";
import styles from "./MasiniPage.module.css";

export default function MasiniPage() {
  const [masini, setMasini] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }

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

  async function handleDelete(id) {
    try {
      await deleteMasina(id);
      setMasini((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const disponibile = masini.filter((m) => m.disponibil).length;

  return (
    <div className={styles.grid}>
      <section className="panel">
        <h2>Adaugă vehicul</h2>
        <MasinaForm onAdd={handleAdd} />
      </section>

      <section className="panel">
        <h2>Vehicule în flotă</h2>
        <p className={styles.summary}>
          {masini.length} vehicule, dintre care {disponibile} disponibile
        </p>

        {loading && <p className="info" data-testid="loading">Se încarcă...</p>}
        
        {error && (
          <p className="error" data-testid="error">
            {error}
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
    </div>
  );
}
