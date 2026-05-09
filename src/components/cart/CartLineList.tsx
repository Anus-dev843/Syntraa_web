"use client";

import { CatalogImage } from "@/components/ui/CatalogImage";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

type CartLineListProps = {
  className?: string;
  onNavigate?: () => void;
};

export function CartLineList({ className, onNavigate }: CartLineListProps) {
  const { lines, increment, decrement, removeItem } = useCart();

  if (!lines.length) {
    return (
      <p
        className={cn(
          "rounded-2xl border border-white/10 px-6 py-12 text-center text-sm text-luxury-muted",
          className,
        )}
      >
        Your ritual bag is empty.{" "}
        <Link
          href="/products"
          className="text-luxury-snow underline-offset-4 hover:underline"
          onClick={onNavigate}
        >
          Browse the catalog
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className={cn("flex flex-col gap-5", className)}>
      {lines.map((line) => (
        <li
          key={line.productId}
          className="flex gap-4 border-b border-white/[0.07] pb-5 last:border-0 last:pb-0"
        >
          <Link
            href={`/product/${line.productId}`}
            onClick={onNavigate}
            className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10"
          >
            <CatalogImage
              src={line.image}
              alt={line.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/product/${line.productId}`}
                onClick={onNavigate}
                className="min-w-0 font-display text-lg leading-snug tracking-tight text-luxury-snow hover:text-white"
              >
                {line.name}
              </Link>
              <button
                type="button"
                className="shrink-0 text-[10px] uppercase tracking-[0.28em] text-luxury-muted transition hover:text-luxury-snow"
                onClick={() => removeItem(line.productId)}
              >
                Remove
              </button>
            </div>
            <p className="text-sm tabular-nums text-luxury-muted">
              ${line.price}{" "}
              <span className="text-[10px] uppercase tracking-[0.2em]">
                each
              </span>
            </p>
            <div className="mt-auto flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] p-0.5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-luxury-snow transition hover:bg-white/10"
                  onClick={() => decrement(line.productId)}
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm tabular-nums text-luxury-snow">
                  {line.quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-luxury-snow transition hover:bg-white/10"
                  onClick={() => increment(line.productId)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
