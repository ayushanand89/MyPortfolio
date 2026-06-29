import Link from "next/link";
import { Container } from "@/components/primitives";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center">
      <Container>
        <p className="eyebrow">Error 404</p>
        <h1 className="display mt-5 text-5xl sm:text-7xl">
          Page not found.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          The page you were looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="link-underline mt-8 inline-block text-foreground"
        >
          ← Back home
        </Link>
      </Container>
    </main>
  );
}
