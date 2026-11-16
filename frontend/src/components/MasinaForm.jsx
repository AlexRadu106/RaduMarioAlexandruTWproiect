import { useState } from "react";

const SEGMENTE = [
  { value: "economic", label: "Economic" },
  { value: "suv", label: "SUV" },
  { value: "premium", label: "Premium" },
];

const MODEL_MAX = 100;

export default function MasinaForm({ onAdd }) {
  const [model, setModel] = useState("");
  const [segment, setSegment] = useState("economic");
  const [eroare, setEroare] = useState("");
  const [trimite, setTrimite] = useState(false);

  function valideaza() {
    const m = model.trim();
    if (m === "") return "Modelul este obligatoriu.";
    if (m.length > MODEL_MAX) return `Modelul are maximum ${MODEL_MAX} de caractere.`;
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const mesaj = valideaza();
    if (mesaj) {
      setEroare(mesaj);
      return;
    }

    setEroare("");
    setTrimite(true);

    try {
      await onAdd({ model: model.trim(), segment, disponibil: true });
      setModel("");
      setSegment("economic");
    } catch (err) {
      setEroare(err.message);
    } finally {
      setTrimite(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate data-testid="form">
      <label>
        Model
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="Ex: Dacia Duster"
          maxLength={MODEL_MAX}
          aria-invalid={Boolean(eroare)}
          data-testid="form-title"
        />
      </label>

      <label>
        Segment
        <select
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          data-testid="form-segment"
        >
          {SEGMENTE.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      {eroare && (
        <p className="error" data-testid="form-error">
          {eroare}
        </p>
      )}

      <button type="submit" disabled={trimite} data-testid="form-submit">
        {trimite ? "Se salvează..." : "Adaugă"}
      </button>
    </form>
  );
}