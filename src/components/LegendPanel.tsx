import { useState } from "react";
import { ChevronUp, Layers } from "lucide-react";
import type { GeoSheet } from "@/lib/geoloskeKarte";
import { cn } from "@/lib/utils";

type Props = {
  sheets: GeoSheet[];
  onSelect: (sheet: GeoSheet) => void;
};

const LegendPanel = ({ sheets, onSelect }: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={cn(
        "absolute right-3 sm:right-4 top-20 sm:top-24 z-20 w-[200px] sm:w-[220px]",
        "bg-card/95 backdrop-blur border border-border rounded-lg shadow-elegant"
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <span className="flex items-center gap-2">
          <Layers size={12} className="text-primary" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
            Listovi
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/70">{sheets.length}</span>
        </span>
        <ChevronUp
          size={14}
          className={cn("text-muted-foreground transition-transform", !open && "rotate-180")}
        />
      </button>

      {open && (
        <ul className="px-2 pb-2 max-h-[40vh] overflow-y-auto">
          {sheets.map((sheet) => (
            <li key={sheet.id}>
              <button
                onClick={() => onSelect(sheet)}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-primary/10 hover:text-primary transition-colors group"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-serif text-sm font-semibold">{sheet.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground group-hover:text-primary">
                    {sheet.year}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{sheet.region}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default LegendPanel;
