import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { SparkleIcon } from "@/components/ui/Icons";

export default function ProductNotFound() {
  return (
    <div className="section-y border-b border-line bg-canvas">
      <Container size="narrow">
        <EmptyState
          icon={<SparkleIcon size={32} />}
          title="Saree Design Not Found"
          description="The product design code or page you requested may have been archived or is temporarily unavailable in our catalogue."
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/products" size="lg">
                Continue Shopping
              </Button>
              <Button href="/collections" variant="secondary" size="lg">
                View Collections
              </Button>
            </div>
          }
        />
      </Container>
    </div>
  );
}
