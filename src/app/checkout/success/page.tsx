import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const orderId = order ?? "AH-ORDER";

  return (
    <main className="container py-12">
      <section className="glass-card mx-auto max-w-3xl rounded-[36px] p-8 text-center sm:p-12">
        <p className="pill">Order confirmed</p>
        <h1 className="section-title mx-auto mt-5 max-w-[10ch]">Your home refresh is officially on its way.</h1>
        <p className="section-copy mx-auto mt-5">Your order reference is {orderId}. We stored it in the account area so the customer journey ends with a useful confirmation instead of a dead screen.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="button-primary">Keep browsing</Link>
          <Link href="/login" className="button-secondary">View account</Link>
        </div>
      </section>
    </main>
  );
}