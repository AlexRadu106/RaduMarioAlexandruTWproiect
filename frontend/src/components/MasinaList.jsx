import MasinaCard from "./MasinaCard.jsx";
import styles from "./MasinaList.module.css";

export default function MasinaList({ masini, onToggle, onDelete }) {
  if (masini.length === 0) {
    return (
      <p className={styles.empty} data-testid="empty">
        Nu există vehicule în flotă.
      </p>
    );
  }

  return (
    <ul className={styles.list} data-testid="list">
      {masini.map((masina) => (
        <MasinaCard
          key={masina.id}
          masina={masina}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}