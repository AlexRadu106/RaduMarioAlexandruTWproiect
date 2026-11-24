import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./SmartFinderPage.module.css";

const TRASEE = [
  { id: "oras", label: "Oraș & Navetă" },
  { id: "drum-lung", label: "Drum lung / Autostradă" },
  { id: "munte", label: "Munte & 4x4" },
  { id: "familie", label: "Familie & Bagaje" },
  { id: "sport", label: "Fun & Performanță" },
];

const PRIORITATI = [
  { id: "buget", label: "Buget & Consum" },
  { id: "echilibrat", label: "Echilibrat" },
  { id: "putere", label: "Putere (CP)" },
];

function evalueazaMasina(m, { buget, traseu, prioritate }) {
  let score = 0;
  const motive = [];
  const pret = m.pretZi || 50;
  const putere = m.putere || 120;
  const modelLower = (m.model || "").toLowerCase();
  const hasAwd = /4x4|awd|quattro|xdrive|4matic|4motion/.test(modelLower);

  // 1. Buget (max 40 puncte)
  if (pret <= buget) {
    score += 40;
    motive.push(`În buget (${pret} €/zi)`);
  } else {
    const diff = pret - buget;
    score += Math.max(0, Math.round(40 - diff * 1.0));
  }

  // 2. Potrivire traseu (max 40 puncte)
  if (traseu === "oras") {
    if (m.segment === "economic" || m.segment === "electric") {
      score += 40;
      motive.push(`Ideal pentru oraș (${m.segment})`);
    } else if (m.combustibil === "Hibrid") {
      score += 28;
      motive.push("Motorizare hibridă eficientă urban");
    } else {
      score += 12;
    }
  } else if (traseu === "drum-lung") {
    if (m.segment === "premium") {
      score += 40;
      motive.push("Confort excelent la drum lung");
    } else if (m.combustibil === "Diesel" || m.combustibil === "Hibrid") {
      score += 30;
      motive.push(`Autonomie bună (${m.combustibil})`);
    } else {
      score += 14;
    }
  } else if (traseu === "munte") {
    if (m.segment === "suv" && hasAwd) {
      score += 40;
      motive.push("SUV cu tracțiune integrală");
    } else if (m.segment === "suv" || hasAwd) {
      score += 30;
      motive.push(
        hasAwd ? "Tracțiune integrală (AWD)" : "Gardă la sol ridicată (SUV)"
      );
    } else {
      score += 10;
    }
  } else if (traseu === "familie") {
    if (m.segment === "van") {
      score += 40;
      motive.push("Spațiu maxim pentru familie și bagaje");
    } else if (m.segment === "suv") {
      score += 32;
      motive.push("Portbagaj generos și acces facil");
    } else {
      score += 12;
    }
  } else if (traseu === "sport") {
    if (m.segment === "sport") {
      score += 40;
      motive.push(`Segment sport (${putere} CP)`);
    } else if (putere >= 250) {
      score += 30;
      motive.push(`Performanță ridicată (${putere} CP)`);
    } else {
      score += 8;
    }
  }

  // 3. Prioritate (max 20 puncte)
  if (prioritate === "buget") {
    if (m.combustibil === "Electric" || m.combustibil === "Hibrid") {
      score += 12;
      motive.push(`Consum redus (${m.combustibil})`);
    }
    if (pret <= 55) score += 8;
    else if (pret <= 85) score += 4;
  } else if (prioritate === "putere") {
    const pts = Math.min(20, Math.round((putere / 350) * 20));
    score += pts;
    if (putere >= 200) motive.push(`Motor puternic: ${putere} CP`);
  } else {
    const anPts = m.an >= 2023 ? 10 : m.an >= 2021 ? 7 : 4;
    const kmPts =
      (m.km ?? 50000) <= 35000 ? 10 : (m.km ?? 50000) <= 60000 ? 6 : 3;
    score += anPts + kmPts;
    if (m.an >= 2023) motive.push(`Model recent (${m.an})`);
  }

  return {
    masina: m,
    score: Math.min(99, Math.max(15, score)),
    motive: motive.slice(0, 3),
  };
}

