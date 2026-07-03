import { ATTR, CLASS } from "../constants.js";
const HEADING_TAGS = /* @__PURE__ */ new Set(["H1", "H2", "H3", "H4", "H5", "H6"]);
const IMAGE_TAGS = /* @__PURE__ */ new Set(["IMG", "PICTURE", "VIDEO", "CANVAS"]);
const SKIP_TAGS = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT", "BR", "HR", "WBR"]);
function hasText(value) {
  return !!value && value.trim().length > 0;
}
function hasElementChildren(el) {
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 1) return true;
  }
  return false;
}
function hasOwnText(el) {
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === 3 && hasText(child.textContent)) return true;
  }
  return false;
}
function looksLikeAvatar(el, style) {
  const radius = Number.parseFloat(style.borderRadius);
  const w = el.clientWidth || Number.parseFloat(style.width) || 0;
  const h = el.clientHeight || Number.parseFloat(style.height) || 0;
  if (!w || !h) return false;
  const square = Math.abs(w - h) / Math.max(w, h) < 0.2;
  const round = style.borderRadius.includes("%") ? Number.parseFloat(style.borderRadius) >= 40 : radius >= Math.min(w, h) / 2 - 1;
  return square && round;
}
function looksLikeBadge(el, style) {
  const display = style.display;
  const inline = display === "inline-block" || display === "inline-flex" || display === "inline";
  const rounded = Number.parseFloat(style.borderRadius) > 0 || style.borderRadius.includes("%");
  const short = (el.textContent ?? "").trim().length <= 24;
  const role = el.getAttribute("role");
  if (role === "status" || el.className.toLowerCase().includes("badge")) return "badge";
  if (el.className.toLowerCase().includes("tag") || el.className.toLowerCase().includes("chip")) return "tag";
  if (inline && rounded && short && hasOwnText(el)) return "badge";
  return null;
}
export function classify(el, style) {
  const tag = el.tagName;
  if (SKIP_TAGS.has(tag)) return "skip";
  if (el.classList.contains(CLASS.overlay) || el.classList.contains(CLASS.svg)) {
    return "skip";
  }
  if (el.hasAttribute(ATTR.ignore) || el.hasAttribute(ATTR.keep)) return "skip";
  if (el.hasAttribute(ATTR.shimmer)) return "shimmer";
  if (el.hasAttribute(ATTR.union)) return "block";
  if (el.hasAttribute(ATTR.replace)) {
    const forced = el.getAttribute(ATTR.replace);
    return forced && forced.length > 0 ? forced : "block";
  }
  if (style.display === "none" || style.visibility === "hidden") return "skip";
  if (tag === "INPUT") {
    const type = el.type;
    if (type === "checkbox") return "checkbox";
    if (type === "radio") return "radio";
    if (type === "hidden") return "skip";
    return "input";
  }
  if (tag === "TEXTAREA") return "textarea";
  if (tag === "SELECT") return "select";
  const role = el.getAttribute("role");
  if (role === "switch") return "switch";
  if (IMAGE_TAGS.has(tag)) {
    return looksLikeAvatar(el, style) ? "avatar" : "image";
  }
  if (tag === "SVG" || tag === "svg") {
    const w = el.clientWidth || 0;
    return w > 0 && w <= 48 ? "icon" : "image";
  }
  if (tag === "BUTTON" || role === "button") return "button";
  if (tag === "A" && /\bbtn\b|button/i.test(el.className)) return "button";
  if (HEADING_TAGS.has(tag)) return "heading";
  const badge = looksLikeBadge(el, style);
  if (badge) return badge;
  if (hasElementChildren(el)) return "container";
  if (hasOwnText(el)) return "text";
  const bg = style.backgroundImage;
  const paints = !!bg && bg !== "none" || Number.parseFloat(style.borderWidth) > 0 || el.className.toLowerCase().includes("icon");
  return paints ? "icon" : "skip";
}
