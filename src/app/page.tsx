import { FeaturedProducts } from "@/components/featured-products";
import { Hero } from "@/components/hero";
import { getHomeData } from "@/lib/store";

export default async function Home() {
  const homeData = await getHomeData();

  return (
    <main>
      <Hero metrics={homeData.metrics} collections={homeData.collections} />
      <FeaturedProducts featured={homeData.featured} newest={homeData.newest} />
    </main>
  );
}