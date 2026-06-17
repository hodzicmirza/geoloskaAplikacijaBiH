import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { intersects } from "ol/extent";
import { defaults as defaultControls } from "ol/control/defaults";
import "ol/ol.css";
import { Info, ChevronUp } from "lucide-react";
import { geoloskeKarte, type GeoSheet } from "@/lib/geoloskeKarte";
import granice, { ENTITY_META, type EntityCode } from "@/lib/granice";
import SheetModal from "./SheetModal";
import LegendPanel from "./LegendPanel";
import AboutModal from "./AboutModal";
import { cn } from "@/lib/utils";

type Filter = "ALL" | EntityCode;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "ALL", label: "Sve granice" },
  { value: "FBiH", label: "Federacija BiH" },
  { value: "RS", label: "Republika Srpska" },
  { value: "BD", label: "Brčko Distrikt" },
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
  const [entitiesOpen, setEntitiesOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 10000);
    return () => clearTimeout(timer);
  }, []);

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

    const imgLayers = geoloskeKarte
      .filter(s => s.imageUrl)
      .map(sheet => {
        const ext = transformExtent(sheet.extent, "EPSG:4326", "EPSG:3857");
        const layer = new ImageLayer({
          opacity: 0.88,
          extent: ext,
        });
        layer.set("sheet", sheet);
        layer.set("ext", ext);
        return layer;
      });

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

    const filterRef = { current: filter as Filter };
    (borderLayerRef as any).filterRef = filterRef;

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
        const f = filterRef.current;
        if (f !== "ALL" && f !== ent) return undefined as any;
        const [h, s, l] = meta.color.split(" ");
        return new Style({
          stroke: new Stroke({ color: `hsl(${meta.color})`, width: 2.5 }),
          fill: new Fill({ color: `hsla(${h}, ${s}, ${l}, 0.10)` }),
        });
      },
      zIndex: 10,
    });
    borderLayerRef.current = borderLayer;

    const viewExtent = transformExtent([15.0, 42.0, 20.0, 45.5], "EPSG:4326", "EPSG:3857");

    const map = new OLMap({
      target: mapEl.current,
      controls: defaultControls({ attribution: false }),
      layers: [
        new TileLayer({ source: new OSM(), opacity: 0.5, preload: Infinity }),
        ...imgLayers,
        gridLayer,
        borderLayer,
      ],
      view: new View({
        center: fromLonLat([17.789, 44.0]),
        zoom: 6.8,
        minZoom: 6.0,
        maxZoom: 14,
        extent: viewExtent,
      }),
    });

    mapInstance.current = map;
    map.on("pointermove", handlePointer);
    map.on("click", handleClick);

    const loadVisibleLayers = () => {
      const size = map.getSize();
      if (!size) return;
      const viewExtent = map.getView().calculateExtent(size);
      imgLayers.forEach(layer => {
        if (layer.getSource()) return; // Already loaded
        const ext = layer.get("ext");
        if (intersects(viewExtent, ext)) {
          const sheet = layer.get("sheet") as GeoSheet;
          layer.setSource(new Static({
            url: sheet.imageUrl!,
            imageExtent: ext,
            projection: "EPSG:3857",
          }));
        }
      });
    };

    map.on("moveend", loadVisibleLayers);
    setTimeout(loadVisibleLayers, 100); // Initial check

    return () => {
      map.un("pointermove", handlePointer);
      map.un("click", handleClick);
      map.un("moveend", loadVisibleLayers);
      map.setTarget(undefined);
      mapInstance.current = null;
      document.body.style.cursor = "";
    };
  }, [handlePointer, handleClick, gridFeatures]);

  useEffect(() => {
    const layer = borderLayerRef.current;
    if (!layer) return;
    const ref = (borderLayerRef as any).filterRef;
    if (ref) ref.current = filter;
    layer.changed();
  }, [filter]);

  return (
    <div className="relative w-full h-[100dvh] bg-gradient-parchment overflow-hidden">
      <div ref={mapEl} className="absolute inset-0 touch-none" aria-label="Geološka karta Bosne i Hercegovine" />

      {/* Kompaktan header */}
      <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-5 bg-gradient-to-b from-background/95 via-background/60 to-transparent">
          <div className="pointer-events-auto flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-primary/80">
                Geološki zavod
              </p>
              <h1 className="font-serif text-base sm:text-xl font-semibold leading-tight text-foreground truncate">
                Osnovna geološka karta <span className="text-primary italic">BiH</span>
              </h1>
              <p className="hidden sm:block mt-0.5 text-[11px] text-muted-foreground">
                1 : 100 000 — klikni list za detalje
              </p>
            </div>
            <button
              onClick={() => setAboutOpen(true)}
              aria-label="O aplikaciji"
              className="shrink-0 w-9 h-9 rounded-full bg-card border border-border hover:border-primary hover:text-primary transition-colors flex items-center justify-center shadow-soft"
            >
              <Info size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Entiteti — donji lijevi ugao, collapsible */}
      <aside className="absolute left-3 sm:left-4 bottom-3 sm:bottom-4 z-20 w-[180px] sm:w-[200px] bg-card/95 backdrop-blur border border-border rounded-lg shadow-elegant">
        <button
          onClick={() => setEntitiesOpen(v => !v)}
          className="w-full flex items-center justify-between px-3 py-2 text-left"
        >
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            Entiteti
          </span>
          <ChevronUp size={14} className={cn("text-muted-foreground transition-transform", !entitiesOpen && "rotate-180")} />
        </button>
        {entitiesOpen && (
          <div className="flex flex-col gap-0.5 px-2 pb-2">
            {FILTERS.map(f => {
              const isActive = filter === f.value;
              const color = f.value === "ALL" ? "20 40% 30%" : ENTITY_META[f.value as EntityCode].color;
              return (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-serif transition-colors",
                    isActive ? "bg-primary/15 text-primary" : "hover:bg-muted text-foreground"
                  )}
                >
                  <span className="w-2.5 h-2.5 rounded-sm border border-foreground/30 shrink-0" style={{ backgroundColor: `hsl(${color})` }} />
                  <span className="truncate">{f.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </aside>

      {hoverName && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-fade-in-up px-3">
          <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-elegant font-mono text-[10px] sm:text-xs tracking-wider uppercase whitespace-nowrap">
            ▶ {hoverName}
          </div>
        </div>
      )}

      <LegendPanel sheets={geoloskeKarte.filter(s => s.imageUrl)} onSelect={setActive} />
      <SheetModal sheet={active} onClose={() => setActive(null)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />

      <AnimatePresence>
        {initialLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-gradient-parchment flex flex-col items-center justify-center backdrop-blur-sm"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-md"></div>
            </div>
            <h2 className="mt-8 font-serif text-2xl lg:text-3xl font-semibold text-foreground tracking-wide animate-pulse">
              Učitavanje geoloških karata
            </h2>
            <p className="font-mono text-[10px] sm:text-xs tracking-[0.25em] uppercase text-muted-foreground mt-4">
              Molimo pričekajte...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapView;
