// Turns a raw OpenStreetMap Overpass export (coastline + reef ways) into the site's map paths.
// Usage: node scripts/build-map.mjs <overpass.json>
import { readFileSync, writeFileSync } from "node:fs";

const K = 1000, LON0 = 72.75, LAT0 = 6.2, COS = Math.cos((5.2 * Math.PI) / 180);
const x = (lon) => (lon - LON0) * COS * K;
const y = (lat) => (LAT0 - lat) * K;

function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let md = 0, mi = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b], dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) {
      const d = dx || dy ? Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / l : Math.hypot(pts[i][0] - ax, pts[i][1] - ay);
      if (d > md) { md = d; mi = i; }
    }
    if (md > tol) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

const raw = JSON.parse(readFileSync(process.argv[2], "utf8"));
const out = { coast: [], reef: [] };
for (const e of raw.elements) {
  if (!e.geometry) continue;
  const near = e.geometry.some((g) => Math.abs(g.lat - 5.715) < 0.04 && Math.abs(g.lon - 73.41) < 0.04);
  const pts = simplify(e.geometry.map((g) => [x(g.lon), y(g.lat)]), near ? 0.015 : 0.12);
  if (pts.length < 2) continue;
  const closed = e.geometry[0].lat === e.geometry.at(-1).lat && e.geometry[0].lon === e.geometry.at(-1).lon;
  const d = "M" + pts.map((p) => p.map((v) => +v.toFixed(2)).join(" ")).join("L") + (closed ? "Z" : "");
  (e.tags?.natural === "reef" ? out.reef : out.coast).push(d);
}
out.points = { jani: [x(73.4147), y(5.7216)], male: [x(73.5304), y(4.1962)], maafaru: [x(73.4697), y(5.819)] };
writeFileSync("public/map/maldives.json", JSON.stringify(out));
console.log({ coast: out.coast.length, reef: out.reef.length, kb: Math.round(JSON.stringify(out).length / 1024), points: out.points });
