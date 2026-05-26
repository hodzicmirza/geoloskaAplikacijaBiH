import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Ruler, Download, ImageOff } from "lucide-react";
import type { GeoSheet } from "@/lib/geoloskeKarte";
import { useEffect } from "react";

type Props = {
  sheet: GeoSheet | null;
  onClose: () => void;
};

const SheetModal = ({ sheet, onClose }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleDownload = async () => {
    if (!sheet?.imageUrl) return;
    try {
      const res = await fetch(sheet.imageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sheet.code}_${sheet.name.replace(/\s+/g, "-")}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      {sheet && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-foreground/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-lg bg-card shadow-elegant border border-border grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-foreground/5 flex items-center justify-center p-4 lg:p-6 max-h-[50vh] lg:max-h-[92vh]">
              {sheet.imageUrl ? (
                <img
                  src={sheet.imageUrl}
                  alt={`Geološki list ${sheet.name}`}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain rounded shadow-soft"
                />
              ) : (
                <div className="text-center px-6 py-12 text-muted-foreground">
                  <ImageOff size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="font-serif text-xl">Sken nije priložen</p>
                  <p className="mt-2 text-xs font-mono">
                    Dodaj sliku <span className="text-primary">src/assets/karte/sheet-r{sheet.row}-c{sheet.col}.jpg</span>
                  </p>
                </div>
              )}
              <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.25em] uppercase text-primary/90 bg-card/90 px-2.5 py-1 rounded">
                {sheet.code}
              </div>
              {sheet.imageUrl && (
                <button
                  onClick={handleDownload}
                  className="absolute bottom-4 right-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-elegant hover:bg-primary/90 transition-colors text-sm font-mono uppercase tracking-wider"
                >
                  <Download size={14} /> Preuzmi
                </button>
              )}
            </div>

            <div className="flex flex-col overflow-y-auto bg-gradient-parchment">
              <div className="p-6 lg:p-8 border-b border-border">
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-2">
                  {sheet.region}
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
                  {sheet.name}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {sheet.description}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
                  <Meta icon={<Ruler size={14} />} label="Razmjera" value={sheet.scale} />
                  <Meta icon={<Calendar size={14} />} label="Godina" value={String(sheet.year)} />
                  <Meta icon={<MapPin size={14} />} label="Šifra" value={sheet.code} />
                </div>
              </div>

              <div className="p-6 lg:p-8">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-baseline gap-3">
                  Tumač geoloških jedinica
                  <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                    Legenda
                  </span>
                </h3>
                <ul className="space-y-2.5">
                  {sheet.legend.map((unit) => (
                    <li
                      key={unit.code}
                      className="flex items-start gap-3 p-3 rounded-md bg-card/60 border border-border/60 hover:border-primary/40 transition-colors"
                    >
                      <span
                        className="mt-0.5 w-8 h-8 rounded-sm border border-foreground/20 shrink-0 shadow-soft"
                        style={{ backgroundColor: `hsl(${unit.color})` }}
                        aria-hidden
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-serif text-base font-semibold text-foreground">
                            {unit.name}
                          </span>
                          <span className="font-mono text-xs text-primary shrink-0">
                            {unit.code}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{unit.age}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Zatvori"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-foreground/80 hover:bg-foreground text-background flex items-center justify-center transition-colors shadow-soft"
            >
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Meta = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col gap-1 p-2.5 rounded bg-card/70 border border-border/60">
    <span className="flex items-center gap-1.5 text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
      {icon} {label}
    </span>
    <span className="font-serif text-sm font-semibold text-foreground">{value}</span>
  </div>
);

export default SheetModal;
