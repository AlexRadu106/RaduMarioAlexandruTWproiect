import { Link } from "react-router-dom";
import styles from "./CompareModal.module.css";

function calc7Zile(pretZi) {
  const p = Number(pretZi) || 0;
  return Math.round(p * 7 * 0.9);
}

export default function CompareModal({ masini, onClose, onClear }) {
  if (!masini || masini.length !== 2) return null;
  const [a, b] = masini;

  const cost7A = calc7Zile(a.pretZi);
  const cost7B = calc7Zile(b.pretZi);

  const rows = [
    {
      label: "Status",
      valA: a.disponibil ? "Disponibil" : `Închiriat (${a.zileRamase || 1}z)`,
      valB: b.disponibil ? "Disponibil" : `Închiriat (${b.zileRamase || 1}z)`,
      win: a.disponibil === b.disponibil ? null : a.disponibil ? "A" : "B",
    },
    {
      label: "Tarif / zi",
      valA: a.pretZi ? `${a.pretZi} €` : "—",
      valB: b.pretZi ? `${b.pretZi} €` : "—",
      win:
        a.pretZi && b.pretZi && a.pretZi !== b.pretZi
          ? a.pretZi < b.pretZi
            ? "A"
            : "B"
          : null,
    },
    {
      label: "Estimare 7 zile (-10%)",
      valA: a.pretZi ? `${cost7A} €` : "—",
      valB: b.pretZi ? `${cost7B} €` : "—",
      win:
        a.pretZi && b.pretZi && cost7A !== cost7B
          ? cost7A < cost7B
            ? "A"
            : "B"
          : null,
    },
    {
      label: "Putere motor",
      valA: a.putere ? `${a.putere} CP` : "—",
      valB: b.putere ? `${b.putere} CP` : "—",
      win:
        a.putere && b.putere && a.putere !== b.putere
          ? a.putere > b.putere
            ? "A"
            : "B"
          : null,
    },
    {
      label: "An fabricație",
      valA: a.an ?? "—",
      valB: b.an ?? "—",
      win: a.an && b.an && a.an !== b.an ? (a.an > b.an ? "A" : "B") : null,
    },
    {
      label: "Kilometraj",
      valA: a.km !== undefined ? `${a.km.toLocaleString("ro-RO")} km` : "—",
      valB: b.km !== undefined ? `${b.km.toLocaleString("ro-RO")} km` : "—",
      win:
        a.km !== undefined && b.km !== undefined && a.km !== b.km
          ? a.km < b.km
            ? "A"
            : "B"
          : null,
    },
    {
      label: "Combustibil",
      valA: a.combustibil ?? "—",
      valB: b.combustibil ?? "—",
      win: null,
    },
    {
      label: "Transmisie",
      valA: a.transmisie ?? "—",
      valB: b.transmisie ?? "—",
      win: null,
    },
  ];

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Comparație vehicule</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Închide comparația"
          >
            ×
          </button>
        </div>

        <div className={styles.gridHeader}>
          <div />
          <div className={styles.carHead}>
            <span className={`badge badge-${a.segment}`}>{a.segment}</span>
            <Link to={`/masini/${a.id}`} className={styles.carTitle} onClick={onClose}>
              {a.model}
            </Link>
          </div>
          <div className={styles.carHead}>
            <span className={`badge badge-${b.segment}`}>{b.segment}</span>
            <Link to={`/masini/${b.id}`} className={styles.carTitle} onClick={onClose}>
              {b.model}
            </Link>
          </div>
        </div>

        <div className={styles.table}>
          {rows.map((r) => (
            <div key={r.label} className={styles.row}>
              <span className={styles.label}>{r.label}</span>
              <span className={`${styles.cell} ${r.win === "A" ? styles.winner : ""}`}>
                {r.valA}
              </span>
              <span className={`${styles.cell} ${r.win === "B" ? styles.winner : ""}`}>
                {r.valB}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button type="button" className="btn-danger" onClick={onClear}>
            Golește selecția
          </button>
          <button type="button" className="btn-primary" onClick={onClose}>
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}