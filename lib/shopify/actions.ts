"use server";

import { cleanAttributes, type LineAttribute } from "@/lib/personalization";
import { addLines, clearCartId, createCart, getCart, readCartId, removeLines, updateLines, writeCartId } from "./cart";
import type { CartView } from "./types";

export type CartResult = { cart: CartView } | { error: string };

function validVariant(id: string) {
  return id.startsWith("gid://shopify/ProductVariant/");
}

export async function fetchCart() {
  return getCart();
}

export async function addToCart(
  variantId: string,
  quantity: number,
  attributes?: LineAttribute[],
): Promise<CartResult> {
  if (!validVariant(variantId)) return { error: "Choose an available option first." };
  const lineAttributes = cleanAttributes(attributes);
  try {
    const existing = await readCartId();
    if (!existing) {
      const cart = await createCart(variantId, quantity, lineAttributes);
      await writeCartId(cart.id);
      return { cart };
    }
    try {
      const cart = await addLines(existing, variantId, quantity, lineAttributes);
      return { cart };
    } catch {
      await clearCartId();
      const cart = await createCart(variantId, quantity, lineAttributes);
      await writeCartId(cart.id);
      return { cart };
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not add that item to the cart." };
  }
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartResult> {
  const id = await readCartId();
  if (!id) return { error: "Your cart is empty." };
  try {
    const cart = await updateLines(id, lineId, quantity);
    return { cart };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not update the cart." };
  }
}

export async function removeCartLine(lineId: string): Promise<CartResult> {
  const id = await readCartId();
  if (!id) return { error: "Your cart is empty." };
  try {
    const cart = await removeLines(id, lineId);
    return { cart };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not remove that item." };
  }
}
