import { ArrowUpRight } from "lucide-react";
import { flagshipProjects } from "@/content/projects";
import { ButtonLink, Container, Lines } from "@/components/primitives";
import { TransitionLink } from "@/components/transition-link";

export default function NotFound() {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <main
      id="main"
      data-surface="ink"
      className="flex min-h-svh items-end pb-16 pt-32 sm:pb-24"
    >
      <Container>
        <p className="label text-muted">
          <span className="text-accent">(404)</span>&nbsp;&nbsp;Page not found
        </p>
        <Lines
          as="h1"
          className="display mt-8 text-[clamp(4rem,19vw,19rem)]"
          lines={["404", <em key="e">Lost the plot.</em>]}
        />
        <div className="mt-10 grid gap-10 border-t border-line pt-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-md text-muted">
              The page you were looking for doesn&apos;t exist or has moved. The
              work is still here, though.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ButtonLink href="/">Back home</ButtonLink>
              <span className="data hidden text-muted lg:inline">
                or press <kbd className="text-fg">⌘K</kbd> / <kbd className="text-fg">Ctrl K</kbd> to find anything
              </span>
            </div>
          </div>
          <ul className="lg:col-span-6 lg:col-start-7">
            {flagshipProjects.map((p, i) => (
              <li key={p.slug} className="row-wipe group border-b border-line first:border-t">
                <TransitionLink
                  href={`/work/${p.slug}`}
                  className="flex items-baseline justify-between gap-4 py-4 transition-colors duration-500 hover-device:group-hover:text-bg"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="data text-muted transition-colors duration-500 hover-device:group-hover:text-bg/60">
                      {pad(i + 1)}
                    </span>
                    <span className="caps text-[1.15rem]">{p.title}</span>
                  </span>
                  <ArrowUpRight aria-hidden className="h-4 w-4 shrink-0" />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}
