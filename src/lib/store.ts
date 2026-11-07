import { skyAt, toCss } from "./sky";

// Mutable on purpose: read every frame by the canvas, so it must not cause React renders.
export const lagoon = { hour: 17.3, targetHour: 17.3, scroll: 0, px: 0, py: 0, open: 0 };

const subs = new Set<() => void>();
export const onHour = (fn: () => void) => { subs.add(fn); return () => { subs.delete(fn); }; };

export function setHour(h: number) {
  lagoon.targetHour = h;
  subs.forEach((f) => f());
}

// The hour tints the whole site's accent. Colours stay light enough to pass on the dark ground.
export function paintAccent(h: number) {
  document.documentElement.style.setProperty("--glow", toCss(skyAt(h).glow));
}

export const noonuHourNow = () => {
  const d = new Date();
  return (d.getUTCHours() + 5 + d.getUTCMinutes() / 60) % 24; // Maldives is UTC+5 all year
};
