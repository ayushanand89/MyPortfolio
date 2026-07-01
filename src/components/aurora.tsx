/**
 * Ambient aurora backdrop — three slow-drifting accent light-fields. It's the
 * main atmospheric layer on mobile (where the WebGL scene is faint) and is
 * dimmed on large screens so the 3D backdrop + hero object lead there. Purely
 * decorative; freezes to a static wash under reduced motion (global rule).
 */
export function Aurora() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-90 lg:opacity-40"
    >
      <span className="aurora-blob aurora-blob--1" />
      <span className="aurora-blob aurora-blob--2" />
      <span className="aurora-blob aurora-blob--3" />
    </div>
  );
}
