// Vercel Serverless Function: create and store a Felicita Treats order.
// Supports Upstash Redis REST, in-memory cache, and webhook notification.

function json(res, status, body) {
  return res.status(status).json(body);
}

function cleanString(val, maxLen = 200) {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen).replace(/[<>'"]/g, "");
}

// In-memory orders registry for fast serverless lifecycle recall
global.__felicitaOrders = global.__felicitaOrders || [];

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const body = req.body || {};
    const orderId = cleanString(body.orderId, 24);
    const name = cleanString(body.name, 100);
    const phone = String(body.phone || "").replace(/[^\d+()\-\s]/g, "").slice(0, 20);
    const address = cleanString(body.address, 300);
    const deliveryDate = cleanString(body.deliveryDate, 50);
    const deliveryTime = cleanString(body.deliveryTime, 50);
    const notes = cleanString(body.notes, 300);
    const paymentMethod = body.paymentMethod === "card" ? "card" : "upi";
    const paymentDetails = body.paymentDetails && typeof body.paymentDetails === "object" ? body.paymentDetails : {};
    const items = Array.isArray(body.items) ? body.items : [];
    const total = typeof body.total === "number" && body.total > 0 ? body.total : 0;
    const message = cleanString(body.message, 3000);
    const createdAt = body.createdAt || new Date().toISOString();
    const status = cleanString(body.status, 30) || "received";

    if (!orderId || !name || !phone || !items.length || !total) {
      return json(res, 400, {
        error: "Invalid order payload: orderId, name, phone, items and total are required"
      });
    }

    const order = {
      orderId,
      name,
      phone,
      address,
      deliveryDate,
      deliveryTime,
      notes,
      paymentMethod,
      paymentDetails: {
        methodName: cleanString(paymentDetails.methodName, 60) || (paymentMethod === "card" ? "Debit / Credit Card" : "UPI"),
        utr: cleanString(paymentDetails.utr, 40),
        gatewayTxnId: cleanString(paymentDetails.gatewayTxnId, 60),
        status: cleanString(paymentDetails.status, 40) || (paymentDetails.gatewayTxnId ? "Verified & Paid" : "Pending Verification")
      },
      items: items.map(item => ({
        name: cleanString(item.name, 100),
        variant: cleanString(item.variant, 50),
        price: Number(item.price) || 0,
        quantity: Math.max(1, Math.min(99, Number(item.quantity) || 1))
      })),
      total,
      message,
      createdAt,
      status // received | preparing | out_for_delivery | delivered | cancelled
    };

    // Store in global in-memory cache
    global.__felicitaOrders = global.__felicitaOrders.filter(o => o.orderId !== orderId);
    global.__felicitaOrders.unshift(order);
    if (global.__felicitaOrders.length > 500) global.__felicitaOrders.pop();

    // Store in Upstash Redis if configured
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      try {
        const key = `felicita:order:${orderId}`;
        await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(JSON.stringify(order))}/EX/2592000`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Also add to orders list
        await fetch(`${url}/lpush/felicita:orders:list/${encodeURIComponent(orderId)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (redisErr) {
        console.warn("Redis storage error:", redisErr);
      }
    }

    // Optional: Server-side WhatsApp or Webhook notification
    const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "new_order",
            orderId,
            name,
            phone,
            total,
            itemsCount: items.length,
            message: order.message,
            order
          })
        });
      } catch (webhookErr) {
        console.warn("Webhook dispatch error:", webhookErr);
      }
    }

    return json(res, 200, {
      ok: true,
      orderId,
      order,
      stored: Boolean(url && token),
      message: "Order placed successfully"
    });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "Could not create order" });
  }
};
