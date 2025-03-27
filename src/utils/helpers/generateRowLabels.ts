export const generateRowLabels = (extractedRows: number): string[] => {
  const labels: string[] = [];
  for (let i = 0; i < extractedRows; i++) {
    let label = "";
    let n = i;
    while (n >= 0) {
      label = String.fromCharCode((n % 26) + 65) + label;
      n = Math.floor(n / 26) - 1;
    }
    labels.push(label);
  }
  return labels;
};