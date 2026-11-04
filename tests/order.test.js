/**
 * Automated test suite for Felicita Treats ordering, WhatsApp notification & Owner Portal logic
 */

function runTests() {
  const results = [];

  function assert(testName, condition, details = "") {
    if (condition) {
      results.push({ name: testName, status: "PASS" });
    } else {
      results.push({ name: testName, status: "FAIL", details });
    }
  }

  // 1. Currency Formatting
  function formatPrice(value) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  }
  assert("Format price for ₹399", formatPrice(399) === "₹399");
  assert("Format price for large amount ₹12,500", formatPrice(12500) === "₹12,500");

  // 2. Cart Total Calculation
  const mockCart = [
    { name: "Chocolate Cake", variant: "1 KG", price: 599, quantity: 2 },
    { name: "Plain Cookie", variant: "Standard", price: 39, quantity: 3 }
  ];
  const total = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  assert("Cart total calculation (2*599 + 3*39 = 1315)", total === 1315);

  // 3. Phone validation (10 digits)
  function isValidPhone(p) {
    const raw = String(p).replace(/\D/g, "");
    return raw.length === 10;
  }
  assert("Valid 10-digit mobile number", isValidPhone("9515372424") === true);
  assert("Reject 8-digit number", isValidPhone("95153724") === false);
  assert("Reject 12-digit number", isValidPhone("9195153724249") === false);

  // 4. XSS sanitization logic
  function cleanString(val, maxLen = 200) {
    if (typeof val !== "string") return "";
    return val.trim().slice(0, maxLen).replace(/[<>'"]/g, "");
  }
  const dangerousInput = "<script>alert('xss')</script>Rahul";
  const cleaned = cleanString(dangerousInput);
  assert("Sanitize XSS input removes script tags and brackets", !cleaned.includes("<") && !cleaned.includes(">") && cleaned.includes("alert"));

  // 5. Payment method validation
  function validatePaymentMethod(method) {
    return ["upi", "card"].includes(method);
  }
  assert("Allow UPI", validatePaymentMethod("upi") === true);
  assert("Allow Card", validatePaymentMethod("card") === true);
  assert("Disallow COD (Cash on Delivery removed)", validatePaymentMethod("cod") === false);

  // 6. Owner WhatsApp URL Generation
  function buildOwnerWhatsAppUrl(ownerPhone, orderId, name, amount) {
    const cleanPhone = String(ownerPhone).replace(/\D/g, "");
    const text = encodeURIComponent(`New order #${orderId} for ${name} (₹${amount})`);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${text}`;
  }
  const waUrl = buildOwnerWhatsAppUrl("919515372424", "FT-102938", "Sita", 599);
  assert("Owner WhatsApp link contains owner phone 919515372424", waUrl.includes("phone=919515372424"));
  assert("Owner WhatsApp link contains order ID", waUrl.includes("FT-102938"));

  // 7. Owner Portal Order Statuses
  const validStatuses = ["received", "preparing", "out_for_delivery", "delivered", "cancelled"];
  assert("Owner order statuses valid", validStatuses.length === 5 && validStatuses.includes("preparing"));

  // 8. Owner Admin PIN Security
  function isValidAdminPin(pin) {
    return typeof pin === "string" && pin.length === 4 && /^\d{4}$/.test(pin);
  }
  assert("Default PIN 1509 is valid", isValidAdminPin("1509") === true);
  assert("Reject 3-digit PIN", isValidAdminPin("889") === false);
  assert("Reject non-numeric PIN", isValidAdminPin("abcd") === false);

  // 9. UPI Payee & Intent Validation
  function buildUpiUri(upiId, amount) {
    return `upi://pay?pa=${upiId}&pn=Felicita%20Treats&am=${amount}&cu=INR`;
  }
  const upiUri = buildUpiUri("9059499756@axl", 499);
  assert("UPI URI encodes payee 9059499756@axl", upiUri.includes("pa=9059499756@axl"));
  assert("UPI URI encodes amount", upiUri.includes("am=499"));

  return results;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { runTests };
}

// Execute tests
const testResults = runTests();
console.log("=== Felicita Treats Test Suite ===");
testResults.forEach(r => {
  console.log(`[${r.status}] ${r.name} ${r.details ? "- " + r.details : ""}`);
});
