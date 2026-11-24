import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMasina, updateMasina } from "../api";
import {
  CalendarIcon,
  FuelIcon,
  GearboxIcon,
  BoltIcon,
  GaugeIcon,
} from "../components/SpecIcons";
import { JUDETE_ROMANIA } from "../data/judete";
import styles from "./MasinaDetaliuPage.module.css";
import ContractModal from "../components/ContractModal";

export default function MasinaDetaliuPage({ onUpdate }) {
  const { id } = useParams();
  const [masina, setMasina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [zile, setZile] = useState(3);
  const [judet, setJudet] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [actionError, setActionError] = useState("");
  const [showContract, setShowContract] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    setFeedback("");
    setActionError("");

    fetchMasina(id)
      .then((data) => {
        if (!ignore) {
          setMasina(data);
          setJudet(data.judet || "");
        }
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

  async function handleInchiriere(contractData) {
    if (!judet) return false;
    setSubmitting(true);
    setFeedback("");
    setActionError("");
    try {
      const payload = {
        disponibil: false,
        zileRamase: zile,
        judet,
      };
      if (contractData) {
        payload.contract = contractData;
      }
      const actualizat = await updateMasina(masina.id, payload);
      setMasina(actualizat);
      onUpdate?.(actualizat);
      setShowContract(false);
      setFeedback(
        `Vehiculul a fost închiriat pentru ${zile} ${
          zile === 1 ? "zi" : "zile"
        } în județul ${judet}!`
      );
      return true;
    } catch (err) {
      setActionError(err.message || "Nu am putut procesa închirierea.");
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReturnare() {
    setSubmitting(true);
    setFeedback("");
    setActionError("");
    try {
      const actualizat = await updateMasina(masina.id, {
        disponibil: true,
        zileRamase: 0,
        judet: "",
      });
      setMasina(actualizat);
      setJudet("");
      onUpdate?.(actualizat);
      setFeedback("Vehiculul a fost marcat ca disponibil în flotă.");
    } catch (err) {
      setActionError(err.message || "Nu am putut actualiza statusul.");
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
  const contracte = Array.isArray(masina.contracte) ? masina.contracte : [];

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
                  : `● Închiriat${masina.judet ? ` • ${masina.judet}` : ""} (revine în ${
                      masina.zileRamase || 1
                    } ${(masina.zileRamase || 1) === 1 ? "zi" : "zile"})`}
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
            <span className={styles.specLabel}>
              <CalendarIcon /> An fabricație
            </span>
            <strong>{masina.an ?? "—"}</strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>
              <FuelIcon /> Combustibil
            </span>
            <strong>{masina.combustibil ?? "—"}</strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>
              <GearboxIcon /> Transmisie
            </span>
            <strong>{masina.transmisie ?? "—"}</strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>
              <BoltIcon /> Putere motor
            </span>
            <strong>{masina.putere ? `${masina.putere} CP` : "—"}</strong>
          </div>
          <div className={styles.specCard}>
            <span className={styles.specLabel}>
              <GaugeIcon /> Kilometraj
            </span>
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

          <label htmlFor="judet-select" style={{ marginTop: "6px" }}>
            Județ destinație:
          </label>
          <select
            id="judet-select"
            value={judet}
            onChange={(e) => setJudet(e.target.value)}
            disabled={!masina.disponibil || submitting}
            style={{
              padding: "9px 12px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
              background: "var(--card-bg)",
              color: "var(--text)",
              fontSize: "0.92rem",
              cursor: "pointer",
            }}
          >
            <option value="" disabled>
              — Alege județul destinație —
            </option>
            {JUDETE_ROMANIA.map((j) => (
              <option key={j.nume} value={j.nume}>
                {j.nume}
              </option>
            ))}
          </select>

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

          {actionError && <p className="error">{actionError}</p>}

          {feedback && (
            <p style={{ color: "#10b981", fontWeight: 600, margin: "4px 0 0" }}>
              {feedback}
            </p>
          )}

          {masina.disponibil ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowContract(true)}
              disabled={submitting || !judet}
            >
              {submitting
                ? "Se procesează..."
                : !judet
                ? "Selectează județul pentru a închiria"
                : `Generează contract & Închiriază (${total} €)`}
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

      <section className="panel" aria-label="Istoric contracte vehicul">
        <div className={styles.historyHeader}>
          <h2>Istoric contracte ({contracte.length})</h2>
          <Link to="/contracte" className={styles.allContractsLink}>
            Vezi toate contractele din flotă →
          </Link>
        </div>

        {contracte.length === 0 ? (
          <p className="info">
            Acest vehicul nu are încă contracte înregistrate.
          </p>
        ) : (
          <ul className={styles.historyList}>
            {contracte.map((c) => {
              const isActiv = c.status === "activ";
              return (
                <li
                  key={c.id || c.nrContract}
                  className={`${styles.contractItem} ${
                    isActiv ? styles.contractItemActive : ""
                  }`}
                >
                  <div className={styles.contractTop}>
                    <div className={styles.contractIdentity}>
                      <span className={styles.contractCode}>
                        {c.nrContract || "FM-CONTRACT"}
                      </span>
                      <span
                        className={`${styles.contractStatus} ${
                          isActiv ? styles.statusActiv : styles.statusFinalizat
                        }`}
                      >
                        {isActiv ? "● Activ" : "✓ Finalizat"}
                      </span>
                    </div>

                    <div className={styles.contractTotal}>
                      {c.areReducere && (
                        <span className={styles.discountTag}>-10%</span>
                      )}
                      <strong>{c.total ?? 0} €</strong>
                    </div>
                  </div>

                  <div className={styles.contractMeta}>
                    <span>
                      Client: <strong>{c.numeClient || "Nespecificat"}</strong>
                    </span>
                    <span>
                      Destinație: <strong>{c.judet || "—"}</strong>
                    </span>
                    <span>
                      Perioadă:{" "}
                      <strong>
                        {c.dataStart || "—"} – {c.dataRetur || "—"} (
                        {c.zile || 1} {(c.zile || 1) === 1 ? "zi" : "zile"})
                      </strong>
                    </span>
                    {c.telefon && (
                      <span>
                        Telefon: <strong>{c.telefon}</strong>
                      </span>
                    )}
                    {c.ciClient && (
                      <span>
                        CI / Pașaport: <strong>{c.ciClient}</strong>
                      </span>
                    )}
                    {!isActiv && c.dataReturnare && (
                      <span>
                        Returnat la: <strong>{c.dataReturnare}</strong>
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {showContract && (
        <ContractModal
          masina={masina}
          zile={zile}
          judet={judet}
          subtotal={subtotal}
          total={total}
          areReducere={areReducere}
          submitting={submitting}
          onClose={() => setShowContract(false)}
          onConfirm={handleInchiriere}
        />
      )}
    </div>
  );
}