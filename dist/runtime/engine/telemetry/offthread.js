import { fnv1a } from "../intelligence/fingerprint.js";
import { idle } from "../clock.js";
const WORKER_SOURCE = `
self.onmessage = (e) => {
  const { id, task } = e.data
  let result
  if (task.type === 'fingerprint') {
    let h = 0x811c9dc5
    const s = task.payload
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) }
    result = (h >>> 0).toString(36)
  } else if (task.type === 'analyze') {
    const arr = task.payload
    let sum = 0, max = 0
    for (const n of arr) { sum += n; if (n > max) max = n }
    const count = arr.length
    const mean = count ? sum / count : 0
    const pageClass = count > 4000 ? 'extreme' : count > 1500 ? 'heavy' : 'light'
    result = { count, sum, mean, max, pageClass }
  }
  self.postMessage({ id, result })
}
`;
export class OffThreadCompute {
  constructor(preferWorker = true) {
    this.preferWorker = preferWorker;
  }
  worker = null;
  seq = 0;
  pending = /* @__PURE__ */ new Map();
  workerOk = false;
  /** Lazily create the worker on first use. */
  ensureWorker() {
    if (this.worker) return this.workerOk;
    if (!this.preferWorker) return false;
    const W = globalThis.Worker;
    const URLImpl = globalThis.URL;
    const BlobImpl = globalThis.Blob;
    if (typeof W !== "function" || !URLImpl?.createObjectURL || typeof BlobImpl !== "function") {
      this.workerOk = false;
      return false;
    }
    try {
      const url = URLImpl.createObjectURL(new BlobImpl([WORKER_SOURCE], { type: "text/javascript" }));
      this.worker = new W(url);
      this.worker.onmessage = (e) => {
        const { id, result } = e.data;
        const resolve = this.pending.get(id);
        if (resolve) {
          this.pending.delete(id);
          resolve(result);
        }
      };
      this.workerOk = true;
    } catch {
      this.workerOk = false;
    }
    return this.workerOk;
  }
  /** Run a task off the main thread (worker → idle fallback). */
  run(task) {
    if (this.ensureWorker() && this.worker) {
      const id = ++this.seq;
      return new Promise((resolve) => {
        this.pending.set(id, resolve);
        this.worker.postMessage({ id, task });
      });
    }
    return new Promise((resolve) => {
      idle(() => resolve(runOnMain(task)));
    });
  }
  /** Whether a real worker is backing this instance. */
  get usingWorker() {
    return this.workerOk;
  }
  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.pending.clear();
  }
}
export function runOnMain(task) {
  if (task.type === "fingerprint") return fnv1a(task.payload);
  const arr = task.payload;
  let sum = 0;
  let max = 0;
  for (const n of arr) {
    sum += n;
    if (n > max) max = n;
  }
  const count = arr.length;
  const mean = count ? sum / count : 0;
  const pageClass = count > 4e3 ? "extreme" : count > 1500 ? "heavy" : "light";
  return { count, sum, mean, max, pageClass };
}
