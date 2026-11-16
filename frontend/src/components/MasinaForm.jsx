import { useState } from "react";
import { SEGMENTE } from "../constants.js";
import styles from "./MasinaForm.module.css";

export default function MasinaForm({ onAdd }) {
  const [model, setModel] = useState("");
  const [segment, setSegment] = useState(SEGMENTE[0].value);
  const [eroare, setEroare] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (model.trim().length < 2) {
      setEroare("Modelul trebuie să aibă minim 2 caractere.");
      return;
    }

    setEroare("");
    setIsSubmitting(true);

    try {
      await onAdd({
        model: model.trim(),
        segment,
        disponibil: true,
      });
      
      setModel("");
      setSegment(SEGMENTE[0].value);
    } catch (err) {
      setEroare(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} data-testid="form">
      <div className={styles.field}>
        <label htmlFor="model" className={styles.label}>
          Model vehicul
        </label>
        <input
          id="model"
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className={styles.input}
          data-testid="form-model"
          placeholder="ex: Peugeot 508"
        />
        {eroare && (
          <span className={styles.error} data-testid="form-error">
            {eroare}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="segment" className={styles.label}>
          Segment
        </label>
        <select
          id="segment"
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          className={styles.select}
          data-testid="form-segment"
        >
          {SEGMENTE.map((seg) => (
            <option key={seg.value} value={seg.value}>
              {seg.label}
            </option>
          ))}
        </select>
      </div>

      <button 
        type="submit" 
        className={`btn-primary ${styles.submit}`} 
        disabled={isSubmitting}
        data-testid="form-submit"
      >
        {isSubmitting ? "Se adaugă..." : "Adaugă vehicul"}
      </button>
    </form>
  );
}