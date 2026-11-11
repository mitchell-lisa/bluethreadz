import { getCart } from "@/lib/shopify/cart";

export const dynamic = "force-dynamic";

export async function GET() {
  const cart = await getCart();
  return Response.json({
    cart: cart
      ? { totalQuantity: cart.totalQuantity, checkoutUrl: cart.checkoutUrl, subtotal: cart.subtotal, currency: cart.currency }
      : null,
  });
}
