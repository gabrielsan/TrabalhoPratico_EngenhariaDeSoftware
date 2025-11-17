export default function formatToDate(value: string): string {
  const dataUTC = new Date(value);
  const dataLocal = new Date(
    dataUTC.getTime() + dataUTC.getTimezoneOffset() * 60000,
  );
  const dataFormatada = dataLocal.toLocaleDateString();
  return dataFormatada;
}
