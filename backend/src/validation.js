export const SEGMENTE = ["economic", "suv", "premium", "sport", "electric", "van"];
export const COMBUSTIBILI = ["Diesel", "Benzină", "Hibrid", "Electric"];
export const TRANSMISII = ["Manuală", "Automată"];
const MODEL_MAX = 100;

export function valideazaMasina(body, { partial = false } = {}) {
  const erori = [];
  const date = {};

  if (!partial || body.model !== undefined) {
    if (typeof body.model !== "string" || body.model.trim() === "") {
      erori.push("model este obligatoriu");
    } else if (body.model.trim().length > MODEL_MAX) {
      erori.push(`model are maximum ${MODEL_MAX} de caractere`);
    } else {
      date.model = body.model.trim();
    }
  }

  if (!partial || body.segment !== undefined) {
    const s = body.segment ?? "economic";
    if (!SEGMENTE.includes(s)) {
      erori.push(`segment trebuie să fie unul din: ${SEGMENTE.join(", ")}`);
    } else {
      date.segment = s;
    }
  }

  if (body.disponibil !== undefined) {
    if (typeof body.disponibil !== "boolean") {
      erori.push("disponibil trebuie să fie true sau false");
    } else {
      date.disponibil = body.disponibil;
    }
  } else if (!partial) {
    date.disponibil = true;
  }

  // --- Câmpuri opționale (detalii vehicul) ---
  if (body.an !== undefined) {
    const an = Number(body.an);
    if (!Number.isInteger(an) || an < 1990 || an > 2027) {
      erori.push("an trebuie să fie un număr între 1990 și 2027");
    } else {
      date.an = an;
    }
  } else if (!partial) {
    date.an = 2022;
  }

  if (body.pretZi !== undefined) {
    const pret = Number(body.pretZi);
    if (Number.isNaN(pret) || pret <= 0 || pret > 5000) {
      erori.push("pretZi trebuie să fie un număr pozitiv");
    } else {
      date.pretZi = pret;
    }
  } else if (!partial) {
    date.pretZi = 45;
  }

  if (body.combustibil !== undefined) {
    if (!COMBUSTIBILI.includes(body.combustibil)) {
      erori.push(`combustibil trebuie să fie unul din: ${COMBUSTIBILI.join(", ")}`);
    } else {
      date.combustibil = body.combustibil;
    }
  } else if (!partial) {
    date.combustibil = "Diesel";
  }

  if (body.transmisie !== undefined) {
    if (!TRANSMISII.includes(body.transmisie)) {
      erori.push(`transmisie trebuie să fie una din: ${TRANSMISII.join(", ")}`);
    } else {
      date.transmisie = body.transmisie;
    }
  } else if (!partial) {
    date.transmisie = "Manuală";
  }

  if (body.putere !== undefined) {
    const cp = Number(body.putere);
    if (!Number.isInteger(cp) || cp < 40 || cp > 1500) {
      erori.push("putere trebuie să fie între 40 și 1500 CP");
    } else {
      date.putere = cp;
    }
  } else if (!partial) {
    date.putere = 130;
  }

  if (body.km !== undefined) {
    const km = Number(body.km);
    if (!Number.isInteger(km) || km < 0) {
      erori.push("km trebuie să fie un număr întreg pozitiv");
    } else {
      date.km = km;
    }
  } else if (!partial) {
    date.km = 45000;
  }

  if (body.nrInmatriculare !== undefined) {
    if (typeof body.nrInmatriculare !== "string" || body.nrInmatriculare.trim().length > 15) {
      erori.push("nrInmatriculare invalid");
    } else {
      date.nrInmatriculare = body.nrInmatriculare.trim().toUpperCase();
    }
  } else if (!partial) {
    date.nrInmatriculare = "B-999-FLT";
  }
  
  if (body.zileRamase !== undefined) {
    const z = Number(body.zileRamase);
    if (!Number.isInteger(z) || z < 0 || z > 365) {
      erori.push("zileRamase trebuie să fie un număr întreg între 0 și 365");
    } else {
      date.zileRamase = z;
    }
  } else if (!partial) {
    date.zileRamase = date.disponibil === false ? 3 : 0;
  }

  if (body.judet !== undefined) {
    if (typeof body.judet !== "string" || body.judet.trim().length > 50) {
      erori.push("judet trebuie să fie un text valid (max 50 caractere)");
    } else {
      date.judet = body.judet.trim();
    }
  } else if (!partial) {
    date.judet = date.disponibil === false ? "București" : "";
  }

  if (body.contract !== undefined) {
    const c = body.contract;
    if (typeof c !== "object" || c === null || Array.isArray(c)) {
      erori.push("contract trebuie să fie un obiect valid");
    } else {
      const numeClient = typeof c.numeClient === "string" ? c.numeClient.trim() : "";
      if (numeClient.length < 2 || numeClient.length > 100) {
        erori.push("numeClient din contract trebuie să aibă între 2 și 100 de caractere");
      } else {
        const contractValid = { numeClient };

        if (typeof c.nrContract === "string" && c.nrContract.trim().length > 0) {
          contractValid.nrContract = c.nrContract.trim().slice(0, 40);
        }
        if (typeof c.ciClient === "string") {
          contractValid.ciClient = c.ciClient.trim().slice(0, 30);
        }
        if (typeof c.telefon === "string") {
          contractValid.telefon = c.telefon.trim().slice(0, 30);
        }
        if (typeof c.dataStart === "string" && c.dataStart.trim().length > 0) {
          contractValid.dataStart = c.dataStart.trim().slice(0, 25);
        }
        if (typeof c.dataRetur === "string" && c.dataRetur.trim().length > 0) {
          contractValid.dataRetur = c.dataRetur.trim().slice(0, 25);
        }
        if (c.zile !== undefined) {
          const z = Number(c.zile);
          if (Number.isInteger(z) && z >= 1 && z <= 365) {
            contractValid.zile = z;
          }
        }
        if (typeof c.judet === "string" && c.judet.trim().length > 0) {
          contractValid.judet = c.judet.trim().slice(0, 50);
        }
        if (c.total !== undefined) {
          const t = Number(c.total);
          if (!Number.isNaN(t) && t > 0) {
            contractValid.total = Math.round(t);
          }
        }
        if (typeof c.areReducere === "boolean") {
          contractValid.areReducere = c.areReducere;
        }

        date.contract = contractValid;
      }
    }
  }
  
  return { erori, date };
}

export function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}