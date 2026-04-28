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
        "absolute right-4 sm:right-6 bottom-6 z-20 w-[280px] sm:w-[320px]",
        "bg-card/95 backdrop-blur border border-border rounded-lg shadow-elegant",
        "transition-all duration-300"
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2">
          <Layers size={16} className="text-primary" />
          <span className="font-serif text-sm font-semibold">Dostupni listovi</span>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
            {sheets.length}
          </span>
        </span>
        <ChevronUp
          size={16}
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
