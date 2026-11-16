import { Link } from "react-router-dom";
import { ETICHETE_SEGMENT } from "../constants.js";
import styles from "./MasinaCard.module.css";

export default function MasinaCard({ masina, onToggle, onDelete }) {
  return (
    <li
      className={!masina.disponibil ? `${styles.card} ${styles.done}` : styles.card}
      data-testid="item"
      data-id={masina.id}
    >
      <div className={styles.main}>
        <input
          type="checkbox"
          checked={!masina.disponibil}
          onChange={() => onToggle(masina.id)}
          aria-label={`Marchează ${masina.model}`}
          data-testid="item-toggle"
        />
        <div>
          <Link to={`/masini/${masina.id}`} className={styles.title} data-testid="item-link">
            {masina.model}
          </Link>
          <span className={`badge badge-${masina.segment}`}>
            {ETICHETE_SEGMENT[masina.segment]}
          </span>
        </div>
      </div>
      <button
        className="btn-danger"
        onClick={() => onDelete(masina.id)}
        aria-label={`Șterge ${masina.model}`}
        data-testid="item-delete"
      >
        Șterge
      </button>
    </li>
  );
}