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
  imageUrl?: string;
  modalUrl?: string;   // undefined ako slika još nije priložena
  legend: GeoUnit[];
};



const DEFAULT_LEGEND: GeoUnit[] = [
  { color: "200 30% 70%", code: "K",  name: "Kredni krečnjaci",      age: "Kreda" },
  { color: "22 78% 52%",  code: "T",  name: "Trijaski dolomiti",     age: "Trijas" },
  { color: "120 35% 45%", code: "J",  name: "Jurski klastiti",       age: "Jura" },
  { color: "45 75% 60%",  code: "E",  name: "Eocenski fliš",         age: "Eocen" },
  { color: "200 25% 55%", code: "Q",  name: "Kvartarne naslage",     age: "Kvartar" },
];

export const geoloskeKarte: GeoSheet[] = [
  {
    id: "R1C1",
    row: 1, col: 1,
    code: "BANJA_LUKA",
    name: "Banja Luka",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Banja Luka",
    extent: [16.99581425493622, 44.66400117668463, 17.498087291332528, 45.00110981378601],
    imageUrl: "/geoloske_slike/BANJA.jpg",
    modalUrl: "/citave_slike/Banja_Luka_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R2C2",
    row: 1, col: 1,
    code: "BIHAC",
    name: "Bihac",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Bihac",
    extent: [15.492583, 44.6673472, 15.9960836, 44.9985715],
    imageUrl: "/geoloske_slike/BIHAC.jpg",
    modalUrl: "/citave_slike/Bihac_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R3C3",
    row: 1, col: 1,
    code: "BIJELJINA",
    name: "Bijeljina",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Bijeljina",
    extent: [18.995859, 44.666554, 19.4925745, 44.999556],
    imageUrl: "/geoloske_slike/BIJELJINA.jpg",
    modalUrl: "/citave_slike/Bijeljina_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R4C4",
    row: 1, col: 1,
    code: "BOSANSKA_KRUPA",
    name: "Bosanska_Krupa",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Bosanska_Krupa",
    extent: [15.9961973, 44.6741622, 16.4932697, 44.9915513],
    imageUrl: "/geoloske_slike/BOSANSKA_KRUPA.jpg",
    modalUrl: "/citave_slike/Bosanska_Krupa_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R5C5",
    row: 1, col: 1,
    code: "BRCKO",
    name: "Brcko",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Brcko",
    extent: [18.4953407, 44.6672844, 18.9966323, 44.9994132],
    imageUrl: "/geoloske_slike/BRCKO.jpg",
    modalUrl: "/citave_slike/Brcko_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R6C6",
    row: 1, col: 1,
    code: "BUGOJNO",
    name: "Bugojno",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Bugojno",
    extent: [16.9969755, 44.0000562, 17.4947858, 44.3333159],
    imageUrl: "/geoloske_slike/BUGOJNO.jpg",
    modalUrl: "/citave_slike/Bugojno_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R7C7",
    row: 1, col: 1,
    code: "DERVENTA",
    name: "Derventa",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Derventa",
    extent: [17.4934887, 44.6688151, 17.9966491, 45.0001578],
    imageUrl: "/geoloske_slike/DERVENTA.jpg",
    modalUrl: "/citave_slike/Derventa_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R8C8",
    row: 1, col: 1,
    code: "DOBOJ",
    name: "Doboj",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Doboj",
    extent: [17.9938444, 44.6666748, 18.496823, 45.000437],
    imageUrl: "/geoloske_slike/DOBOJ.jpg",
    modalUrl: "/citave_slike/Doboj_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R9C9",
    row: 1, col: 1,
    code: "DRVAR",
    name: "Drvar",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Drvar",
    extent: [15.9970655, 44.3342644, 16.4952934, 44.6657714],
    imageUrl: "/geoloske_slike/DRVAR.jpg",
    modalUrl: "/citave_slike/Drvar_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R10C10",
    row: 1, col: 1,
    code: "FOCA",
    name: "Foca",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Foca",
    extent: [18.4952561, 43.3337788, 18.9950364, 43.665628],
    imageUrl: "/geoloske_slike/FOCA.jpg",
    modalUrl: "/citave_slike/Foca_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R11C11",
    row: 1, col: 1,
    code: "GACKO",
    name: "Gacko",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Gacko",
    extent: [18.4993527, 42.998782, 18.9905148, 43.3332701],
    imageUrl: "/geoloske_slike/GACKO.jpg",
    modalUrl: "/citave_slike/Gacko_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R12C12",
    row: 1, col: 1,
    code: "GLAMOC",
    name: "Glamoc",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Glamoc",
    extent: [16.4945131, 44.0017441, 16.9919774, 44.3317309],
    imageUrl: "/geoloske_slike/GLAMOC.jpg",
    modalUrl: "/citave_slike/Glamoc_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R13C13",
    row: 1, col: 1,
    code: "IMOTSKI",
    name: "Imotski",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Imotski",
    extent: [16.9970857, 43.3336561, 17.4976407, 43.665269],
    imageUrl: "/geoloske_slike/IMOTSKI.jpg",
    modalUrl: "/citave_slike/Imotski_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R14C14",
    row: 1, col: 1,
    code: "JAJCE",
    name: "Jajce",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Jajce",
    extent: [16.9973323, 44.3327853, 17.4941826, 44.6679349],
    imageUrl: "/geoloske_slike/JAJCE.jpg",
    modalUrl: "/citave_slike/Jajce_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R15C15",
    row: 1, col: 1,
    code: "KALINOVIK",
    name: "Kalinovik",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Kalinovik",
    extent: [17.9948944, 43.3338654, 18.4958784, 43.665828],
    imageUrl: "/geoloske_slike/KALINOVIK.jpg",
    modalUrl: "/citave_slike/Kalinovik_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R16C16",
    row: 1, col: 1,
    code: "KLJUC",
    name: "Kljuc",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Kljuc",
    extent: [16.4959681, 44.3345183, 16.9925271, 44.665886],
    imageUrl: "/geoloske_slike/KLJUC.jpg",
    modalUrl: "/citave_slike/Kljuc_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R17C17",
    row: 1, col: 1,
    code: "KOSTAJNICA",
    name: "Kostajnica",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Kostajnica",
    extent: [16.495874, 45.0016915, 16.9950819, 45.3322116],
    imageUrl: "/geoloske_slike/KOSTAJNICA.jpg",
    modalUrl: "/citave_slike/Kostajnica_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R18C18",
    row: 1, col: 1,
    code: "LIVNO",
    name: "Livno",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Livno",
    extent: [16.9955832, 43.6652724, 17.5021356, 43.9996059],
    imageUrl: "/geoloske_slike/LIVNO.jpg",
    modalUrl: "/citave_slike/Livno_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R19C19",
    row: 1, col: 1,
    code: "LJUBOVIJA",
    name: "Ljubovija",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Ljubovija",
    extent: [18.9980053, 44.0007225, 19.4954285, 44.3309193],
    imageUrl: "/geoloske_slike/LJUBOVIJA.jpg",
    modalUrl: "/citave_slike/Ljubovija_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R20C20",
    row: 1, col: 1,
    code: "METKOVIC",
    name: "Metkovic",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Metkovic",
    extent: [17.4926099, 43.0022942, 17.9946378, 43.3314037],
    imageUrl: "/geoloske_slike/METKOVIC.jpg",
    modalUrl: "/citave_slike/Metkovic_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R21C21",
    row: 1, col: 1,
    code: "MOSTAR",
    name: "Mostar",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Mostar",
    extent: [17.4955819, 43.3343349, 17.9986615, 43.6674412],
    imageUrl: "/geoloske_slike/MOSTAR.jpg",
    modalUrl: "/citave_slike/Mostar_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R22C22",
    row: 1, col: 1,
    code: "NOVA_GRADISKA",
    name: "Nova_Gradiska",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Nova_Gradiska",
    extent: [16.9942752, 45.0004776, 17.4922101, 45.3329182],
    imageUrl: "/geoloske_slike/NOVA_GRADISKA.jpg",
    modalUrl: "/citave_slike/Nova_Gradiska_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R23C23",
    row: 1, col: 1,
    code: "NOVA_KAPELA",
    name: "Nova_Kapela",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Nova_Kapela",
    extent: [17.4969904, 44.9992185, 17.9934879, 45.3324188],
    imageUrl: "/geoloske_slike/NOVA_KAPELA.jpg",
    modalUrl: "/citave_slike/Nova_Kapela_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R24C24",
    row: 1, col: 1,
    code: "PLJEVLJA",
    name: "Pljevlja",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Pljevlja",
    extent: [18.9954321, 43.3381076, 19.4897386, 43.6641501],
    imageUrl: "/geoloske_slike/PLJEVLJA.jpg",
    modalUrl: "/citave_slike/Pljevlja_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R25C25",
    row: 1, col: 1,
    code: "PRACA",
    name: "Praca",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Praca",
    extent: [18.4934354, 43.6668276, 18.9970529, 44.0016312],
    imageUrl: "/geoloske_slike/PRACA.jpg",
    modalUrl: "/citave_slike/Praca_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R26C26",
    row: 1, col: 1,
    code: "PRIJEDOR",
    name: "Prijedor",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Prijedor",
    extent: [16.4985683, 44.6665182, 16.9922857, 44.9982197],
    imageUrl: "/geoloske_slike/PRIJEDOR.jpg",
    modalUrl: "/citave_slike/Prijedor_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R27C27",
    row: 1, col: 1,
    code: "PROZOR",
    name: "Prozor",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Prozor",
    extent: [17.4957806, 43.6653962, 17.9957225, 44.0001177],
    imageUrl: "/geoloske_slike/PROZOR.jpg",
    modalUrl: "/citave_slike/Prozor_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R28C28",
    row: 1, col: 1,
    code: "SARAJEVO",
    name: "Sarajevo",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Sarajevo",
    extent: [17.989466, 43.6339546, 18.5026791, 44.0206792],
    imageUrl: "/geoloske_slike/SARAJEVO.jpg",
    modalUrl: "/citave_slike/Sarajevo_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R29C29",
    row: 1, col: 1,
    code: "SLAVONSKI_BROD",
    name: "Slavonski_Brod",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Slavonski_Brod",
    extent: [17.9950968, 44.9990251, 18.4977869, 45.3327788],
    imageUrl: "/geoloske_slike/SLAVONSKI_BROD.jpg",
    modalUrl: "/citave_slike/Slavonski_Brod_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R30C30",
    row: 1, col: 1,
    code: "SLUNJ",
    name: "Slunj",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Slunj",
    extent: [15.4949878, 45.002421, 16.0008263, 45.3273245],
    imageUrl: "/geoloske_slike/SLUNJ.jpg",
    modalUrl: "/citave_slike/Slunj_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R31C31",
    row: 1, col: 1,
    code: "STON",
    name: "Ston",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Ston",
    extent: [17.4931973, 42.6678339, 17.9968414, 42.9986499],
    imageUrl: "/geoloske_slike/STON.jpg",
    modalUrl: "/citave_slike/Ston_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R32C32",
    row: 1, col: 1,
    code: "TESLIC",
    name: "Teslic",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Teslic",
    extent: [17.4960714, 44.3332104, 17.9929316, 44.6687566],
    imageUrl: "/geoloske_slike/TESLIC.jpg",
    modalUrl: "/citave_slike/Teslic_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R33C33",
    row: 1, col: 1,
    code: "TREBINJE",
    name: "Trebinje",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Trebinje",
    extent: [17.9929098, 42.6685431, 18.4968065, 42.998347],
    imageUrl: "/geoloske_slike/TREBINJE.jpg",
    modalUrl: "/citave_slike/Trebinje_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R34C34",
    row: 1, col: 1,
    code: "TUZLA",
    name: "Tuzla",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Tuzla",
    extent: [18.4944165, 44.3328186, 18.9949447, 44.6669643],
    imageUrl: "/geoloske_slike/TUZLA.jpg",
    modalUrl: "/citave_slike/Tuzla_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R35C35",
    row: 1, col: 1,
    code: "UDBINA",
    name: "Udbina",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Udbina",
    extent: [15.4938247, 44.3014133, 16.0041024, 44.6840411],
    imageUrl: "/geoloske_slike/UDBINA.jpg",
    modalUrl: "/citave_slike/Udbina_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R36C36",
    row: 1, col: 1,
    code: "VARES",
    name: "Vares",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Vares",
    extent: [17.9976667, 43.9967826, 18.494843, 44.3401974],
    imageUrl: "/geoloske_slike/VARES.jpg",
    modalUrl: "/citave_slike/Vares_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R37C37",
    row: 1, col: 1,
    code: "VINKOVCI",
    name: "Vinkovci",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Vinkovci",
    extent: [18.4976217, 45.0002738, 18.9907586, 45.3371929],
    imageUrl: "/geoloske_slike/VINKOVCI.jpg",
    modalUrl: "/citave_slike/Vinkovci_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R38C38",
    row: 1, col: 1,
    code: "VISEGRAD",
    name: "Visegrad",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Visegrad",
    extent: [18.9999842, 43.6650292, 19.4923464, 43.9998773],
    imageUrl: "/geoloske_slike/VISEGRAD.jpg",
    modalUrl: "/citave_slike/Visegrad_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R39C39",
    row: 1, col: 1,
    code: "ZAVIDOVICI",
    name: "Zavidovici",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Zavidovici",
    extent: [17.997867, 44.3338244, 18.4919998, 44.6652856],
    imageUrl: "/geoloske_slike/ZAVIDOVICI.jpg",
    modalUrl: "/citave_slike/Zavidovici_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R40C40",
    row: 1, col: 1,
    code: "ZENICA",
    name: "Zenica",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Zenica",
    extent: [17.4969476, 44.0003322, 17.9969768, 44.3316336],
    imageUrl: "/geoloske_slike/ZENICA.jpg",
    modalUrl: "/citave_slike/Zenica_Modal.jpg",
    legend: DEFAULT_LEGEND
  },
  {
    id: "R41C41",
    row: 1, col: 1,
    code: "ZVORNIK",
    name: "Zvornik",
    region: 'Bosna i Hercegovina',
    scale: '1 : 100 000',
    year: 1978,
    description: 'Geološki list ' + "Zvornik",
    extent: [18.9980606, 44.3329315, 19.4911878, 44.6663943],
    imageUrl: "/geoloske_slike/ZVORNIK.jpg",
    modalUrl: "/citave_slike/Zvornik_Modal.jpg",
    legend: DEFAULT_LEGEND
  }
];

