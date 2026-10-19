const ETICHETE_SEGMENT = {
  economic: "Economic",
  suv: "SUV",
  premium: "Premium"
};

export default function MasinaCard({ masina }) {
  return (
    <li className={masina.disponibil ? "item-card" : "item-card done"}>
      <div>
        <h3>{masina.model}</h3>
        <span className={`badge badge-${masina.segment}`}>
          {ETICHETE_SEGMENT[masina.segment]}
        </span>
      </div>
      <span className="status">
        {masina.disponibil ? "Disponibil" : "Închiriat"}
      </span>
    </li>
  );
}