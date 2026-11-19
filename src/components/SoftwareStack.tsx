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
  tone?: "slate" | "parchment";
};

export function SoftwareStack({ software, showLabels = false, tone = "slate" }: SoftwareStackProps) {
  const { text } = useLanguage();
  const isParchment = tone === "parchment";

  return (
    <div aria-label={`${text("Software and tools", "软件与工具")}: ${software.join(", ")}`}>
      <p
        className={`font-numeral text-[10.5px] font-semibold tracking-[0.22em] uppercase ${
          isParchment ? "text-parchment-muted" : "text-warm/85"
        }`}
      >
        {text("Atelier Instruments", "制作工具与管线")}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {software.map((name) => (
          <span
            key={name}
            title={name}
            className={`victorian-ticket inline-flex min-h-7 items-center gap-2 border px-2.5 py-1 text-xs transition-colors ${
              isParchment
                ? "border-[#7a582e]/55 bg-parchment-deep/75 text-parchment-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] [--ticket-border:rgba(122,88,46,0.55)]"
                : "border-warm/35 bg-[#120d0a]/85 text-muted-foreground [--ticket-border:rgba(200,157,98,0.35)]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`font-numeral text-[10.5px] font-bold tracking-wider ${
                isParchment ? "text-rubric" : "text-[#d4af77]"
              }`}
            >
              {abbreviations[name]}
            </span>
            {showLabels && (
              <span
                className={`border-l pl-2 font-medium ${
                  isParchment ? "border-[#7a582e]/40 text-parchment-ink" : "border-warm/25 text-foreground/90"
                }`}
              >
                {compactNames[name] ?? name}
              </span>
            )}
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
    <p
      aria-label={`${text("Software and tools", "软件与工具")}: ${software.join(", ")}`}
      className="flex items-baseline gap-2 text-xs text-muted-foreground"
    >
      <span className="shrink-0 font-numeral text-[10px] font-semibold tracking-wider text-warm/85">{text("TOOLS", "工具")}</span>
      <span className="min-w-0 truncate">{summary}</span>
    </p>
  );
}
