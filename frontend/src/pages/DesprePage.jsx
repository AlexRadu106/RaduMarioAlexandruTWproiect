import { Link } from "react-router-dom";
import styles from "./DesprePage.module.css";

const ENDPOINTS = [
  { method: "GET", path: "/health", desc: "Verifică starea serverului Express" },
  { method: "GET", path: "/masini", desc: "Returnează lista completă de vehicule din flotă" },
  { method: "GET", path: "/masini/:id", desc: "Returnează fișa detaliată a unui vehicul" },
  { method: "POST", path: "/masini", desc: "Adaugă un vehicul nou cu validare pe server" },
  { method: "PATCH", path: "/masini/:id", desc: "Actualizează statusul, zilele rămase sau alte câmpuri" },
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
              Aplicație web completă pentru administrarea unei flote auto de închirieri:
              urmărirea disponibilității în timp real, gestionarea duratei de închiriere,
              filtrare avansată și estimare automată a costurilor.
            </p>
          </div>
          <div className={styles.stackPills}>
            <span>React 19</span>
            <span>Vite</span>
            <span>React Router</span>
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
            Dark / Light. Include căutare live, filtrare pe 6 categorii, sortare după preț
            sau an și paginare configurabilă (10 / 20 vehicule).
          </p>
        </article>

        <article className="panel">
          <h3>Backend REST API</h3>
          <p className={styles.cardText}>
            Server propriu în Node.js + Express cu structură modulară (rute, validare,
            tratare erori). Răspunde cu coduri HTTP corecte (<code>200</code>,{" "}
            <code>201</code>, <code>204</code>, <code>400</code>, <code>404</code>) și
            validează fiecare cerere.
          </p>
        </article>

        <article className="panel">
          <h3>Funcționalități Flotă</h3>
          <p className={styles.cardText}>
            Flotă inițială de 20 de vehicule (Economic, SUV, Premium, Sport, Electric,
            Van), urmărire automată a zilelor rămase de închiriere și calculator interactiv
            cu reducere de 10% pentru 7+ zile.
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