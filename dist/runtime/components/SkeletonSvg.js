import { defineComponent, h } from "vue";
export default defineComponent({
  name: "SkeletonSvgInternal",
  inheritAttrs: false,
  props: {
    width: { type: [String, Number], default: void 0 },
    height: { type: [String, Number], default: void 0 },
    mode: { type: String, required: true },
    gradId: { type: String, required: true },
    fill: { type: String, required: true },
    durSec: { type: String, required: true },
    shapes: { type: Array, required: true },
    svgStyle: { type: Object, default: void 0 }
  },
  setup(props, { attrs }) {
    return () => {
      const children = [];
      if (props.mode !== "none") {
        const stops = [
          h("stop", { "offset": "0%", "stop-color": "var(--sk-bg)" }),
          h("stop", { "offset": "50%", "stop-color": "var(--sk-hl)" }),
          h("stop", { "offset": "100%", "stop-color": "var(--sk-bg)" })
        ];
        if (props.mode === "sweep") {
          stops.push(h("animateTransform", {
            attributeName: "gradientTransform",
            type: "translate",
            from: "-1 0",
            to: "1 0",
            dur: props.durSec,
            repeatCount: "indefinite"
          }));
        }
        children.push(
          h("defs", [
            h("linearGradient", { id: props.gradId, x1: "0", y1: "0", x2: "1", y2: "0" }, stops)
          ])
        );
      }
      for (const s of props.shapes) {
        if (s.type === "circle") {
          children.push(h("circle", {
            cx: s.cx ?? "50%",
            cy: s.cy ?? "50%",
            r: s.r ?? "50%",
            fill: props.fill
          }));
        } else {
          children.push(h("rect", {
            x: s.x ?? 0,
            y: s.y ?? 0,
            width: s.w ?? "100%",
            height: s.h ?? "100%",
            rx: s.rx,
            ry: s.rx,
            fill: props.fill
          }));
        }
      }
      return h("svg", {
        "class": ["sk-svg", `sk-svg--${props.mode}`],
        "width": props.width,
        "height": props.height,
        "style": props.svgStyle,
        "role": "img",
        "aria-label": "Caricamento\u2026",
        ...attrs
      }, children);
    };
  }
});
