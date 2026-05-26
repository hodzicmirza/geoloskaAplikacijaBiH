import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import OLMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import { Style, Stroke, Fill, Text } from "ol/style";
import { fromLonLat, transformExtent, toLonLat } from "ol/proj";
import "ol/ol.css";
import { Info } from "lucide-react";
import { geoloskeKarte, type GeoSheet } from "@/lib/geoloskeKarte";
import granice, { ENTITY_META, type EntityCode } from "@/lib/granice";
import SheetModal from "./SheetModal";
import LegendPanel from "./LegendPanel";
import AboutModal from "./AboutModal";

type Filter = "ALL" | EntityCode;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL",  label: "Sve granice" },
  { value: "FBiH", label: "Federacija BiH" },
  { value: "RS",   label: "Republika Srpska" },
  { value: "BD",   label: "Brčko Distrikt" },
];

const MapView = () => {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<OLMap | null>(null);
  const borderLayerRef = useRef<VectorLayer<VectorSource> | null>(null);
  const sheetsRef = useRef<GeoSheet[]>(geoloskeKarte);
  const hovered = useRef<GeoSheet | null>(null);

  const [active, setActive] = useState<GeoSheet | null>(null);
  const [hoverName, setHoverName] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [aboutOpen, setAboutOpen] = useState(false);

  const handlePointer = useCallback((e: any) => {
    const [lon, lat] = toLonLat(e.coordinate);
    const found = sheetsRef.current.find(s => {
      const [a, b, c, d] = s.extent;
      return lon >= a && lon <= c && lat >= b && lat <= d;
    }) ?? null;
    hovered.current = found;
    setHoverName(found?.name ?? null);
    document.body.style.cursor = found ? "pointer" : "";
  }, []);

  const handleClick = useCallback(() => {
    if (hovered.current) setActive(hovered.current);
  }, []);

  // Build grid + sheet vector layer (cells outline + labels)
  const gridFeatures = useMemo(() => {
    return geoloskeKarte.map(s => {
      const [a, b, c, d] = s.extent;
      const ring = [[a, b], [c, b], [c, d], [a, d], [a, b]].map(([x, y]) => fromLonLat([x, y]));
      const f = new Feature({ geometry: new Polygon([ring]) });
      f.set("sheet", s);
      return f;
    });
  }, []);

  useEffect(() => {
    if (!mapEl.current) return;

    // Rasterski overlay-i (samo gdje postoji slika)
    const imgLayers = geoloskeKarte
      .filter(s => s.imageUrl)
      .map(sheet => new ImageLayer({
        opacity: 0.88,
        source: new Static({
          url: sheet.imageUrl!,
          imageExtent: transformExtent(sheet.extent, "EPSG:4326", "EPSG:3857"),
          projection: "EPSG:3857",
        }),
      }));

    // Mreža listova (granice ćelija + oznake)
    const gridLayer = new VectorLayer({
      source: new VectorSource({ features: gridFeatures }),
      style: (feat) => {
        const s = feat.get("sheet") as GeoSheet;
        const hasImg = !!s.imageUrl;
        return new Style({
          stroke: new Stroke({ color: "hsla(20, 30%, 20%, 0.55)", width: 1 }),
          fill: new Fill({ color: hasImg ? "transparent" : "hsla(39, 38%, 88%, 0.25)" }),
          text: new Text({
            text: s.code,
            font: "600 10px 'JetBrains Mono', monospace",
            fill: new Fill({ color: "hsl(20, 40%, 20%)" }),
            stroke: new Stroke({ color: "hsla(39, 38%, 95%, 0.85)", width: 3 }),
            overflow: true,
          }),
        });
      },
      zIndex: 5,
    });

    // Granice po entitetima
    const borderLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(granice, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }),
      }),
      style: (feat) => {
        const ent = feat.get("entity") as EntityCode;
        const meta = ENTITY_META[ent];
        return new Style({
          stroke: new Stroke({ color: `hsl(${meta.color})`, width: 2.5 }),
          fill: new Fill({ color: `hsla(${meta.color.split(" ").join(", ")
            .replace(/(\d+)%, (\d+)%/, "$1%, $2%")}, 0.08)` }),
        });
      },
      zIndex: 10,
    });
    borderLayerRef.current = borderLayer;

    const viewExtent = transformExtent([14.5, 41.8, 21.5, 46.5], "EPSG:4326", "EPSG:3857");

    const map = new OLMap({
      target: mapEl.current,
      layers: [
        new TileLayer({ source: new OSM(), opacity: 0.5 }),
        ...imgLayers,
        gridLayer,
        borderLayer,
      ],
      view: new View({
        center: fromLonLat([17.789, 44.0]),
        zoom: 7.4,
        minZoom: 6.5,
        maxZoom: 14,
        extent: viewExtent,
      }),
    });

    mapInstance.current = map;
    map.on("pointermove", handlePointer);
    map.on("click", handleClick);

    return () => {
      map.un("pointermove", handlePointer);
      map.un("click", handleClick);
      map.setTarget(undefined);
      mapInstance.current = null;
      document.body.style.cursor = "";
    };
  }, [handlePointer, handleClick, gridFeatures]);

  // Apply entity filter
  useEffect(() => {
    const layer = borderLayerRef.current;
    if (!layer) return;
    const src = layer.getSource();
    src?.getFeatures().forEach(f => {
      const ent = f.get("entity") as EntityCode;
      const visible = filter === "ALL" || filter === ent;
      f.setStyle(visible ? undefined : new Style({}));
    });
  }, [filter]);

  return (
    <div className="relative w-full h-screen bg-gradient-parchment overflow-hidden">
      <div ref={mapEl} className="absolute inset-0" aria-label="Geološka karta Bosne i Hercegovine" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="px-6 sm:px-10 pt-6 pb-10 bg-gradient-to-b from-background/95 via-background/70 to-transparent">
          <div className="pointer-events-auto max-w-5xl flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-2">
                Geološki zavod · Arhiv listova
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-[1.05] text-foreground">
                Osnovna geološka karta
                <span className="block text-primary italic">Bosne i Hercegovine</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
                Razmjera 1 : 100 000 — mreža listova prikazana je preko granica entiteta.
                Klikni na bilo koji list za uvećan sken i tumač geoloških jedinica.
              </p>
            </div>
            <button
              onClick={() => setAboutOpen(true)}
              aria-label="O aplikaciji"
              className="shrink-0 w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center shadow-soft"
            >
              <Info size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Entity filter */}
      <div className="absolute top-44 sm:top-48 left-4 sm:left-6 z-20 bg-card/95 backdrop-blur border border-border rounded-lg shadow-elegant p-2">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground px-2 pt-1 pb-2">
          Entiteti
        </p>
        <div className="flex flex-col gap-1">
          {FILTERS.map(f => {
            const active = filter === f.value;
            const color = f.value === "ALL" ? "20 40% 30%" : ENTITY_META[f.value as EntityCode].color;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-serif transition-colors ${
                  active ? "bg-primary/15 text-primary" : "hover:bg-muted text-foreground"
                }`}
              >
                <span className="w-3 h-3 rounded-sm border border-foreground/30" style={{ backgroundColor: `hsl(${color})` }} />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {hoverName && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-fade-in-up">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-elegant font-mono text-xs tracking-wider uppercase">
            ▶ {hoverName} — klikni za detalje
          </div>
        </div>
      )}

      <LegendPanel sheets={geoloskeKarte.filter(s => s.imageUrl)} onSelect={setActive} />
      <SheetModal sheet={active} onClose={() => setActive(null)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  );
};

export default MapView;
