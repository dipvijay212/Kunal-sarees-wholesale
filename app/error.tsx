"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { SparkleIcon } from "@/components/ui/Icons";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    // Replace with an error reporting service when one is configured.
    console.error(error);
  }, [error]);

  return (
    <section className="section-y">
      <div className="container-page">
        <EmptyState
          icon={<SparkleIcon size={26} />}
          title="Something went wrong"
          description="This page could not be loaded. Please try again, or return to the catalogue."
          action={
            <>
              <Button onClick={() => retry()}>Try again</Button>
              <Button href="/products" variant="secondary">
                Browse catalogue
              </Button>
            </>
          }
        />
      </div>
    </section>
  );
}
