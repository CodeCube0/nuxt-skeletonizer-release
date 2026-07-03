export const BUILTIN_ANIMATIONS = ["wave", "pulse", "fade", "gradient", "shine", "none"];
const STYLE_ID = "sk-custom-animations";
const registered = /* @__PURE__ */ new Map();
function canTouchDom() {
  return typeof document !== "undefined" && !!document.head;
}
function styleEl() {
  if (!canTouchDom()) return null;
  let el = document.getElementById(STYLE_ID);
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  return el;
}
export function registerAnimation(def) {
  registered.set(def.name, def.css);
  const el = styleEl();
  if (!el) return;
  el.textContent = Array.from(registered.values()).join("\n");
}
export function hasAnimation(name) {
  return BUILTIN_ANIMATIONS.includes(name) || registered.has(name);
}
export function customAnimationNames() {
  return Array.from(registered.keys());
}
export function animationClass(name) {
  return `sk-anim-${name}`;
}
export function __resetAnimations() {
  registered.clear();
  const el = canTouchDom() ? document.getElementById(STYLE_ID) : null;
  el?.remove();
}
