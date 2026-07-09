/**
 * Page-load dive intro. Pure CSS (see `.intro-*` in globals.css): a glossy
 * tile with a circular hole scales in with the wordmark, holds a beat, then
 * scales up massively so the viewer "dives" through the hole — the hole is
 * filled with the page background colour, so the overlay fade that follows is
 * an invisible seam straight into the homepage, where the hero headline rises
 * in sync (see the `intro-sync` class set by the inline script in layout.tsx).
 *
 * Transform/opacity only (compositor-composited), works with no JS, removes
 * itself after playing, and is hidden entirely under reduced motion. Lives in
 * the root layout, so it plays once per full page load — not on client
 * navigations, which don't remount the layout.
 */
export function Intro() {
  return (
    <div className="intro-curtain" aria-hidden="true">
      <div className="intro-stage">
        <div className="intro-tile">
          <span className="intro-hole" />
        </div>
        <div className="intro-text">
          <span className="intro-eyebrow">Full-Stack Developer</span>
          <span className="intro-word">
            <span>
              Ayush Anand<span className="text-accent">.</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