export default function SmartFinderPage({ masini }) {
  const [buget, setBuget] = useState(95);
  const [traseu, setTraseu] = useState("drum-lung");
  const [prioritate, setPrioritate] = useState("echilibrat");
  const [transmisie, setTransmisie] = useState("oricare");
  const [doarDisponibile, setDoarDisponibile] = useState(true);

  const top3 = useMemo(() => {
    const baza = masini.filter((m) => {
      if (doarDisponibile && !m.disponibil) return false;
      if (transmisie !== "oricare" && m.transmisie !== transmisie) return false;
      return true;
    });

    return baza
      .map((m) => evalueazaMasina(m, { buget, traseu, prioritate }))
      .sort(
        (a, b) =>
          b.score - a.score || (a.masina.pretZi || 0) - (b.masina.pretZi || 0)
      )
      .slice(0, 3);
  }, [masini, buget, traseu, prioritate, transmisie, doarDisponibile]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>
          ← Înapoi la flotă
        </Link>
        <span className={styles.subtitle}>
          Algoritm de recomandare pe baza a {masini.length} vehicule din flotă
        </span>
      </div>

      <div className={styles.layout}>
        <section className="panel">
          <h2>Configurează preferințele</h2>

          <div className={styles.field}>
            <label htmlFor="buget-range">
              Buget maxim / zi: <strong>{buget} €</strong>
            </label>
            <input
              id="buget-range"
              type="range"
              min="30"
              max="220"
              step="5"
              value={buget}
              onChange={(e) => setBuget(Number(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Tip traseu / utilizare</span>
            <div className={styles.pills}>
              {TRASEE.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`${styles.pill} ${
                    traseu === t.id ? styles.pillActive : ""
                  }`}
                  onClick={() => setTraseu(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Prioritate principală</span>
            <div className={styles.pills}>
              {PRIORITATI.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`${styles.pill} ${
                    prioritate === p.id ? styles.pillActive : ""
                  }`}
                  onClick={() => setPrioritate(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Transmisie preferată</span>
            <div className={styles.pills}>
              {["oricare", "Automată", "Manuală"].map((tr) => (
                <button
                  key={tr}
                  type="button"
                  className={`${styles.pill} ${
                    transmisie === tr ? styles.pillActive : ""
                  }`}
                  onClick={() => setTransmisie(tr)}
                >
                  {tr === "oricare" ? "Oricare" : tr}
                </button>
              ))}
            </div>
          </div>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={doarDisponibile}
              onChange={(e) => setDoarDisponibile(e.target.checked)}
            />
            <span>Afișează doar vehiculele disponibile acum</span>
          </label>
        </section>

        <section className="panel">
          <h2>Top 3 recomandări pentru tine</h2>

          {top3.length === 0 ? (
            <p className="info">
              Nu există vehicule care să corespundă criteriilor selectate.
            </p>
          ) : (
            <div className={styles.results}>
              {top3.map(({ masina, score, motive }, idx) => (
                <article
                  key={masina.id}
                  className={`${styles.resultCard} ${
                    idx === 0 ? styles.bestCard : ""
                  }`}
                >
                  <div className={styles.resultTop}>
                    <div>
                      <span className={styles.rankTag}>
                        {idx === 0
                          ? "★ #1 Cel mai bun match"
                          : `#${idx + 1} Recomandat`}
                      </span>
                      <h3 className={styles.carName}>{masina.model}</h3>
                      <div className={styles.metaRow}>
                        <span className={`badge badge-${masina.segment}`}>
                          {masina.segment}
                        </span>
                        <span>{masina.an}</span>
                        <span>• {masina.combustibil}</span>
                        <span>• {masina.transmisie}</span>
                        <span>• {masina.putere} CP</span>
                      </div>
                    </div>

                    <div className={styles.scoreBox}>
                      <span className={styles.scoreNum}>{score}%</span>
                      <span className={styles.scoreLabel}>MATCH</span>
                    </div>
                  </div>

                  <div className={styles.barTrack}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  {motive.length > 0 && (
                    <ul className={styles.reasons}>
                      {motive.map((mot, i) => (
                        <li key={i}>✓ {mot}</li>
                      ))}
                    </ul>
                  )}

                  <div className={styles.cardFooter}>
                    <div className={styles.price}>
                      <strong>{masina.pretZi} €</strong> <span>/ zi</span>
                    </div>
                    <Link
                      to={`/masini/${masina.id}`}
                      className="btn-primary"
                      style={{ textDecoration: "none" }}
                    >
                      Vezi detalii & Închiriază →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}