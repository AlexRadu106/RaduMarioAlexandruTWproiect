import { useState, useEffect } from "react";
import MasinaForm from "../components/MasinaForm";
import MasinaList from "../components/MasinaList";
import styles from "./MasiniPage.module.css";

export default function MasiniPage({
  masini,
  loading,
  error,
  onAdd,
  onToggle,
  onDelete,
}) {
  const [segmentFilter, setSegmentFilter] = useState("toate");
  const [sortBy, setSortBy] = useState("default");
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const masiniFiltrate = [...masini]
    .filter((m) => {
      if (segmentFilter !== "toate" && m.segment !== segmentFilter) return false;
      if (search.trim() !== "") {
        const q = search.toLowerCase();
        const matchModel = m.model.toLowerCase().includes(q);
        const matchPlate = (m.nrInmatriculare || "").toLowerCase().includes(q);
        return matchModel || matchPlate;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "pret-asc") return (a.pretZi ?? 0) - (b.pretZi ?? 0);
      if (sortBy === "pret-desc") return (b.pretZi ?? 0) - (a.pretZi ?? 0);
      if (sortBy === "an-desc") return (b.an ?? 0) - (a.an ?? 0);
      if (sortBy === "an-asc") return (a.an ?? 0) - (b.an ?? 0);
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(masiniFiltrate.length / perPage));

  // Revine la pagina 1 când se schimbă filtrele sau numărul de elemente pe pagină
  useEffect(() => {
    setCurrentPage(1);
  }, [segmentFilter, sortBy, search, perPage]);

  // Dacă ștergi ultima mașină de pe ultima pagină, revine pe pagina anterioară
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * perPage;
  const masiniPagina = masiniFiltrate.slice(startIndex, startIndex + perPage);

  return (
    <div className={styles.grid}>
      <section className="panel">
        <h2>Adaugă vehicul</h2>
        <MasinaForm onAdd={onAdd} />
      </section>

      <section className="panel">
        <h2>Vehicule în flotă ({masiniFiltrate.length})</h2>

        <div className={styles.controls}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Caută model sau nr. înmatriculare..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sortează vehiculele"
          >
            <option value="default">Sortare: Implicită</option>
            <option value="pret-asc">Preț: Mic → Mare</option>
            <option value="pret-desc">Preț: Mare → Mic</option>
            <option value="an-desc">An: Cele mai noi</option>
            <option value="an-asc">An: Cele mai vechi</option>
          </select>

          <select
            className={styles.sortSelect}
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            aria-label="Vehicule pe pagină"
          >
            <option value={10}>10 / pagină</option>
            <option value={20}>20 / pagină</option>
          </select>
        </div>

        <div className={styles.filterPills}>
          {["toate", "economic", "suv", "premium", "sport", "electric", "van"].map(
            (seg) => (
              <button
                key={seg}
                type="button"
                className={`${styles.pill} ${
                  segmentFilter === seg ? styles.pillActive : ""
                }`}
                onClick={() => setSegmentFilter(seg)}
              >
                {seg === "toate" ? "Toate" : seg.toUpperCase()}
              </button>
            )
          )}
        </div>

        {loading && <p className="info">Se încarcă vehiculele...</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <>
            <MasinaList
              masini={masiniPagina}
              onToggle={onToggle}
              onDelete={onDelete}
            />

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  ← Înapoi
                </button>

                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        className={`${styles.pageBtn} ${
                          currentPage === page ? styles.pageActive : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  className={styles.pageBtn}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Înainte →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}