import { useLayoutEffect, useRef } from "react";
import { useLanguage } from "../lib/language";

type SignalAcquisitionProps = {
  active: boolean;
};

export function SignalAcquisition({ active }: SignalAcquisitionProps) {
  const { text } = useLanguage();
  const layerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!active) return;

    const positionLock = () => {
      const target = document.getElementById("hero-system-diagram");
      const layer = layerRef.current;
      if (!target || !layer) return;

      const bounds = target.getBoundingClientRect();
      layer.style.setProperty("--signal-lock-x", `${bounds.left + bounds.width / 2}px`);
      layer.style.setProperty("--signal-lock-y", `${bounds.top + bounds.height / 2}px`);
    };

    positionLock();
    window.addEventListener("resize", positionLock);
    return () => window.removeEventListener("resize", positionLock);
  }, [active]);

  if (!active) return null;

  return (
    <div ref={layerRef} aria-hidden="true" className="signal-acquisition">
      <div className="signal-acquisition__scan" />
      <div className="signal-acquisition__flash" />
      <div className="signal-acquisition__wave" />
      <div className="signal-acquisition__reticle">
        <span />
        <span />
      </div>
      <p className="signal-acquisition__status">
        <span className="signal-acquisition__status-light" />
        {text("Signal acquired", "信号已捕获")} <span aria-hidden="true">//</span> {text("Portfolio", "作品集")} {new Date().getFullYear()}
      </p>
    </div>
  );
}
