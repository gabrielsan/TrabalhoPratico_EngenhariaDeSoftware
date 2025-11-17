export default function formatToCoin(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
