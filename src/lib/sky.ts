// The whole site's light is one function of the hour.
export type Rgb = [number, number, number];
const hex = (h: string): Rgb => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as Rgb;

type Key = { h: number; zenith: string; horizon: string; sun: string; deep: string; shallow: string; stars: number; glow: string };
const KEYS: Key[] = [
  { h: 0, zenith: "#03060f", horizon: "#0b1a2e", sun: "#aebfe0", deep: "#020a14", shallow: "#0a2a38", stars: 1, glow: "#9fd8e8" },
  { h: 5, zenith: "#070d22", horizon: "#27304f", sun: "#ffb48f", deep: "#04121f", shallow: "#123f4e", stars: 0.7, glow: "#c8d0ec" },
  { h: 6.5, zenith: "#27406f", horizon: "#f6ad8e", sun: "#ffd2a8", deep: "#0d3f58", shallow: "#58b4b0", stars: 0, glow: "#ffc4a8" },
  { h: 9, zenith: "#2474b8", horizon: "#bde7ef", sun: "#fff4dc", deep: "#06607f", shallow: "#49d8cb", stars: 0, glow: "#8ff0e2" },
  { h: 12.5, zenith: "#1668b4", horizon: "#c6eff2", sun: "#ffffff", deep: "#056f8a", shallow: "#5fe9d6", stars: 0, glow: "#7ff3e3" },
  { h: 16, zenith: "#2a6ea8", horizon: "#f3dcb2", sun: "#ffe7bb", deep: "#0a5570", shallow: "#58c9bb", stars: 0, glow: "#ffe0a6" },
  { h: 17.8, zenith: "#2a3f74", horizon: "#ff9f62", sun: "#ffb56b", deep: "#123a55", shallow: "#7a8f8c", stars: 0.05, glow: "#ffb98a" },
  { h: 18.8, zenith: "#141a42", horizon: "#d9565a", sun: "#ff7a50", deep: "#0b1c34", shallow: "#40485f", stars: 0.35, glow: "#ff9d90" },
  { h: 20, zenith: "#050a1c", horizon: "#172544", sun: "#aebfe0", deep: "#030d1a", shallow: "#0d2c3c", stars: 0.9, glow: "#a8cdf0" },
  { h: 24, zenith: "#03060f", horizon: "#0b1a2e", sun: "#aebfe0", deep: "#020a14", shallow: "#0a2a38", stars: 1, glow: "#9fd8e8" },
];

const mix = (a: Rgb, b: Rgb, t: number): Rgb => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export function skyAt(hourIn: number) {
  const hour = ((hourIn % 24) + 24) % 24;
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1].h <= hour) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const t = (hour - a.h) / (b.h - a.h);
  const m = (k: "zenith" | "horizon" | "sun" | "deep" | "shallow" | "glow") => mix(hex(a[k]), hex(b[k]), t);
  // Sun rises at 6 and sets at 18:30, moving east to west; at night the moon takes its place.
  const day = (hour - 6) / 12.5;
  const up = day >= 0 && day <= 1;
  const arc = up ? day : ((hour + 24 - 18.5) % 24) / 11.5;
  const elev = Math.sin(Math.PI * arc) * (up ? 1 : 0.6);
  const az = (arc - 0.5) * 2.4;
  const sunDir: Rgb = [Math.sin(az) * Math.cos(elev), elev * 0.9 + 0.012, -Math.cos(az) * Math.cos(elev)];
  return {
    zenith: m("zenith"), horizon: m("horizon"), sun: m("sun"), deep: m("deep"), shallow: m("shallow"), glow: m("glow"),
    stars: a.stars + (b.stars - a.stars) * t,
    sunDir, isDay: up,
  };
}

export const toCss = (c: Rgb) => `rgb(${c.map((v) => Math.round(v * 255)).join(" ")})`;

export const HOURS = [
  { h: 6.4, label: "First light" },
  { h: 12.5, label: "High sun" },
  { h: 17.3, label: "Golden hour" },
  { h: 18.7, label: "Dusk" },
  { h: 21.5, label: "Under the stars" },
] as const;

export const nameOfHour = (h: number) => {
  if (h < 5 || h >= 20) return "Under the stars";
  if (h < 8) return "First light";
  if (h < 15.5) return "High sun";
  if (h < 18.2) return "Golden hour";
  return "Dusk";
};
export const fmtHour = (h: number) => {
  const m = Math.floor((((h % 1) + 1) % 1) * 60);
  return `${String(Math.floor(h) % 24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
