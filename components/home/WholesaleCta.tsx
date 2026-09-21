import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function WholesaleCta() {
  return (
    <section aria-labelledby="cta-heading" className="section-y border-t border-line bg-canvas">
      <Container>
        <div className="relative overflow-hidden rounded-xs bg-maroon-dark text-cream border border-gold/30 shadow-lift">
          <div className="grid lg:grid-cols-12 items-stretch min-h-[22rem]">
            {/* Left Column: Copy & Actions (Span 7) */}
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14 lg:col-span-7 z-10">
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-gold-light">
                Wholesale Enquiries
              </span>
              <h2
                id="cta-heading"
                className="font-serif text-3xl sm:text-4xl lg:text-[2.625rem] font-normal text-cream leading-tight mt-3"
              >
                Looking for the right sarees for your business?
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-cream/90 max-w-xl">
                Explore our latest wholesale collections or connect directly with Kunal Sarees for your bulk requirements.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  href="/collections"
                  size="lg"
                  className="bg-gold hover:bg-gold-light text-maroon-dark font-semibold shadow-sm tracking-[0.08em]"
                >
                  Explore Collections
                </Button>
                <WhatsAppButton
                  size="lg"
                  label="Chat on WhatsApp"
                  variant="ghost"
                  className="border border-gold/50 bg-white/10 text-cream hover:bg-gold hover:text-maroon-dark hover:border-gold font-semibold tracking-[0.08em] transition-all duration-300 shadow-sm"
                />
              </div>
            </div>

            {/* Right Column: Premium Saree Photograph (Span 5) */}
            <div className="relative min-h-[16rem] sm:min-h-[20rem] lg:min-h-full lg:col-span-5 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85"
                alt="Exquisite Indian silk saree with intricate zari border"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-maroon-dark via-maroon-dark/30 to-transparent lg:bg-linear-to-r lg:from-maroon-dark lg:via-maroon-dark/20 lg:to-transparent"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}


