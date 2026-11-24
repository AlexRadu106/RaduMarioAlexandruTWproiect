import { Link } from "react-router-dom";
import { CalendarIcon, FuelIcon, GearboxIcon, BoltIcon } from "./SpecIcons";
import styles from "./MasinaCard.module.css";

export default function MasinaCard({
  masina,
  onToggle,
  onDelete,
  isCompared,
  onToggleCompare,
  compareDisabled,
}) {
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
            {!masina.disponibil && (
              <span className={styles.rentedTag}>
                Închiriat{masina.judet ? ` • ${masina.judet}` : ""} •{" "}
                {masina.zileRamase || 1}{" "}
                {(masina.zileRamase || 1) === 1 ? "zi rămasă" : "zile rămase"}
              </span>
            )}
          </div>

          <div className={styles.meta}>
            <span className={`badge badge-${masina.segment}`}>
              {masina.segment}
            </span>
            {masina.an && (
              <span className={styles.specItem}>
                <CalendarIcon /> {masina.an}
              </span>
            )}
            {masina.combustibil && (
              <span className={styles.specItem}>
                <FuelIcon /> {masina.combustibil}
              </span>
            )}
            {masina.transmisie && (
              <span className={styles.specItem}>
                <GearboxIcon /> {masina.transmisie}
              </span>
            )}
            {masina.putere && (
              <span className={styles.specItem}>
                <BoltIcon /> {masina.putere} CP
              </span>
            )}
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
          className={`${styles.compareBtn} ${isCompared ? styles.compareActive : ""}`}
          onClick={() => onToggleCompare?.(masina.id)}
          disabled={!isCompared && compareDisabled}
        >
          {isCompared ? "✓ Compară" : "Compară"}
        </button>
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