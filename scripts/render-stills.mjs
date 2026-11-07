// Renders the hero poster with the same shader as the live lagoon. Run: npm run stills
import { writeFileSync, mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { LAGOON_FRAG, LAGOON_VERT } from "../src/lib/lagoon-glsl.ts";
import { skyAt } from "../src/lib/sky.ts";

const H = { mode: 0, seed: 1, zoom: 3, island: 0, jetty: 0, pitch: 0.02, yaw: 0, fov: 0.75, height: 3, w: 1800, h: 1125 };
const STILLS = { "hero-golden": { ...H, hour: 17.3, w: 2000, h: 1250, pitch: 0.18, fov: 0.82 } };

const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync);
if (!chrome) throw new Error("Chrome or Edge not found");

const dir = mkdtempSync(join(tmpdir(), "stills-"));
const only = process.argv.slice(2);
for (const [name, s] of Object.entries(STILLS)) {
  if (only.length && !only.includes(name)) continue;
  const k = skyAt(s.hour);
  const uni = { uTime: 12.4, uAspect: s.w / s.h, uMode: s.mode, uSeed: s.seed, uZoom: s.zoom, uIsland: s.island, uJetty: s.jetty, uStars: k.stars, uPitch: s.pitch, uYaw: s.yaw, uFov: s.fov, uHeight: s.height, uOct: 6 };
  const vec = { uZenith: k.zenith, uHorizon: k.horizon, uSun: k.sun, uDeep: k.deep, uShallow: k.shallow, uSunDir: k.sunDir };
  const html = `<!doctype html><style>*{margin:0}canvas{display:block}</style><canvas id=c width=${s.w} height=${s.h}></canvas><script>
const gl=c.getContext('webgl',{preserveDrawingBuffer:true});
const sh=(t,src)=>{const o=gl.createShader(t);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,${JSON.stringify("attribute vec3 position;" + LAGOON_VERT)}));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,${JSON.stringify(LAGOON_FRAG)}));gl.linkProgram(pr);gl.useProgram(pr);
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),gl.STATIC_DRAW);
const a=gl.getAttribLocation(pr,'position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,0,0);
for(const[k,v]of Object.entries(${JSON.stringify(uni)}))gl.uniform1f(gl.getUniformLocation(pr,k),v);
for(const[k,v]of Object.entries(${JSON.stringify(vec)}))gl.uniform3fv(gl.getUniformLocation(pr,k),v);
gl.drawArrays(gl.TRIANGLES,0,3);</script>`;
  const file = join(dir, name + ".html"), png = join(dir, name + ".png");
  writeFileSync(file, html);
  execFileSync(chrome, ["--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars", `--window-size=${s.w},${s.h}`, "--virtual-time-budget=20000", `--screenshot=${png}`, `--user-data-dir=${join(dir, "profile")}`, pathToFileURL(file).href], { stdio: "ignore", timeout: 180000 });
  await sharp(png).webp({ quality: 84 }).toFile(resolve("public/media", name + ".webp"));
  console.log("ok", name);
}
