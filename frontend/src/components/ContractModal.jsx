import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import styles from "./ContractModal.module.css";

// Curăță diacriticele pentru fontul standard Helvetica din jsPDF (fără caractere stricate)
function roSafe(text = "") {
  return String(text)
    .replace(/[ăâ]/g, "a")
    .replace(/[ĂÂ]/g, "A")
    .replace(/[î]/g, "i")
    .replace(/[Î]/g, "I")
    .replace(/[șş]/g, "s")
    .replace(/[ȘŞ]/g, "S")
    .replace(/[țţ]/g, "t")
    .replace(/[ȚŢ]/g, "T");
}

export default function ContractModal({
  masina,
  zile,
  judet,
  subtotal,
  total,
  areReducere,
  submitting,
  onClose,
  onConfirm,
}) {
  const [numeClient, setNumeClient] = useState("");
  const [ciClient, setCiClient] = useState("");
  const [telefon, setTelefon] = useState("");
  const [hasSigned, setHasSigned] = useState(false);

  const canvasRef = useRef(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function startDraw(e) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);
    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function moveDraw(e) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasSigned) setHasSigned(true);
  }

  function endDraw() {
    drawingRef.current = false;
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  }

  function genereazaPDF() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const azi = new Date();
    const dataFormatata = azi.toLocaleDateString("ro-RO");
    const dataRetur = new Date(
      azi.getTime() + zile * 24 * 60 * 60 * 1000
    ).toLocaleDateString("ro-RO");
    const nrContract = `FM-${azi.getFullYear()}-${String(masina.id).padStart(
      3,
      "0"
    )}-${String(azi.getTime()).slice(-4)}`;

    // Header colorat
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 34, "F");
    doc.setTextColor(56, 189, 248);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("FLEETMANAGER", 16, 16);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text("CONTRACT DE INCHIRIERE AUTO", 16, 24);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(`Nr. contract: ${nrContract}`, 194, 15, { align: "right" });
    doc.text(`Data emiterii: ${dataFormatata}`, 194, 22, { align: "right" });

    // 1. Date Client
    let y = 46;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text("1. DATE CLIENT (LOCATAR)", 16, y);
    doc.setDrawColor(203, 213, 225);
    doc.line(16, y + 2, 194, y + 2);

    y += 9;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nume complet: ${roSafe(numeClient)}`, 16, y);
    doc.text(`CI / Pasaport: ${roSafe(ciClient || "Nespecificat")}`, 115, y);
    y += 7;
    doc.text(`Telefon: ${roSafe(telefon || "Nespecificat")}`, 16, y);
    doc.text(`Judet destinatie: ${roSafe(judet)}`, 115, y);

    // 2. Date Vehicul
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text("2. DATE VEHICUL INCHIRIAT", 16, y);
    doc.line(16, y + 2, 194, y + 2);

    y += 9;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Model: ${roSafe(masina.model)}`, 16, y);
    doc.text(
      `Nr. inmatriculare: ${roSafe(masina.nrInmatriculare || "-")}`,
      115,
      y
    );
    y += 7;
    doc.text(
      `Segment: ${roSafe((masina.segment || "").toUpperCase())} | An: ${
        masina.an || "-"
      }`,
      16,
      y
    );
    doc.text(
      `Combustibil / Transmisie: ${roSafe(masina.combustibil || "-")} / ${roSafe(
        masina.transmisie || "-"
      )}`,
      115,
      y
    );
    y += 7;
    doc.text(
      `Kilometraj la predare: ${
        masina.km !== undefined ? masina.km.toLocaleString("ro-RO") : "-"
      } km`,
      16,
      y
    );
    doc.text(`Putere motor: ${masina.putere || "-"} CP`, 115, y);

    // 3. Perioada si Costuri
    y += 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text("3. PERIOADA SI SUMAR FINANCIAR", 16, y);
    doc.line(16, y + 2, 194, y + 2);

    y += 9;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Perioada: ${dataFormatata} - ${dataRetur} (${zile} ${zile === 1 ? "zi" : "zile"})`, 16, y);
    y += 7;
    doc.text(
      `Tarif de baza: ${zile} x ${masina.pretZi ?? 45} EUR = ${subtotal} EUR`,
      16,
      y
    );
    if (areReducere) {
      y += 7;
      doc.setTextColor(16, 185, 129);
      doc.text(`Reducere inchiriere 7+ zile (-10%): -${subtotal - total} EUR`, 16, y);
      doc.setTextColor(15, 23, 42);
    }

    y += 9;
    doc.setFillColor(241, 245, 249);
    doc.rect(16, y - 5, 178, 11, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text(`TOTAL DE PLATA: ${total} EUR`, 20, y + 2);

    // 4. Clauze esentiale
    y += 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.text("4. CONDITII DE PREDARE-PRIMIRE", 16, y);
    doc.line(16, y + 2, 194, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const clauze = [
      "- Politica de combustibil este FULL-TO-FULL: vehiculul se preda cu rezervorul plin si se returneaza in aceeasi stare.",
      "- Locatarul raspunde pentru amenzile de circulatie, taxele de drum si eventualele daune produse pe durata contractului.",
      "- Vehiculul va fi utilizat pe teritoriul Romaniei, cu destinatia principala declarata in judetul " + roSafe(judet) + ".",
      "- Returnarea cu intarziere fata de data stabilita poate atrage tarifarea unei zile suplimentare.",
    ];
    clauze.forEach((c) => {
      const lines = doc.splitTextToSize(c, 178);
      doc.text(lines, 16, y);
      y += lines.length * 5 + 1.5;
    });

    // 5. Semnaturi
    y = Math.max(y + 10, 232);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("LOCATOR (FleetManager)", 16, y);
    doc.text("LOCATAR (Semnatura digitala)", 120, y);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Aprobat electronic - FleetManager RO", 16, y + 14);
    doc.line(16, y + 26, 86, y + 26);

    // Inserare imagine semnătură din Canvas
    const sigDataUrl = canvasRef.current.toDataURL("image/png");
    doc.setDrawColor(203, 213, 225);
    doc.rect(120, y + 3, 74, 24);
    doc.addImage(sigDataUrl, "PNG", 121, y + 4, 72, 22);

    const filePlate = (masina.nrInmatriculare || `ID${masina.id}`).replace(
      /\s+/g,
      "_"
    );
    doc.save(`Contract_${filePlate}_${dataFormatata.replace(/\./g, "-")}.pdf`);
  }

  async function handleConfirmAndDownload(e) {
    e.preventDefault();
    if (!numeClient.trim() || !hasSigned) return;
    genereazaPDF();
    await onConfirm();
  }

  const canSubmit = numeClient.trim().length >= 3 && hasSigned && !submitting;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2>Contract de închiriere & Semnătură</h2>
            <p className={styles.sub}>
              {masina.model} ({masina.nrInmatriculare}) • {zile}{" "}
              {zile === 1 ? "zi" : "zile"} • {judet} • <strong>{total} €</strong>
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Închide"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleConfirmAndDownload} className={styles.form}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="client-nume">Nume complet client *</label>
              <input
                id="client-nume"
                type="text"
                placeholder="ex: Popescu Andrei"
                value={numeClient}
                onChange={(e) => setNumeClient(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="client-ci">Serie & Nr. CI / Pașaport</label>
              <input
                id="client-ci"
                type="text"
                placeholder="ex: RX 123456"
                value={ciClient}
                onChange={(e) => setCiClient(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="client-tel">Telefon contact</label>
              <input
                id="client-tel"
                type="tel"
                placeholder="ex: 0722 000 000"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label>Politică combustibil</label>
              <input type="text" value="Full-to-Full (standard)" disabled />
            </div>
          </div>

          <div className={styles.sigSection}>
            <div className={styles.sigHeader}>
              <span>Semnătură client * (desenează cu mouse-ul)</span>
              <button
                type="button"
                className={styles.clearBtn}
                onClick={clearSignature}
              >
                Șterge semnătura
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={560}
              height={150}
              className={styles.canvas}
              onPointerDown={startDraw}
              onPointerMove={moveDraw}
              onPointerUp={endDraw}
              onPointerLeave={endDraw}
            />
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Anulează
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!canSubmit}
            >
              {submitting
                ? "Se procesează..."
                : "Semnează, Închiriază & Descarcă PDF"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}