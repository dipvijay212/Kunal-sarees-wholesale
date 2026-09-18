import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CollectionCard } from "@/components/collection/CollectionCard";
import { DialogDemo, QuantityDemo } from "@/components/design-system/InteractiveDemos";
import { Logo } from "@/components/layout/Logo";
import { PageHeader } from "@/components/layout/PageHeader";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, Input, Select, Textarea, fieldAria } from "@/components/ui/FormField";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowRightIcon, BagIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";
import { LoadingState } from "@/components/ui/LoadingState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { getCollections, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false, follow: false },
};

const palette = [
  { group: "Deep Maroon & Wine (10%)", tokens: ["maroon-900", "maroon-800", "maroon-700", "maroon-600"] },
  { group: "Warm Gold & Zari (5%)", tokens: ["gold-600", "gold-500", "gold-400", "gold-300"] },
  { group: "Cream & Ivory Canvas (70%)", tokens: ["cream-100", "cream-200", "cream-300", "white"] },
  { group: "Dark Ink & Text", tokens: ["ink-950", "ink-800", "ink-700", "muted", "subtle"] },
];

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-line py-14">
      <Container>
        <h2 className="type-eyebrow mb-8 text-accent-strong">{title}</h2>
        {children}
      </Container>
    </section>
  );
}

