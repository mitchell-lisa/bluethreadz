import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { ShopByOrg } from "@/components/ShopByOrg";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop team stores | BlueThreadz",
  description: "Shop Aces Softball, Mountainside FC, RN Threadz, St. Teresa of Avila, and BlueThreadz custom apparel in one place.",
};

export default function ShopIndexPage() {
  return (
    <Shell
      eyebrow="One community, one checkout"
      title="Shop team stores"
      intro="Pick an organization. Custom apparel that is not in a team shop is listed on its own."
      crumbs={[{ href: "/", label: "Home" }, { href: "/shop", label: "Team stores" }]}
    >
      <ShopByOrg heading={false} />
    </Shell>
  );
}
