import { business } from "@/lib/business";
import { brands, collections } from "@/lib/catalog";
import { SHOP_STORES } from "@/lib/stores";
import { safeShopIndex, storeCounts } from "@/lib/shopify/catalog";
import { HeaderClient, type Menu } from "./HeaderClient";

/** Server component: builds the menu data (from the catalog) and hands it to the client nav. */
export async function Header() {
  const index = await safeShopIndex();
  const counts = index ? storeCounts(index) : null;
  const menus: Menu[] = [
    {
      label: "Shop Team Stores",
      href: "/shop",
      viewAll: "All team stores",
      columns: [
        {
          title: "Organizations",
          links: SHOP_STORES.map((s) => ({
            label: s.name,
            href: `/shop/${s.handle}`,
            note: counts ? String(counts[s.handle] ?? 0) : s.status,
          })),
        },
      ],
    },
    {
      label: "Apparel Catalog",
      href: "/products",
      viewAll: "Browse the catalog",
      columns: [
        { title: "By category", links: collections.map((c) => ({ label: c.name, href: `/products/c/${c.slug}`, note: `${c.count}` })) },
        { title: "Top brands", links: brands.slice(0, 12).map((b) => ({ label: b.name, href: `/products/b/${b.slug}` })), footer: { label: "All 30+ brands →", href: "/products#brands" } },
        { title: "Branding options", links: business.methods.map((m) => ({ label: m.name, href: "/quote", note: m.bestFor })) },
      ],
    },
    {
      label: "Methods",
      href: "/quote",
      columns: [{ title: "How we decorate", links: business.methods.map((m) => ({ label: m.name, href: "/quote", note: m.bestFor })) }],
    },
    {
      label: "Who We Serve",
      href: "/quote",
      columns: [{ title: "Made for", links: business.audiences.map((a) => ({ label: a.name, href: "/quote", note: a.blurb })) }],
    },
    { label: "Featured", href: "/products" },
    { label: "FAQ", href: "/quote" },
    { label: "Contact", href: "#contact" },
  ];
  return <HeaderClient menus={menus} phone={business.phone} phoneDisplay={business.phoneDisplay} />;
}
