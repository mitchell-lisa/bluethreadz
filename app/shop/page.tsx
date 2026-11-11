import type { Metadata } from "next";
import { Shell } from "@/components/Shell";
import { ShopTiles } from "@/components/ShopTiles";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop team stores | BlueThreadz",
  description: "Shop Aces Softball, Mountainside FC, RN Threadz, St. Teresa of Avila, and BlueThreadz custom apparel in one place.",
};

export default function ShopIndexPage() {
  return (
    <Shell title="Team stores">
      <ShopTiles bare />
    </Shell>
  );
}
