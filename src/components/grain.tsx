const NOISE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.85'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='200'%20height='200'%20filter='url(%23n)'/%3E%3C/svg%3E";

/** Subtle film-grain overlay for a filmic, high-end texture. */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45] opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "200px 200px",
      }}
    />
  );
}
