import { Router } from "express";
import { parseId, valideazaMasina } from "../validation.js";

const router = Router();

let masini = [
  // ECONOMIC (10)
  { id: 1, model: "Dacia Logan 1.0 TCe", segment: "economic", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Manuală", putere: 90, km: 32400, pretZi: 32, nrInmatriculare: "B-101-FLT", zileRamase: 0, judet: "" },
  { id: 2, model: "Renault Clio 1.0 TCe", segment: "economic", disponibil: true, an: 2022, combustibil: "Benzină", transmisie: "Manuală", putere: 91, km: 41200, pretZi: 35, nrInmatriculare: "B-102-FLT", zileRamase: 0, judet: "" },
  { id: 3, model: "Skoda Octavia 1.5 TSI", segment: "economic", disponibil: true, an: 2024, combustibil: "Hibrid", transmisie: "Automată", putere: 150, km: 18900, pretZi: 48, nrInmatriculare: "B-315-FLT", zileRamase: 0, judet: "" },
  { id: 4, model: "Toyota Corolla 1.8 Hybrid", segment: "economic", disponibil: false, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 140, km: 27600, pretZi: 45, nrInmatriculare: "B-114-FLT", zileRamase: 4, judet: "Brașov" },
  { id: 21, model: "Dacia Sandero Stepway 1.0 TCe", segment: "economic", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Manuală", putere: 90, km: 25100, pretZi: 34, nrInmatriculare: "B-105-FLT", zileRamase: 0, judet: "" },
  { id: 22, model: "Volkswagen Golf 8 1.5 TSI", segment: "economic", disponibil: true, an: 2022, combustibil: "Benzină", transmisie: "Automată", putere: 130, km: 48900, pretZi: 46, nrInmatriculare: "B-108-FLT", zileRamase: 0, judet: "" },
  { id: 23, model: "Ford Focus 1.0 EcoBoost", segment: "economic", disponibil: false, an: 2021, combustibil: "Benzină", transmisie: "Manuală", putere: 125, km: 62300, pretZi: 39, nrInmatriculare: "B-112-FLT", zileRamase: 3, judet: "Sibiu" },
  { id: 24, model: "Hyundai i30 1.5 T-GDi", segment: "economic", disponibil: true, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 160, km: 21400, pretZi: 44, nrInmatriculare: "B-119-FLT", zileRamase: 0, judet: "" },
  { id: 25, model: "Opel Astra L 1.2 Turbo", segment: "economic", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Automată", putere: 130, km: 31200, pretZi: 42, nrInmatriculare: "B-122-FLT", zileRamase: 0, judet: "" },
  { id: 26, model: "Peugeot 208 1.2 PureTech", segment: "economic", disponibil: false, an: 2022, combustibil: "Benzină", transmisie: "Manuală", putere: 100, km: 39500, pretZi: 36, nrInmatriculare: "B-125-FLT", zileRamase: 2, judet: "Prahova" },

  // SUV (10)
  { id: 5, model: "Dacia Duster 1.3 TCe 4x4", segment: "suv", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Manuală", putere: 150, km: 29800, pretZi: 52, nrInmatriculare: "B-201-FLT", zileRamase: 0, judet: "" },
  { id: 6, model: "Volkswagen Tiguan 2.0 TDI", segment: "suv", disponibil: false, an: 2021, combustibil: "Diesel", transmisie: "Automată", putere: 150, km: 78500, pretZi: 65, nrInmatriculare: "B-204-FLT", zileRamase: 2, judet: "Cluj" },
  { id: 7, model: "Volvo XC60 B4 AWD", segment: "suv", disponibil: true, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 197, km: 36400, pretZi: 88, nrInmatriculare: "B-209-FLT", zileRamase: 0, judet: "" },
  { id: 8, model: "BMW X3 xDrive20d", segment: "suv", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 190, km: 54300, pretZi: 92, nrInmatriculare: "B-218-FLT", zileRamase: 0, judet: "" },
  { id: 27, model: "Hyundai Tucson 1.6 T-GDi HEV", segment: "suv", disponibil: true, an: 2024, combustibil: "Hibrid", transmisie: "Automată", putere: 230, km: 15600, pretZi: 68, nrInmatriculare: "B-221-FLT", zileRamase: 0, judet: "" },
  { id: 28, model: "Kia Sportage 1.6 T-GDi AWD", segment: "suv", disponibil: false, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 180, km: 28900, pretZi: 66, nrInmatriculare: "B-224-FLT", zileRamase: 5, judet: "Bihor" },
  { id: 29, model: "Toyota RAV4 2.5 Hybrid AWD", segment: "suv", disponibil: true, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 222, km: 33100, pretZi: 74, nrInmatriculare: "B-228-FLT", zileRamase: 0, judet: "" },
  { id: 30, model: "Audi Q5 40 TDI quattro", segment: "suv", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 204, km: 61400, pretZi: 96, nrInmatriculare: "B-231-FLT", zileRamase: 0, judet: "" },
  { id: 31, model: "Skoda Kodiaq 2.0 TDI 4x4", segment: "suv", disponibil: false, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 200, km: 57200, pretZi: 72, nrInmatriculare: "B-235-FLT", zileRamase: 7, judet: "Suceava" },
  { id: 32, model: "Mazda CX-5 2.5 Skyactiv-G", segment: "suv", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Automată", putere: 194, km: 24700, pretZi: 64, nrInmatriculare: "B-239-FLT", zileRamase: 0, judet: "" },

  // PREMIUM (10)
  { id: 9, model: "Peugeot 508 GT 2.0 BlueHDi", segment: "premium", disponibil: true, an: 2020, combustibil: "Diesel", transmisie: "Automată", putere: 180, km: 94200, pretZi: 75, nrInmatriculare: "CL-106-FLT", zileRamase: 0, judet: "" },
  { id: 10, model: "Audi A5 Sportback 2.0 TDI quattro", segment: "premium", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 204, km: 56100, pretZi: 95, nrInmatriculare: "B-508-FLT", zileRamase: 0, judet: "" },
  { id: 11, model: "Mercedes-Benz E 220d", segment: "premium", disponibil: false, an: 2023, combustibil: "Diesel", transmisie: "Automată", putere: 197, km: 42100, pretZi: 110, nrInmatriculare: "B-305-FLT", zileRamase: 6, judet: "Constanța" },
  { id: 12, model: "BMW 520d xDrive M-Paket", segment: "premium", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 190, km: 61800, pretZi: 105, nrInmatriculare: "B-309-FLT", zileRamase: 0, judet: "" },
  { id: 33, model: "Audi A6 45 TDI quattro", segment: "premium", disponibil: true, an: 2023, combustibil: "Diesel", transmisie: "Automată", putere: 245, km: 38400, pretZi: 118, nrInmatriculare: "B-312-FLT", zileRamase: 0, judet: "" },
  { id: 34, model: "BMW 320d xDrive G20", segment: "premium", disponibil: false, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 190, km: 51900, pretZi: 89, nrInmatriculare: "B-318-FLT", zileRamase: 4, judet: "Călărași" },
  { id: 35, model: "Mercedes-Benz C 200 4MATIC", segment: "premium", disponibil: true, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 204, km: 29300, pretZi: 98, nrInmatriculare: "B-321-FLT", zileRamase: 0, judet: "" },
  { id: 36, model: "Volvo S60 B5 AWD", segment: "premium", disponibil: true, an: 2022, combustibil: "Hibrid", transmisie: "Automată", putere: 250, km: 44800, pretZi: 92, nrInmatriculare: "B-324-FLT", zileRamase: 0, judet: "" },
  { id: 37, model: "Volkswagen Arteon 2.0 TDI R-Line", segment: "premium", disponibil: true, an: 2023, combustibil: "Diesel", transmisie: "Automată", putere: 200, km: 35600, pretZi: 86, nrInmatriculare: "B-328-FLT", zileRamase: 0, judet: "" },
  { id: 38, model: "Lexus ES 300h", segment: "premium", disponibil: false, an: 2023, combustibil: "Hibrid", transmisie: "Automată", putere: 218, km: 26500, pretZi: 108, nrInmatriculare: "B-332-FLT", zileRamase: 3, judet: "Mureș" },

  // SPORT (9)
  { id: 13, model: "Seat Leon Cupra 300", segment: "sport", disponibil: true, an: 2020, combustibil: "Benzină", transmisie: "Automată", putere: 300, km: 68400, pretZi: 115, nrInmatriculare: "B-401-FLT", zileRamase: 0, judet: "" },
  { id: 14, model: "Volkswagen Golf 7 R 4Motion", segment: "sport", disponibil: true, an: 2019, combustibil: "Benzină", transmisie: "Automată", putere: 310, km: 74500, pretZi: 120, nrInmatriculare: "B-407-FLT", zileRamase: 0, judet: "" },
  { id: 15, model: "Audi S3 Sportback quattro", segment: "sport", disponibil: false, an: 2022, combustibil: "Benzină", transmisie: "Automată", putere: 310, km: 39200, pretZi: 130, nrInmatriculare: "B-410-FLT", zileRamase: 1, judet: "Timiș" },
  { id: 16, model: "BMW M340i xDrive", segment: "sport", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Automată", putere: 374, km: 24700, pretZi: 165, nrInmatriculare: "B-440-FLT", zileRamase: 0, judet: "" },
  { id: 39, model: "Cupra Formentor VZ 2.0 TSI", segment: "sport", disponibil: true, an: 2024, combustibil: "Benzină", transmisie: "Automată", putere: 310, km: 14200, pretZi: 135, nrInmatriculare: "B-442-FLT", zileRamase: 0, judet: "" },
  { id: 40, model: "Mercedes-AMG A 35 4MATIC", segment: "sport", disponibil: false, an: 2022, combustibil: "Benzină", transmisie: "Automată", putere: 306, km: 34800, pretZi: 140, nrInmatriculare: "B-445-FLT", zileRamase: 2, judet: "București" },
  { id: 41, model: "Hyundai i30 N Performance", segment: "sport", disponibil: true, an: 2022, combustibil: "Benzină", transmisie: "Automată", putere: 280, km: 31900, pretZi: 118, nrInmatriculare: "B-448-FLT", zileRamase: 0, judet: "" },
  { id: 42, model: "Audi RS3 Sportback", segment: "sport", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Automată", putere: 400, km: 19600, pretZi: 195, nrInmatriculare: "B-450-FLT", zileRamase: 0, judet: "" },
  { id: 43, model: "Porsche Macan S", segment: "sport", disponibil: true, an: 2023, combustibil: "Benzină", transmisie: "Automată", putere: 380, km: 22400, pretZi: 210, nrInmatriculare: "B-455-FLT", zileRamase: 0, judet: "" },

  // ELECTRIC (6)
  { id: 17, model: "Tesla Model 3 Long Range", segment: "electric", disponibil: true, an: 2024, combustibil: "Electric", transmisie: "Automată", putere: 440, km: 14300, pretZi: 85, nrInmatriculare: "B-601-FLT", zileRamase: 0, judet: "" },
  { id: 18, model: "Volkswagen ID.4 Pro", segment: "electric", disponibil: true, an: 2023, combustibil: "Electric", transmisie: "Automată", putere: 204, km: 22100, pretZi: 72, nrInmatriculare: "B-604-FLT", zileRamase: 0, judet: "" },
  { id: 44, model: "Tesla Model Y Performance", segment: "electric", disponibil: false, an: 2024, combustibil: "Electric", transmisie: "Automată", putere: 534, km: 11800, pretZi: 98, nrInmatriculare: "B-608-FLT", zileRamase: 3, judet: "Cluj" },
  { id: 45, model: "Hyundai Ioniq 5 AWD", segment: "electric", disponibil: true, an: 2023, combustibil: "Electric", transmisie: "Automată", putere: 325, km: 19400, pretZi: 82, nrInmatriculare: "B-612-FLT", zileRamase: 0, judet: "" },
  { id: 46, model: "BMW i4 eDrive40", segment: "electric", disponibil: true, an: 2023, combustibil: "Electric", transmisie: "Automată", putere: 340, km: 17600, pretZi: 102, nrInmatriculare: "B-615-FLT", zileRamase: 0, judet: "" },
  { id: 47, model: "Dacia Spring Extreme 65", segment: "electric", disponibil: true, an: 2024, combustibil: "Electric", transmisie: "Automată", putere: 65, km: 9800, pretZi: 28, nrInmatriculare: "B-619-FLT", zileRamase: 0, judet: "" },

  // VAN (5)
  { id: 19, model: "Mercedes-Benz V 250d 4MATIC", segment: "van", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 190, km: 63500, pretZi: 125, nrInmatriculare: "B-701-FLT", zileRamase: 0, judet: "" },
  { id: 20, model: "Volkswagen Multivan T7 eHybrid", segment: "van", disponibil: false, an: 2024, combustibil: "Hibrid", transmisie: "Automată", putere: 218, km: 16800, pretZi: 118, nrInmatriculare: "B-707-FLT", zileRamase: 5, judet: "Iași" },
  { id: 48, model: "Ford Tourneo Custom 2.0 EcoBlue", segment: "van", disponibil: true, an: 2023, combustibil: "Diesel", transmisie: "Automată", putere: 170, km: 41200, pretZi: 95, nrInmatriculare: "B-711-FLT", zileRamase: 0, judet: "" },
  { id: 49, model: "Renault Trafic SpaceClass", segment: "van", disponibil: true, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 150, km: 58900, pretZi: 88, nrInmatriculare: "B-715-FLT", zileRamase: 0, judet: "" },
  { id: 50, model: "Peugeot Traveller 2.0 BlueHDi", segment: "van", disponibil: false, an: 2022, combustibil: "Diesel", transmisie: "Automată", putere: 177, km: 52400, pretZi: 92, nrInmatriculare: "B-719-FLT", zileRamase: 6, judet: "Dolj" },
];
let nextId = 51;

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

  if (date.disponibil === true) {
    if (date.zileRamase === undefined) date.zileRamase = 0;
    if (date.judet === undefined) date.judet = "";
  } else if (date.disponibil === false) {
    if (date.zileRamase === undefined) date.zileRamase = masini[index].zileRamase || 3;
    if (date.judet === undefined) date.judet = masini[index].judet || "București";
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