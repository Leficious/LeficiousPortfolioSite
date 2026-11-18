import type { SoftwareName } from "../lib/gallery";
import { useLanguage } from "../lib/language";

const abbreviations: Record<SoftwareName, string> = {
  Maya: "MY",
  "Substance 3D Designer": "SD",
  "Substance 3D Painter": "SP",
  SpeedTree: "ST",
  "Unreal Engine": "UE",
  Unity: "UN",
  "C#": "C#",
  Gaea: "GA",
  ZBrush: "ZB",
  Photoshop: "PS",
  Python: "PY",
  MEL: "MEL",
  Yeti: "YT",
  "Marmoset Toolbag": "MT",
  "Clip Studio Paint": "CS",
  "V-Ray": "VR",
  Houdini: "HO",
  Redshift: "RS",
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
  const { text } = useLanguage();
  return (
    <div aria-label={`${text("Software and tools", "软件与工具")}: ${software.join(", ")}`}>
      <p className="text-xs font-medium text-foreground/75">{text("Tools", "软件与工具")}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {software.map((name) => (
          <span
            key={name}
            title={name}
            className="inline-flex min-h-7 items-center gap-2 rounded-xs border border-border bg-background/60 px-2.5 py-1 text-xs text-muted-foreground"
          >
            <span aria-hidden="true" className="font-mono text-[11px] text-foreground/80">
              {abbreviations[name]}
            </span>
            {showLabels && <span className="border-l border-border pl-2">{name}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SoftwareSummary({ software }: Pick<SoftwareStackProps, "software">) {
  const { text } = useLanguage();
  const visible = software.slice(0, 2).map((name) => compactNames[name] ?? name);
  const remaining = software.length - visible.length;
  const summary = `${visible.join(" · ")}${remaining > 0 ? ` · +${remaining}` : ""}`;

  return (
    <p aria-label={`${text("Software and tools", "软件与工具")}: ${software.join(", ")}`} className="flex items-baseline gap-2 text-xs text-muted-foreground">
      <span className="shrink-0 text-foreground/75">{text("Tools", "工具")}</span>
      <span className="min-w-0 truncate">{summary}</span>
    </p>
  );
}
