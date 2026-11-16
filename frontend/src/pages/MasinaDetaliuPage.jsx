import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchMasina } from "../api.js";
import { ETICHETE_SEGMENT } from "../constants.js";
import styles from "./MasinaDetaliuPage.module.css";

export default function MasinaDetaliuPage() {
  const { id } = useParams();
  const [masina, setMasina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    
    fetchMasina(id)
      .then((data) => {
        if (!ignore) {
          setMasina(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <p className="info" data-testid="loading">
        Se încarcă...
      </p>
    );
  }

  if (error) {
    return (
      <section className="panel">
        <p className="error" data-testid="error">
          Vehiculul nu a putut fi încărcat: {error}
        </p>
        <Link to="/">Înapoi la flotă</Link>
      </section>
    );
  }

  return (
    <section className={`panel ${styles.detail}`} data-testid="detail">
      <Link to="/" className={styles.back}>
        Înapoi la flotă
      </Link>
      <h2 className={!masina.disponibil ? styles.done : undefined} data-testid="detail-title">
        {masina.model}
      </h2>
      <dl className={styles.fields}>
        <dt>Segment</dt>
        <dd>
          <span className={`badge badge-${masina.segment}`}>
            {ETICHETE_SEGMENT[masina.segment]}
          </span>
        </dd>
        <dt>Status</dt>
        <dd>{masina.disponibil ? "Disponibil" : "Închiriat"}</dd>
        <dt>ID</dt>
        <dd>{masina.id}</dd>
      </dl>
    </section>
  );
}