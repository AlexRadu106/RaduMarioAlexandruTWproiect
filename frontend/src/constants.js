export const SEGMENTE = [
  { value: "economic", label: "Economic" },
  { value: "suv", label: "SUV" },
  { value: "premium", label: "Premium" },
];

export const ETICHETE_SEGMENT = Object.fromEntries(
  SEGMENTE.map((s) => [s.value, s.label])
);