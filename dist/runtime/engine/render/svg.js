const SVG_NS = "http://www.w3.org/2000/svg";
export function gradientId(uid, index) {
  return index === void 0 ? `sk-shimmer-${uid}` : `sk-shimmer-${uid}-${index}`;
}
export function visualMode(opts) {
  if (!opts.shimmer || opts.tier === "static") return "none";
  const a = opts.animation;
  if (a === "none") return "none";
  if (a === "pulse" || a === "fade" || opts.tier === "reduced") return "pulse";
  return "sweep";
}
export function round(value, precision) {
  const f = 10 ** Math.max(0, precision);
  return Math.round(value * f) / f;
}
function dim(value, precision) {
  return round(Math.max(0, value), precision);
}
function gradientDef(id, opts, mode) {
  const dur = `${Math.max(0, opts.durationMs) / 1e3}s`;
  const animate = mode === "sweep" ? `<animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="${dur}" repeatCount="indefinite"/>` : "";
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="var(--sk-bg)"/><stop offset="50%" stop-color="var(--sk-hl)"/><stop offset="100%" stop-color="var(--sk-bg)"/>` + animate + `</linearGradient>`;
}
function fillFor(id, mode) {
  return mode === "none" ? "var(--sk-bg)" : `url(#${id})`;
}
export function shapeFor(node, fill, precision) {
  const { rect } = node;
  const w = dim(rect.width, precision);
  const h = dim(rect.height, precision);
  const x = round(rect.x, precision);
  const y = round(rect.y, precision);
  const opacity = node.shimmer ? ` opacity="0.45"` : "";
  if (node.kind === "avatar") {
    const r = round(Math.min(w, h) / 2, precision);
    const cx = round(x + w / 2, precision);
    const cy = round(y + h / 2, precision);
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${opacity}/>`;
  }
  const radius = round(node.kind === "radio" ? Math.min(w, h) / 2 : Math.max(0, node.radius), precision);
  const rxy = radius > 0 ? ` rx="${radius}" ry="${radius}"` : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rxy} fill="${fill}"${opacity}/>`;
}
export function buildBlueprint(nodes, container, opts) {
  const w = dim(container.width, opts.precision);
  const h = dim(container.height, opts.precision);
  const sharedId = gradientId(opts.uid);
  const mode = visualMode(opts);
  const defs = [];
  const shapes = [];
  if (opts.sharedGradient) {
    if (mode !== "none") defs.push(gradientDef(sharedId, opts, mode));
    const fill = fillFor(sharedId, mode);
    for (const node of nodes) shapes.push(shapeFor(node, fill, opts.precision));
  } else {
    nodes.forEach((node, i) => {
      const id = gradientId(opts.uid, i);
      if (mode !== "none") defs.push(gradientDef(id, opts, mode));
      shapes.push(shapeFor(node, fillFor(id, mode), opts.precision));
    });
  }
  const svg = `<svg xmlns="${SVG_NS}" class="sk-svg sk-svg--${mode}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="Caricamento\u2026" style="--sk-duration:${Math.max(0, opts.durationMs)}ms"><defs>${defs.join("")}</defs>` + shapes.join("") + `</svg>`;
  return {
    svg,
    nodeCount: shapes.length,
    width: w,
    height: h,
    gradientId: sharedId,
    tier: opts.tier
  };
}
