const paths = {
  home: "M7 1h2v2h2v2h2v2h2v2h-2v6H9v-5H7v5H3V9H1V7h2V5h2V3h2z",
  settings: "M6 0h4v3h2V2h2v2h-1v2h3v4h-3v2h1v2h-2v-1h-2v3H6v-3H4v1H2v-2h1v-2H0V6h3V4H2V2h2v1h2zM6 6v4h4V6z",
  companion: "M4 1h3v4H4zM9 1h3v4H9zM0 5h3v4H0zM13 5h3v4h-3zM6 7h4v2h2v2h1v3H3v-3h1V9h2z",
  wardrobe: "M5 1h6v1h2v1h2v4h-3v8H4V7H1V3h2V2h2zM6 1v3h4V1z",
  memories: "M1 2h5v1h4V2h5v11h-5v1H6v-1H1zM3 4v7h3V5H3zM10 5v6h3V4h-3z",
  float: "M1 5h5v2H3v6h6v-3h2v5H1zM8 1h7v7h-2V4L7 10 6 9l6-6H8z",
};

export function PixelIcon({ kind }: { kind: keyof typeof paths }) {
  return <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor"
    fillRule="evenodd" shapeRendering="crispEdges" aria-hidden="true" focusable="false"><path d={paths[kind]} /></svg>;
}
