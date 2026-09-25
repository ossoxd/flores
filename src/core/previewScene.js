const PREVIEW_SCENES = new Set(["game", "bouquet", "letter", "final-island"]);

export function resolvePreviewScene(urlValue) {
  const url = new URL(urlValue);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const requested = url.searchParams.get("preview");
  return isLocal && PREVIEW_SCENES.has(requested) ? requested : "menu";
}

export function resolveVictoryPreview(urlValue) {
  const url = new URL(urlValue);
  const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const enabled = isLocal
    && url.searchParams.get("preview") === "game"
    && url.searchParams.get("testVictory") === "1";
  return {
    enabled,
    state: enabled
      ? {
          flowerIds: Array.from({ length: 9 }, (_, index) => `flower-${index + 1}`),
          dialogueSeen: true,
          gameCompleted: false
        }
      : null
  };
}
