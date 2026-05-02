import type { CategoryMeta } from "@/lib/types";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { MotionStagger } from "@/components/ui/MotionStagger";
import { CATEGORY_SLUGS } from "@/lib/constants";

type CategoryShowcaseProps = {
  categories: CategoryMeta[];
};

function orderCategories(list: CategoryMeta[]): CategoryMeta[] {
  const map = new Map(list.map((c) => [c.slug, c]));
  return CATEGORY_SLUGS.map((slug) => map.get(slug)).filter(
    (c): c is CategoryMeta => Boolean(c),
  );
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const ordered = orderCategories(categories);

  return (
    <section
      id="collections"
      className="bg-black pb-[var(--section-y-lg)] pt-[var(--section-y)]"
    >
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)]">
        <AnimatedSection className="max-w-2xl">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-luxury-muted">
            Categories
          </p>
          <h2 className="mt-6 font-display text-4xl text-luxury-snow md:text-[3.65rem]">
            Five lines of ritual.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-luxury-muted md:text-xl">
            Shampoo, Facewash, Serums, Bodycare, and Haircare — each capsule
            composed in monochrome calm. Hover to reveal depth.
          </p>
        </AnimatedSection>

        <MotionStagger
          variant="category"
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8 xl:grid-cols-5"
        >
          {ordered.map((cat, index) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              index={index}
              stagger
            />
          ))}
        </MotionStagger>
      </div>
    </section>
  );
}
