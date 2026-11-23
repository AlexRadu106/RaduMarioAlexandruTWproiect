export const SEGMENTE = [
  { value: "economic", label: "Economic" },
  { value: "suv", label: "SUV" },
  { value: "premium", label: "Premium" },
  { value: "sport", label: "Sport" },
  { value: "electric", label: "Electric" },
  { value: "van", label: "Van" },
];
export const ETICHETE_SEGMENT = Object.fromEntries(
  SEGMENTE.map((s) => [s.value, s.label])
);