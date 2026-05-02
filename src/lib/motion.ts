/** Premium motion curve — calm deceleration. */
export const easeLuxury = [0.16, 1, 0.3, 1] as const;

export const transition = {
  page: { duration: 0.48, ease: easeLuxury },
  section: { duration: 0.82, ease: easeLuxury },
  card: { duration: 0.7, ease: easeLuxury },
} as const;

export const stagger = {
  product: 0.09,
  category: 0.078,
  testimonial: 0.068,
} as const;

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.product,
      delayChildren: 0.07,
    },
  },
} as const;

export const staggerContainerCategory = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.category,
      delayChildren: 0.055,
    },
  },
} as const;

export const staggerContainerTestimonial = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger.testimonial,
      delayChildren: 0.045,
    },
  },
} as const;

export const staggerItem = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: transition.card.duration,
      ease: transition.card.ease,
    },
  },
} as const;
