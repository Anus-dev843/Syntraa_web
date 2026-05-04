"use client";

import "./ProductCarousel.css";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { Autoplay, EffectCoverflow, Navigation, Pagination, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type ProductCarouselProps = {
  products: Product[];
  className?: string;
  /** Default true */
  autoplay?: boolean;
};

const easeLux = [0.42, 0, 0.58, 1] as const;

export function ProductCarousel({
  products,
  className,
  autoplay = true,
}: ProductCarouselProps) {
  const reduceMotion = useReducedMotion();

  const slides = useMemo(() => products.filter((p) => p.image), [products]);

  if (!slides.length) {
    return null;
  }

  const useLoop = slides.length >= 5;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: easeLux }}
      className={cn(
        "syntraa-product-carousel border-y border-white/[0.08] bg-[linear-gradient(180deg,#030303_0%,#0a0a0a_45%,#030303_100%)] py-[var(--section-y-lg)]",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl px-[var(--gutter-x)]">
        <header className="mb-12 text-center md:mb-16">
          <p className="text-[0.65rem] uppercase tracking-[0.38em] text-luxury-muted">
            Curated motion
          </p>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-luxury-snow md:text-5xl">
            Formulae in focus.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-luxury-muted md:text-base">
            Cinematic depth, parallax layers, and a centered hero slide — built for a luxury
            storefront.
          </p>
        </header>

        <div className="relative pb-14 md:pb-16">
          <Swiper
            modules={[EffectCoverflow, Navigation, Pagination, Parallax, Autoplay]}
            centeredSlides
            loop={useLoop}
            rewind={!useLoop && slides.length > 1}
            grabCursor
            speed={1200}
            parallax
            slidesPerView={1.1}
            spaceBetween={20}
            effect="coverflow"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 1.5,
              slideShadows: false,
            }}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={
              autoplay && !reduceMotion
                ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }
                : false
            }
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 24 },
              1024: { slidesPerView: 1.3, spaceBetween: 30 },
            }}
            className="!overflow-visible pb-12"
          >
            {slides.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <motion.div
                  whileHover={reduceMotion ? undefined : { scale: 1.015 }}
                  transition={{ duration: 0.45, ease: easeLux }}
                  className="mx-auto max-w-xl px-1"
                >
                  <Link href={`/product/${product.id}`} className="group block">
                    <div className="carousel-card-shell relative overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.06] via-[#0c0c0c] to-black shadow-[0_40px_100px_-50px_rgba(0,0,0,0.95)] ring-1 ring-white/[0.04] transition-[box-shadow] duration-500 ease-in-out group-hover:shadow-[0_48px_120px_-40px_rgba(255,255,255,0.12)] md:rounded-3xl">
                      <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[3/4]">
                        {/* Slower parallax layer */}
                        <div
                          className="absolute inset-0 scale-[1.12]"
                          data-swiper-parallax="-13%"
                          aria-hidden
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 90vw, 480px"
                            className="object-cover"
                            priority={false}
                          />
                        </div>
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15"
                          aria-hidden
                        />
                        {/* Copy moves slightly faster than image */}
                        <div
                          className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8"
                          data-swiper-parallax="-48"
                        >
                          <p className="text-[0.6rem] uppercase tracking-[0.32em] text-white/50">
                            {product.category}
                          </p>
                          <h3 className="mt-2 font-display text-2xl tracking-tight text-luxury-snow md:text-3xl">
                            {product.name}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-luxury-muted">
                            {product.shortDescription}
                          </p>
                          <p className="mt-5 font-display text-xl text-luxury-snow md:text-2xl">
                            {product.currency === "USD" ? "$" : `${product.currency} `}
                            {product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.section>
  );
}
