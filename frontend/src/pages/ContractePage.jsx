import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ContractePage.module.css";

function normalizeText(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function ContractePage({ masini = [] }) {
  const [statusFilter, setStatusFilter] = useState("toate");
  const [search, setSearch] = useState("");

  const toateContractele = useMemo(() => {
    const lista = [];
    masini.forEach((m) => {
      const items = Array.isArray(m.contracte) ? m.contracte : [];
      items.forEach((c) => {
        lista.push({
          ...c,
          masinaId: m.id,
          model: m.model,
          segment: m.segment,
          nrInmatriculare: m.nrInmatriculare,
        });
      });
    });

    return lista.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "activ" ? -1 : 1;
      }
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tB - tA;
    });
  }, [masini]);

  const activeCount = useMemo(
    () => toateContractele.filter((c) => c.status === "activ").length,
    [toateContractele]
  );
  const finalizateCount = toateContractele.length - activeCount;
  const valoareTotala = useMemo(
    () =>
      toateContractele.reduce((sum, c) => sum + (Number(c.total) || 0), 0),
    [toateContractele]
  );
  const valoareActiva = useMemo(
    () =>
      toateContractele
        .filter((c) => c.status === "activ")
        .reduce((sum, c) => sum + (Number(c.total) || 0), 0),
    [toateContractele]
  );

  const contracteFiltrate = useMemo(() => {
    const q = normalizeText(search);
    return toateContractele.filter((c) => {
      if (statusFilter !== "toate" && c.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = normalizeText(
        [
          c.nrContract,
          c.numeClient,
          c.model,
          c.nrInmatriculare,
          c.judet,
          c.telefon,
        ]
          .filter(Boolean)
          .join(" ")
      );
      return haystack.includes(q);
    });
  }, [toateContractele, statusFilter, search]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>
          ← Înapoi la flotă
        </Link>
        <span className={styles.summary}>
          {toateContractele.length}{" "}
          {toateContractele.length === 1
            ? "contract înregistrat"
            : "contracte înregistrate"}{" "}
          în sesiunea curentă
        </span>
      </div>

      <section className={styles.kpiGrid} aria-label="Statistici contracte">
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total contracte</span>
          <strong className={styles.kpiValue}>{toateContractele.length}</strong>
          <span className={styles.kpiSub}>în istoric flotă</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiAmber}`}>
          <span className={styles.kpiLabel}>Active acum</span>
          <strong className={styles.kpiValue}>{activeCount}</strong>
          <span className={styles.kpiSub}>vehicule pe traseu</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <span className={styles.kpiLabel}>Finalizate</span>
          <strong className={styles.kpiValue}>{finalizateCount}</strong>
          <span className={styles.kpiSub}>vehicule returnate</span>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiAccent}`}>
          <span className={styles.kpiLabel}>Valoare totală</span>
          <strong className={styles.kpiValue}>
            {valoareTotala.toLocaleString("ro-RO")} €
          </strong>
          <span className={styles.kpiSub}>
            din care {valoareActiva.toLocaleString("ro-RO")} € active
          </span>
        </div>
      </section>

      <section className="panel">
        <h2>Istoric contracte flotă ({contracteFiltrate.length})</h2>

        <div className={styles.controls}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Caută după nr. contract, client, model, nr. înmatriculare sau județ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Caută contracte"
          />

          <div className={styles.pills}>
            {[
              { id: "toate", label: `Toate (${toateContractele.length})` },
              { id: "activ", label: `Active (${activeCount})` },
              { id: "finalizat", label: `Finalizate (${finalizateCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`${styles.pill} ${
                  statusFilter === tab.id ? styles.pillActive : ""
                }`}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {contracteFiltrate.length === 0 ? (
          <p className="info">
            Nu există contracte care să corespundă criteriilor selectate.
          </p>
        ) : (
          <ul className={styles.list}>
            {contracteFiltrate.map((c) => {
              const isActiv = c.status === "activ";
              return (
                <li
                  key={c.id || `${c.masinaId}-${c.nrContract}`}
                  className={`${styles.card} ${
                    isActiv ? styles.cardActive : ""
                  }`}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.leftHead}>
                      <span className={styles.code}>
                        {c.nrContract || "FM-CONTRACT"}
                      </span>
                      <span
                        className={`${styles.status} ${
                          isActiv ? styles.statusActiv : styles.statusFinalizat
                        }`}
                      >
                        {isActiv ? "● Activ" : "✓ Finalizat"}
                      </span>
                      {c.segment && (
                        <span className={`badge badge-${c.segment}`}>
                          {c.segment}
                        </span>
                      )}
                    </div>

                    <div className={styles.priceGroup}>
                      {c.areReducere && (
                        <span className={styles.discountTag}>-10%</span>
                      )}
                      <strong className={styles.total}>
                        {c.total ?? 0} €
                      </strong>
                    </div>
                  </div>

                  <div className={styles.carRow}>
                    <Link
                      to={`/masini/${c.masinaId}`}
                      className={styles.carLink}
                    >
                      {c.model}
                    </Link>
                    {c.nrInmatriculare && (
                      <span className={styles.plate}>{c.nrInmatriculare}</span>
                    )}
                  </div>

                  <div className={styles.metaGrid}>
                    <span>
                      Client: <strong>{c.numeClient || "Nespecificat"}</strong>
                    </span>
                    <span>
                      Destinație: <strong>{c.judet || "—"}</strong>
                    </span>
                    <span>
                      Perioadă:{" "}
                      <strong>
                        {c.dataStart || "—"} – {c.dataRetur || "—"} (
                        {c.zile || 1} {(c.zile || 1) === 1 ? "zi" : "zile"})
                      </strong>
                    </span>
                    {c.telefon && (
                      <span>
                        Telefon: <strong>{c.telefon}</strong>
                      </span>
                    )}
                    {c.ciClient && (
                      <span>
                        CI / Pașaport: <strong>{c.ciClient}</strong>
                      </span>
                    )}
                    {!isActiv && c.dataReturnare && (
                      <span>
                        Returnat la: <strong>{c.dataReturnare}</strong>
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