export default function DesignSystemPage() {
  const [product] = getProducts();
  const [collection] = getCollections();

  return (
    <>
      <PageHeader
        eyebrow="Internal reference"
        title="Kunal Sarees design system"
        description="Tokens, typography and components used across the site. Edit tokens in styles/tokens.css."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Design system" }]}
      />

      <Block title="Brand">
        <div className="flex flex-wrap items-center gap-10">
          <Logo asLink={false} markClassName="size-14" wordmarkClassName="text-xl" showTagline />
          <Logo asLink={false} markClassName="size-9" wordmarkClassName="text-base" />
          <Logo asLink={false} markClassName="size-12" showWordmark={false} />
        </div>
      </Block>

      <Block title="Colour tokens">
        <div className="flex flex-col gap-10">
          {palette.map((row) => (
            <div key={row.group}>
              <p className="mb-4 text-sm font-semibold text-ink">{row.group}</p>
              <ul className="grid grid-cols-2 gap-4 xs:grid-cols-3 lg:grid-cols-6">
                {row.tokens.map((token) => (
                  <li key={token} className="flex min-w-0 flex-col gap-2">
                    <span
                      className="block h-16 rounded-xs border border-line-strong"
                      style={{ backgroundColor: `var(--ks-${token})` }}
                    />
                    <code className="truncate text-xs text-muted">--ks-{token}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Typography">
        <div className="flex flex-col gap-6">
          <p className="type-display">Display</p>
          <p className="type-h1">Heading one</p>
          <p className="type-h2">Heading two</p>
          <p className="type-h3">Heading three</p>
          <p className="type-h4">Heading four</p>
          <p className="type-eyebrow text-accent-strong">Eyebrow label</p>
          <p className="type-lead max-w-2xl text-muted">
            Lead paragraph — Manrope for interface and body text, paired with Cormorant Garamond for display type.
          </p>
          <p className="type-body max-w-2xl text-muted">
            Body text is set at 16px with generous line height for comfortable reading on phones.
          </p>
          <p className="type-price text-2xl">₹1,16,400</p>
        </div>
      </Block>

      <Block title="Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link" trailingIcon={<ArrowRightIcon size={16} />}>
            Text link
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg" leadingIcon={<BagIcon size={18} />}>
            Large with icon
          </Button>
        </div>
      </Block>

      <Block title="IconButton">
        <div className="flex flex-wrap items-center gap-3">
          <IconButton label="Search" icon={<SearchIcon size={20} />} />
          <IconButton label="Order list, 3 designs" icon={<BagIcon size={21} />} badge={3} />
          <IconButton label="Menu" icon={<MenuIcon size={22} />} variant="outline" />
          <IconButton label="Save design" icon={<HeartIcon size={18} />} variant="solid" />
          <IconButton label="Save design" icon={<HeartIcon size={18} />} variant="overlay" size="sm" />
          <IconButton label="Large" icon={<SearchIcon size={22} />} variant="outline" size="lg" />
        </div>
      </Block>

      <Block title="WhatsAppButton">
        <div className="flex flex-wrap items-center gap-3">
          <WhatsAppButton />
          <WhatsAppButton variant="secondary" size="sm" label="WhatsApp" />
          <WhatsAppButton variant="icon" label="Chat on WhatsApp" />
          <WhatsAppButton variant="link" label="Chat on WhatsApp" />
        </div>
        <div className="mt-6">
          <SocialLinks />
        </div>
      </Block>

      <Block title="Badge">
        <div className="flex flex-wrap gap-3">
          <Badge variant="solid">Bestseller</Badge>
          <Badge variant="neutral">New</Badge>
          <Badge variant="accent">New arrival</Badge>
          <Badge variant="outline">Organza</Badge>
        </div>
      </Block>

      <Block title="SectionHeading">
        <SectionHeading
          eyebrow="Eyebrow"
          title="Section heading with an action"
          description="Optional supporting description that sits below the heading."
          action={{ label: "View all", href: "/products" }}
        />
      </Block>

      <Block title="Cards">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card card__body">
            <p className="type-h4">Default card</p>
            <p className="mt-2 text-sm text-muted">Charcoal surface with a hairline border.</p>
          </div>
          <div className="card card--interactive card__body">
            <p className="type-h4">Interactive card</p>
            <p className="mt-2 text-sm text-muted">Border brightens on hover.</p>
          </div>
          <div className="card card--raised card__body">
            <p className="type-h4">Raised card</p>
            <p className="mt-2 text-sm text-muted">For nested or emphasised panels.</p>
          </div>
        </div>
        <div className="mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:gap-6">
          {product ? <ProductCard product={product} /> : null}
          {collection ? <CollectionCard collection={collection} /> : null}
        </div>
      </Block>

      <Block title="Forms">
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <Field id="ds-name" label="Text input" required hint="Helper text">
            <Input id="ds-name" placeholder="Placeholder" {...fieldAria("ds-name", { hint: "Helper text" })} />
          </Field>
          <Field id="ds-error" label="Invalid input" error="Explain how to fix the value.">
            <Input
              id="ds-error"
              defaultValue="Wrong value"
              {...fieldAria("ds-error", { error: "Explain how to fix the value." })}
            />
          </Field>
          <Field id="ds-select" label="Select">
            <Select id="ds-select" defaultValue="silk">
              <option value="silk">Banarasi Silk</option>
              <option value="organza">Organza</option>
            </Select>
          </Field>
          <Field id="ds-disabled" label="Disabled">
            <Input id="ds-disabled" disabled defaultValue="Not editable" />
          </Field>
          <Field id="ds-textarea" label="Textarea" className="sm:col-span-2">
            <Textarea id="ds-textarea" rows={3} />
          </Field>
          <label className="flex items-center gap-3 text-sm text-ink">
            <input type="checkbox" className="checkbox" defaultChecked /> Checkbox
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="chip" aria-pressed="true">
              Selected chip
            </button>
            <button type="button" className="chip" aria-pressed="false">
              Chip
            </button>
          </div>
        </div>
      </Block>

      <Block title="Quantity selector">
        <QuantityDemo />
      </Block>

      <Block title="Modal & drawer">
        <DialogDemo />
      </Block>

      <Block title="Empty & loading states">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="card">
            <EmptyState
              icon={<BagIcon size={26} />}
              title="Nothing here yet"
              titleAs="h3"
              description="Empty states explain what belongs here and offer a next step."
              action={<Button href="/products">Browse catalogue</Button>}
            />
          </div>
          <div className="card card__body flex flex-col gap-10">
            <LoadingState label="Loading" />
            <LoadingState variant="lines" count={2} />
          </div>
        </div>
        <LoadingState variant="products" count={4} className="mt-10" />
      </Block>
    </>
  );
}
