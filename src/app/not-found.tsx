import { ButtonLink, Container, Lines } from "@/components/primitives";

export default function NotFound() {
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
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
          <p className="max-w-md text-muted">
            The page you were looking for doesn&apos;t exist or has moved.
          </p>
          <ButtonLink href="/">Back home</ButtonLink>
        </div>
      </Container>
    </main>
  );
}
