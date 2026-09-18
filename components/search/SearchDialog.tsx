"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useUI } from "@/components/providers/UIProvider";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { searchCatalogue } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const POPULAR_SEARCHES = ["Banarasi", "Kanjivaram", "Organza", "Bridal", "Georgette", "Linen"];

const rowLinkClass =
  "-mx-2 flex min-h-14 items-center gap-4 rounded-xs px-2 py-2 transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted";

/** Catalogue search opened from the header. Results update as the user types. */
export function SearchDialog() {
  const { isSearchOpen, closeSearch } = useUI();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const trimmed = query.trim();
  const results = useMemo(() => searchCatalogue(trimmed), [trimmed]);
  const resultsHref = `/products?q=${encodeURIComponent(trimmed)}`;
  const hasResults = results.products.length > 0 || results.collections.length > 0 || results.categories.length > 0;

  // The dialog focuses its first control when opened; move focus to the input instead.
  useEffect(() => {
    if (isSearchOpen) inputRef.current?.focus();
  }, [isSearchOpen]);

  const close = () => {
    closeSearch();
    setQuery("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmed) return;
    router.push(resultsHref);
    close();
  };

  return (
    <Modal
      open={isSearchOpen}
      onClose={close}
      title="Search the catalogue"
      hideHeader
      size="lg"
      placement="top"
      padded={false}
    >
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex h-16 items-center gap-3 border-b border-line pr-14 pl-4 focus-within:border-accent sm:pl-6"
      >
        <SearchIcon size={20} className="shrink-0 text-muted" />
        <label htmlFor="site-search" className="sr-only">
          Search sarees, fabrics or design codes
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sarees, fabrics or codes"
          autoComplete="off"
          enterKeyHint="search"
          maxLength={80}
          className="h-full min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-subtle focus:outline-none"
        />
      </form>

      <div className="px-4 py-5 sm:px-6">
        <p className="sr-only" aria-live="polite">
          {trimmed ? `${results.totalProducts} designs found` : ""}
        </p>

        {!trimmed ? (
          <div>
            <h3 className="type-eyebrow text-subtle">Popular searches</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button key={term} type="button" className="chip" onClick={() => setQuery(term)}>
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : hasResults ? (
          <div className="flex flex-col gap-6">
            {results.collections.length > 0 ? (
              <section aria-labelledby="search-collections">
                <h3 id="search-collections" className="type-eyebrow text-subtle">
                  Collections
                </h3>
                <ul className="mt-2">
                  {results.collections.map((collection) => (
                    <li key={collection.slug}>
                      <Link href={`/collections/${collection.slug}`} onClick={close} className={rowLinkClass}>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-ink">{collection.name}</span>
                          <span className="block truncate text-xs text-muted">{collection.tagline}</span>
                        </span>
                        <ArrowRightIcon size={16} className="shrink-0 text-subtle" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.categories.length > 0 ? (
              <section aria-labelledby="search-categories">
                <h3 id="search-categories" className="type-eyebrow text-subtle">
                  Categories
                </h3>
                <ul className="mt-2">
                  {results.categories.map((category) => (
                    <li key={category.slug}>
                      <Link href={`/products?category=${category.slug}`} onClick={close} className={rowLinkClass}>
                        <span className="min-w-0 flex-1 truncate text-ink">{category.name}</span>
                        <ArrowRightIcon size={16} className="shrink-0 text-subtle" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.products.length > 0 ? (
              <section aria-labelledby="search-designs">
                <h3 id="search-designs" className="type-eyebrow text-subtle">
                  Designs
                </h3>
                <ul className="mt-2">
                  {results.products.map((product) => (
                    <li key={product.id}>
                      <Link href={`/products/${product.slug}`} onClick={close} className={rowLinkClass}>
                        <span className="media-frame relative block aspect-[3/4] w-10 shrink-0 rounded-xs">
                          {product.images[0] ? (
                            <RemoteImage src={product.images[0].url} alt="" fill sizes="40px" className="object-cover" />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-ink">{product.name}</span>
                          <span className="block truncate text-xs text-muted">
                            {product.productCode} · {product.fabric}
                          </span>
                        </span>
                        <span className="type-price shrink-0 text-sm text-ink">
                          {formatPrice(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {results.totalProducts > 0 ? (
              <Link href={resultsHref} onClick={close} className="btn btn--secondary btn--sm self-start">
                View all {results.totalProducts} {results.totalProducts === 1 ? "design" : "designs"}
                <ArrowRightIcon size={14} />
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-ink">No designs match “{trimmed}”.</p>
            <p className="mt-2 text-sm text-muted">Try a fabric, colour or design code such as KS-BNS-1004.</p>
            <Link href="/products" onClick={close} className="btn btn--link mt-5">
              Browse the full catalogue
            </Link>
          </div>
        )}
      </div>
    </Modal>
  );
}
