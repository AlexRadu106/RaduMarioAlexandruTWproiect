export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Eroare server: ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

export function fetchMasini() {
  return request("/masini");
}

export function createMasina(masina) {
  return request("/masini", {
    method: "POST",
    body: JSON.stringify(masina),
  });
}

export function updateMasina(id, changes) {
  return request(`/masini/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteMasina(id) {
  return request(`/masini/${id}`, {
    method: "DELETE",
  });
}