export function tryOpenLiveChatWidget() {
  if (typeof window === "undefined") return;
  try {
    window.LiveChatWidget?.call?.("maximize");
  } catch {
    /* ignore */
  }
}

const RETRY_MS = [0, 500, 1500];

export function openLiveChatWithRetries() {
  RETRY_MS.forEach((ms) => {
    setTimeout(tryOpenLiveChatWidget, ms);
  });
}
