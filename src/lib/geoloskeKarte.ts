import sarajevo from "@/assets/karta-sarajevo.jpg";
import banjaluka from "@/assets/karta-banjaluka.jpg";
import mostar from "@/assets/karta-mostar.jpg";
import tuzla from "@/assets/karta-tuzla.jpg";

export type GeoUnit = {
  color: string; // HSL string used inline for legend swatches
  code: string;
  name: string;
  age: string;
};

export type GeoSheet = {
  id: string;
  name: string;
  region: string;
  scale: string;
  year: number;
  description: string;
  /** [minLon, minLat, maxLon, maxLat] in EPSG:4326 */
  extent: [number, number, number, number];
  imageUrl: string;
  legend: GeoUnit[];
};

export const geoloskeKarte: GeoSheet[] = [
  {
    id: "sarajevo",
    name: "List Sarajevo",
    region: "Centralna Bosna",
    scale: "1 : 100 000",
    year: 1978,
    description:
      "Sektor centralne Bosne sa dinarskim borama, mezozojskim karbonatima i kvartarnim aluvijalnim naslagama doline Miljacke i Bosne.",
    extent: [17.95, 43.6, 18.95, 44.2],
    imageUrl: sarajevo,
    legend: [
      { color: "22 78% 52%", code: "T2", name: "Trijaski krečnjaci i dolomiti", age: "Srednji trijas" },
      { color: "120 35% 45%", code: "J1", name: "Jurski klastiti i rožnaci", age: "Donja jura" },
      { color: "45 75% 60%", code: "K2", name: "Kredni flišni sedimenti", age: "Gornja kreda" },
      { color: "200 25% 55%", code: "Q", name: "Aluvijalne naslage", age: "Kvartar" },
    ],
  },
  {
    id: "banjaluka",
    name: "List Banja Luka",
    region: "Sjeverozapadna Bosna",
    scale: "1 : 100 000",
    year: 1976,
    description:
      "Prelaz iz unutrašnjih Dinarida u Panonski basen — neogeni klastiti, ofiolitni kompleksi i pliocenske terase Vrbasa.",
    extent: [16.85, 44.55, 17.85, 45.15],
    imageUrl: banjaluka,
    legend: [
      { color: "16 65% 50%", code: "Ng", name: "Neogeni pješčari i lapori", age: "Miocen" },
      { color: "0 55% 38%", code: "Of", name: "Ofiolitni melanž", age: "Jura–kreda" },
      { color: "35 30% 70%", code: "Pl", name: "Pliocenske terase", age: "Pliocen" },
      { color: "200 25% 55%", code: "Q", name: "Aluvijum Vrbasa", age: "Kvartar" },
    ],
  },
  {
    id: "mostar",
    name: "List Mostar",
    region: "Hercegovina",
    scale: "1 : 100 000",
    year: 1975,
    description:
      "Visoki krš Hercegovine — debele serije krednih i jurskih krečnjaka sa razvijenim kraškim formama, poljima i ponorima.",
    extent: [17.55, 43.1, 18.55, 43.7],
    imageUrl: mostar,
    legend: [
      { color: "200 30% 70%", code: "K1", name: "Donjokredni krečnjaci", age: "Donja kreda" },
      { color: "200 20% 50%", code: "J3", name: "Gornjojurski dolomiti", age: "Gornja jura" },
      { color: "30 50% 65%", code: "E", name: "Eocenski fliš", age: "Eocen" },
      { color: "45 60% 80%", code: "Q", name: "Crvenice i naplavine", age: "Kvartar" },
    ],
  },
  {
    id: "tuzla",
    name: "List Tuzla",
    region: "Sjeveroistočna Bosna",
    scale: "1 : 100 000",
    year: 1980,
    description:
      "Tuzlanski basen sa neogenim soljenim sedimentima, miocenskim laporima i ležištima kamene soli — geološki specifičan po sinklinalnim strukturama.",
    extent: [18.4, 44.25, 19.4, 44.85],
    imageUrl: tuzla,
    legend: [
      { color: "330 30% 75%", code: "Ms", name: "Miocenski salinski sedimenti", age: "Miocen" },
      { color: "45 80% 60%", code: "Mg", name: "Glinoviti lapori", age: "Miocen" },
      { color: "10 70% 50%", code: "Vu", name: "Vulkanoklastiti", age: "Oligo–miocen" },
      { color: "55 70% 80%", code: "Q", name: "Aluvijum Spreče", age: "Kvartar" },
    ],
  },
];
