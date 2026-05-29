// Grid sistem geoloških listova 1:100 000 koji pokriva BiH.
// Svaka ćelija je 0.5° × 0.5° (geografski stepeni).
//
// === KAKO DODATI SVOJE KARTE ===
// Postavi slike u folder:  src/assets/karte/
// Imenuj ih po šablonu:    sheet-r{ROW}-c{COL}.jpg   (npr. sheet-r3-c5.jpg)
//   ROW = 1..6   (sjever → jug)
//   COL = 1..8   (zapad → istok)
// Slika se automatski pojavljuje na odgovarajućoj ćeliji mreže.

export type GeoUnit = {
  color: string;
  code: string;
  name: string;
  age: string;
};

export type GeoSheet = {
  id: string;          // npr. "R3C5"
  row: number;
  col: number;
  code: string;        // npr. "L33-127"
  name: string;        // npr. "Sarajevo"
  region: string;
  scale: string;
  year: number;
  description: string;
  /** [minLon, minLat, maxLon, maxLat] u EPSG:4326 */
  extent: [number, number, number, number];
  imageUrl?: string;   // undefined ako slika još nije priložena
  legend: GeoUnit[];
};

// Geografski okvir mreže (pokriva cijelu BiH + malo zalihe)
export const GRID_ORIGIN_LON = 15.5;   // zapad
export const GRID_ORIGIN_LAT = 45.5;   // sjever (vrh)
export const CELL_SIZE = 0.5;          // stepeni
export const GRID_COLS = 8;
export const GRID_ROWS = 6;

// Automatsko učitavanje svih slika iz src/assets/karte/
const imageModules = import.meta.glob("../assets/karte/sheet-r*-c*.{jpg,jpeg,png}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const imageByCell: Record<string, string> = {};
for (const [path, url] of Object.entries(imageModules)) {
  const m = path.match(/sheet-r(\d+)-c(\d+)/);
  if (m) imageByCell[`r${m[1]}c${m[2]}`] = url;
}

// Imenovani listovi (možeš dopuniti). Ako nije naveden, koristi se generički naziv.
const NAMED: Record<string, { name: string; code: string; region: string }> = {
  r2c4: { name: "Banja Luka", code: "L33-119", region: "Sjeverozapadna Bosna" },
  r3c7: { name: "Tuzla",      code: "L33-122", region: "Sjeveroistočna Bosna" },
  r4c6: { name: "Sarajevo",   code: "L33-127", region: "Centralna Bosna" },
  r5c5: { name: "Mostar",     code: "L33-132", region: "Hercegovina" },
};

const DEFAULT_LEGEND: GeoUnit[] = [
  { color: "200 30% 70%", code: "K",  name: "Kredni krečnjaci",      age: "Kreda" },
  { color: "22 78% 52%",  code: "T",  name: "Trijaski dolomiti",     age: "Trijas" },
  { color: "120 35% 45%", code: "J",  name: "Jurski klastiti",       age: "Jura" },
  { color: "45 75% 60%",  code: "E",  name: "Eocenski fliš",         age: "Eocen" },
  { color: "200 25% 55%", code: "Q",  name: "Kvartarne naslage",     age: "Kvartar" },
];
import granice from "./granice";

// Bounding boxes svih entiteta — za brzu provjeru "ćelija leži unutar BiH"
const entityBBoxes: Array<[number, number, number, number]> = (granice as any).features.map((f: any) => {
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  const walk = (coords: any) => {
    if (typeof coords[0] === "number") {
      const [x, y] = coords;
      if (x < minLon) minLon = x; if (y < minLat) minLat = y;
      if (x > maxLon) maxLon = x; if (y > maxLat) maxLat = y;
    } else coords.forEach(walk);
  };
  walk(f.geometry.coordinates);
  return [minLon, minLat, maxLon, maxLat];
});

const cellIntersectsBiH = (a: number, b: number, c: number, d: number) =>
  entityBBoxes.some(([x1, y1, x2, y2]) => !(c < x1 || a > x2 || d < y1 || b > y2));

// Ručno isključene ćelije (more / izvan BiH u donjem lijevom L obliku)
const EXCLUDED = new Set([
  "r3c1", "r4c1", "r5c1", "r6c1",
  "r5c2", "r5c3",
  "r6c2", "r6c3", "r6c4",
]);

export const geoloskeKarte: GeoSheet[] = (() => {
  const out: GeoSheet[] = [];
  for (let r = 1; r <= GRID_ROWS; r++) {
    for (let c = 1; c <= GRID_COLS; c++) {
      const key = `r${r}c${c}`;
      const minLon = GRID_ORIGIN_LON + (c - 1) * CELL_SIZE;
      const maxLon = minLon + CELL_SIZE;
      const maxLat = GRID_ORIGIN_LAT - (r - 1) * CELL_SIZE;
      const minLat = maxLat - CELL_SIZE;
      if (EXCLUDED.has(key)) continue;
      if (!cellIntersectsBiH(minLon, minLat, maxLon, maxLat)) continue;
      const named = NAMED[key];
      out.push({
        id: `R${r}C${c}`,
        row: r,
        col: c,
        code: named?.code ?? `BH-R${r}C${c}`,
        name: named?.name ?? `List R${r}-C${c}`,
        region: named?.region ?? "Bosna i Hercegovina",
        scale: "1 : 100 000",
        year: 1978,
        description: named
          ? `Geološki list ${named.name} — sektor ${named.region}.`
          : "Sektor mreže 1:100 000. Skenirani list još nije priložen.",
        extent: [minLon, minLat, maxLon, maxLat],
        imageUrl: imageByCell[key],
        legend: DEFAULT_LEGEND,
      });
    }
  }
  return out;
})();
