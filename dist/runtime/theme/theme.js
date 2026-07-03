const VAR = {
  baseColor: "--sk-base-color",
  highlightColor: "--sk-highlight-color",
  darkBaseColor: "--sk-dark-base-color",
  darkHighlightColor: "--sk-dark-highlight-color",
  borderRadius: "--sk-radius",
  opacity: "--sk-opacity",
  duration: "--sk-duration"
};
function canTouchDom() {
  return typeof document !== "undefined" && !!document.documentElement;
}
export function applyBaseTheme(config) {
  if (!canTouchDom()) return;
  const root = document.documentElement;
  root.style.setProperty(VAR.baseColor, config.baseColor);
  root.style.setProperty(VAR.highlightColor, config.highlightColor);
  root.style.setProperty(VAR.darkBaseColor, config.darkBaseColor);
  root.style.setProperty(VAR.darkHighlightColor, config.darkHighlightColor);
  root.style.setProperty(VAR.borderRadius, config.borderRadius);
  root.style.setProperty(VAR.opacity, String(config.opacity));
  root.style.setProperty(VAR.duration, `${config.shimmerDuration}ms`);
}
export function setThemeTokens(tokens, target) {
  if (!canTouchDom() && !target) return;
  const root = target ?? document.documentElement;
  if (tokens.baseColor !== void 0) root.style.setProperty(VAR.baseColor, tokens.baseColor);
  if (tokens.highlightColor !== void 0) root.style.setProperty(VAR.highlightColor, tokens.highlightColor);
  if (tokens.darkBaseColor !== void 0) root.style.setProperty(VAR.darkBaseColor, tokens.darkBaseColor);
  if (tokens.darkHighlightColor !== void 0) root.style.setProperty(VAR.darkHighlightColor, tokens.darkHighlightColor);
  if (tokens.borderRadius !== void 0) root.style.setProperty(VAR.borderRadius, tokens.borderRadius);
  if (tokens.opacity !== void 0) root.style.setProperty(VAR.opacity, String(tokens.opacity));
}
export const THEME_VARS = VAR;
