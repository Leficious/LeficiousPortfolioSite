type SignalAcquisitionProps = {
  active: boolean;
};

export function SignalAcquisition({ active }: SignalAcquisitionProps) {
  if (!active) return null;

  return (
    <div aria-hidden="true" className="signal-acquisition">
      <div className="signal-acquisition__scan" />
      <div className="signal-acquisition__reticle">
        <span />
        <span />
      </div>
      <p className="signal-acquisition__status">
        <span className="signal-acquisition__status-light" />
        Signal acquired <span aria-hidden="true">//</span> Portfolio {new Date().getFullYear()}
      </p>
    </div>
  );
}
