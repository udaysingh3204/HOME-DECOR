import Link from "next/link";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; status?: string; message?: string }>;
}) {
  const { order, status, message } = await searchParams;
  const orderId = order ?? "AH-ORDER";
  const normalizedStatus = status === "failed" ? "failed" : "succeeded";
  const heading = normalizedStatus === "failed" ? "Payment needs one more try before the order can move forward." : "Your home refresh is officially on its way.";
  const copy = normalizedStatus === "failed"
    ? message ?? `We saved the checkout attempt for ${orderId}, but the demo gateway marked the payment as declined. Your cart stays intact so you can try again immediately.`
    : `Your order reference is ${orderId}. We stored it in the account area so the customer journey ends with a useful confirmation instead of a dead screen.`;

  return (
    <main className="container py-12">
      <section className="glass-card mx-auto max-w-3xl rounded-[36px] p-8 text-center sm:p-12">
        <p className="pill">{normalizedStatus === "failed" ? "Payment update" : "Order confirmed"}</p>
        <h1 className="section-title mx-auto mt-5 max-w-[12ch]">{heading}</h1>
        <p className="section-copy mx-auto mt-5">{copy}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {normalizedStatus === "failed" ? (
            <Link href="/checkout" className="button-primary">Retry checkout</Link>
          ) : (
            <Link href="/products" className="button-primary">Keep browsing</Link>
          )}
          <Link href="/login" className="button-secondary">View account</Link>
        </div>
      </section>
    </main>
  );
}