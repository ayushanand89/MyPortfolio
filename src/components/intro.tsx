/**
 * First-visit curtain. Pure CSS (see `.intro-*` in globals.css), so it plays
 * before hydration: a 00→100 counter and rule run while the name rises out of
 * its clip edge, then the sheet lifts away with its bottom edge rounding -
 * straight into the hero, whose entrance is held by `--hero-delay` to land as
 * the curtain clears.
 *
 * Shown only when the pre-paint script in layout.tsx sets `html.intro-play`
 * (first homepage load of a browser session, motion allowed); otherwise it's
 * `display: none` and costs nothing.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-sheet">
        <span className="intro-name display">
          <span>
            Ayush Anand<span className="text-signal">.</span>
          </span>
        </span>
        <span className="intro-bar" />
        <span className="intro-count" />
        <span className="intro-role label text-[#9d978b]">
          Full-stack developer · Delhi
        </span>
      </div>
    </div>
  );
}
