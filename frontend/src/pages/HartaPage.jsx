import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./HartaPage.module.css";

const GEOJSON_URL =
  "https://code.highcharts.com/mapdata/countries/ro/ro-all.geo.json";

function normalizeName(str = "") {
  const clean = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-_]/g, " ")
    .trim();

  if (clean === "bucharest") return "bucuresti";
  return clean;
}

function buildSvgData(geojson) {
  const W = 820;
  const H = 580;
  const PAD = 24;

  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  const visitCoords = (coords) => {
    if (typeof coords[0] === "number") {
      const [x, y] = coords;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    } else {
      coords.forEach(visitCoords);
    }
  };

  geojson.features.forEach((f) => visitCoords(f.geometry.coordinates));

  const scale = Math.min(
    (W - 2 * PAD) / (maxX - minX),
    (H - 2 * PAD) / (maxY - minY)
  );
  const offsetX = (W - (maxX - minX) * scale) / 2;
  const offsetY = (H - (maxY - minY) * scale) / 2;

  const project = ([x, y]) => [
    offsetX + (x - minX) * scale,
    H - (offsetY + (y - minY) * scale),
  ];

  const ringToPath = (ring) =>
    ring
      .map((pt, i) => {
        const [px, py] = project(pt);
        return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
      })
      .join(" ") + " Z";

  const counties = geojson.features.map((f) => {
    const { type, coordinates } = f.geometry;
    const polygons = type === "Polygon" ? [coordinates] : coordinates;

    const d = polygons
      .map((poly) => poly.map(ringToPath).join(" "))
      .join(" ");

    // Calculăm centrul celui mai mare poligon pentru poziția badge-ului
    let largestRing = polygons[0][0];
    polygons.forEach((poly) => {
      if (poly[0].length > largestRing.length) largestRing = poly[0];
    });

    let cMinX = Infinity,
      cMaxX = -Infinity,
      cMinY = Infinity,
      cMaxY = -Infinity;
    largestRing.forEach((pt) => {
      const [px, py] = project(pt);
      if (px < cMinX) cMinX = px;
      if (px > cMaxX) cMaxX = px;
      if (py < cMinY) cMinY = py;
      if (py > cMaxY) cMaxY = py;
    });

    const rawName = f.properties.name || "";
    const displayName = rawName === "Bucharest" ? "București" : rawName;

    return {
      id: f.properties["hc-key"] || rawName,
      name: displayName,
      norm: normalizeName(displayName),
      d,
      cx: (cMinX + cMaxX) / 2,
      cy: (cMinY + cMaxY) / 2,
    };
  });

  return { W, H, counties };
}

export default function HartaPage({ masini }) {
  const [svgData, setSvgData] = useState(null);
  const [mapError, setMapError] = useState("");
  const [hovered, setHovered] = useState(null);
  const [selectedNorm, setSelectedNorm] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(GEOJSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Nu am putut încărca contururile hărții.");
        return res.json();
      })
      .then((geo) => {
        if (!ignore) setSvgData(buildSvgData(geo));
      })
      .catch((err) => {
        if (!ignore) setMapError(err.message);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const inchiriate = useMemo(
    () => masini.filter((m) => !m.disponibil),
    [masini]
  );

  const peJudeteNorm = useMemo(() => {
    const map = {};
    inchiriate.forEach((m) => {
      const label = m.judet || "București";
      const norm = normalizeName(label);
      if (!map[norm]) map[norm] = { label, lista: [] };
      map[norm].lista.push(m);
    });
    return map;
  }, [inchiriate]);

  const judeteActive = useMemo(
    () =>
      Object.entries(peJudeteNorm).sort(
        (a, b) => b[1].lista.length - a[1].lista.length
      ),
    [peJudeteNorm]
  );

  const activeInfo = hovered
    ? {
        name: hovered.name,
        lista: peJudeteNorm[hovered.norm]?.lista || [],
      }
    : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.backLink}>
          ← Înapoi la flotă
        </Link>
        <span className={styles.summary}>
          {inchiriate.length} vehicule pe traseu în {judeteActive.length}{" "}
          {judeteActive.length === 1 ? "județ" : "județe"}
        </span>
      </div>

      <div className={styles.layout}>
        <section className={`panel ${styles.mapPanel}`}>
          <div className={styles.mapHeader}>
            <h2>Harta României pe județe</h2>
            <div className={styles.hoverBadge}>
              {activeInfo ? (
                <>
                  <strong>{activeInfo.name}</strong> —{" "}
                  {activeInfo.lista.length}{" "}
                  {activeInfo.lista.length === 1 ? "vehicul" : "vehicule"}
                </>
              ) : (
                <span>Trece cu mouse-ul peste un județ</span>
              )}
            </div>
          </div>

          {mapError && <p className="error">{mapError}</p>}
          {!svgData && !mapError && (
            <p className="info">Se încarcă harta României...</p>
          )}

          {svgData && (
            <svg
              viewBox={`0 0 ${svgData.W} ${svgData.H}`}
              className={styles.romaniaSvg}
              role="img"
              aria-label="Harta interactivă a României pe județe"
            >
              {svgData.counties.map((c) => {
                const count = peJudeteNorm[c.norm]?.lista.length || 0;
                const isSelected = selectedNorm === c.norm;

                return (
                  <g
                    key={c.id}
                    className={`${styles.countyGroup} ${
                      count > 0 ? styles.countyHasCars : ""
                    } ${isSelected ? styles.countySelected : ""}`}
                    onMouseEnter={() => setHovered(c)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() =>
                      setSelectedNorm((prev) => (prev === c.norm ? null : c.norm))
                    }
                  >
                    <path d={c.d} className={styles.countyPath} />
                    {count > 0 && (
                      <g className={styles.pinGroup}>
                        <circle cx={c.cx} cy={c.cy} r="13" className={styles.pinCircle} />
                        <text
                          x={c.cx}
                          y={c.cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                          className={styles.pinText}
                        >
                          {count}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
        </section>

        <aside className="panel">
          <h2>Distribuție pe județe</h2>
          {judeteActive.length === 0 ? (
            <p className="info">Toate vehiculele sunt disponibile în garaj.</p>
          ) : (
            <ul className={styles.judetList}>
              {judeteActive.map(([norm, { label, lista }]) => (
                <li
                  key={norm}
                  className={`${styles.judetItem} ${
                    selectedNorm === norm ? styles.judetActive : ""
                  }`}
                  onMouseEnter={() => setHovered({ name: label, norm })}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    setSelectedNorm((prev) => (prev === norm ? null : norm))
                  }
                >
                  <div className={styles.judetHeader}>
                    <strong>{label}</strong>
                    <span className={styles.countPill}>{lista.length}</span>
                  </div>
                  <div className={styles.carsMini}>
                    {lista.map((m) => (
                      <Link
                        key={m.id}
                        to={`/masini/${m.id}`}
                        className={styles.carLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        • {m.model} ({m.zileRamase || 1}z)
                      </Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}