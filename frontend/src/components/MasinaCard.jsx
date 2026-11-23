import { Link } from "react-router-dom";
import styles from "./MasinaCard.module.css";

export default function MasinaCard({ masina, onToggle, onDelete }) {
  return (
    <li
      className={`${styles.card} ${!masina.disponibil ? styles.done : ""}`}
      data-testid="masina-item"
    >
      <div className={styles.main}>
        <input
          type="checkbox"
          checked={!masina.disponibil}
          onChange={() => onToggle(masina.id, !masina.disponibil)}
          aria-label={`Schimbă statusul pentru ${masina.model}`}
        />

        <div className={styles.info}>
          <div className={styles.topRow}>
            <Link to={`/masini/${masina.id}`} className={styles.title}>
              {masina.model}
            </Link>
            {masina.nrInmatriculare && (
              <span className={styles.plate}>{masina.nrInmatriculare}</span>
            )}
          </div>

          <div className={styles.meta}>
            <span className={`badge badge-${masina.segment}`}>
              {masina.segment}
            </span>
            {masina.an && <span>• {masina.an}</span>}
            {masina.combustibil && <span>• {masina.combustibil}</span>}
            {masina.transmisie && <span>• {masina.transmisie}</span>}
            {masina.putere && <span>• {masina.putere} CP</span>}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        {masina.pretZi && (
          <div className={styles.price}>
            <strong>{masina.pretZi} €</strong>
            <span>/zi</span>
          </div>
        )}
        <button
          type="button"
          className="btn-danger"
          onClick={() => onDelete(masina.id)}
        >
          Șterge
        </button>
      </div>
    </li>
  );
}