/**
 * Trigger a browser download for a string of text content.
 * Caller must be running on the client (page interaction handler).
 */
export function downloadTextFile(
  filename: string,
  content: string,
  mime = "text/markdown;charset=utf-8"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // give the browser a tick to start the download before revoking
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
