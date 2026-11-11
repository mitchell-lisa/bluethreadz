export type ShopCard = {
  id: string;
  handle: string;
  slug: string;
  title: string;
  vendor: string;
  productType: string;
  image: string | null;
  imageAlt: string | null;
  minPrice: string;
  maxPrice: string;
  currency: string;
  available: boolean;
};

export type ShopVariant = {
  id: string;
  title: string;
  available: boolean;
  price: string;
  currency: string;
  options: { name: string; value: string }[];
  image: string | null;
  imageAlt: string | null;
};

export type ShopProduct = {
  id: string;
  handle: string;
  slug: string;
  title: string;
  vendor: string;
  productType: string;
  description: string;
  descriptionHtml: string;
  available: boolean;
  images: { url: string; alt: string | null }[];
  options: { name: string; values: string[] }[];
  variants: ShopVariant[];
  minPrice: string;
  maxPrice: string;
  currency: string;
  storeHandle: string | null;
  storeName: string | null;
};

export type ShopIndex = {
  cards: ShopCard[];
  bySlug: Record<string, string>;
  byStore: Record<string, string[]>;
  custom: string[];
};

export type CartLine = {
  id: string;
  quantity: number;
  title: string;
  handle: string;
  variantTitle: string;
  options: { name: string; value: string }[];
  image: string | null;
  imageAlt: string | null;
  lineTotal: string;
  currency: string;
};

export type CartView = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: string;
  total: string;
  currency: string;
  lines: CartLine[];
};
