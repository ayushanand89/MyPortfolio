/**
 * Page-load curtain. Pure CSS (see `.intro-curtain` in globals.css): a wordmark
 * + fill bar plays, then the curtain lifts to reveal the page. Works with no JS,
 * removes itself after playing, and is hidden entirely under reduced motion.
 * Lives in the root layout, so it plays once per full page load (not on client
 * navigations, which don't remount the layout).
 */
export function Intro() {
  return (
    <div className="intro-curtain" aria-hidden="true">
      <div className="intro-inner">
        <span className="font-display text-xl font-semibold tracking-tight">
          Ayush Anand<span className="text-accent">.</span>
        </span>
        <span className="intro-bar" />
      </div>
    </div>
  );
}
