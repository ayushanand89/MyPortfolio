# Project media

Everything here is referenced from `src/content/projects.ts`.

## Per live project (`quit-gambling/`, `barethreads/`)

| File | What | Used by |
| --- | --- | --- |
| `desktop.mp4` + `desktop.jpg` | 1280×800 H.264 loop of the live site scrolling (poster = first frame) | Work "screening room", case-study live embed facade, next-case card |
| `mobile.mp4` + `mobile.jpg` | 480×1038 loop of the mobile site | Work phone frame, case-study phone row |
| `reel.mp4` | 800×500, ~7s cut of the desktop loop | Hero "now showing" screen (loads after idle) |
| `cover.jpg`, other `*.jpg` | 2400px-wide (desktop) / 1080px (mobile, `m-*`) stills | Case-study figures, OG/fallbacks |

Screens that need a login (`dashboard.jpg`, `admin.jpg`) and the client
chatbot (`enterprise-ai-chatbot/`) can't be re-captured from the public sites;
they're marked `narrow` in the content so they're shown at a reading width.

## Re-recording

The captures were made with a headless-Chrome (CDP) script: it walks the page
once so lazy images and reveals settle, then steps the scroll position frame
by frame along an eased timeline with dwell stops (smooth regardless of
capture speed), and encodes with ffmpeg:

```
-c:v libx264 -preset veryslow -tune animation -crf 27 -pix_fmt yuv420p -movflags +faststart -an
```

Keep each desktop loop ≲ 2MB and mobile ≲ 1MB. End the timeline by scrolling
back to the top so the loop is seamless. When a file's content changes, give
it a **new name** (e.g. `answer-v2.jpg`) and update `projects.ts` — the image
optimizer and CDN caches are keyed by URL, so an overwritten file can keep
serving the old picture.
