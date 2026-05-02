"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const STORAGE_KEY = "syntraa-cart";

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity?: number;
  }) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function parseLines(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    const out: CartLine[] = [];
    for (const row of data) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      if (
        typeof r.productId === "string" &&
        typeof r.name === "string" &&
        typeof r.price === "number" &&
        typeof r.image === "string" &&
        typeof r.quantity === "number" &&
        r.quantity > 0
      ) {
        out.push({
          productId: r.productId,
          name: r.name,
          price: r.price,
          image: r.image,
          quantity: Math.min(99, Math.floor(r.quantity)),
        });
      }
    }
    return out;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setLines(parseLines(localStorage.getItem(STORAGE_KEY)));
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (item: {
      productId: string;
      name: string;
      price: number;
      image: string;
      quantity?: number;
    }) => {
      const q = Math.min(99, Math.max(1, Math.floor(item.quantity ?? 1)));
      setLines((prev) => {
        const i = prev.findIndex((l) => l.productId === item.productId);
        if (i >= 0) {
          const next = [...prev];
          const merged = Math.min(99, next[i].quantity + q);
          next[i] = { ...next[i], quantity: merged };
          return next;
        }
        return [
          ...prev,
          {
            productId: item.productId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: q,
          },
        ];
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const q = Math.floor(quantity);
    if (q < 1) {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
      return;
    }
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId
          ? { ...l, quantity: Math.min(99, q) }
          : l,
      ),
    );
  }, []);

  const increment = useCallback((productId: string) => {
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId
          ? { ...l, quantity: Math.min(99, l.quantity + 1) }
          : l,
      ),
    );
  }, []);

  const decrement = useCallback((productId: string) => {
    setLines((prev) =>
      prev
        .map((l) =>
          l.productId === productId
            ? { ...l, quantity: l.quantity - 1 }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const itemCount = useMemo(
    () => lines.reduce((acc, l) => acc + l.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(
    () => lines.reduce((acc, l) => acc + l.price * l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      itemCount,
      subtotal,
      hydrated,
    }),
    [
      lines,
      isOpen,
      openCart,
      closeCart,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      itemCount,
      subtotal,
      hydrated,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
