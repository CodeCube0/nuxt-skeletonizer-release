import { ATTR } from "../constants.js";
import { classify } from "./classify.js";
import { now } from "./clock.js";
const TEXT_KINDS = /* @__PURE__ */ new Set(["text", "heading"]);
const MAX_TEXT_LINES = 200;
function childElements(el) {
  const out = [];
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 1) out.push(node);
  }
  return out;
}
function relativeRect(el, originRect) {
  const r = el.getBoundingClientRect();
  return {
    x: r.left - originRect.left,
    y: r.top - originRect.top,
    width: r.width,
    height: r.height
  };
}
function readRadius(style) {
  const v = Number.parseFloat(style.borderRadius);
  return Number.isFinite(v) ? v : 0;
}
function measureTextLines(el, originRect) {
  let clientRects;
  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    clientRects = range.getClientRects();
  } catch {
    return [];
  }
  const raw = [];
  for (const r of Array.from(clientRects)) {
    if (r.width <= 0 || r.height <= 0) continue;
    raw.push({ x: r.left - originRect.left, y: r.top - originRect.top, width: r.width, height: r.height });
  }
  if (raw.length === 0) return [];
  raw.sort((a, b) => a.y - b.y);
  const lines = [];
  for (const r of raw) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(r.y - last.y) < Math.max(1, last.height * 0.3)) {
      const x2 = Math.max(last.x + last.width, r.x + r.width);
      last.x = Math.min(last.x, r.x);
      last.width = x2 - last.x;
      last.height = Math.max(last.height, r.height);
    } else {
      lines.push({ ...r });
    }
  }
  return lines;
}
function readGap(style) {
  const row = Number.parseFloat(style.rowGap || style.gap) || 0;
  const column = Number.parseFloat(style.columnGap || style.gap) || 0;
  return { row, column };
}
function countTracks(template) {
  if (!template || template === "none") return void 0;
  return template.trim().split(/\s+/).length;
}
function containerLayout(el, style, originRect) {
  const display = style.display;
  const gap = readGap(style);
  if (display === "grid" || display === "inline-grid") {
    return {
      rect: relativeRect(el, originRect),
      display: "grid",
      justify: style.justifyContent,
      align: style.alignItems,
      gap,
      columns: countTracks(style.gridTemplateColumns),
      rows: countTracks(style.gridTemplateRows)
    };
  }
  if (display === "flex" || display === "inline-flex") {
    return {
      rect: relativeRect(el, originRect),
      display: "flex",
      direction: style.flexDirection,
      justify: style.justifyContent,
      align: style.alignItems,
      gap
    };
  }
  return null;
}
function mergeRects(rects) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const r of rects) {
    minX = Math.min(minX, r.x);
    minY = Math.min(minY, r.y);
    maxX = Math.max(maxX, r.x + r.width);
    maxY = Math.max(maxY, r.y + r.height);
  }
  if (!Number.isFinite(minX)) return { x: 0, y: 0, width: 0, height: 0 };
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
export function scanSubtree(root, opts) {
  const start = now();
  const nodes = [];
  const containers = [];
  let ignored = 0;
  const originRect = root.getBoundingClientRect();
  const unionGroups = /* @__PURE__ */ new Map();
  const radiusFor = (el, style) => opts.respectBorderRadius ? readRadius(style) : opts.defaultRadius;
  const stack = [];
  for (const child of childElements(root)) stack.push({ el: child, depth: 1 });
  while (stack.length > 0) {
    const { el, depth } = stack.pop();
    if (el.hasAttribute(ATTR.union)) {
      const group = el.getAttribute(ATTR.union)?.trim();
      const style2 = getComputedStyle(el);
      const rect = relativeRect(el, originRect);
      if (group) {
        const arr = unionGroups.get(group) ?? [];
        arr.push(rect);
        unionGroups.set(group, arr);
      } else {
        nodes.push({ el, kind: "block", rect, radius: radiusFor(el, style2), depth });
      }
      continue;
    }
    const style = getComputedStyle(el);
    const kind = classify(el, style);
    if (kind === "skip") {
      ignored++;
      continue;
    }
    if (kind === "shimmer") {
      nodes.push({ el, kind: "block", rect: relativeRect(el, originRect), radius: radiusFor(el, style), depth, shimmer: true });
      continue;
    }
    if (kind === "container") {
      if (depth >= opts.maxDepth) {
        nodes.push({ el, kind: "block", rect: relativeRect(el, originRect), radius: radiusFor(el, style), depth });
        continue;
      }
      const layout = containerLayout(el, style, originRect);
      if (layout) containers.push(layout);
      for (const child of childElements(el)) stack.push({ el: child, depth: depth + 1 });
      continue;
    }
    if (TEXT_KINDS.has(kind)) {
      const lines = measureTextLines(el, originRect);
      if (lines.length > 0 && lines.length <= MAX_TEXT_LINES) {
        const radius = radiusFor(el, style);
        for (const lineRect of lines) nodes.push({ el, kind, rect: lineRect, radius, depth });
        continue;
      }
    }
    nodes.push({ el, kind, rect: relativeRect(el, originRect), radius: radiusFor(el, style), depth });
  }
  for (const rects of unionGroups.values()) {
    nodes.push({ el: root, kind: "block", rect: mergeRects(rects), radius: opts.defaultRadius, depth: 1 });
  }
  const durationMs = now() - start;
  if (opts.debug) {
    console.debug(
      `[nuxt-skeletonizer] scanned ${nodes.length} nodes, ${ignored} ignored in ${durationMs.toFixed(2)}ms`
    );
  }
  return { nodes, ignored, durationMs, containers };
}
