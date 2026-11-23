import { Router } from "express";
import { parseId, valideazaMasina } from "../validation.js";

const router = Router();

let masini = [
  // ECONOMIC
  { id: 1, model: "Dacia Logan 1.0 TCe", segment: "economic", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Manuală", putere: 90, km: 32400, pretZi: 32, nrInmatriculare: "B-101-FLT", zileRamase: 0 },
  { id: 2, model: "Renault Clio 1.0 TCe", segment: "economic", disponibil: true, an: 2022, combustibil: "Benzină", transmisie: "Manuală", putere: 91, km: 41200, pretZi: 35, nrInmatriculare: "B-102-FLT", zileRamase: 0 },
  { id: 3, model: "Skoda Octavia 1.5 TSI", segment: "economic", disponibil: true, an: 2024, combustibil: "Hibrid", transmisie: "Automată", putere: 150, km: 18900, pretZi: 48, nrInmatriculare: "B-315-FLT", zileRamase: 0 },
  { id: 4, model: "Toyota Corolla 1.8 Hybrid", segment: "economic", disponibil: false, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 140, km: 27600, pretZi: 45, nrInmatriculare: "B-114-FLT", zileRamase: 4 },

  // SUV
  { id: 5, model: "Dacia Duster 1.3 TCe 4x4", segment: "suv", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Manuală", putere: 150, km: 29800, pretZi: 52, nrInmatriculare: "B-201-FLT", zileRamase: 0 },
  { id: 6, model: "Volkswagen Tiguan 2.0 TDI", segment: "suv", disponibil: false, an: 2021, combustibil: "Diesel", transmisie: "Automată", putere: 150, km: 78500, pretZi: 65, nrInmatriculare: "B-204-FLT", zileRamase: 2 },
  { id: 7, model: "Volvo XC60 B4 AWD", segment: "suv", disponibil: true, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 197, km: 36400, pretZi: 88, nrInmatriculare: "B-209-FLT", zileRamase: 0 },
  { id: 8, model: "BMW X3 xDrive20d", segment: "suv", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 190, km: 54300, pretZi: 92, nrInmatriculare: "B-218-FLT", zileRamase: 0 },

  // PREMIUM
  { id: 9, model: "Peugeot 508 GT 2.0 BlueHDi", segment: "premium", disponibil: true, an: 2020, combustibil: "Diesel", transmisie: "Automată", putere: 180, km: 94200, pretZi: 75, nrInmatriculare: "CL-106-FLT", zileRamase: 0 },
  { id: 10, model: "Audi A5 Sportback 2.0 TDI quattro", segment: "premium", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 204, km: 56100, pretZi: 95, nrInmatriculare: "B-508-FLT", zileRamase: 0 },
  { id: 11, model: "Mercedes-Benz E 220d", segment: "premium", disponibil: false, an: 2023, combustibil: "Diesel", transmisie: "Automată", putere: 197, km: 42100, pretZi: 110, nrInmatriculare: "B-305-FLT", zileRamase: 6 },
  { id: 12, model: "BMW 520d xDrive M-Paket", segment: "premium", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 190, km: 61800, pretZi: 105, nrInmatriculare: "B-309-FLT", zileRamase: 0 },

  // SPORT
  { id: 13, model: "Seat Leon Cupra 300", segment: "sport", disponibil: true, an: 2020, combustibil: "Benzină", transmisie: "Automată", putere: 300, km: 68400, pretZi: 115, nrInmatriculare: "B-401-FLT", zileRamase: 0 },
  { id: 14, model: "Volkswagen Golf 7 R 4Motion", segment: "sport", disponibil: true, an: 2019, combustibil: "Benzină", transmisie: "Automată", putere: 310, km: 74500, pretZi: 120, nrInmatriculare: "B-407-FLT", zileRamase: 0 },
  { id: 15, model: "Audi S3 Sportback quattro", segment: "sport", disponibil: false, an: 2022, combustibil: "Benzină", transmisie: "Automată", putere: 310, km: 39200, pretZi: 130, nrInmatriculare: "B-410-FLT", zileRamase: 1 },
  { id: 16, model: "BMW M340i xDrive", segment: "sport", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Automată", putere: 374, km: 24700, pretZi: 165, nrInmatriculare: "B-440-FLT", zileRamase: 0 },

  // ELECTRIC
  { id: 17, model: "Tesla Model 3 Long Range", segment: "electric", disponibil: true, an: 2024, combustibil: "Electric", transmisie: "Automată", putere: 440, km: 14300, pretZi: 85, nrInmatriculare: "B-601-FLT", zileRamase: 0 },
  { id: 18, model: "Volkswagen ID.4 Pro", segment: "electric", disponibil: true, an: 2023, combustibil: "Electric", transmisie: "Automată", putere: 204, km: 22100, pretZi: 72, nrInmatriculare: "B-604-FLT", zileRamase: 0 },

  // VAN
  { id: 19, model: "Mercedes-Benz V 250d 4MATIC", segment: "van", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 190, km: 63500, pretZi: 125, nrInmatriculare: "B-701-FLT", zileRamase: 0 },
  { id: 20, model: "Volkswagen Multivan T7 eHybrid", segment: "van", disponibil: false, an: 2024, combustibil: "Hibrid", transmisie: "Automată", putere: 218, km: 16800, pretZi: 118, nrInmatriculare: "B-707-FLT", zileRamase: 5 },
];
let nextId = 21;

function gasesteIndex(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    res.status(400).json({ error: "Id invalid" });
    return -1;
  }

  const index = masini.findIndex((m) => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Mașina nu există" });
    return -1;
  }

  return index;
}

router.get("/", (req, res) => {
  res.json(masini);
});

router.get("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;
  res.json(masini[index]);
});

router.post("/", (req, res) => {
  const { erori, date } = valideazaMasina(req.body ?? {});
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }

  const masina = { id: nextId++, ...date };
  masini.push(masina);
  res.status(201).json(masina);
});

router.patch("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;

  const { erori, date } = valideazaMasina(req.body ?? {}, { partial: true });
  if (erori.length > 0) {
    return res.status(400).json({ error: erori.join("; ") });
  }

  if (date.disponibil === true && date.zileRamase === undefined) {
    date.zileRamase = 0;
  } else if (date.disponibil === false && date.zileRamase === undefined) {
    date.zileRamase = masini[index].zileRamase || 3;
  }

  masini[index] = { ...masini[index], ...date };
  res.json(masini[index]);
});

router.delete("/:id", (req, res) => {
  const index = gasesteIndex(req, res);
  if (index === -1) return;

  masini.splice(index, 1);
  res.status(204).end();
});

export default router;