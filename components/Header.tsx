import { business } from "@/lib/business";
import { brands, collections } from "@/lib/catalog";
import { SHOP_STORES } from "@/lib/stores";
import { safeShopIndex, storeCounts } from "@/lib/shopify/catalog";
import { HeaderClient, type Menu } from "./HeaderClient";

/** Server component: builds the menu data and hands it to the client nav. */
export async function Header() {
  const index = await safeShopIndex();
  const counts = index ? storeCounts(index) : null;
  const menus: Menu[] = [
    {
      label: "Shop Team Stores",
      href: "/shop",
      viewAll: "All stores",
      columns: [
        {
          title: "Stores",
          links: SHOP_STORES.map((s) => ({
            label: s.name,
            href: `/shop/${s.handle}`,
            note: counts ? String(counts[s.handle] ?? 0) : undefined,
          })),
        },
      ],
    },
    {
      label: "Apparel Catalog",
      href: "/products",
      viewAll: "All styles",
      columns: [
        { title: "Category", links: collections.map((c) => ({ label: c.name, href: `/products/c/${c.slug}` })) },
        { title: "Brands", links: brands.slice(0, 12).map((b) => ({ label: b.name, href: `/products/b/${b.slug}` })) },
      ],
    },
    { label: "Quote", href: "/quote" },
    { label: "Contact", href: "#contact" },
  ];
  return <HeaderClient menus={menus} phone={business.phone} phoneDisplay={business.phoneDisplay} />;
}
