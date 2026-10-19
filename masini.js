const masini = [
  { id: 1, model: "Dacia Duster 1.5 dCi", disponibil: true, segment: "suv" },
  { id: 2, model: "Volkswagen Golf 8 2.0 TDI", disponibil: false, segment: "economic" },
  { id: 3, model: "Audi A6 40 TDI Quattro", disponibil: true, segment: "premium" }
];

const SEGMENTE = ["economic", "suv", "premium"];

function listeazaModele(lista) {
  return lista.map((m) => m.model);
}

function numaraDisponibile(lista) {
  return lista.filter((m) => m.disponibil).length;
}

function cautaDupaModel(lista, text) {
  return lista.filter((m) =>
    m.model.toLowerCase().includes(text.toLowerCase())
  );
}

function nextId(lista) {
  return lista.reduce((max, m) => Math.max(max, m.id), 0) + 1;
}

function adaugaMasina(lista, model, segment = "economic") {
  const modelCurat = model ? model.trim() : "";

  if (!modelCurat) {
    console.error("Modelul vehiculului nu poate fi gol!");
    return lista;
  }

  if (!SEGMENTE.includes(segment)) {
    console.error(`Segment invalid: ${segment}`);
    return lista;
  }

  const nou = {
    id: nextId(lista),
    model: modelCurat,
    disponibil: true,
    segment: segment
  };

  return [...lista, nou];
}

function comutaDisponibil(lista, id) {
  return lista.map((m) =>
    m.id === id ? { ...m, disponibil: !m.disponibil } : m
  );
}

function stergeMasina(lista, id) {
  return lista.filter((m) => m.id !== id);
}

console.log("--- Citire ---");
console.log("Modele:", listeazaModele(masini).join(", "));
console.log("Disponibile:", numaraDisponibile(masini));
console.log("Căutare 'Golf':", listeazaModele(cautaDupaModel(masini, "Golf")).join(", "));

console.log("--- Adăugare ---");
let listaNoua = adaugaMasina(masini, "Skoda Octavia 2.0 TDI", "economic");
console.log("Lista nouă:", listaNoua.length, "vehicule");
console.log("Originalul a rămas cu:", masini.length, "vehicule");

console.log("--- Modificare și ștergere ---");
listaNoua = comutaDisponibil(listaNoua, 1);
console.log("După indisponibilizarea id 1, disponibile:", numaraDisponibile(listaNoua));
listaNoua = stergeMasina(listaNoua, 3);
console.log("După ștergerea id 3:", listeazaModele(listaNoua).join(", "));

console.log("--- Validare ---");
adaugaMasina(listaNoua, "   ");
adaugaMasina(listaNoua, "BMW 320d", "supercar");