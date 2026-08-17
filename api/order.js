// Vercel Serverless Function: create and store a Felicita Treats order.
// Requires UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN for durable storage.

function json(res, status, body) {
  return res.status(status).json(body);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const { orderId, name, phone, items, total, message, createdAt } = req.body || {};
    if (!orderId || !name || !phone || !Array.isArray(items) || !items.length || typeof total !== "number") {
      return json(res, 400, { error: "Invalid order payload" });
    }

    const order = { orderId, name, phone, items, total, message, createdAt: createdAt || new Date().toISOString() };

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      const key = `felicita:order:${orderId}`;
      const response = await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(order))}/EX/86400`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Redis storage failed: ${response.status}`);
    }

    return json(res, 200, {
      ok: true,
      orderId,
      stored: Boolean(url && token),
      message: "Order created"
    });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "Could not create order" });
  }
};
