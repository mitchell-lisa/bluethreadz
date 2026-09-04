import { business } from "@/lib/business";
import { brands, collections } from "@/lib/catalog";
import { HeaderClient, type Menu } from "./HeaderClient";

/** Server component: builds the menu data (from the catalog) and hands it to the client nav. */
export function Header() {
  const menus: Menu[] = [
    {
      label: "Products",
      href: "/products",
      columns: [
        { title: "By category", links: collections.map((c) => ({ label: c.name, href: `/products/c/${c.slug}`, note: `${c.count}` })) },
        { title: "Top brands", links: brands.slice(0, 12).map((b) => ({ label: b.name, href: `/products/b/${b.slug}` })), footer: { label: "All 30+ brands →", href: "/products#brands" } },
        { title: "Branding options", links: business.methods.map((m) => ({ label: m.name, href: "/#methods", note: m.bestFor })) },
      ],
    },
    {
      label: "Methods",
      href: "/#methods",
      columns: [{ title: "How we decorate", links: business.methods.map((m) => ({ label: m.name, href: "/#methods", note: m.bestFor })) }],
    },
    {
      label: "Who We Serve",
      href: "/#serve",
      columns: [{ title: "Made for", links: business.audiences.map((a) => ({ label: a.name, href: "/#serve", note: a.blurb })) }],
    },
    { label: "Featured", href: "/#work" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "#contact" },
  ];
  return <HeaderClient menus={menus} phone={business.phone} phoneDisplay={business.phoneDisplay} />;
}
