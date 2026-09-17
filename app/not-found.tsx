import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="section-y">
      <Container size="narrow" className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="type-eyebrow text-accent-strong">Error 404</p>
        <h1 className="type-h1 mt-6 text-ink">This page has slipped off the shelf</h1>
        <p className="type-lead mt-6 max-w-lg text-muted">
          The design or page you are looking for may have moved or is no longer in the catalogue.
        </p>
        <div className="mt-10 flex flex-col gap-3 xs:flex-row">
          <Button href="/products">Browse catalogue</Button>
          <Button href="/" variant="secondary">
            Back to home
          </Button>
        </div>
      </Container>
    </section>
  );
}
