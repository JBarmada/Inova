export function PixelStatus({ text, hoverOnly = false }: { text: string; hoverOnly?: boolean }) {
  return <div className={hoverOnly ? "status-wrap hover-reveal" : "status-wrap"}><div className="pixel-status" role="status">
    <span className="status-pip" aria-hidden="true" /><span>{text}</span>
  </div></div>;
}
