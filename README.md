# Geološki Arhiv Bosne i Hercegovine 🌍 🇧🇦

Ova aplikacija predstavlja interaktivni prikaz osnovnih geoloških karata Bosne i Hercegovine u razmjeri 1 : 100 000. Karte su organizovane u mrežu listova preko stvarnih granica entiteta, što omogućava jednostavno i intuitivno pretraživanje, pregledavanje i preuzimanje geoloških karata.

---

## 👨‍💻 Autori
- **Mirza Hodžić** 
- **Faris Mušija** 
- **Kontakt:** [mhodzic6@etf.unsa.ba](mailto:mhodzic6@etf.unsa.ba)

---

## ✨ Ključne Mogućnosti (Features)
1. **Interaktivna Mreža Karata:** Pregled teritorije BiH podijeljene po geološkim listovima.
2. **Prikaz i Zumiranje u Visokoj Rezoluciji:** Mogućnost detaljnog pregleda skeniranih listova geoloških karata. Slika se može uvećati pritiskom na kartu u modalu, kako biste sa lakoćom pročitali legendu sa same slike.
3. **Filter Granica (Entiteti):** Prebacivanje prikaza i filtriranje graničnih područja unutar Bosne i Hercegovine (FBiH, RS, Brčko Distrikt).
4. **Preuzimanje (Download):** Direktno lokalno preuzimanje karata visoke rezolucije jednim klikom, dizajnirano na način da troši minimalno memorije računara ili mobilnog telefona.
5. **Brzina i Optimizacija:** Aplikacija koristi pametno progresivno učitavanje (*Progressive Image Loading*) za brže iscrtavanje karata bez "zamrzavanja" sistema na mobilnim uređajima.

---

## 🛠️ Korištene Tehnologije
Ovaj projekat je izgrađen sa fokusom na performanse, stabilnost i responzivan korisnički interfejs:
- **React.js** (Frontend biblioteka za građenje UI)
- **TypeScript** (Tipizacija i veća pouzdanost koda)
- **OpenLayers (ol)** (Napredna biblioteka za prikazivanje i upravljanje GIS mapama)
- **Tailwind CSS** (Za stilizovanje, dizajn i responzivnost aplikacije)
- **Framer Motion** (Biblioteka za tečne animacije modala, tranzicija i učitavanja)
- **Vite** (Izuzetno brz build-alat i razvojni server)
- **Lucide React** (Sistem elegantnih skalabilnih ikonica)

---

## 🚀 Pokretanje Projekta (Lokalno)

Ukoliko želite preuzeti projekat i pokrenuti ga lokalno na vašoj mašini, slijedite ove jednostavne korake:

### Preduslovi:
Na vašem računaru mora biti instaliran **Node.js** (preporučeno v18 ili novije).

### 1. Kloniranje repozitorijuma
```bash
git clone https://github.com/hodzicmirza/geoloskaAplikacijaBiH.git
cd geoloskaAplikacijaBiH
```

### 2. Instalacija zavisnosti
Preporučujemo korištenje `npm`:
```bash
npm install
```

### 3. Pokretanje razvojnog (Development) servera
Pokrenite lokalni server sa komandom:
```bash
npm run dev
```
Aplikacija će sada biti dostupna na adresi `http://localhost:5173/`.

### 4. Build za Produkciju
Da biste kreirali optimizovan i umanjen build za deploy, pokrenite:
```bash
npm run build
```
Zatim možete pregledati generisani lokalni build:
```bash
npm run preview
```

---

## 📚 Korišteni Podaci
- **Geološke Karte:** Skenovi originalnih karata su arhivski listovi - izvor **Geološki zavod Bosne i Hercegovine** (razmjera 1:100.000).
- **Granice entiteta:** Granice unutar BiH preuzete su sa [geoBoundaries](https://www.geoboundaries.org) baze podataka (gbOpen, ADM1) i konvertovane u upotrebljivi GeoJSON format prilagođen OpenLayers biblioteci.
