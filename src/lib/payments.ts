export type PaymentMethod = "CARD" | "PAYPAL" | "APPLE_PAY";

export type PaymentResult = {
  provider: string;
  providerReference: string;
  status: "SUCCEEDED" | "FAILED";
  amount: number;
  method: PaymentMethod;
  message?: string;
};

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

export async function processPayment(amount: number, method: string): Promise<PaymentResult> {
  const provider = process.env.STRIPE_SECRET_KEY ? "stripe-ready" : "demo-gateway";
  const shouldFail = method.toLowerCase().includes("4000") || method.toLowerCase().includes("decline");

  return {
    provider,
    providerReference: `${provider}-${Date.now()}`,
    status: shouldFail ? "FAILED" : "SUCCEEDED",
    amount,
    method: resolvePaymentMethodLabel(method),
    message: shouldFail ? "The demo payment was declined. Try a success method to continue." : "Payment approved.",
  };
}