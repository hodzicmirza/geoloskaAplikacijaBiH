import { useEffect, useRef, useState, useCallback } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke, Fill } from "ol/style";
import { fromLonLat, transformExtent, toLonLat } from "ol/proj";
import "ol/ol.css";
import { geoloskeKarte, type GeoSheet } from "@/lib/geoloskeKarte";
import granice from "@/lib/granice";
import SheetModal from "./SheetModal";
import LegendPanel from "./LegendPanel";

const MapView = () => {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const sheetByLayer = useRef<Map[]>([]);
  const layers = useRef<Array<{ layer: ImageLayer<Static>; sheet: GeoSheet }>>([]);
  const hovered = useRef<GeoSheet | null>(null);

  const [active, setActive] = useState<GeoSheet | null>(null);
  const [hoverName, setHoverName] = useState<string | null>(null);

  const handlePointer = useCallback((e: any) => {
    if (!mapInstance.current) return;
    const [lon, lat] = toLonLat(e.coordinate);
    let found: GeoSheet | null = null;
    for (const { sheet } of layers.current) {
      const [a, b, c, d] = sheet.extent;
      if (lon >= a && lon <= c && lat >= b && lat <= d) {
        found = sheet;
        break;
      }
    }
    hovered.current = found;
    setHoverName(found?.name ?? null);
    document.body.style.cursor = found ? "pointer" : "";
  }, []);

  const handleClick = useCallback(() => {
    if (hovered.current) setActive(hovered.current);
  }, []);

  useEffect(() => {
    if (!mapEl.current) return;

    // Image overlays for each geological sheet
    const imgLayers = geoloskeKarte.map((sheet) => {
      const layer = new ImageLayer({
        opacity: 0.85,
        source: new Static({
          url: sheet.imageUrl,
          imageExtent: transformExtent(sheet.extent, "EPSG:4326", "EPSG:3857"),
          projection: "EPSG:3857",
        }),
      });
      return { layer, sheet };
    });
    layers.current = imgLayers;

    // BiH borders
    const borderLayer = new VectorLayer({
      source: new VectorSource({
        features: new GeoJSON().readFeatures(granice, {
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }),
      }),
      style: new Style({
        stroke: new Stroke({ color: "hsl(16, 65%, 25%)", width: 2.5 }),
        fill: new Fill({ color: "hsla(39, 38%, 95%, 0.08)" }),
      }),
    });

    const viewExtent = transformExtent([14.5, 41.8, 21.5, 46.2], "EPSG:4326", "EPSG:3857");

    const map = new Map({
      target: mapEl.current,
      layers: [
        new TileLayer({ source: new OSM(), opacity: 0.55 }),
        borderLayer,
        ...imgLayers.map((l) => l.layer),
      ],
      view: new View({
        center: fromLonLat([17.789, 44.0]),
        zoom: 7.2,
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
  }, [handlePointer, handleClick]);

  return (
    <div className="relative w-full h-screen bg-gradient-parchment overflow-hidden">
      {/* Map canvas */}
      <div ref={mapEl} className="absolute inset-0" aria-label="Geološka karta Bosne i Hercegovine" />

      {/* Top header */}
      <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="px-6 sm:px-10 pt-6 pb-10 bg-gradient-to-b from-background/95 via-background/70 to-transparent">
          <div className="pointer-events-auto max-w-5xl">
            <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-2">
              Geološki zavod · Arhiv listova
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-[1.05] text-foreground">
              Osnovna geološka karta
              <span className="block text-primary italic">Bosne i Hercegovine</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
              Razmjera 1 : 100 000 — pređi mišem preko mape, klikni na list za prikaz uvećanog
              skena i tumača geoloških jedinica.
            </p>
          </div>
        </div>
      </header>

      {/* Hover indicator */}
      {hoverName && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-fade-in-up">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-elegant font-mono text-xs tracking-wider uppercase">
            ▶ {hoverName} — klikni za detalje
          </div>
        </div>
      )}

      {/* Legend panel */}
      <LegendPanel sheets={geoloskeKarte} onSelect={setActive} />

      {/* Modal */}
      <SheetModal sheet={active} onClose={() => setActive(null)} />
    </div>
  );
};

export default MapView;
