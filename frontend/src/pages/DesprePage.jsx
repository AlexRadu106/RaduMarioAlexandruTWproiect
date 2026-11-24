import { Link } from "react-router-dom";
import styles from "./DesprePage.module.css";

const ENDPOINTS = [
  { method: "GET", path: "/health", desc: "Verifică starea serverului Express" },
  { method: "GET", path: "/masini", desc: "Returnează lista completă a celor 50 de vehicule și contractele asociate" },
  { method: "GET", path: "/masini/:id", desc: "Returnează fișa detaliată a unui vehicul și istoricul său de contracte" },
  { method: "POST", path: "/masini", desc: "Adaugă un vehicul nou cu validare pe server" },
  { method: "PATCH", path: "/masini/:id", desc: "Actualizează statusul, județul, zilele rămase și înregistrează sau finalizează contractele" },
  { method: "DELETE", path: "/masini/:id", desc: "Elimină un vehicul din flotă" },
];

export default function DesprePage() {
  return (
    <div className={styles.wrapper}>
      <Link to="/" className={styles.backLink}>
        ← Înapoi la lista vehiculelor
      </Link>

      <section className="panel">
        <div className={styles.hero}>
          <div>
            <span className={styles.eyebrow}>Proiect Full-Stack • Tehnologii Web</span>
            <h2 className={styles.title}>Despre FleetManager</h2>
            <p className={styles.subtitle}>
              Aplicație web completă pentru administrarea unei flote auto de închirieri din
              România: disponibilitate în timp real, hartă vectorială pe cele 42 de județe,
              recomandări Smart Finder, contracte PDF cu semnătură digitală și istoric
              complet al închirierilor.
            </p>
          </div>
          <div className={styles.stackPills}>
            <span>React 19</span>
            <span>Vite</span>
            <span>React Router</span>
            <span>CSS Modules</span>
            <span>jsPDF</span>
            <span>HTML5 Canvas</span>
            <span>SVG Vectorial</span>
            <span>Node.js</span>
            <span>Express</span>
          </div>
        </div>
      </section>

      <div className={styles.cardsGrid}>
        <article className="panel">
          <h3>Frontend SPA</h3>
          <p className={styles.cardText}>
            Construit în React + Vite cu rute dedicate, CSS Modules și temă adaptivă
            Dark / Light. Include catalog cu căutare, filtrare pe 6 segmente, sortare,
            paginare (10 / 20), comparator side-by-side, hartă SVG a României pe 42 de
            județe, Smart Finder Top 3 și pagină dedicată pentru istoricul contractelor.
          </p>
        </article>

        <article className="panel">
          <h3>Backend REST API</h3>
          <p className={styles.cardText}>
            Server propriu în Node.js + Express cu structură modulară (rute, validare
            completă și parțială, tratare erori). Răspunde cu coduri HTTP semantice (
            <code>200</code>, <code>201</code>, <code>204</code>, <code>400</code>,{" "}
            <code>404</code>) și menține coerența automată între statusul vehiculelor,
            județe și istoricul de contracte.
          </p>
        </article>

        <article className="panel">
          <h3>Funcționalități Flotă</h3>
          <p className={styles.cardText}>
            Flotă inițială de 50 de vehicule (Economic, SUV, Premium, Sport, Electric,
            Van), calculator de închiriere cu reducere automată de 10% pentru 7+ zile,
            politică transparentă full-to-full, semnătură digitală pe HTML5 Canvas,
            contract PDF descărcabil și evidență completă a contractelor active și
            finalizate.
          </p>
        </article>
      </div>

      <section className="panel">
        <h2>Endpoint-uri API disponibile</h2>
        <div className={styles.endpointsList}>
          {ENDPOINTS.map((ep) => (
            <div key={`${ep.method}-${ep.path}`} className={styles.endpointRow}>
              <span className={`${styles.method} ${styles[`m_${ep.method}`]}`}>
                {ep.method}
              </span>
              <code className={styles.path}>{ep.path}</code>
              <span className={styles.desc}>{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}