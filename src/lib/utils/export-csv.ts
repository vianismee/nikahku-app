/**
 * Download arbitrary data as a UTF-8 CSV file with BOM (for Excel compatibility).
 */
export function downloadCsv(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][]
) {
  const escape = (v: string | number | null | undefined) =>
    `"${String(v ?? "").replace(/"/g, '""')}"`;

  const lines = [headers.map(escape), ...rows.map((r) => r.map(escape))];
  const blob = new Blob(["\uFEFF" + lines.map((l) => l.join(",")).join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
