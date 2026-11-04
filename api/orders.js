// Vercel Serverless Function: Owner Portal API for viewing and managing all orders.

function json(res, status, body) {
  return res.status(status).json(body);
}

function cleanString(val, maxLen = 200) {
  if (typeof val !== "string") return "";
  return val.trim().slice(0, maxLen).replace(/[<>'"]/g, "");
}

global.__felicitaOrders = global.__felicitaOrders || [];

module.exports = async (req, res) => {
  // CORS & Security headers
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-pin");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // GET: Fetch all orders
  if (req.method === "GET") {
    try {
      let orders = [...(global.__felicitaOrders || [])];

      if (url && token) {
        try {
          const listRes = await fetch(`${url}/lrange/felicita:orders:list/0/99`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const listData = await listRes.json();
          const orderIds = Array.isArray(listData.result) ? listData.result : [];

          if (orderIds.length) {
            const fetchedOrders = [];
            for (const id of orderIds) {
              const oRes = await fetch(`${url}/get/felicita:order:${encodeURIComponent(id)}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              const oData = await oRes.json();
              if (oData && oData.result) {
                try {
                  fetchedOrders.push(JSON.parse(oData.result));
                } catch (e) {}
              }
            }
            if (fetchedOrders.length) {
              // Merge with in-memory orders
              const map = new Map();
              for (const o of [...orders, ...fetchedOrders]) {
                if (o && o.orderId) map.set(o.orderId, o);
              }
              orders = Array.from(map.values()).sort(
                (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
              );
            }
          }
        } catch (redisErr) {
          console.warn("Redis fetch error:", redisErr);
        }
      }

      return json(res, 200, {
        ok: true,
        count: orders.length,
        orders
      });
    } catch (error) {
      console.error(error);
      return json(res, 500, { error: "Failed to retrieve orders" });
    }
  }

  // PATCH: Update order status
  if (req.method === "PATCH") {
    try {
      const body = req.body || {};
      const orderId = cleanString(body.orderId, 24);
      const newStatus = cleanString(body.status, 30);

      const validStatuses = ["received", "preparing", "out_for_delivery", "delivered", "cancelled"];
      if (!orderId || !validStatuses.includes(newStatus)) {
        return json(res, 400, { error: "Invalid orderId or status" });
      }

      let updated = null;
      // Update in-memory
      const idx = global.__felicitaOrders.findIndex(o => o.orderId === orderId);
      if (idx !== -1) {
        global.__felicitaOrders[idx].status = newStatus;
        updated = global.__felicitaOrders[idx];
      }

      // Update in Redis
      if (url && token) {
        try {
          const oRes = await fetch(`${url}/get/felicita:order:${encodeURIComponent(orderId)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const oData = await oRes.json();
          if (oData && oData.result) {
            const ord = JSON.parse(oData.result);
            ord.status = newStatus;
            await fetch(`${url}/set/felicita:order:${encodeURIComponent(orderId)}/${encodeURIComponent(JSON.stringify(ord))}/EX/2592000`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            updated = ord;
          }
        } catch (e) {
          console.warn("Redis update error", e);
        }
      }

      return json(res, 200, {
        ok: true,
        orderId,
        status: newStatus,
        order: updated
      });
    } catch (error) {
      console.error(error);
      return json(res, 500, { error: "Failed to update order status" });
    }
  }

  // DELETE: Remove an order
  if (req.method === "DELETE") {
    try {
      const body = req.body || {};
      const orderId = cleanString(body.orderId, 24);

      if (!orderId) {
        return json(res, 400, { error: "orderId is required" });
      }

      global.__felicitaOrders = global.__felicitaOrders.filter(o => o.orderId !== orderId);

      if (url && token) {
        try {
          await fetch(`${url}/del/felicita:order:${encodeURIComponent(orderId)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          await fetch(`${url}/lrem/felicita:orders:list/0/${encodeURIComponent(orderId)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (e) {}
      }

      return json(res, 200, { ok: true, orderId, message: "Order removed" });
    } catch (error) {
      console.error(error);
      return json(res, 500, { error: "Failed to delete order" });
    }
  }

  return json(res, 405, { error: "Method not allowed" });
};

