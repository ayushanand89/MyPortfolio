/**
 * Ambient background depth — a calm static radial gradient. (Previously a
 * WebGL distort blob; that was removed because two per-frame render loops made
 * scrolling jittery. The aurora + particles + grain carry the atmosphere now.)
 */
export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
      style={{
        background:
          "radial-gradient(60% 50% at 72% 32%, #1f3a3055, transparent 70%)",
      }}
    />
  );
}
