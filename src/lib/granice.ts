// Stvarne granice Bosne i Hercegovine podijeljene po entitetima.
// Izvor: geoBoundaries (gbOpen, ADM1) — pojednostavljena geometrija.
import raw from "./bih-entities.geojson.json";

export type EntityCode = "FBiH" | "RS" | "BD";

const NAME_MAP: Record<string, EntityCode> = {
  "Federation of Bosnia and Herzegovina": "FBiH",
  "Republika Srpska": "RS",
  "Brčko District": "BD",
};

export const ENTITY_META: Record<EntityCode, { label: string; color: string }> = {
  FBiH: { label: "Federacija BiH", color: "210 70% 45%" },
  RS:   { label: "Republika Srpska", color: "0 65% 45%" },
  BD:   { label: "Brčko Distrikt", color: "140 55% 38%" },
};

const features = (raw as any).features.map((f: any) => ({
  ...f,
  properties: {
    ...f.properties,
    entity: NAME_MAP[f.properties.shapeName] ?? "FBiH",
  },
}));

const granice = { type: "FeatureCollection", features } as const;
export default granice;
