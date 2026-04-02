import { Catalog } from "@/components/catalog";
import { getCatalog } from "@/lib/store";

export default async function ProductsPage() {
  const initialCatalog = await getCatalog();

  return (
    <main>
      <Catalog initialCatalog={initialCatalog} />
    </main>
  );
}