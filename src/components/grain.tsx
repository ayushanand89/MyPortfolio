const NOISE =
  "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='220'%20height='220'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.8'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3CfeColorMatrix%20values='0%200%200%200%200.5%200%200%200%200%200.5%200%200%200%200%200.5%200%200%200%201.1%20-0.2'/%3E%3C/filter%3E%3Crect%20width='220'%20height='220'%20filter='url(%23n)'/%3E%3C/svg%3E";

/**
 * Filmic grain over everything - a static tile at low opacity with normal
 * blending (no per-frame blend-mode compositing against the page).
 */
export function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45] opacity-[0.07]"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "220px 220px",
      }}
    />
  );
}
