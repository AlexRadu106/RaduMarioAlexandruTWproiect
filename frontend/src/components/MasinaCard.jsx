const ETICHETE_SEGMENT = {
  economic: "Economic",
  suv: "SUV",
  premium: "Premium"
};

export default function MasinaCard({ masina, onToggle, onDelete }) {
  const esteInchiriat = !masina.disponibil;

  return (
    <li className={esteInchiriat ? "item-card done" : "item-card"}>
      <label className="item-main">
        <input
          type="checkbox"
          checked={esteInchiriat}
          onChange={() => onToggle(masina.id)}
        />
        <div>
          <h3>{masina.model}</h3>
          <span className={`badge badge-${masina.segment}`}>
            {ETICHETE_SEGMENT[masina.segment]}
          </span>
        </div>
      </label>

      <div className="item-actions">
        <span className="status">
          {masina.disponibil ? "Disponibil" : "Închiriat"}
        </span>
        <button
          className="btn-danger"
          onClick={() => onDelete(masina.id)}
          aria-label={`Șterge ${masina.model}`}
        >
          Șterge
        </button>
      </div>
    </li>
  );
}