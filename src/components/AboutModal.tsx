import { motion, AnimatePresence } from "framer-motion";
import { X, Github, Mail, BookOpen } from "lucide-react";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const AboutModal = ({ open, onClose }: Props) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-foreground/70 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg bg-card border border-border rounded-lg shadow-elegant overflow-hidden"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-parchment p-8">
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-primary/80 mb-2">
                O aplikaciji
              </p>
              <h2 className="font-serif text-3xl font-semibold text-foreground">
                Geološki Arhiv BiH
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Interaktivni prikaz osnovnih geoloških karata Bosne i Hercegovine u razmjeri
                1 : 100 000. Karte su organizovane u mrežu listova preko stvarnih granica entiteta.
              </p>
            </div>

            <div className="p-8 space-y-4">
              <Row label="Autori"     value="Mirza Hodžić, Faris Mušija" />
              <Row label="Godina"     value="2026" />
              <Row label="Izvor karata" value="Geološki zavod Bosne i Hercegovine" />
              <Row label="Granice"    value="geoBoundaries (gbOpen, ADM1)" />
              <Row label="Tehnologija" value="React · OpenLayers · Tailwind" />

              <div className="pt-4 border-t border-border flex flex-wrap gap-2">
                <Link icon={<BookOpen size={14} />} text="Dokumentacija" href="https://github.com/hodzicmirza/geoloskaAplikacijaBiH#readme" />
                <Link icon={<Github size={14} />}   text="GitHub" href="https://github.com/hodzicmirza/geoloskaAplikacijaBiH" />
                <Link icon={<Mail size={14} />}     text="Kontakt" href="mailto:mhodzic6@etf.unsa.ba" />
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Zatvori"
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-foreground/80 hover:bg-foreground text-background flex items-center justify-center shadow-soft transition-colors"
            >
              <X size={18} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-border/50 pb-2">
    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className="font-serif text-sm font-semibold text-foreground text-right">{value}</span>
  </div>
);

const Link = ({ icon, text, href }: { icon: React.ReactNode; text: string; href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary text-xs font-mono uppercase tracking-wider transition-colors">
    {icon} {text}
  </a>
);

export default AboutModal;
