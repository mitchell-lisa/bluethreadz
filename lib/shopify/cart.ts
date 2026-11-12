import { cookies } from "next/headers";
import { cleanAttributes, type LineAttribute } from "@/lib/personalization";
import { storefront } from "./client";
import type { CartLine, CartView } from "./types";

export type { CartLine, CartView };

const COOKIE = "bt_cart";

type Money = { amount: string; currencyCode: string };

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      attributes: { key: string; value: string }[];
      cost: { totalAmount: Money };
      merchandise: {
        title: string;
        image: { url: string; altText: string | null } | null;
        selectedOptions: { name: string; value: string }[];
        product: { title: string; handle: string };
      } | null;
    }[];
  };
};

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        attributes { key value }
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            title
            image { url altText }
            selectedOptions { name value }
            product { title handle }
          }
        }
      }
    }
  }
`;

/** Password-locked Online Store themes intercept checkout unless this channel is set. */
function withHeadlessChannel(url: string) {
  try {
    const next = new URL(url);
    next.searchParams.set("channel", "headless-storefronts");
    return next.toString();
  } catch {
    return url;
  }
}

function toView(cart: RawCart): CartView {
  return {
    id: cart.id,
    checkoutUrl: withHeadlessChannel(cart.checkoutUrl),
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount.amount,
    total: cart.cost.totalAmount.amount,
    currency: cart.cost.totalAmount.currencyCode || "USD",
    lines: cart.lines.nodes
      .filter((line) => line.merchandise)
      .map((line) => ({
        id: line.id,
        quantity: line.quantity,
        title: line.merchandise!.product.title,
        handle: line.merchandise!.product.handle,
        variantTitle: line.merchandise!.title,
        options: line.merchandise!.selectedOptions.filter((o) => o.name !== "Title"),
        attributes: (line.attributes ?? []).filter((attribute) => attribute.key && attribute.value),
        image: line.merchandise!.image?.url ?? null,
        imageAlt: line.merchandise!.image?.altText ?? null,
        lineTotal: line.cost.totalAmount.amount,
        currency: line.cost.totalAmount.currencyCode,
      })),
  };
}

async function cartById(id: string): Promise<CartView | null> {
  const data = await storefront<{ cart: RawCart | null }>(
    `query Cart($id: ID!) { cart(id: $id) { ...CartFields } } ${CART_FIELDS}`,
    { id },
  );
  return data.cart ? toView(data.cart) : null;
}

export async function readCartId() {
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  return value ? decodeURIComponent(value) : null;
}

export async function writeCartId(id: string) {
  const jar = await cookies();
  jar.set(COOKIE, encodeURIComponent(id), {
    httpOnly: true,
    secure: process.env.VERCEL === "1",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCartId() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getCart(): Promise<CartView | null> {
  const id = await readCartId();
  if (!id) return null;
  try {
    const cart = await cartById(id);
    if (!cart) await clearCartId();
    return cart;
  } catch {
    return null;
  }
}

function clampQty(quantity: number) {
  const n = Math.floor(Number(quantity));
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(99, n));
}

function lineInput(variantId: string, quantity: number, attributes?: LineAttribute[]) {
  const line: { merchandiseId: string; quantity: number; attributes?: LineAttribute[] } = {
    merchandiseId: variantId,
    quantity: clampQty(quantity),
  };
  const clean = cleanAttributes(attributes);
  if (clean.length) line.attributes = clean;
  return line;
}

export async function createCart(variantId: string, quantity: number, attributes?: LineAttribute[]) {
  const data = await storefront<{
    cartCreate: { cart: RawCart | null; userErrors: { message: string }[] };
  }>(
    `mutation CartCreate($input: CartInput!) {
      cartCreate(input: $input) { cart { ...CartFields } userErrors { message } }
    } ${CART_FIELDS}`,
    { input: { lines: [lineInput(variantId, quantity, attributes)] } },
  );
  const err = data.cartCreate.userErrors[0]?.message;
  if (err || !data.cartCreate.cart) throw new Error(err || "Could not create the cart.");
  return toView(data.cartCreate.cart);
}

export async function addLines(cartId: string, variantId: string, quantity: number, attributes?: LineAttribute[]) {
  const data = await storefront<{
    cartLinesAdd: { cart: RawCart | null; userErrors: { message: string }[] };
  }>(
    `mutation CartAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } }
    } ${CART_FIELDS}`,
    { cartId, lines: [lineInput(variantId, quantity, attributes)] },
  );
  const err = data.cartLinesAdd.userErrors[0]?.message;
  if (err || !data.cartLinesAdd.cart) throw new Error(err || "Could not add that item.");
  return toView(data.cartLinesAdd.cart);
}

export async function updateLines(cartId: string, lineId: string, quantity: number) {
  const data = await storefront<{
    cartLinesUpdate: { cart: RawCart | null; userErrors: { message: string }[] };
  }>(
    `mutation CartUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFields } userErrors { message } }
    } ${CART_FIELDS}`,
    { cartId, lines: [{ id: lineId, quantity: clampQty(quantity) }] },
  );
  const err = data.cartLinesUpdate.userErrors[0]?.message;
  if (err || !data.cartLinesUpdate.cart) throw new Error(err || "Could not update that item.");
  return toView(data.cartLinesUpdate.cart);
}

export async function removeLines(cartId: string, lineId: string) {
  const data = await storefront<{
    cartLinesRemove: { cart: RawCart | null; userErrors: { message: string }[] };
  }>(
    `mutation CartRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFields } userErrors { message } }
    } ${CART_FIELDS}`,
    { cartId, lineIds: [lineId] },
  );
  const err = data.cartLinesRemove.userErrors[0]?.message;
  if (err || !data.cartLinesRemove.cart) throw new Error(err || "Could not remove that item.");
  return toView(data.cartLinesRemove.cart);
}
