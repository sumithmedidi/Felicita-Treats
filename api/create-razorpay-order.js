// Vercel Serverless Function: Initialize Razorpay Order
// Generates official Razorpay order for online checkout

function json(res, status, body) {
  return res.status(status).json(body);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "Method not allowed" });

  try {
    const { amount, orderId, name, phone } = req.body || {};
    const numAmount = Number(amount) || 0;

    if (!orderId || numAmount <= 0) {
      return json(res, 400, { ok: false, error: "Invalid amount or orderId" });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_felicita_demo";
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If live/test secret is provided, create order via Razorpay REST API
    if (keySecret && !keyId.includes("demo")) {
      const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`
        },
        body: JSON.stringify({
          amount: Math.round(numAmount * 100), // in paise
          currency: "INR",
          receipt: orderId.slice(0, 40),
          notes: { customer_name: name || "", customer_phone: phone || "" }
        })
      });

      const rzpData = await rzpRes.json();
      if (!rzpRes.ok) {
        return json(res, 400, { ok: false, error: rzpData.error?.description || "Could not create Razorpay order" });
      }

      return json(res, 200, {
        ok: true,
        keyId,
        razorpayOrderId: rzpData.id,
        amount: numAmount,
        currency: "INR"
      });
    }

    // Default configuration (using UPI direct fallback / test key)
    return json(res, 200, {
      ok: true,
      keyId,
      razorpayOrderId: `order_${orderId}`,
      amount: numAmount,
      currency: "INR",
      isDemo: true
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return json(res, 500, { ok: false, error: "Razorpay server initialization error" });
  }
};

