import MasinaCard from "./MasinaCard.jsx";

export default function MasinaList({ masini }) {
  if (masini.length === 0) {
    return <p className="empty">Nu există niciun vehicul înregistrat în flotă.</p>;
  }

  return (
    <ul className="item-list">
      {masini.map((masina) => (
        <MasinaCard key={masina.id} masina={masina} />
      ))}
    </ul>
  );
}