// Vercel Serverless Function: Instagram webhook.
// Meta sends customer messages here. When a customer sends an order ID such as FT-123456,
// this function retrieves the order and sends the order details back through Instagram.

function json(res, status, body) {
  return res.status(status).json(body);
}

async function getOrder(orderId) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const response = await fetch(`${url}/get/${encodeURIComponent(`felicita:order:${orderId}`)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data.result ? JSON.parse(data.result) : null;
}

async function sendInstagramMessage(recipientId, text) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;
  const apiVersion = process.env.INSTAGRAM_API_VERSION || "v23.0";

  if (!token || !igUserId) throw new Error("Instagram API credentials are missing");

  const response = await fetch(`https://graph.instagram.com/${apiVersion}/${igUserId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text }
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(data));
  return data;
}

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return json(res, 403, { error: "Webhook verification failed" });
  }

  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = req.body || {};
    const events = [];

    for (const entry of body.entry || []) {
      for (const messaging of entry.messaging || []) {
        const senderId = messaging.sender?.id;
        const text = messaging.message?.text?.trim();
        if (!senderId || !text) continue;

        const match = text.match(/\bFT-\d{6}\b/i);
        if (!match) continue;

        const orderId = match[0].toUpperCase();
        const order = await getOrder(orderId);
        if (!order) {
          await sendInstagramMessage(senderId, `I couldn't find ${orderId}. Please check the Order ID and send it again.`);
          continue;
        }

        const confirmation = [
          "🍰 FELICITA TREATS",
          "━━━━━━━━━━━━━━━━━━",
          "🆕 ORDER RECEIVED",
          `Order ID: ${order.orderId}`,
          "",
          "👤 CUSTOMER",
          `Name: ${order.name}`,
          `Phone: ${order.phone}`,
          "",
          "🛒 ITEMS",
          ...(order.items || []).map(item => `${item.quantity} × ${item.name} (${item.variant}) — ₹${(item.price * item.quantity).toLocaleString("en-IN")}`),
          "",
          `💰 TOTAL: ₹${Number(order.total).toLocaleString("en-IN")}`,
          "",
          "Thank you! Your order has been received. We will contact you shortly."
        ].join("\n");

        await sendInstagramMessage(senderId, confirmation);
        events.push({ orderId, senderId });
      }
    }

    return json(res, 200, { ok: true, processed: events.length });
  } catch (error) {
    console.error(error);
    // Always acknowledge Meta's webhook quickly enough to avoid unnecessary retries.
    return json(res, 200, { ok: false });
  }
};
