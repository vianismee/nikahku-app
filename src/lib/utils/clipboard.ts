/**
 * Cross-browser clipboard utility.
 * Handles iOS Safari (needs range selection), non-HTTPS, and older browsers.
 */
export async function copyToClipboard(text: string): Promise<void> {
  // Modern Clipboard API — requires HTTPS + user gesture
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // fall through to legacy method
    }
  }

  // Legacy fallback — works on HTTP + iOS Safari + older browsers
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.cssText =
    "position:fixed;left:-9999px;top:-9999px;opacity:0;font-size:16px";
  document.body.appendChild(el);

  // iOS Safari requires manual range selection
  const isIOS = /ipad|iphone|ipod/i.test(navigator.userAgent);
  if (isIOS) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    el.setSelectionRange(0, 999999);
  } else {
    el.select();
  }

  document.execCommand("copy");
  document.body.removeChild(el);
}
