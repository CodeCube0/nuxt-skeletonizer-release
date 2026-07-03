export class DebouncedObserver {
  observer = null;
  timer = null;
  debounce;
  callback;
  constructor(callback, debounce = 50) {
    this.callback = callback;
    this.debounce = debounce;
  }
  /** Start observing a root element for child/subtree/attribute changes. */
  observe(root) {
    if (typeof MutationObserver === "undefined") return;
    this.disconnect();
    this.observer = new MutationObserver(() => this.schedule());
    this.observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  /** Temporarily ignore mutations while we mutate the DOM ourselves. */
  pause() {
    this.observer?.takeRecords();
  }
  schedule() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      this.callback();
    }, this.debounce);
  }
  /** Stop observing and cancel any pending callback. */
  disconnect() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.observer?.disconnect();
    this.observer = null;
  }
}
