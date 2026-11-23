import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMasina, updateMasina } from "../api";
import styles from "./MasinaDetaliuPage.module.css";

export default function MasinaDetaliuPage({ onUpdate }) {
  const { id } = useParams();
  const [masina, setMasina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zile, setZile] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    setFeedback("");

    fetchMasina(id)
      .then((data) => {
        if (!ignore) setMasina(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || "Mașina nu a putut fi încărcată.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleInchiriere() {
    setSubmitting(true);
    setFeedback("");
    try {
      const actualizat = await updateMasina(masina.id, {
        disponibil: false,
        zileRamase: zile,
      });
      setMasina(actualizat);
      onUpdate?.(actualizat);
      setFeedback(
        `Vehiculul a fost închiriat cu succes pentru ${zile} ${
          zile === 1 ? "zi" : "zile"
        }!`
      );
    } catch (err) {
      setError(err.message || "Nu am putut procesa închirierea.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReturnare() {
    setSubmitting(true);
    setFeedback("");
    try {
      const actualizat = await updateMasina(masina.id, {
        disponibil: true,
        zileRamase: 0,
      });
      setMasina(actualizat);
      onUpdate?.(actualizat);
      setFeedback("Vehiculul a fost marcat ca disponibil în flotă.");
    } catch (err) {
      setError(err.message || "Nu am putut actualiza statusul.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="info">Se încarcă detaliile vehiculului...</p>;

  if (error) {
    return (
      <div className="panel">
        <p className="error">Vehiculul nu a putut fi încărcat: {error}</p>
        <Link to="/" className={styles.backLink}>
          ← Înapoi la flotă
        </Link>
      </div>
    );
  }

  const pretZi = masina.pretZi ?? 45;
  const subtotal = pretZi * zile;
  const areReducere = zile >= 7;
  const total = areReducere ? Math.round(subtotal * 0.9) : subtotal;

  return (
    <div className={styles.wrapper}>
      <Link to="/" className={styles.backLink}>
        ← Înapoi la lista vehiculelor
      </Link>

      <div className="panel">
        <div className={styles.header}>
          <div>
            <h2 className={styles.modelTitle}>{masina.model}</h2>
            <div className={styles.badges}>
              <span className={`badge badge-${masina.segment}`}>
                {masina.segment}
              </span>
              <span
                className={`${styles.status} ${
                  masina.disponibil ? styles.available : styles.unavailable
                }`}
              >
                {masina.disponibil
                  ? "● Disponibil"
                  : `● Închiriat (revine în ${masina.zileRamase || 1} ${
                      (masina.zileRamase || 1) === 1 ? "zi" : "zile"
                    })`}
              </span>
              {masina.nrInmatriculare && (
                <span className={styles.plate}>{masina.nrInmatriculare}</span>
              )}
            </div>
          </div>

          <div className={styles.priceBox}>
            <strong>{pretZi} €</strong>
            <span>/ zi</span>
          </div>
        </div>

        <div className={styles.specsGrid}>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>An fabricație</span>
            <strong>{masina.an ?? "—"}</strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>Combustibil</span>
            <strong>{masina.combustibil ?? "—"}</strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>Transmisie</span>
            <strong>{masina.transmisie ?? "—"}</strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>Putere motor</span>
            <strong>{masina.putere ? `${masina.putere} CP` : "—"}</strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>Kilometraj</span>
            <strong>
              {masina.km !== undefined
                ? `${masina.km.toLocaleString("ro-RO")} km`
                : "—"}
            </strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>ID intern</span>
            <strong>#{masina.id}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Calculator estimativ de închiriere</h2>
        <div className={styles.calcRow}>
          <label htmlFor="zile-range">
            Durată închiriere:{" "}
            <strong>
              {zile} {zile === 1 ? "zi" : "zile"}
            </strong>
          </label>
          <input
            id="zile-range"
            type="range"
            min="1"
            max="30"
            value={zile}
            onChange={(e) => setZile(Number(e.target.value))}
            className={styles.slider}
            disabled={!masina.disponibil || submitting}
          />
          <div className={styles.calcSummary}>
            <div>
              <span>
                Tarif de bază ({zile} × {pretZi} €):
              </span>
              <span>{subtotal} €</span>
            </div>
            {areReducere && (
              <div className={styles.discount}>
                <span>Reducere 7+ zile (-10%):</span>
                <span>-{subtotal - total} €</span>
              </div>
            )}
            <div className={styles.totalRow}>
              <span>Total estimat:</span>
              <strong>{total} €</strong>
            </div>
          </div>

          {feedback && (
            <p style={{ color: "#10b981", fontWeight: 600, margin: "4px 0 0" }}>
              {feedback}
            </p>
          )}

          {masina.disponibil ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleInchiriere}
              disabled={submitting}
            >
              {submitting
                ? "Se procesează..."
                : `Închiriază pentru ${zile} ${zile === 1 ? "zi" : "zile"} (${total} €)`}
            </button>
          ) : (
            <button
              type="button"
              className="btn-danger"
              onClick={handleReturnare}
              disabled={submitting}
            >
              {submitting ? "Se actualizează..." : "Returnează vehiculul în flotă"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}