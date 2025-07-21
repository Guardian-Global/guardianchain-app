// Placeholder stripe handler (client-side logic may redirect)
export async function createStripeCheckoutSession(capsuleId: string) {
  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ capsuleId }),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  }
}