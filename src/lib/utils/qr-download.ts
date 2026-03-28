import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

/** Buat QR card PNG (canvas → blob). Berisi QR + NanoID + nama tamu */
async function generateQrCardBlob(
  nanoId: string,
  guestName: string,
  coupleName: string
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const size = 320;
  canvas.width = size;
  canvas.height = size + 80;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header text
  ctx.fillStyle = "#8B6F4E";
  ctx.font = "bold 14px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(coupleName, size / 2, 22);

  // QR code
  const qrDataUrl = await QRCode.toDataURL(nanoId, {
    width: 280,
    margin: 1,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });
  const qrImg = new Image();
  await new Promise<void>((res) => { qrImg.onload = () => res(); qrImg.src = qrDataUrl; });
  ctx.drawImage(qrImg, 20, 32, 280, 280);

  // NanoID
  ctx.fillStyle = "#555555";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.letterSpacing = "6px";
  ctx.fillText(nanoId, size / 2, size + 20);
  ctx.letterSpacing = "0px";

  // Guest name
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "14px sans-serif";
  ctx.fillText(guestName, size / 2, size + 44);

  // Footer hint
  ctx.fillStyle = "#aaaaaa";
  ctx.font = "11px sans-serif";
  ctx.fillText("Scan untuk konfirmasi & souvenir", size / 2, size + 68);

  return new Promise((res) => canvas.toBlob((b) => res(b!), "image/png"));
}

/** Download QR untuk 1 tamu */
export async function downloadSingleQr(
  nanoId: string,
  guestName: string,
  coupleName: string
): Promise<void> {
  const blob = await generateQrCardBlob(nanoId, guestName, coupleName);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `QR_${nanoId}_${guestName.replace(/\s+/g, "_")}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Download ZIP semua QR untuk semua tamu */
export async function downloadAllQrZip(
  guests: { nano_id: string; name: string }[],
  coupleName: string
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder("QR_Undangan")!;

  for (const g of guests) {
    const blob = await generateQrCardBlob(g.nano_id, g.name, coupleName);
    folder.file(`${g.nano_id}_${g.name.replace(/\s+/g, "_")}.png`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, `QR_Undangan_${coupleName.replace(/\s+/g, "_")}.zip`);
}
