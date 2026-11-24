import MasinaCard from "./MasinaCard";
import styles from "./MasinaList.module.css";

export default function MasinaList({
  masini,
  onToggle,
  onDelete,
  compareIds = [],
  onToggleCompare,
}) {
  if (masini.length === 0) {
    return <p className="info">Nu există vehicule care să corespundă filtrelor.</p>;
  }

  return (
    <ul className={styles.list}>
      {masini.map((m) => (
        <MasinaCard
          key={m.id}
          masina={m}
          onToggle={onToggle}
          onDelete={onDelete}
          isCompared={compareIds.includes(m.id)}
          onToggleCompare={onToggleCompare}
          compareDisabled={compareIds.length >= 2}
        />
      ))}
    </ul>
  );
}