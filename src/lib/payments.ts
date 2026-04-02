export type PaymentMethod = "CARD" | "PAYPAL" | "APPLE_PAY";

export function resolvePaymentMethodLabel(method: string): PaymentMethod {
  switch (method) {
    case "PayPal":
      return "PAYPAL";
    case "Apple Pay":
      return "APPLE_PAY";
    default:
      return "CARD";
  }
}

export async function processPayment(amount: number, method: string) {
  const provider = process.env.STRIPE_SECRET_KEY ? "stripe-ready" : "demo-gateway";

  return {
    provider,
    providerReference: `${provider}-${Date.now()}`,
    status: "SUCCEEDED" as const,
    amount,
    method: resolvePaymentMethodLabel(method),
  };
}