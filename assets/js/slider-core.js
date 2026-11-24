// État pur du slider : aucun accès au DOM ni aux minuteries (le temps est injecté via tick).
export function createSlider({ count, interval = 6000, paused = [] }) {
  const reasons = new Set(paused);
  const listeners = [];
  let index = 0;
  let elapsed = 0;
  let wantsPlay = false;

  const mod = (i) => ((i % count) + count) % count;
  const set = (i) => {
    const next = mod(i);
    elapsed = 0;
    if (next === index) return;
    const old = index;
    index = next;
    listeners.forEach((cb) => cb(index, old));
  };

  return {
    get index() { return index; },
    get isPlaying() { return wantsPlay && reasons.size === 0; },
    get progress() { return Math.min(elapsed / interval, 1); },
    next() { set(index + 1); },
    prev() { set(index - 1); },
    goTo(i) { set(i); },
    play() { wantsPlay = true; },
    pause(reason) { reasons.add(reason); },
    resume(reason) { reasons.delete(reason); },
    onChange(cb) { listeners.push(cb); },
    tick(ms) {
      if (!this.isPlaying) return;
      elapsed += ms;
      while (elapsed >= interval) {
        const carry = elapsed - interval;
        set(index + 1);
        elapsed = carry;
      }
    },
  };
}
