import { useState } from "react";
import { SEGMENTE } from "../constants";
import styles from "./MasinaForm.module.css";

export default function MasinaForm({ onAdd }) {
  const [model, setModel] = useState("");
  const [segment, setSegment] = useState("economic");
  const [an, setAn] = useState("2023");
  const [pretZi, setPretZi] = useState("45");
  const [combustibil, setCombustibil] = useState("Diesel");
  const [transmisie, setTransmisie] = useState("Automată");
  const [putere, setPutere] = useState("150");
  const [nrInmatriculare, setNrInmatriculare] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const cleanModel = model.trim();
    if (cleanModel.length < 2) {
      setError("Modelul trebuie să aibă cel puțin 2 caractere.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onAdd({
        model: cleanModel,
        segment,
        disponibil: true,
        an: Number(an) || 2023,
        pretZi: Number(pretZi) || 45,
        combustibil,
        transmisie,
        putere: Number(putere) || 150,
        nrInmatriculare: nrInmatriculare.trim() || "B-999-FLT",
      });
      setModel("");
      setNrInmatriculare("");
    } catch (err) {
      setError(err.message || "Nu am putut adăuga vehiculul.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="model">Model vehicul</label>
        <input
          id="model"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="ex: Peugeot 508 GT"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="segment">Segment</label>
        <select
          id="segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          disabled={isSubmitting}
        >
          {SEGMENTE.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div className={styles.field}>
          <label htmlFor="an">An</label>
          <input
            id="an"
            type="number"
            min="1990"
            max="2027"
            value={an}
            onChange={(e) => setAn(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="pretZi">Preț / zi (€)</label>
          <input
            id="pretZi"
            type="number"
            min="1"
            value={pretZi}
            onChange={(e) => setPretZi(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div className={styles.field}>
          <label htmlFor="combustibil">Combustibil</label>
          <select
            id="combustibil"
            value={combustibil}
            onChange={(e) => setCombustibil(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="Diesel">Diesel</option>
            <option value="Benzină">Benzină</option>
            <option value="Hibrid">Hibrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="transmisie">Transmisie</label>
          <select
            id="transmisie"
            value={transmisie}
            onChange={(e) => setTransmisie(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="Automată">Automată</option>
            <option value="Manuală">Manuală</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div className={styles.field}>
          <label htmlFor="putere">Putere (CP)</label>
          <input
            id="putere"
            type="number"
            min="40"
            value={putere}
            onChange={(e) => setPutere(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="nrInmatriculare">Nr. înmatriculare</label>
          <input
            id="nrInmatriculare"
            type="text"
            value={nrInmatriculare}
            onChange={(e) => setNrInmatriculare(e.target.value)}
            placeholder="B-106-FLT"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Se adaugă..." : "Adaugă vehiculul"}
      </button>
    </form>
  );
}