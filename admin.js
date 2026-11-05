/**
 * FELICITA TREATS — OWNER PORTAL SCRIPT
 * Full-featured bakery order management & real-time WhatsApp dispatcher
 */

(function () {
    "use strict";

    // Configuration & State
    const DEFAULT_PIN = "1509";
    const DEFAULT_OWNER_PHONE = "919515372424";

    let orders = [];
    let currentPinInput = "";
    let soundEnabled = true;
    let activeStatusFilter = "all";
    let activeTimeFilter = "all";
    let activeSearchQuery = "";
    let activeViewMode = "cards"; // "cards" | "table"
    let manualOrderItems = [];

    // DOM Elements
    const pinGateOverlay = document.getElementById("pinGateOverlay");
    const dashboardWrapper = document.getElementById("dashboardWrapper");
    const pinDots = document.querySelectorAll(".pin-dots .dot");
    const pinError = document.getElementById("pinError");
    const pinHiddenInput = document.getElementById("pinHiddenInput");

    const dashClock = document.getElementById("dashClock");
    const dashDate = document.getElementById("dashDate");
    const soundToggleBtn = document.getElementById("soundToggleBtn");
    const soundStatusText = document.getElementById("soundStatusText");
    const soundIcon = document.getElementById("soundIcon");
    const refreshBtn = document.getElementById("refreshBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const newOrderBanner = document.getElementById("newOrderBanner");
    const bannerOrderInfo = document.getElementById("bannerOrderInfo");
    const dismissBannerBtn = document.getElementById("dismissBannerBtn");

    // KPI Elements
    const kpiTotalOrders = document.getElementById("kpiTotalOrders");
    const kpiTodayOrders = document.getElementById("kpiTodayOrders");
    const kpiTodayRevenue = document.getElementById("kpiTodayRevenue");
    const kpiActiveKitchen = document.getElementById("kpiActiveKitchen");
    const kpiTodayDate = document.getElementById("kpiTodayDate");

    // Filter & Search
    const statusTabs = document.getElementById("statusTabs");
    const orderSearchInput = document.getElementById("orderSearchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const timeFilterSelect = document.getElementById("timeFilterSelect");
    const viewCardsBtn = document.getElementById("viewCardsBtn");
    const viewTableBtn = document.getElementById("viewTableBtn");
    const exportCsvBtn = document.getElementById("exportCsvBtn");

    // Containers
    const ordersCardsGrid = document.getElementById("ordersCardsGrid");
    const ordersTableWrapper = document.getElementById("ordersTableWrapper");
    const ordersTableBody = document.getElementById("ordersTableBody");
    const emptyOrdersState = document.getElementById("emptyOrdersState");
    const addSampleOrderBtn = document.getElementById("addSampleOrderBtn");
    const printSlipContainer = document.getElementById("printSlipContainer");

    // Modals
    const openManualOrderBtn = document.getElementById("openManualOrderBtn");
    const manualOrderBackdrop = document.getElementById("manualOrderBackdrop");
    const closeManualOrderX = document.getElementById("closeManualOrderX");
    const closeManualOrderBtn = document.getElementById("closeManualOrderBtn");
    const manualOrderForm = document.getElementById("manualOrderForm");
    const manualItemSelect = document.getElementById("manualItemSelect");
    const manualItemQty = document.getElementById("manualItemQty");
    const addManualItemBtn = document.getElementById("addManualItemBtn");
    const manualItemsList = document.getElementById("manualItemsList");
    const manualTotalDisplay = document.getElementById("manualTotalDisplay");

    const openPasteOrderBtn = document.getElementById("openPasteOrderBtn");
    const pasteOrderBackdrop = document.getElementById("pasteOrderBackdrop");
    const closePasteOrderX = document.getElementById("closePasteOrderX");
    const closePasteOrderBtn = document.getElementById("closePasteOrderBtn");
    const pasteOrderTextarea = document.getElementById("pasteOrderTextarea");
    const parseWhatsAppBtn = document.getElementById("parseWhatsAppBtn");

    const openSettingsBtn = document.getElementById("openSettingsBtn");
    const settingsBackdrop = document.getElementById("settingsBackdrop");
    const closeSettingsX = document.getElementById("closeSettingsX");
    const closeSettingsBtn = document.getElementById("closeSettingsBtn");
    const settingsForm = document.getElementById("settingsForm");
    const settingOwnerPhone = document.getElementById("settingOwnerPhone");
    const settingAdminPin = document.getElementById("settingAdminPin");
    const testChimeBtn = document.getElementById("testChimeBtn");
    const exportBackupBtn = document.getElementById("exportBackupBtn");
    const clearAllOrdersBtn = document.getElementById("clearAllOrdersBtn");

    // =========================================================
    // 1. AUDIO CHIME SYNTHESIZER (NO EXTERNAL ASSETS NEEDED)
    // =========================================================
    function playOrderChime() {
        if (!soundEnabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();

            // Note 1: E5 (659.25Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
            gain1.gain.setValueAtTime(0.3, ctx.currentTime);
            gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(ctx.currentTime);
            osc1.stop(ctx.currentTime + 0.4);

            // Note 2: A5 (880Hz)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
            gain2.gain.setValueAtTime(0.35, ctx.currentTime + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(ctx.currentTime + 0.15);
            osc2.stop(ctx.currentTime + 0.7);
        } catch (e) {
            console.warn("Audio chime prevented by browser autoplay policy", e);
        }
    }

    // =========================================================
    // 2. PASSCODE AUTHENTICATION
    // =========================================================
    function getStoredPin() {
        const pin = localStorage.getItem("felicita_admin_pin");
        if (!pin || pin === "8899") {
            localStorage.setItem("felicita_admin_pin", DEFAULT_PIN);
            return DEFAULT_PIN;
        }
        return pin;
    }

    function checkAuth() {
        if (sessionStorage.getItem("felicita_admin_auth") === "true") {
            pinGateOverlay.style.display = "none";
            dashboardWrapper.style.display = "block";
            initDashboard();
        } else {
            pinGateOverlay.style.display = "flex";
            dashboardWrapper.style.display = "none";
            currentPinInput = "";
            updatePinDots();
        }
    }

    function updatePinDots() {
        pinDots.forEach((dot, idx) => {
            if (idx < currentPinInput.length) {
                dot.classList.add("filled");
            } else {
                dot.classList.remove("filled");
            }
        });
    }

    function handlePinDigit(digit) {
        if (currentPinInput.length >= 4) return;
        currentPinInput += digit;
        updatePinDots();
        pinError.textContent = "";

        if (currentPinInput.length === 4) {
            validatePin();
        }
    }

    function handlePinAction(action) {
        if (action === "clear") {
            currentPinInput = "";
            pinError.textContent = "";
            updatePinDots();
        } else if (action === "back") {
            currentPinInput = currentPinInput.slice(0, -1);
            pinError.textContent = "";
            updatePinDots();
        }
    }

    function validatePin() {
        const correctPin = getStoredPin();
        if (currentPinInput === correctPin) {
            sessionStorage.setItem("felicita_admin_auth", "true");
            pinGateOverlay.style.display = "none";
            dashboardWrapper.style.display = "block";
            initDashboard();
        } else {
            pinError.textContent = "Incorrect PIN. Please try again.";
            setTimeout(() => {
                currentPinInput = "";
                updatePinDots();
            }, 500);
        }
    }

    // Keypad listeners
    document.querySelectorAll(".key-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.dataset.key;
            const action = btn.dataset.action;
            if (key !== undefined) handlePinDigit(key);
            if (action) handlePinAction(action);
        });
    });

    // Physical keyboard listener on PIN gate
    window.addEventListener("keydown", (e) => {
        if (pinGateOverlay.style.display !== "none") {
            if (e.key >= "0" && e.key <= "9") {
                handlePinDigit(e.key);
            } else if (e.key === "Backspace") {
                handlePinAction("back");
            } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
                handlePinAction("clear");
            }
        }
    });

    logoutBtn?.addEventListener("click", () => {
        if (confirm("Log out from the Owner Portal?")) {
            sessionStorage.removeItem("felicita_admin_auth");
            location.reload();
        }
    });

    // =========================================================
    // 3. CLOCK & LIVE TIME UPDATER
    // =========================================================
    function updateClock() {
        const now = new Date();
        if (dashClock) {
            dashClock.textContent = now.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            });
        }
        if (dashDate) {
            dashDate.textContent = now.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // =========================================================
    // 4. ORDER STORAGE & SYNC
    // =========================================================
    function formatPrice(val) {
        return `₹${Number(val || 0).toLocaleString("en-IN")}`;
    }

    function escapeHtml(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getLocalOrders() {
        try {
            return JSON.parse(localStorage.getItem("felicita_all_orders") || "[]");
        } catch (e) {
            return [];
        }
    }

    function saveLocalOrders(arr) {
        try {
            localStorage.setItem("felicita_all_orders", JSON.stringify(arr));
        } catch (e) {
            console.warn("Could not save to localStorage", e);
        }
    }

    async function fetchOrdersFromServer() {
        let serverOrders = [];
        try {
            const res = await fetch("/api/orders");
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.orders)) {
                    serverOrders = data.orders;
                }
            }
        } catch (e) {
            console.log("Server API not reachable; using local store");
        }

        const localOrders = getLocalOrders();

        // Merge orders by orderId (preferring server status if present, otherwise local)
        const map = new Map();
        for (const o of localOrders) {
            if (o && o.orderId) map.set(o.orderId, o);
        }
        for (const o of serverOrders) {
            if (o && o.orderId) map.set(o.orderId, o);
        }

        orders = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

        saveLocalOrders(orders);
        renderDashboard();
    }

    // Real-time listener for orders placed in other browser tabs
    if (window.BroadcastChannel) {
        try {
            const bc = new BroadcastChannel("felicita_orders");
            bc.onmessage = (event) => {
                if (event.data && event.data.type === "NEW_ORDER" && event.data.order) {
                    const newOrd = event.data.order;
                    // Check if already in array
                    if (!orders.some(o => o.orderId === newOrd.orderId)) {
                        orders.unshift(newOrd);
                        saveLocalOrders(orders);
                        playOrderChime();
                        showNewOrderBanner(newOrd);
                        renderDashboard();
                    }
                }
            };
        } catch (e) {}
    }

    // Auto-polling every 15 seconds
    setInterval(() => {
        fetchOrdersFromServer();
    }, 15000);

    function showNewOrderBanner(order) {
        if (!newOrderBanner) return;
        bannerOrderInfo.textContent = `Order #${order.orderId} from ${order.name} (${formatPrice(order.total)}) just arrived!`;
        newOrderBanner.style.display = "flex";
    }

    dismissBannerBtn?.addEventListener("click", () => {
        if (newOrderBanner) newOrderBanner.style.display = "none";
        // Scroll to orders
        ordersCardsGrid.scrollIntoView({ behavior: "smooth" });
    });

    // =========================================================
    // 5. DASHBOARD RENDERING & KPIS
    // =========================================================
    function calculateMetrics() {
        const todayStr = new Date().toDateString();
        let totalRev = 0;
        let todayCount = 0;
        let todayRev = 0;
        let activeKitchen = 0;

        orders.forEach(o => {
            const dStr = new Date(o.createdAt || Date.now()).toDateString();
            const amt = Number(o.total) || 0;
            totalRev += amt;

            if (dStr === todayStr) {
                todayCount++;
                todayRev += amt;
            }

            const status = o.status || "received";
            if (["received", "preparing", "out_for_delivery"].includes(status)) {
                activeKitchen++;
            }
        });

        if (kpiTotalOrders) kpiTotalOrders.textContent = orders.length;
        if (kpiTodayOrders) kpiTodayOrders.textContent = todayCount;
        if (kpiTodayRevenue) kpiTodayRevenue.textContent = formatPrice(todayRev);
        if (kpiActiveKitchen) kpiActiveKitchen.textContent = activeKitchen;
        if (kpiTodayDate) {
            kpiTodayDate.textContent = new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short"
            });
        }

        // Status counts for tabs
        const counts = { all: orders.length, received: 0, preparing: 0, out_for_delivery: 0, delivered: 0, cancelled: 0 };
        orders.forEach(o => {
            const st = o.status || "received";
            if (counts[st] !== undefined) counts[st]++;
        });

        document.getElementById("countAll").textContent = counts.all;
        document.getElementById("countReceived").textContent = counts.received;
        document.getElementById("countPreparing").textContent = counts.preparing;
        document.getElementById("countOut").textContent = counts.out_for_delivery;
        document.getElementById("countDelivered").textContent = counts.delivered;
        document.getElementById("countCancelled").textContent = counts.cancelled;
    }

    function filterOrders() {
        const query = activeSearchQuery.toLowerCase().trim();
        const now = new Date();
        const todayStr = now.toDateString();
        const yesterday = new Date(now.getTime() - 86400000).toDateString();
        const oneWeekAgo = now.getTime() - 7 * 86400000;

        return orders.filter(o => {
            // Status filter
            const st = o.status || "received";
            if (activeStatusFilter !== "all" && st !== activeStatusFilter) {
                return false;
            }

            // Time filter
            const oTime = new Date(o.createdAt || Date.now());
            const oDateStr = oTime.toDateString();
            if (activeTimeFilter === "today" && oDateStr !== todayStr) return false;
            if (activeTimeFilter === "yesterday" && oDateStr !== yesterday) return false;
            if (activeTimeFilter === "week" && oTime.getTime() < oneWeekAgo) return false;

            // Search query filter
            if (query) {
                const matchId = (o.orderId || "").toLowerCase().includes(query);
                const matchName = (o.name || "").toLowerCase().includes(query);
                const matchPhone = (o.phone || "").toLowerCase().includes(query);
                const matchAddress = (o.address || "").toLowerCase().includes(query);
                if (!matchId && !matchName && !matchPhone && !matchAddress) {
                    return false;
                }
            }

            return true;
        });
    }

    function renderDashboard() {
        calculateMetrics();
        const filtered = filterOrders();

        if (filtered.length === 0) {
            emptyOrdersState.style.display = "block";
            ordersCardsGrid.style.display = "none";
            ordersTableWrapper.style.display = "none";
            return;
        }

        emptyOrdersState.style.display = "none";

        if (activeViewMode === "cards") {
            ordersCardsGrid.style.display = "grid";
            ordersTableWrapper.style.display = "none";
            renderCardsView(filtered);
        } else {
            ordersCardsGrid.style.display = "none";
            ordersTableWrapper.style.display = "block";
            renderTableView(filtered);
        }
    }

    function getRelativeTimeString(dateIso) {
        const diff = Math.floor((Date.now() - new Date(dateIso).getTime()) / 1000);
        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    function renderCardsView(list) {
        ordersCardsGrid.innerHTML = list.map(o => {
            const status = o.status || "received";
            const dateStr = new Date(o.createdAt || Date.now()).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            });
            const relTime = getRelativeTimeString(o.createdAt || Date.now());

            // Build items HTML
            const itemsHtml = (o.items || []).map(item => `
                <div class="order-item-row">
                    <div>
                        <span class="order-item-name">${item.quantity} × ${escapeHtml(item.name)}</span>
                        <span class="order-item-var">(${escapeHtml(item.variant || "Standard")})</span>
                    </div>
                    <span class="order-item-total">${formatPrice(item.price * item.quantity)}</span>
                </div>
            `).join("");

            // Format customer phone for tel & wa
            const rawPhone = String(o.phone || "").replace(/\D/g, "");
            const waCustPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
            const waUpdateMsg = encodeURIComponent(
                `Hello ${o.name}! 🍰 This is an update from Felicita Treats regarding your Order #${o.orderId}.\nStatus: ${status.toUpperCase().replace(/_/g, " ")}\nTotal: ${formatPrice(o.total)}\nThank you for choosing us!`
            );

            return `
                <article class="order-card" data-order-id="${escapeHtml(o.orderId)}">
                    <div class="order-card-header">
                        <div class="order-id-group">
                            <span class="order-id">#${escapeHtml(o.orderId)}</span>
                            <span class="order-time-badge">${escapeHtml(dateStr)} • ${relTime}</span>
                        </div>
                        <div class="status-select-wrap">
                            <select class="order-status-select status-${status}" data-order-id="${escapeHtml(o.orderId)}">
                                <option value="received" ${status === "received" ? "selected" : ""}>🟡 Received</option>
                                <option value="preparing" ${status === "preparing" ? "selected" : ""}>🔵 Baking</option>
                                <option value="out_for_delivery" ${status === "out_for_delivery" ? "selected" : ""}>🟣 Out</option>
                                <option value="delivered" ${status === "delivered" ? "selected" : ""}>🟢 Delivered</option>
                                <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>🔴 Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div class="order-card-body">
                        <div class="order-customer-box">
                            <div class="cust-name-row">
                                <span class="cust-name">👤 ${escapeHtml(o.name)}</span>
                                <div class="cust-actions">
                                    <a href="tel:${rawPhone}" class="action-icon-btn call" title="Call Customer">📞</a>
                                    <a href="https://wa.me/${waCustPhone}?text=${waUpdateMsg}" target="_blank" class="action-icon-btn wa" title="WhatsApp Customer">💬</a>
                                </div>
                            </div>
                            <div class="cust-detail">
                                <span>📱 <strong>+91 ${rawPhone}</strong></span>
                            </div>
                            <div class="cust-detail">
                                <span>📍 ${escapeHtml(o.address)}, Visakhapatnam</span>
                            </div>
                            ${o.deliveryDate ? `<div class="cust-detail"><span>📅 Preferred: <strong>${escapeHtml(o.deliveryDate)} ${escapeHtml(o.deliveryTime || "")}</strong></span></div>` : ""}
                            ${o.notes ? `<div class="cust-notes-alert">📝 <strong>Note:</strong> ${escapeHtml(o.notes)}</div>` : ""}
                        </div>

                        <div class="order-items-box">
                            <div class="order-items-heading">Ordered Treats (${(o.items || []).length})</div>
                            ${itemsHtml}
                        </div>

                        <div class="order-card-financials">
                            <div>
                                ${(["card", "debit", "credit", "debit_card", "credit_card"].includes(o.paymentMethod))
                                    ? `<span class="payment-method-badge is-verified">💳 ${escapeHtml(o.paymentDetails?.methodName || 'Card (3DS)')}</span>`
                                    : (o.paymentDetails?.status === "Verified & Paid"
                                        ? `<span class="payment-method-badge is-verified">🟢 ${escapeHtml(o.paymentDetails?.methodName || 'UPI Verified')}</span>
                                           ${o.paymentDetails?.gatewayTxnId ? `<small style="display:block; font-size:10px; font-weight:700; color:#047857; margin-top:2px;">Txn: ${escapeHtml(o.paymentDetails.gatewayTxnId)}</small>` : (o.paymentDetails?.utr ? `<small style="display:block; font-size:11px; font-weight:700; color:#047857; margin-top:2px;">UTR: ${escapeHtml(o.paymentDetails.utr)}</small>` : "")}`
                                        : `<span class="payment-method-badge is-pending">🟡 ${escapeHtml(o.paymentDetails?.methodName || 'UPI')} (Pending Verification)</span>
                                           ${o.paymentDetails?.utr ? `<small style="display:block; font-size:11px; font-weight:700; color:#b45309; margin-top:2px;">UTR: ${escapeHtml(o.paymentDetails.utr)}</small>` : ""}
                                           <button type="button" class="verify-payment-btn" data-order-id="${escapeHtml(o.orderId)}" title="Verify money credited to 9059499756@axl">✓ Mark Verified</button>`
                                      )
                                }
                            </div>
                            <span class="order-grand-total">${formatPrice(o.total)}</span>
                        </div>
                    </div>

                    <div class="order-card-footer">
                        <button type="button" class="card-action-btn print-kot-btn" data-order-id="${escapeHtml(o.orderId)}" title="Print Kitchen Order Slip">
                            🖨️ Kitchen Slip
                        </button>
                        <a href="https://wa.me/${waCustPhone}?text=${waUpdateMsg}" target="_blank" class="card-action-btn wa-notify" title="Send WhatsApp Update to Customer">
                            💬 WhatsApp Customer
                        </a>
                        <button type="button" class="card-action-btn copy-summary-btn" data-order-id="${escapeHtml(o.orderId)}" title="Copy Order Text">
                            📋 Copy
                        </button>
                        <button type="button" class="card-action-btn delete-btn" data-order-id="${escapeHtml(o.orderId)}" title="Delete Order">
                            🗑️
                        </button>
                    </div>
                </article>
            `;
        }).join("");

        attachCardActionListeners();
    }

    function renderTableView(list) {
        ordersTableBody.innerHTML = list.map(o => {
            const status = o.status || "received";
            const dateStr = new Date(o.createdAt || Date.now()).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            });
            const itemsBrief = (o.items || []).map(i => `${i.quantity}x ${i.name}`).join(", ");
            const rawPhone = String(o.phone || "").replace(/\D/g, "");
            const waCustPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;

            return `
                <tr>
                    <td><strong>#${escapeHtml(o.orderId)}</strong></td>
                    <td>${escapeHtml(dateStr)}</td>
                    <td>${escapeHtml(o.name)}</td>
                    <td>
                        <a href="tel:${rawPhone}" style="color:var(--ink); text-decoration:none;">${rawPhone}</a>
                    </td>
                    <td><small>${escapeHtml(o.address)}</small></td>
                    <td><small>${escapeHtml(itemsBrief)}</small></td>
                    <td><strong>${formatPrice(o.total)}</strong></td>
                    <td>
                        ${(["card", "debit", "credit", "debit_card", "credit_card"].includes(o.paymentMethod))
                            ? `<span class="payment-method-badge is-verified">Card (3DS)</span>`
                            : (o.paymentDetails?.status === "Verified & Paid"
                                ? `<span class="payment-method-badge is-verified">UPI Verified</span><br><small style="color:#047857; font-weight:700;">${escapeHtml(o.paymentDetails?.utr || '')}</small>`
                                : `<span class="payment-method-badge is-pending">UPI Pending</span><br><small style="color:#b45309; font-weight:700;">${escapeHtml(o.paymentDetails?.utr || '')}</small><br><button type="button" class="verify-payment-btn" data-order-id="${escapeHtml(o.orderId)}" style="margin-top:3px; padding:2px 6px; font-size:10px;">✓ Verify</button>`
                              )
                        }
                    </td>
                    <td>
                        <select class="order-status-select status-${status}" data-order-id="${escapeHtml(o.orderId)}">
                            <option value="received" ${status === "received" ? "selected" : ""}>🟡 Received</option>
                            <option value="preparing" ${status === "preparing" ? "selected" : ""}>🔵 Baking</option>
                            <option value="out_for_delivery" ${status === "out_for_delivery" ? "selected" : ""}>🟣 Out</option>
                            <option value="delivered" ${status === "delivered" ? "selected" : ""}>🟢 Delivered</option>
                            <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>🔴 Cancelled</option>
                        </select>
                    </td>
                    <td>
                        <div style="display:flex; gap:6px;">
                            <button type="button" class="dash-btn print-kot-btn" data-order-id="${escapeHtml(o.orderId)}" style="padding:4px 8px; font-size:11px;">🖨️</button>
                            <a href="https://wa.me/${waCustPhone}" target="_blank" class="dash-btn" style="padding:4px 8px; font-size:11px; text-decoration:none;">💬</a>
                            <button type="button" class="dash-btn danger delete-btn" data-order-id="${escapeHtml(o.orderId)}" style="padding:4px 8px; font-size:11px;">🗑️</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        attachCardActionListeners();
    }

    // =========================================================
    // 6. ORDER ACTIONS (STATUS, PRINT, DELETE, COPY)
    // =========================================================
    async function updateOrderStatus(orderId, newStatus) {
        const ord = orders.find(o => o.orderId === orderId);
        if (!ord) return;

        ord.status = newStatus;
        saveLocalOrders(orders);
        renderDashboard();

        try {
            await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus })
            });
        } catch (e) {
            console.warn("Could not sync status to server", e);
        }
    }

    async function deleteOrder(orderId) {
        if (!confirm(`Are you sure you want to delete order #${orderId}?`)) return;

        orders = orders.filter(o => o.orderId !== orderId);
        saveLocalOrders(orders);
        renderDashboard();

        try {
            await fetch("/api/orders", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId })
            });
        } catch (e) {}
    }

    function printKitchenSlip(orderId) {
        const ord = orders.find(o => o.orderId === orderId);
        if (!ord) return;

        const itemsList = (ord.items || []).map(i => `
            <div class="slip-row">
                <span>${i.quantity} x ${escapeHtml(i.name)} (${escapeHtml(i.variant)})</span>
                <strong>${formatPrice(i.price * i.quantity)}</strong>
            </div>
        `).join("");

        printSlipContainer.innerHTML = `
            <div class="slip-header">
                <h2>FELICITA TREATS</h2>
                <p>KITCHEN ORDER TICKET (KOT)</p>
                <div class="slip-divider"></div>
                <div class="slip-row"><span>ORDER NO:</span><strong>#${escapeHtml(ord.orderId)}</strong></div>
                <div class="slip-row"><span>DATE:</span><span>${new Date(ord.createdAt || Date.now()).toLocaleString("en-IN")}</span></div>
            </div>
            <div class="slip-divider"></div>
            <div>
                <div><strong>CUSTOMER:</strong> ${escapeHtml(ord.name)}</div>
                <div><strong>PHONE:</strong> +91 ${escapeHtml(ord.phone)}</div>
                <div><strong>ADDRESS:</strong> ${escapeHtml(ord.address)}</div>
                ${ord.notes ? `<div style="margin-top:4px;"><strong>NOTE:</strong> ${escapeHtml(ord.notes)}</div>` : ""}
            </div>
            <div class="slip-divider"></div>
            <div>
                <strong>ITEMS:</strong>
                ${itemsList}
            </div>
            <div class="slip-divider"></div>
            <div class="slip-row slip-total">
                <span>TOTAL:</span>
                <span>${formatPrice(ord.total)}</span>
            </div>
            <div class="slip-row">
                <span>PAYMENT:</span>
                <span>${ord.paymentMethod === "card" ? "CARD (PAID)" : "UPI (PAID)"}</span>
            </div>
            <div class="slip-divider"></div>
            <div style="text-align:center; margin-top:8px;">*** THANK YOU ***</div>
        `;

        window.print();
    }

    function copyOrderSummary(orderId) {
        const ord = orders.find(o => o.orderId === orderId);
        if (!ord) return;
        const text = ord.message || JSON.stringify(ord, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            alert(`Order #${orderId} details copied to clipboard!`);
        });
    }

    async function verifyPayment(orderId) {
        const ord = orders.find(o => o.orderId === orderId);
        if (!ord) return;

        if (!ord.paymentDetails) ord.paymentDetails = {};
        ord.paymentDetails.status = "Verified & Paid";
        saveLocalOrders(orders);
        renderDashboard();
        alert(`Payment for Order #${orderId} marked as Verified!`);

        try {
            await fetch("/api/orders", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, paymentStatus: "Verified & Paid" })
            });
        } catch (e) {
            console.warn("Could not sync verification to server", e);
        }
    }

    function attachCardActionListeners() {
        // Verify payment
        document.querySelectorAll(".verify-payment-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                verifyPayment(btn.dataset.orderId);
            });
        });

        // Status change
        document.querySelectorAll(".order-status-select").forEach(sel => {
            sel.addEventListener("change", (e) => {
                const id = sel.dataset.orderId;
                const newStatus = sel.value;
                updateOrderStatus(id, newStatus);
            });
        });

        // Print slip
        document.querySelectorAll(".print-kot-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                printKitchenSlip(btn.dataset.orderId);
            });
        });

        // Delete
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                deleteOrder(btn.dataset.orderId);
            });
        });

        // Copy
        document.querySelectorAll(".copy-summary-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                copyOrderSummary(btn.dataset.orderId);
            });
        });
    }

    // =========================================================
    // 7. FILTERS, SEARCH & TABS
    // =========================================================
    statusTabs?.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (!btn) return;
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeStatusFilter = btn.dataset.status;
        renderDashboard();
    });

    timeFilterSelect?.addEventListener("change", (e) => {
        activeTimeFilter = e.target.value;
        renderDashboard();
    });

    orderSearchInput?.addEventListener("input", (e) => {
        activeSearchQuery = e.target.value;
        clearSearchBtn.style.display = activeSearchQuery ? "block" : "none";
        renderDashboard();
    });

    clearSearchBtn?.addEventListener("click", () => {
        orderSearchInput.value = "";
        activeSearchQuery = "";
        clearSearchBtn.style.display = "none";
        renderDashboard();
    });

    viewCardsBtn?.addEventListener("click", () => {
        activeViewMode = "cards";
        viewCardsBtn.classList.add("active");
        viewTableBtn.classList.remove("active");
        renderDashboard();
    });

    viewTableBtn?.addEventListener("click", () => {
        activeViewMode = "table";
        viewTableBtn.classList.add("active");
        viewCardsBtn.classList.remove("active");
        renderDashboard();
    });

    // Sound toggle
    soundToggleBtn?.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundStatusText.textContent = soundEnabled ? "ON" : "OFF";
        soundIcon.textContent = soundEnabled ? "🔔" : "🔕";
    });

    // Refresh button
    refreshBtn?.addEventListener("click", () => {
        const icon = refreshBtn.querySelector(".refresh-icon");
        icon?.classList.add("spinning");
        fetchOrdersFromServer().finally(() => {
            setTimeout(() => icon?.classList.remove("spinning"), 600);
        });
    });

    // Export to CSV
    exportCsvBtn?.addEventListener("click", () => {
        if (!orders.length) {
            alert("No orders to export.");
            return;
        }

        const headers = ["Order ID", "Date", "Customer Name", "Phone", "Address", "Items", "Total (INR)", "Payment Method", "Status"];
        const rows = orders.map(o => [
            `"${o.orderId}"`,
            `"${new Date(o.createdAt || Date.now()).toISOString()}"`,
            `"${(o.name || "").replace(/"/g, '""')}"`,
            `"${o.phone || ""}"`,
            `"${(o.address || "").replace(/"/g, '""')}"`,
            `"${(o.items || []).map(i => `${i.quantity}x ${i.name} (${i.variant})`).join("; ").replace(/"/g, '""')}"`,
            Number(o.total) || 0,
            `"${o.paymentMethod || "upi"}"`,
            `"${o.status || "received"}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Felicita_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // =========================================================
    // 8. MANUAL ORDER MODAL
    // =========================================================
    openManualOrderBtn?.addEventListener("click", () => {
        manualOrderItems = [];
        renderManualItemsList();
        manualOrderForm.reset();
        manualOrderBackdrop.style.display = "flex";
    });

    closeManualOrderX?.addEventListener("click", () => manualOrderBackdrop.style.display = "none");
    closeManualOrderBtn?.addEventListener("click", () => manualOrderBackdrop.style.display = "none");

    addManualItemBtn?.addEventListener("click", () => {
        const [name, variant, priceStr] = (manualItemSelect.value || "").split("|");
        const qty = parseInt(manualItemQty.value, 10) || 1;
        const price = parseInt(priceStr, 10) || 0;

        manualOrderItems.push({ name, variant, price, quantity: qty });
        renderManualItemsList();
    });

    function renderManualItemsList() {
        let total = 0;
        manualItemsList.innerHTML = manualOrderItems.map((item, idx) => {
            const lineTotal = item.price * item.quantity;
            total += lineTotal;
            return `
                <div class="manual-item-pill">
                    <span>${item.quantity} × ${escapeHtml(item.name)} (${escapeHtml(item.variant)})</span>
                    <div>
                        <strong>${formatPrice(lineTotal)}</strong>
                        <button type="button" data-idx="${idx}" class="remove-manual-item-btn" style="margin-left:8px; border:none; background:transparent; cursor:pointer; color:#dc2626;">✕</button>
                    </div>
                </div>
            `;
        }).join("");

        manualTotalDisplay.textContent = formatPrice(total);

        document.querySelectorAll(".remove-manual-item-btn").forEach(b => {
            b.addEventListener("click", () => {
                const i = parseInt(b.dataset.idx, 10);
                manualOrderItems.splice(i, 1);
                renderManualItemsList();
            });
        });
    }

    manualOrderForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!manualOrderItems.length) {
            alert("Please add at least one treat to the order.");
            return;
        }

        const name = document.getElementById("manualCustName").value.trim();
        const phone = document.getElementById("manualCustPhone").value.replace(/\D/g, "");
        const address = document.getElementById("manualCustAddress").value.trim();
        const deliveryDate = document.getElementById("manualCustDate").value;
        const deliveryTime = document.getElementById("manualCustTime").value.trim();
        const paymentMethod = document.getElementById("manualPaymentMethod").value;
        const notes = document.getElementById("manualNotes").value.trim();
        const total = manualOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderId = `FT-${Math.floor(100000 + Math.random() * 900000)}`;

        const newOrder = {
            orderId,
            name,
            phone,
            address,
            deliveryDate,
            deliveryTime,
            notes,
            status: "received",
            paymentMethod,
            paymentDetails: {
                methodName: paymentMethod === "card" ? "Debit / Credit Card" : (paymentMethod === "cash" ? "Cash" : "UPI / QR Code"),
                status: "Paid"
            },
            items: [...manualOrderItems],
            total,
            createdAt: new Date().toISOString()
        };

        orders.unshift(newOrder);
        saveLocalOrders(orders);
        renderDashboard();
        manualOrderBackdrop.style.display = "none";
        playOrderChime();

        // Optional WhatsApp confirmation to customer
        const rawPhone = phone.length === 10 ? `91${phone}` : phone;
        const waMsg = encodeURIComponent(
            `🍰 Hello ${name}! Your Felicita Treats order #${orderId} has been booked.\nTotal: ${formatPrice(total)}\nDelivery Address: ${address}\nThank you!`
        );
        if (confirm(`Order #${orderId} saved! Do you want to send a WhatsApp confirmation to customer?`)) {
            window.open(`https://wa.me/${rawPhone}?text=${waMsg}`, "_blank");
        }
    });

    // =========================================================
    // 9. PASTE WHATSAPP ORDER AUTO-PARSER
    // =========================================================
    openPasteOrderBtn?.addEventListener("click", () => {
        pasteOrderTextarea.value = "";
        pasteOrderBackdrop.style.display = "flex";
    });

    closePasteOrderX?.addEventListener("click", () => pasteOrderBackdrop.style.display = "none");
    closePasteOrderBtn?.addEventListener("click", () => pasteOrderBackdrop.style.display = "none");

    parseWhatsAppBtn?.addEventListener("click", () => {
        const text = pasteOrderTextarea.value.trim();
        if (!text) {
            alert("Please paste the WhatsApp order text first.");
            return;
        }

        // Auto-extract fields using regex
        const idMatch = text.match(/Order ID:\s*#?([A-Za-z0-9\-]+)/i);
        const nameMatch = text.match(/Name:\s*([^\n\r]+)/i);
        const phoneMatch = text.match(/Phone:\s*([^\n\r]+)/i);
        const addressMatch = text.match(/Address:\s*([^\n\r]+)/i);
        const totalMatch = text.match(/TOTAL(?:\s*BILL)?:\s*₹?([0-9,]+)/i);

        const orderId = idMatch ? idMatch[1].trim() : `FT-${Math.floor(100000 + Math.random() * 900000)}`;
        const name = nameMatch ? nameMatch[1].trim() : "WhatsApp Customer";
        const phone = phoneMatch ? phoneMatch[1].replace(/\D/g, "") : "";
        const address = addressMatch ? addressMatch[1].trim() : "Visakhapatnam";
        const totalVal = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ""), 10) : 599;

        const importedOrder = {
            orderId,
            name,
            phone,
            address,
            status: "received",
            paymentMethod: text.toLowerCase().includes("card") ? "card" : "upi",
            paymentDetails: {
                methodName: "UPI / QR Code",
                status: "Paid"
            },
            items: [
                { name: "Bakery Order", variant: "WhatsApp Order", price: totalVal, quantity: 1 }
            ],
            total: totalVal,
            notes: "Imported via WhatsApp text",
            message: text,
            createdAt: new Date().toISOString()
        };

        orders.unshift(importedOrder);
        saveLocalOrders(orders);
        renderDashboard();
        pasteOrderBackdrop.style.display = "none";
        alert(`Successfully imported Order #${orderId} for ${name}!`);
    });

    // =========================================================
    // 10. SETTINGS MODAL
    // =========================================================
    openSettingsBtn?.addEventListener("click", () => {
        if (settingOwnerPhone) {
            settingOwnerPhone.value = localStorage.getItem("felicita_owner_phone") || DEFAULT_OWNER_PHONE;
        }
        if (settingAdminPin) {
            settingAdminPin.value = getStoredPin();
        }
        settingsBackdrop.style.display = "flex";
    });

    closeSettingsX?.addEventListener("click", () => settingsBackdrop.style.display = "none");
    closeSettingsBtn?.addEventListener("click", () => settingsBackdrop.style.display = "none");

    testChimeBtn?.addEventListener("click", () => {
        playOrderChime();
    });

    settingsForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const newPhone = settingOwnerPhone.value.replace(/\D/g, "");
        const newPin = settingAdminPin.value.trim();

        if (newPhone.length >= 10) {
            localStorage.setItem("felicita_owner_phone", newPhone);
        }
        if (newPin.length === 4 && /^\d+$/.test(newPin)) {
            localStorage.setItem("felicita_admin_pin", newPin);
        }

        settingsBackdrop.style.display = "none";
        alert("Owner Portal settings updated successfully!");
    });

    exportBackupBtn?.addEventListener("click", () => {
        const jsonStr = JSON.stringify(orders, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Felicita_Orders_Backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
    });

    clearAllOrdersBtn?.addEventListener("click", () => {
        if (confirm("WARNING: This will erase all orders stored on this device. Proceed?")) {
            orders = [];
            saveLocalOrders(orders);
            renderDashboard();
            settingsBackdrop.style.display = "none";
        }
    });

    // Demo sample order seeder
    addSampleOrderBtn?.addEventListener("click", () => {
        const demoOrders = [
            {
                orderId: `FT-${Math.floor(100000 + Math.random() * 900000)}`,
                name: "Ananya Sharma",
                phone: "9848022338",
                address: "Flat 302, Sagar View Apts, Beach Road",
                deliveryDate: "Tomorrow",
                deliveryTime: "5:00 PM",
                notes: "Please write 'Happy 21st Birthday Ananya' on the cake!",
                status: "received",
                paymentMethod: "upi",
                paymentDetails: { methodName: "UPI / QR Code", utr: "UTR829103948172", status: "Paid" },
                items: [
                    { name: "Chocolate Cake", variant: "1 KG", price: 599, quantity: 1 },
                    { name: "Double Chocolate Cookie", variant: "Standard", price: 49, quantity: 4 }
                ],
                total: 795,
                createdAt: new Date().toISOString()
            },
            {
                orderId: `FT-${Math.floor(100000 + Math.random() * 900000)}`,
                name: "Karthik Varma",
                phone: "9515372424",
                address: "Plot 18, Sector 6, MVP Colony",
                deliveryDate: "Today",
                deliveryTime: "7:30 PM",
                notes: "Call when delivery driver is near the gate",
                status: "preparing",
                paymentMethod: "upi",
                paymentDetails: { methodName: "UPI / QR Code", utr: "UTR994821039482", status: "Paid" },
                items: [
                    { name: "Red Velvet Cake", variant: "½ KG", price: 449, quantity: 1 },
                    { name: "Nutella Brownie", variant: "Standard", price: 99, quantity: 2 }
                ],
                total: 647,
                createdAt: new Date(Date.now() - 3600000).toISOString()
            }
        ];

        demoOrders.forEach(o => orders.unshift(o));
        saveLocalOrders(orders);
        renderDashboard();
        playOrderChime();
    });

    // =========================================================
    // 11. INITIALIZATION
    // =========================================================
    function initDashboard() {
        fetchOrdersFromServer();
    }

    // Check auth on page load
    checkAuth();

})();

