import type { SoftwareName } from "../lib/gallery";

const abbreviations: Record<SoftwareName, string> = {
  "Maya": "MY",
  "Substance 3D Designer": "SD",
  "Substance 3D Painter": "SP",
  "SpeedTree": "ST",
  "Unreal Engine": "UE",
  "Gaea": "GA",
  "ZBrush": "ZB",
  "Photoshop": "PS",
  "Python": "PY",
  "MEL": "MEL",
  "Yeti": "YT",
  "Marmoset Toolbag": "MT",
  "Clip Studio Paint": "CS",
  "V-Ray": "VR",
  "Houdini": "HO",
  "Redshift": "RS",
  "Traditional Media": "TM",
};

const compactNames: Partial<Record<SoftwareName, string>> = {
  "Substance 3D Designer": "Substance Designer",
  "Substance 3D Painter": "Substance Painter",
  "Marmoset Toolbag": "Marmoset",
  "Clip Studio Paint": "Clip Studio",
};

type SoftwareStackProps = {
  software: SoftwareName[];
  showLabels?: boolean;
};

export function SoftwareStack({ software, showLabels = false }: SoftwareStackProps) {
  return (
    <div aria-label={`Software and tools: ${software.join(", ")}`}>
      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Software / tools</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {software.map((name) => (
          <span
            key={name}
            title={name}
            className="inline-flex min-h-7 items-center gap-2 rounded border border-border/80 bg-background/45 px-2 font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-foreground/45 hover:text-foreground"
          >
            <span aria-hidden="true" className="text-foreground/75">{abbreviations[name]}</span>
            {showLabels && <span className="border-l border-border/70 pl-2">{name}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SoftwareSummary({ software }: Pick<SoftwareStackProps, "software">) {
  const visible = software.slice(0, 2).map((name) => compactNames[name] ?? name);
  const remaining = software.length - visible.length;
  const summary = `${visible.join(" · ")}${remaining > 0 ? ` · +${remaining}` : ""}`;

  return (
    <p aria-label={`Software and tools: ${software.join(", ")}`} className="flex items-baseline gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
      <span className="shrink-0 text-accent/80">Toolkit</span>
      <span className="min-w-0 truncate">{summary}</span>
    </p>
  );
}
