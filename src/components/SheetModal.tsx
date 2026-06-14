import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Ruler, Download, ImageOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

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

  const handleDownload = () => {
    const downloadUrl = sheet?.modalUrl || sheet?.imageUrl;
    if (!downloadUrl) return;
    
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${sheet.code}_${sheet.name.replace(/\s+/g, "-")}.jpg`;
    a.target = "_blank"; // Fallback if download attribute is not fully supported
    document.body.appendChild(a);
    a.click();
    a.remove();
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
            className="relative w-full max-w-[95vw] lg:max-w-7xl max-h-[95vh] overflow-hidden rounded-lg bg-card shadow-elegant border border-border grid grid-cols-1 lg:grid-cols-[3.5fr_1fr]"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-foreground/5 flex items-center justify-center p-4 lg:p-6 max-h-[50vh] lg:max-h-[92vh]">
              {sheet.imageUrl ? (
                <ProgressiveImage 
                  lowRes={sheet.imageUrl} 
                  highRes={sheet.modalUrl} 
                  alt={`Geološki list ${sheet.name}`} 
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
              <div className="p-6 lg:p-8 border-b border-border flex-1">
                <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-2">
                  {sheet.region}
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
                  {sheet.name}
                </h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {sheet.description}
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 text-xs">
                  <Meta icon={<Ruler size={14} />} label="Razmjera" value={sheet.scale} />
                  <Meta icon={<Calendar size={14} />} label="Godina" value={String(sheet.year)} />
                  <Meta icon={<MapPin size={14} />} label="Šifra" value={sheet.code} />
                </div>
                
                <div className="mt-8 p-4 bg-primary/5 rounded-md border border-primary/20 text-sm text-foreground/80">
                  <p className="flex items-center gap-2 font-medium mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Kako očitati legendu?
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Koristite točkić miša, dvostruki klik ili pinch-to-zoom (na telefonu) za zumiranje i detaljan pregled legende. Kartu možete slobodno prevlačiti (pan).
                  </p>
                </div>
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

const ProgressiveImage = ({ lowRes, highRes, alt }: { lowRes: string; highRes?: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [src, setSrc] = useState(lowRes);

  useEffect(() => {
    setLoaded(false);
    setSrc(lowRes);
    
    if (highRes && highRes !== lowRes) {
      const img = new Image();
      img.src = highRes;
      img.onload = () => {
        if (img.decode) {
          img.decode().then(() => {
            setSrc(highRes);
            setLoaded(true);
          }).catch(() => {
            setSrc(highRes);
            setLoaded(true);
          });
        } else {
          setSrc(highRes);
          setLoaded(true);
        }
      };
    } else {
      setLoaded(true);
    }
  }, [lowRes, highRes]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={1}
        maxScale={6}
        centerOnInit={true}
        wheel={{ step: 0.15 }}
        doubleClick={{ step: 1.5 }}
      >
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded shadow-soft transition-opacity duration-300"
            style={{ opacity: loaded ? 1 : 0.6 }}
          />
        </TransformComponent>
      </TransformWrapper>

      {!loaded && highRes && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[1px] rounded pointer-events-none z-10">
          <Loader2 className="w-8 h-8 text-primary animate-spin shadow-md" />
        </div>
      )}
    </div>
  );
};

export default SheetModal;
