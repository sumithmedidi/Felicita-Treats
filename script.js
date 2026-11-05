/* =========================================================
   FELICITA TREATS
   JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. ELEMENTS
   ========================================================= */

const brandIntro = document.getElementById("brandIntro");
const productGrid = document.getElementById("productGrid");
const filters = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");
const navLinks = document.querySelectorAll(".menu-nav a");
const sections = document.querySelectorAll("main section[id]");
const toast = document.getElementById("toast");
const instagramOrderBtn = document.getElementById("instagramOrderBtn");


/* =========================================================
   2. PAGE INTRO
   ========================================================= */

document.body.classList.add("intro-active");


window.addEventListener("load", () => {

    setTimeout(() => {

        document.body.classList.remove("intro-active");

    }, 4200);

});


/* =========================================================
   3. PRODUCT FILTER
   =========================================================

   Products are now written directly in HTML.

   JavaScript ONLY shows/hides them.
   ========================================================= */

function filterProducts(category) {

    productCards.forEach((card, index) => {

        const cardCategory =
            card.dataset.category;

        const shouldShow =
            category === "all" ||
            cardCategory === category;


        if (shouldShow) {

            card.classList.remove(
                "filter-hidden"
            );

            card.classList.remove(
                "filter-visible"
            );

            /*
             * Small delay creates a clean
             * staggered entrance effect.
             */

            setTimeout(() => {

                card.classList.add(
                    "filter-visible"
                );

            }, index * 45);

        } else {

            card.classList.remove(
                "filter-visible"
            );

            card.classList.add(
                "filter-hidden"
            );

        }

    });

}


/* =========================================================
   4. FILTER BUTTONS
   ========================================================= */

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        const category =
            filter.dataset.filter;


        /* Remove active state */

        filters.forEach(button => {

            button.classList.remove("active");

        });


        /* Activate clicked button */

        filter.classList.add("active");


        /* Filter products */

        filterProducts(category);

    });

});


/* =========================================================
   5. INITIAL PRODUCT STATE
   ========================================================= */

filterProducts("all");


/* =========================================================
   6. NAVIGATION
   ========================================================= */

navLinks.forEach(link => {

    link.addEventListener("click", event => {

        const targetId =
            link.getAttribute("href");


        if (
            !targetId ||
            !targetId.startsWith("#")
        ) {
            return;
        }


        const target =
            document.querySelector(targetId);


        if (!target) {
            return;
        }


        event.preventDefault();


        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   7. ACTIVE NAVIGATION ON SCROLL
   ========================================================= */

const observerOptions = {

    root: null,

    rootMargin:
        "-35% 0px -55% 0px",

    threshold: 0

};


const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }


                const id =
                    entry.target.id;


                navLinks.forEach(link => {

                    link.classList.remove(
                        "active"
                    );


                    const linkTarget =
                        link.getAttribute("href");


                    if (
                        linkTarget === `#${id}`
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                });

            });

        },
        observerOptions
    );


sections.forEach(section => {

    sectionObserver.observe(section);

});


/* =========================================================
   8. LOGO / BRAND LINKS
   ========================================================= */

const brandLinks =
    document.querySelectorAll(
        ".brand[href='#home']"
    );


brandLinks.forEach(link => {

    link.addEventListener("click", event => {

        const home =
            document.getElementById("home");


        if (!home) {
            return;
        }


        event.preventDefault();


        home.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   9. IMAGE ERROR HANDLING
   =========================================================

   If an image filename is wrong, the broken image
   won't destroy the product card layout.
   ========================================================= */

const allImages =
    document.querySelectorAll("img");


allImages.forEach(image => {

    image.addEventListener("error", () => {

        image.classList.add(
            "image-error"
        );


        /*
         * Do not repeatedly trigger
         * the error event.
         */

        image.removeAttribute("src");

    });

});


/* =========================================================
   10. HERO IMAGE PRELOAD
   ========================================================= */

const heroImage =
    document.querySelector(
        ".cake-card img"
    );


if (heroImage) {

    const preload =
        new Image();

    preload.src =
        heroImage.src;

}


/* =========================================================
   11. INTERSECTION REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(
        ".story-content, .story-photo, .contact-copy, .contact-card"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }


                entry.target.classList.add(
                    "revealed"
                );


                revealObserver.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   12. CONTACT CARD MICRO INTERACTION
   ========================================================= */

const contactCards =
    document.querySelectorAll(
        ".contact-card"
    );


contactCards.forEach(card => {

    card.addEventListener(
        "mouseenter",
        () => {

            card.classList.add(
                "is-hovered"
            );

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.classList.remove(
                "is-hovered"
            );

        }
    );

});


/* =========================================================
   13. IMAGE LAZY LOAD FALLBACK
   ========================================================= */

const lazyImages =
    document.querySelectorAll(
        'img[loading="lazy"]'
    );


lazyImages.forEach(image => {

    image.addEventListener(
        "load",
        () => {

            image.classList.add(
                "loaded"
            );

        }
    );

});


/* =========================================================
   14. TOAST FUNCTION
   ========================================================= */

let toastTimer;


function showToast(message) {

    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* =========================================================
   15. PRODUCT IMAGE CLICK
   =========================================================

   Clicking a product image gives a subtle
   feedback without opening unnecessary popups.
   ========================================================= */

const productImages =
    document.querySelectorAll(
        ".product-card .product-img img"
    );


productImages.forEach(image => {

    image.addEventListener(
        "click",
        () => {

            const card =
                image.closest(
                    ".product-card"
                );


            if (!card) {
                return;
            }


            const name =
                card.querySelector("h3");


            if (name) {

                showToast(
                    `${name.textContent.trim()} — message us on Instagram to order.`
                );

            }

        }
    );

});


/* =========================================================
   16. PREVENT UNNECESSARY SCROLL JUMP
   ========================================================= */

window.addEventListener(
    "hashchange",
    () => {

        const target =
            document.querySelector(
                window.location.hash
            );


        if (!target) {
            return;
        }

    }
);


/* =========================================================
   17. KEYBOARD ACCESSIBILITY
   ========================================================= */

filters.forEach(filter => {

    filter.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                filter.click();

            }

        }
    );

});


/* =========================================================
   18. REDUCED MOTION
   ========================================================= */

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


if (prefersReducedMotion) {

    document.body.classList.add(
        "reduced-motion"
    );

}


/* =========================================================
   19. DEBUG MESSAGE
   ========================================================= */

console.log(
    "Felicita Treats website loaded successfully."
);

console.log(
    `Products loaded: ${productCards.length}`
);

/* =========================================================
   20. CART SYSTEM
   ========================================================= */

const cartTrigger = document.getElementById("cartTrigger");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartClose = document.getElementById("cartClose");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartSummary = document.getElementById("cartSummary");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartTotal = document.getElementById("cartTotal");
const cartItemLabel = document.getElementById("cartItemLabel");
const cartCheckoutBtn = document.getElementById("cartCheckoutBtn");
const mobileNavItems = document.querySelectorAll(".mobile-nav-item");

const productModal = document.getElementById("productModal");
const productModalBackdrop = document.getElementById("productModalBackdrop");
const productModalClose = document.getElementById("productModalClose");
const modalProductName = document.getElementById("modalProductName");
const modalProductDescription = document.getElementById("modalProductDescription");
const modalOptions = document.getElementById("modalOptions");

const checkoutPanel = document.getElementById("checkoutPanel");
const checkoutBackdrop = document.getElementById("checkoutBackdrop");
const checkoutClose = document.getElementById("checkoutClose");
const checkoutOrder = document.getElementById("checkoutOrder");
const checkoutTotal = document.getElementById("checkoutTotal");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const orderSuccessPanel = document.getElementById("orderSuccessPanel");
const orderSuccessBackdrop = document.getElementById("orderSuccessBackdrop");
const successOrderId = document.getElementById("successOrderId");
const copyOrderBtn = document.getElementById("copyOrderBtn");
const closeSuccessBtn = document.getElementById("closeSuccessBtn");

let latestOrderText = "";

let cart = [];
let selectedProduct = null;

try {
    cart = JSON.parse(localStorage.getItem("felicitaTreatsCart") || "[]");
    if (!Array.isArray(cart)) cart = [];
} catch (error) {
    cart = [];
}

function formatPrice(value) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getProductFromCard(card) {
    const name = card.querySelector("h3")?.textContent.trim() || "Product";
    const description = card.querySelector(".product-info > p")?.textContent.trim() || "";
    const image = card.querySelector(".product-img img")?.getAttribute("src") || "";
    const cakePrices = [...card.querySelectorAll(".cake-price")]
        .map(option => ({
            variant: option.querySelector("span")?.textContent.trim() || "",
            priceText: option.querySelector("strong")?.textContent.trim() || ""
        }))
        .filter(option => !option.priceText.includes("-"));

    if (cakePrices.length) {
        return { name, description, image, options: cakePrices };
    }

    const priceText = card.querySelector(".product-price")?.textContent.trim() || "₹0";
    const price = Number(priceText.replace(/[^0-9.]/g, "")) || 0;
    return {
        name,
        description,
        image,
        options: [{ variant: "Standard", priceText: formatPrice(price) }]
    };
}

function saveCart() {
    localStorage.setItem("felicitaTreatsCart", JSON.stringify(cart));
}

function totalCartQuantity() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function totalCartValue() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartBadge() {
    const quantity = totalCartQuantity();
    cartCount.textContent = quantity;
    cartCount.hidden = quantity === 0;
    cartItemLabel.textContent = `${quantity} ${quantity === 1 ? "item" : "items"}`;
}

function openCart() {
    cartPanel.classList.add("open");
    cartBackdrop.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
    cartTrigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("modal-open");
    renderCart();
}

function closeCart() {
    cartPanel.classList.remove("open");
    cartBackdrop.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
    cartTrigger.setAttribute("aria-expanded", "false");
    if (!productModal.classList.contains("open") && !checkoutPanel.classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
}

function addToCart(product, variant, priceVal, quantityToAdd = 1) {
    let price = 0;
    if (typeof priceVal === "number") {
        price = priceVal;
    } else {
        price = Number(String(priceVal).replace(/[^0-9.]/g, "")) || 0;
    }
    if (!price) return;

    const qty = Math.max(1, Number(quantityToAdd) || 1);
    const id = `${product.name}__${variant}`;
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += qty;
    } else {
        cart.push({
            id,
            name: product.name,
            variant,
            price,
            image: product.image || "",
            quantity: qty
        });
    }

    saveCart();
    updateCartBadge();
    renderCart();

    cartTrigger.classList.remove("bump");
    void cartTrigger.offsetWidth;
    cartTrigger.classList.add("bump");

    const qtyText = qty > 1 ? `${qty} Ã— ` : "";
    showToast(`Added ${qtyText}${product.name} (${variant}) to cart`);
}
function changeQuantity(id, delta) {
    const item = cart.find(entry => entry.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(entry => entry.id !== id);
    }
    saveCart();
    updateCartBadge();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
}

function renderCart() {
    cartItems.innerHTML = "";

    const hasItems = cart.length > 0;
    cartEmpty.classList.toggle("is-hidden", hasItems);
    cartSummary.classList.toggle("is-hidden", !hasItems);

    if (!hasItems) {
        updateCartBadge();
        return;
    }

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-line";
        row.innerHTML = `
            <div>
                <div class="cart-line-name">${escapeHtml(item.name)}</div>
                <div class="cart-line-variant">${escapeHtml(item.variant)}</div>
                <div class="cart-line-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
            <div class="cart-line-controls">
                <button class="qty-btn" type="button" data-action="decrease" data-id="${escapeHtml(item.id)}" aria-label="Decrease quantity">−</button>
                <span class="qty-number">${item.quantity}</span>
                <button class="qty-btn" type="button" data-action="increase" data-id="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button>
                <button class="remove-item" type="button" data-action="remove" data-id="${escapeHtml(item.id)}" aria-label="Remove item">×</button>
            </div>
        `;
        cartItems.appendChild(row);
    });

    const total = totalCartValue();
    cartSubtotal.textContent = formatPrice(total);
    cartTotal.textContent = formatPrice(total);
    updateCartBadge();
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
    }[char]));
}

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const id = button.dataset.id;
    const action = button.dataset.action;
    if (action === "increase") changeQuantity(id, 1);
    if (action === "decrease") changeQuantity(id, -1);
    if (action === "remove") removeFromCart(id);
});

function openProductModal(card) {
    selectedProduct = getProductFromCard(card);
    modalProductName.textContent = selectedProduct.name;
    modalProductDescription.textContent = selectedProduct.description;
    modalOptions.innerHTML = "";

    selectedProduct.options.forEach(option => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "modal-option";
        button.innerHTML = `<span>${escapeHtml(option.variant)}</span><strong>${escapeHtml(option.priceText)}</strong>`;
        button.addEventListener("click", () => {
            addToCart(selectedProduct, option.variant, option.priceText);
            closeProductModal();
            openCart();
        });
        modalOptions.appendChild(button);
    });

    productModal.classList.add("open");
    productModalBackdrop.classList.add("open");
    productModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeProductModal() {
    productModal.classList.remove("open");
    productModalBackdrop.classList.remove("open");
    productModal.setAttribute("aria-hidden", "true");
    selectedProduct = null;
    if (!cartPanel.classList.contains("open") && !checkoutPanel.classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
}

function openCheckout() {
    if (!cart.length) return;
    closeCart();
    checkoutOrder.innerHTML = cart.map(item => `
        <div class="checkout-row">
            <span>${item.quantity} × ${escapeHtml(item.name)} (${escapeHtml(item.variant)})</span>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
    `).join("");
    checkoutTotal.textContent = formatPrice(totalCartValue());
    checkoutPanel.classList.add("open");
    checkoutBackdrop.classList.add("open");
    checkoutPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeCheckout() {
    checkoutPanel.classList.remove("open");
    checkoutBackdrop.classList.remove("open");
    checkoutPanel.setAttribute("aria-hidden", "true");
    if (!cartPanel.classList.contains("open") && !productModal.classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
}

cartTrigger.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
cartCheckoutBtn.addEventListener("click", openCheckout);
productModalClose.addEventListener("click", closeProductModal);
productModalBackdrop.addEventListener("click", closeProductModal);
checkoutClose.addEventListener("click", closeCheckout);
checkoutBackdrop.addEventListener("click", closeCheckout);

// Product actions: Every menu item gets a quantity stepper and dedicated Add to Cart button.
// The price dynamically updates whenever size variant or quantity is changed.
productCards.forEach(card => {
    const product = getProductFromCard(card);
    const info = card.querySelector(".product-info");
    if (!info) return;

    const cakeOptions = [...card.querySelectorAll(".cake-price")];
    let selectedVariant = "Standard";
    let unitPrice = 0;
    let cardQty = 1;

    if (cakeOptions.length) {
        const availableOptions = cakeOptions.filter(el => {
            const txt = el.querySelector("strong")?.textContent.trim() || "";
            return txt && !txt.includes("-");
        });

        if (availableOptions.length > 0) {
            const first = availableOptions[0];
            first.classList.add("is-active");
            selectedVariant = first.querySelector("span")?.textContent.trim() || "Standard";
            unitPrice = Number(first.querySelector("strong")?.textContent.replace(/[^0-9.]/g, "")) || 0;
        }

        availableOptions.forEach(optionEl => {
            optionEl.setAttribute("role", "button");
            optionEl.setAttribute("tabindex", "0");
            optionEl.addEventListener("click", () => {
                availableOptions.forEach(o => o.classList.remove("is-active"));
                optionEl.classList.add("is-active");
                selectedVariant = optionEl.querySelector("span")?.textContent.trim() || "Standard";
                unitPrice = Number(optionEl.querySelector("strong")?.textContent.replace(/[^0-9.]/g, "")) || 0;
                updateCardPrice();
            });
        });
    } else {
        const priceEl = card.querySelector(".product-price");
        const priceText = priceEl?.textContent.trim() || "";
        unitPrice = Number(priceText.replace(/[^0-9.]/g, "")) || 0;
        selectedVariant = product.options[0]?.variant || "Standard";
    }

    if (unitPrice === 0) return;

    let actionBar = info.querySelector(".card-action-bar");
    if (!actionBar) {
        actionBar = document.createElement("div");
        actionBar.className = "card-action-bar";
        actionBar.innerHTML = `
            <div class="card-qty-stepper">
                <button type="button" class="card-qty-btn dec-btn" aria-label="Decrease quantity">-</button>
                <span class="card-qty-value">1</span>
                <button type="button" class="card-qty-btn inc-btn" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="card-add-btn">
                <span>Add to Cart</span>
                <strong class="card-live-price">${formatPrice(unitPrice)}</strong>
            </button>
        `;
        info.appendChild(actionBar);
    }

    const qtyValEl = actionBar.querySelector(".card-qty-value");
    const decBtn = actionBar.querySelector(".dec-btn");
    const incBtn = actionBar.querySelector(".inc-btn");
    const addBtn = actionBar.querySelector(".card-add-btn");
    const priceDisplay = actionBar.querySelector(".card-live-price");

    function updateCardPrice() {
        const total = unitPrice * cardQty;
        if (priceDisplay) priceDisplay.textContent = formatPrice(total);
        if (qtyValEl) qtyValEl.textContent = cardQty;
    }

    decBtn?.addEventListener("click", e => {
        e.stopPropagation();
        if (cardQty > 1) {
            cardQty -= 1;
            updateCardPrice();
        }
    });

    incBtn?.addEventListener("click", e => {
        e.stopPropagation();
        if (cardQty < 99) {
            cardQty += 1;
            updateCardPrice();
        }
    });

    addBtn?.addEventListener("click", e => {
        e.stopPropagation();
        addToCart(product, selectedVariant, unitPrice, cardQty);

        addBtn.classList.add("is-added");
        const origHtml = addBtn.innerHTML;
        addBtn.innerHTML = `<span>Added! &#10003;</span><strong>(${cardQty})</strong>`;
        setTimeout(() => {
            addBtn.classList.remove("is-added");
            addBtn.innerHTML = origHtml;
            updateCardPrice();
        }, 1200);
    });

    updateCardPrice();
});
// Mobile bottom navigation uses the same sections as the desktop navigation.
mobileNavItems.forEach(item => {
    item.addEventListener("click", event => {
        const target = document.querySelector(item.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        mobileNavItems.forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");
    });
});

// Keep the mobile active state synchronized with the existing section observer.
const mobileSectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        mobileNavItems.forEach(item => {
            item.classList.toggle("active", item.dataset.navTarget === entry.target.id);
        });
    });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

sections.forEach(section => mobileSectionObserver.observe(section));

// Existing "Explore the menu" cart link closes the cart after navigation.
document.querySelector(".cart-shop-link")?.addEventListener("click", () => {
    closeCart();
});

function openOrderSuccess(orderId) {
    successOrderId.textContent = orderId;
    orderSuccessPanel.classList.add("open");
    orderSuccessBackdrop.classList.add("open");
    orderSuccessPanel.setAttribute("aria-hidden", "false");
    orderSuccessBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeOrderSuccess() {
    orderSuccessPanel.classList.remove("open");
    orderSuccessBackdrop.classList.remove("open");
    orderSuccessPanel.setAttribute("aria-hidden", "true");
    orderSuccessBackdrop.setAttribute("aria-hidden", "true");
    if (!checkoutPanel.classList.contains("open") && !cartPanel.classList.contains("open") && !productModal.classList.contains("open")) {
        document.body.classList.remove("modal-open");
    }
}


// =========================================================
// 2-STEP CHECKOUT & VERIFIED PAYMENT GATEWAY
// =========================================================

const OFFICIAL_UPI_ID = "9059499756@axl";
const OFFICIAL_UPI_NAME = "Felicita Treats";
const OWNER_PHONE = "919515372424";

// 2-Step Stepper Elements
const checkoutStep1 = document.getElementById("checkoutStep1");
const checkoutStep2 = document.getElementById("checkoutStep2");
const stepTab1 = document.getElementById("stepTab1");
const stepTab2 = document.getElementById("stepTab2");
const proceedToPaymentBtn = document.getElementById("proceedToPaymentBtn");
const backToStep1Btn = document.getElementById("backToStep1Btn");
const editDetailsBtn = document.getElementById("editDetailsBtn");
const step1CheckoutTotal = document.getElementById("step1CheckoutTotal");

// Step 1 Form
const customerAddress = document.getElementById("customerAddress");
const deliveryDate = document.getElementById("deliveryDate");
const deliveryTime = document.getElementById("deliveryTime");
const customerNotes = document.getElementById("customerNotes");
const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const addressError = document.getElementById("addressError");

// Step 2 Review Card
const summaryCustomerName = document.getElementById("summaryCustomerName");
const summaryCustomerPhone = document.getElementById("summaryCustomerPhone");
const summaryCustomerAddress = document.getElementById("summaryCustomerAddress");
const summaryCustomerSlot = document.getElementById("summaryCustomerSlot");

// Payment Tabs & Views
const paymentTabBtns = document.querySelectorAll(".payment-tab-btn");
const upiPaymentView = document.getElementById("upiPaymentView");
const razorpayPaymentView = document.getElementById("razorpayPaymentView");
const debitCardPaymentView = document.getElementById("debitCardPaymentView");
const creditCardPaymentView = document.getElementById("creditCardPaymentView");
const copyUpiBtn = document.getElementById("copyUpiBtn");

// UPI 1-Click App Buttons
const payViaGPayBtn = document.getElementById("payViaGPayBtn");
const payViaPhonePeBtn = document.getElementById("payViaPhonePeBtn");
const payViaPaytmBtn = document.getElementById("payViaPaytmBtn");
const payViaGenericUpiBtn = document.getElementById("payViaGenericUpiBtn");
const payViaRazorpayBtn = document.getElementById("payViaRazorpayBtn");

// Debit Card Form
const debitCardNumber = document.getElementById("debitCardNumber");
const debitCardExpiry = document.getElementById("debitCardExpiry");
const debitCardCvv = document.getElementById("debitCardCvv");
const debitCardHolder = document.getElementById("debitCardHolder");
const payDebitCardBtn = document.getElementById("payDebitCardBtn");

// Credit Card Form
const creditCardNumber = document.getElementById("creditCardNumber");
const creditCardExpiry = document.getElementById("creditCardExpiry");
const creditCardCvv = document.getElementById("creditCardCvv");
const creditCardHolder = document.getElementById("creditCardHolder");
const payCreditCardBtn = document.getElementById("payCreditCardBtn");

// Payment Gateway Verification Modal
const gatewayVerifyModal = document.getElementById("gatewayVerifyModal");
const gatewayCancelXBtn = document.getElementById("gatewayCancelXBtn");
const gatewayCancelPaymentBtn = document.getElementById("gatewayCancelPaymentBtn");
const gatewayPayableAmount = document.getElementById("gatewayPayableAmount");
const gatewayAppTitle = document.getElementById("gatewayAppTitle");
const gatewayStatusSub = document.getElementById("gatewayStatusSub");
const gatewayTimerCount = document.getElementById("gatewayTimerCount");
const gatewayUtrInput = document.getElementById("gatewayUtrInput");
const gatewayUtrCount = document.getElementById("gatewayUtrCount");
const gatewayErrorMsg = document.getElementById("gatewayErrorMsg");
const gatewayConfirmVerifyBtn = document.getElementById("gatewayConfirmVerifyBtn");
const gatewaySpinner = document.getElementById("gatewaySpinner");
const gatewayVerifyBtnLabel = document.getElementById("gatewayVerifyBtnLabel");

// 3DS Card Modal
const bankOtpBackdrop = document.getElementById("bankOtpBackdrop");
const bankCloseBtn = document.getElementById("bankCloseBtn");
const bankOtpCancelBtn = document.getElementById("bankOtpCancelBtn");
const bankAuthAmount = document.getElementById("bankAuthAmount");
const bankOtpInput = document.getElementById("bankOtpInput");
const bankOtpError = document.getElementById("bankOtpError");
const bankOtpSubmitBtn = document.getElementById("bankOtpSubmitBtn");
const bankSubmitBtnLabel = document.getElementById("bankSubmitBtnLabel");

// Receipt Modal
const successPaymentStatus = document.getElementById("successPaymentStatus");
const successGreeting = document.getElementById("successGreeting");
const successOrderSummaryBox = document.getElementById("successOrderSummaryBox");
const openWhatsAppNotifyBtn = document.getElementById("openWhatsAppNotifyBtn");
const printReceiptBtn = document.getElementById("printReceiptBtn");

let activeGatewayOrder = null;
let activeGatewayApp = "";
let activeGatewayMethod = "upi";
let gatewayTimerInterval = null;
let activeCardOrder = null;

function initDeliveryDate() {
    if (!deliveryDate) return;
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;
    deliveryDate.min = todayStr;
    if (!deliveryDate.value) deliveryDate.value = todayStr;
}

const origOpenCheckout = openCheckout;
openCheckout = function() {
    if (!cart.length) {
        showToast("Your cart is empty");
        return;
    }
    initDeliveryDate();
    goToStep(1);
    origOpenCheckout();
    const total = totalCartValue();
    if (step1CheckoutTotal) step1CheckoutTotal.textContent = formatPrice(total);
    if (checkoutTotal) checkoutTotal.textContent = formatPrice(total);
};

function goToStep(step) {
    if (step === 2) {
        if (!validateStep1()) return;

        const name = customerName?.value.trim() || "";
        const phone = customerPhone?.value.replace(/\D/g, "") || "";
        const address = customerAddress?.value.trim() || "";
        const date = deliveryDate?.value || "Today";
        const time = deliveryTime?.value || "Evening Slot";

        if (summaryCustomerName) summaryCustomerName.textContent = name;
        if (summaryCustomerPhone) summaryCustomerPhone.textContent = `ðŸ“ž +91 ${phone}`;
        if (summaryCustomerAddress) summaryCustomerAddress.textContent = `ðŸ“ ${address}, Visakhapatnam`;
        if (summaryCustomerSlot) summaryCustomerSlot.textContent = `ðŸ“… ${date} â€¢ ${time}`;

        checkoutStep1?.classList.add("is-hidden");
        checkoutStep2?.classList.remove("is-hidden");
        stepTab1?.classList.remove("is-active");
        stepTab2?.classList.add("is-active");
        checkoutPanel.scrollTop = 0;
    } else {
        checkoutStep2?.classList.add("is-hidden");
        checkoutStep1?.classList.remove("is-hidden");
        stepTab2?.classList.remove("is-active");
        stepTab1?.classList.add("is-active");
        checkoutPanel.scrollTop = 0;
    }
}

function setFieldError(input, errorEl, msg) {
    if (!errorEl) return;
    if (msg) {
        errorEl.textContent = msg;
        errorEl.classList.add("visible");
        input?.focus();
    } else {
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
    }
}

function validateStep1() {
    const name = customerName?.value.trim() || "";
    const phone = customerPhone?.value.replace(/\D/g, "") || "";
    const address = customerAddress?.value.trim() || "";

    if (!name || name.length < 2) {
        setFieldError(customerName, nameError, "Please enter your full name (at least 2 letters)");
        return false;
    }
    setFieldError(customerName, nameError, "");

    if (!phone || phone.length !== 10) {
        setFieldError(customerPhone, phoneError, "Please enter a valid 10-digit mobile number");
        return false;
    }
    setFieldError(customerPhone, phoneError, "");

    if (!address || address.length < 5) {
        setFieldError(customerAddress, addressError, "Please enter your delivery address & landmark in Vizag");
        return false;
    }
    setFieldError(customerAddress, addressError, "");

    return true;
}

proceedToPaymentBtn?.addEventListener("click", () => goToStep(2));
backToStep1Btn?.addEventListener("click", () => goToStep(1));
editDetailsBtn?.addEventListener("click", () => goToStep(1));

// Payment method tab switching
paymentTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        paymentTabBtns.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const method = btn.dataset.method;

        upiPaymentView?.classList.toggle("is-hidden", method !== "upi");
        razorpayPaymentView?.classList.toggle("is-hidden", method !== "razorpay");
        debitCardPaymentView?.classList.toggle("is-hidden", method !== "debit");
        creditCardPaymentView?.classList.toggle("is-hidden", method !== "credit");
    });
});

copyUpiBtn?.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(OFFICIAL_UPI_ID);
        copyUpiBtn.textContent = "Copied! âœ“";
        showToast(`Bakery UPI ID (${OFFICIAL_UPI_ID}) copied`);
        setTimeout(() => { copyUpiBtn.textContent = "Copy"; }, 2000);
    } catch {
        showToast(`UPI ID: ${OFFICIAL_UPI_ID}`);
    }
});

// Card Auto-Formatters
[debitCardNumber, creditCardNumber].forEach(input => {
    input?.addEventListener("input", e => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 16);
        e.target.value = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    });
});

[debitCardExpiry, creditCardExpiry].forEach(input => {
    input?.addEventListener("input", e => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (val.length >= 2) {
            e.target.value = val.slice(0, 2) + "/" + val.slice(2);
        } else {
            e.target.value = val;
        }
    });
});

function buildOrderPayload(methodKey, methodName) {
    const orderId = `FT-${Math.floor(100000 + Math.random() * 900000)}`;
    const name = customerName.value.trim();
    const phone = customerPhone.value.replace(/\D/g, "");
    const address = customerAddress.value.trim();
    const date = deliveryDate?.value || "Today";
    const time = deliveryTime?.value || "Evening Slot";
    const notes = customerNotes?.value.trim() || "";
    const total = totalCartValue();

    return {
        orderId,
        name,
        phone,
        address,
        deliveryDate: date,
        deliveryTime: time,
        notes,
        paymentMethod: methodKey,
        paymentDetails: {
            methodName: methodName,
            status: "Pending Verification"
        },
        items: cart.map(item => ({ ...item })),
        total,
        createdAt: new Date().toISOString()
    };
}

// 1. RAZORPAY AUTOMATED MERCHANT GATEWAY CHECKOUT
payViaRazorpayBtn?.addEventListener("click", async () => {
    if (!validateStep1()) {
        goToStep(1);
        return;
    }
    if (!cart.length) {
        showToast("Your cart is empty");
        return;
    }

    const order = buildOrderPayload("razorpay", "Razorpay Gateway");
    payViaRazorpayBtn.disabled = true;
    payViaRazorpayBtn.innerHTML = `<span>Connecting to Razorpay Gateway...</span>`;

    try {
        const rzpInitRes = await fetch("/api/create-razorpay-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: order.total,
                orderId: order.orderId,
                name: order.name,
                phone: order.phone
            })
        });

        const rzpInitData = await rzpInitRes.json();
        if (!rzpInitData.ok) {
            showToast(rzpInitData.error || "Unable to start Razorpay");
            return;
        }

        const options = {
            key: rzpInitData.keyId,
            amount: Math.round(order.total * 100),
            currency: "INR",
            name: "Felicita Treats",
            description: `Order ${order.orderId}`,
            image: "images/logo1.png",
            order_id: rzpInitData.isDemo ? undefined : rzpInitData.razorpayOrderId,
            prefill: {
                name: order.name,
                contact: `+91${order.phone}`
            },
            theme: { color: "#a85c52" },
            handler: async function(response) {
                try {
                    const verifyRes = await fetch("/api/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            orderId: order.orderId,
                            amount: order.total,
                            paymentMethod: "razorpay",
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature
                        })
                    });

                    const verifyData = await verifyRes.json();
                    if (verifyData.ok && verifyData.verified) {
                        order.paymentDetails = {
                            methodName: "Razorpay (Verified Gateway)",
                            gatewayTxnId: response.razorpay_payment_id,
                            status: "Verified & Paid"
                        };
                        await finalizeVerifiedOrder(order);
                    } else {
                        showToast(`Verification rejected: ${verifyData.error || "Transaction not verified"}`);
                    }
                } catch {
                    showToast("Error verifying Razorpay settlement.");
                }
            },
            modal: {
                ondismiss: function() {
                    showToast("Razorpay payment cancelled. Order was not placed.");
                }
            }
        };

        if (window.Razorpay) {
            const rzpInstance = new window.Razorpay(options);
            rzpInstance.open();
        } else {
            showToast("Razorpay SDK not loaded. Falling back to UPI direct apps.");
            const upiTab = document.querySelector('[data-method="upi"]');
            upiTab?.click();
        }
    } catch (e) {
        console.error("Razorpay error:", e);
        showToast("Gateway error. Please use direct UPI or Card.");
    } finally {
        payViaRazorpayBtn.disabled = false;
        payViaRazorpayBtn.innerHTML = `<span>Pay via Official Razorpay Gateway</span>`;
    }
});

// 2. UPI 1-Click App Payment Launch
function initiateUpiApp(appName, methodKey) {
    if (!validateStep1()) {
        goToStep(1);
        return;
    }
    if (!cart.length) {
        showToast("Your cart is empty");
        return;
    }

    const total = totalCartValue();
    const order = buildOrderPayload(methodKey, `${appName} (UPI)`);
    activeGatewayOrder = order;
    activeGatewayApp = appName;
    activeGatewayMethod = methodKey;

    let deepLink = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodeURIComponent(OFFICIAL_UPI_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order ${order.orderId}`)}`;
    if (methodKey === "phonepe") {
        deepLink = `phonepe://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodeURIComponent(OFFICIAL_UPI_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order ${order.orderId}`)}`;
    } else if (methodKey === "paytm") {
        deepLink = `paytmmp://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodeURIComponent(OFFICIAL_UPI_NAME)}&am=${total}&cu=INR&tn=${encodeURIComponent(`Order ${order.orderId}`)}`;
    }

    try {
        window.location.href = deepLink;
    } catch (e) {
        console.log("App redirect triggered", e);
    }

    if (gatewayPayableAmount) gatewayPayableAmount.textContent = formatPrice(total);
    if (gatewayAppTitle) gatewayAppTitle.textContent = `${appName} Verification`;
    if (gatewayStatusSub) gatewayStatusSub.textContent = `Please approve the transfer of ${formatPrice(total)} in ${appName}, then enter the Bank UTR.`;
    if (gatewayUtrInput) gatewayUtrInput.value = "";
    if (gatewayUtrCount) gatewayUtrCount.textContent = "0 / 12";
    if (gatewayErrorMsg) {
        gatewayErrorMsg.textContent = "";
        gatewayErrorMsg.classList.remove("visible");
    }

    let timeLeft = 299;
    clearInterval(gatewayTimerInterval);
    gatewayTimerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(gatewayTimerInterval);
            if (gatewayTimerCount) gatewayTimerCount.textContent = "00:00 (Expired)";
            if (gatewayErrorMsg) {
                gatewayErrorMsg.textContent = "Session expired. Please restart payment.";
                gatewayErrorMsg.classList.add("visible");
            }
        } else {
            const m = Math.floor(timeLeft / 60);
            const s = timeLeft % 60;
            if (gatewayTimerCount) gatewayTimerCount.textContent = `0${m}:${s < 10 ? '0' : ''}${s}`;
        }
    }, 1000);

    gatewayVerifyModal?.classList.add("open");
    gatewayVerifyModal?.setAttribute("aria-hidden", "false");
}

payViaGPayBtn?.addEventListener("click", () => initiateUpiApp("Google Pay", "gpay"));
payViaPhonePeBtn?.addEventListener("click", () => initiateUpiApp("PhonePe", "phonepe"));
payViaPaytmBtn?.addEventListener("click", () => initiateUpiApp("Paytm", "paytm"));
payViaGenericUpiBtn?.addEventListener("click", () => initiateUpiApp("Other UPI App", "upi"));

gatewayUtrInput?.addEventListener("input", e => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 12);
    e.target.value = val;
    if (gatewayUtrCount) gatewayUtrCount.textContent = `${val.length} / 12`;
    if (val.length === 12 && gatewayErrorMsg) {
        gatewayErrorMsg.textContent = "";
        gatewayErrorMsg.classList.remove("visible");
    }
});

function closeGatewayModal() {
    clearInterval(gatewayTimerInterval);
    gatewayVerifyModal?.classList.remove("open");
    gatewayVerifyModal?.setAttribute("aria-hidden", "true");
    activeGatewayOrder = null;
}

gatewayCancelXBtn?.addEventListener("click", () => {
    closeGatewayModal();
    showToast("Payment cancelled. Order was not placed.");
});

gatewayCancelPaymentBtn?.addEventListener("click", () => {
    closeGatewayModal();
    showToast("Payment cancelled. No money was deducted.");
});

gatewayConfirmVerifyBtn?.addEventListener("click", async () => {
    if (!activeGatewayOrder) {
        showToast("Session expired. Please restart checkout.");
        closeGatewayModal();
        return;
    }

    const utr = gatewayUtrInput?.value.replace(/\D/g, "") || "";
    if (utr.length !== 12) {
        if (gatewayErrorMsg) {
            gatewayErrorMsg.textContent = "Please enter the complete 12-digit Bank Reference / UTR Number from your payment receipt.";
            gatewayErrorMsg.classList.add("visible");
        }
        gatewayUtrInput?.focus();
        return;
    }

    gatewayConfirmVerifyBtn.disabled = true;
    gatewaySpinner?.classList.add("is-spinning");
    if (gatewayVerifyBtnLabel) gatewayVerifyBtnLabel.textContent = "Verifying with Bank...";

    try {
        const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderId: activeGatewayOrder.orderId,
                amount: activeGatewayOrder.total,
                paymentMethod: activeGatewayMethod,
                utr: utr
            })
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.ok || !verifyData.verified) {
            if (gatewayErrorMsg) {
                gatewayErrorMsg.textContent = `âŒ Verification Failed: ${verifyData.error || "No matching bank settlement found."}`;
                gatewayErrorMsg.classList.add("visible");
            }
            return;
        }

        activeGatewayOrder.paymentDetails = {
            methodName: `${activeGatewayApp} (Verified Gateway)`,
            utr: utr,
            gatewayTxnId: verifyData.gatewayTxnId,
            status: "Verified & Paid"
        };

        const finalOrder = activeGatewayOrder;
        closeGatewayModal();
        await finalizeVerifiedOrder(finalOrder);
    } catch {
        if (gatewayErrorMsg) {
            gatewayErrorMsg.textContent = "Unable to reach verification server. Please check your connection.";
            gatewayErrorMsg.classList.add("visible");
        }
    } finally {
        gatewayConfirmVerifyBtn.disabled = false;
        gatewaySpinner?.classList.remove("is-spinning");
        if (gatewayVerifyBtnLabel) gatewayVerifyBtnLabel.textContent = "Verify Payment & Confirm Order";
    }
});

// 3. Card Payment Initiation
payDebitCardBtn?.addEventListener("click", () => handleCardPay("debit", "Debit Card"));
payCreditCardBtn?.addEventListener("click", () => handleCardPay("credit", "Credit Card"));

function handleCardPay(cardType, typeName) {
    if (!validateStep1()) {
        goToStep(1);
        return;
    }
    const numInput = cardType === "debit" ? debitCardNumber : creditCardNumber;
    const expInput = cardType === "debit" ? debitCardExpiry : creditCardExpiry;
    const cvvInput = cardType === "debit" ? debitCardCvv : creditCardCvv;
    const rawCard = numInput?.value.replace(/\s/g, "") || "";

    if (rawCard.length < 15 || !expInput?.value || !cvvInput?.value) {
        showToast("Please enter complete card details");
        numInput?.focus();
        return;
    }

    const order = buildOrderPayload(cardType, `${typeName} (3DS Secure)`);
    activeCardOrder = order;
    if (bankAuthAmount) bankAuthAmount.textContent = formatPrice(order.total);
    if (bankOtpInput) bankOtpInput.value = "";
    if (bankOtpError) {
        bankOtpError.textContent = "";
        bankOtpError.classList.remove("visible");
    }

    bankOtpBackdrop?.classList.add("open");
    bankOtpBackdrop?.setAttribute("aria-hidden", "false");
    setTimeout(() => bankOtpInput?.focus(), 300);
}

function closeCardModal() {
    bankOtpBackdrop?.classList.remove("open");
    bankOtpBackdrop?.setAttribute("aria-hidden", "true");
    activeCardOrder = null;
}

bankCloseBtn?.addEventListener("click", () => {
    closeCardModal();
    showToast("Card payment cancelled. Order was not placed.");
});

bankOtpCancelBtn?.addEventListener("click", () => {
    closeCardModal();
    showToast("Card payment cancelled. No money was charged.");
});

bankOtpSubmitBtn?.addEventListener("click", async () => {
    const otp = bankOtpInput?.value.replace(/\D/g, "") || "";
    if (otp.length !== 6) {
        if (bankOtpError) {
            bankOtpError.textContent = "Please enter the 6-digit Bank OTP (Demo: 123456)";
            bankOtpError.classList.add("visible");
        }
        bankOtpInput?.focus();
        return;
    }

    bankOtpSubmitBtn.disabled = true;
    if (bankSubmitBtnLabel) bankSubmitBtnLabel.textContent = "Authorizing...";

    try {
        const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderId: activeCardOrder.orderId,
                amount: activeCardOrder.total,
                paymentMethod: activeCardOrder.paymentMethod,
                otp: otp
            })
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.ok || !verifyData.verified) {
            if (bankOtpError) {
                bankOtpError.textContent = `âŒ ${verifyData.error || "Authorization declined by issuing bank."}`;
                bankOtpError.classList.add("visible");
            }
            return;
        }

        activeCardOrder.paymentDetails = {
            methodName: activeCardOrder.paymentDetails.methodName,
            gatewayTxnId: verifyData.gatewayTxnId,
            status: "Verified & Paid"
        };

        const finalOrder = activeCardOrder;
        closeCardModal();
        await finalizeVerifiedOrder(finalOrder);
    } catch {
        if (bankOtpError) {
            bankOtpError.textContent = "Bank authorization error. Please try again.";
            bankOtpError.classList.add("visible");
        }
    } finally {
        bankOtpSubmitBtn.disabled = false;
        if (bankSubmitBtnLabel) bankSubmitBtnLabel.textContent = "Authorize & Pay";
    }
});

// Finalize Verified Order & Send Automated Owner WhatsApp Alert
async function finalizeVerifiedOrder(orderRecord) {
    const paymentBadge = [
        "ðŸŸ¢ PAYMENT STATUS: VERIFIED & PAID",
        `ðŸ’³ Method: ${orderRecord.paymentDetails?.methodName || 'Online Gateway'}`,
        `ðŸ”¢ Txn Ref: ${orderRecord.paymentDetails?.gatewayTxnId || orderRecord.paymentDetails?.utr || 'VERIFIED'}`,
        `ðŸ’° Amount: ${formatPrice(orderRecord.total)}`
    ].join("\n");

    const messageText = [
        "ðŸ° FELICITA TREATS â€” VISAKHAPATNAM",
        "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”",
        `ðŸ†• NEW ORDER #${orderRecord.orderId}`,
        "",
        paymentBadge,
        "",
        "ðŸ‘¤ CUSTOMER DETAILS:",
        `Name: ${orderRecord.name}`,
        `Phone: +91 ${orderRecord.phone}`,
        `Address: ${orderRecord.address}, Visakhapatnam`,
        `Delivery Slot: ${orderRecord.deliveryDate} (${orderRecord.deliveryTime})`,
        orderRecord.notes ? `Baker Note: ${orderRecord.notes}` : "",
        "",
        "ðŸ›’ ORDERED ITEMS:",
        ...orderRecord.items.map(item => `â€¢ ${item.quantity} Ã— ${item.name} (${item.variant}) â€” ${formatPrice(item.price * item.quantity)}`),
        "",
        `ðŸ’µ TOTAL AMOUNT: ${formatPrice(orderRecord.total)}`,
        "â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”",
        "ðŸŒ Verified Online Order via Felicita Treats"
    ].filter(Boolean).join("\n");

    orderRecord.message = messageText;

    // Save to localStorage (both last order and all orders for admin)
    localStorage.setItem("felicitaLastOrder", JSON.stringify(orderRecord));
    try {
        const all = JSON.parse(localStorage.getItem("felicita_all_orders") || "[]");
        all.unshift(orderRecord);
        localStorage.setItem("felicita_all_orders", JSON.stringify(all));
    } catch (e) {
        console.warn(e);
    }

    // Submit to serverless order API (triggers automated server WhatsApp to owner +91 9515372424)
    try {
        await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderRecord)
        });
    } catch (apiErr) {
        console.warn("API offline fallback:", apiErr);
    }

    // Direct WhatsApp message browser fallback
    const waUrl = `https://api.whatsapp.com/send?phone=${OWNER_PHONE}&text=${encodeURIComponent(messageText)}`;
    try {
        window.open(waUrl, "_blank");
    } catch (waErr) {
        console.log("Popup blocked", waErr);
    }

    // Clear Cart
    cart = [];
    saveCart();
    updateCartBadge();
    renderCart();

    closeCheckout();
    displayOrderReceipt(orderRecord);
    showToast(`Payment verified! Order #${orderRecord.orderId} confirmed ðŸŽ‰`);
}

function displayOrderReceipt(orderRecord) {
    if (successOrderId) successOrderId.textContent = orderRecord.orderId;
    if (successGreeting) successGreeting.textContent = `Thank you, ${orderRecord.name}!`;
    if (successPaymentStatus) {
        const ref = orderRecord.paymentDetails?.gatewayTxnId || orderRecord.paymentDetails?.utr || "VERIFIED";
        successPaymentStatus.textContent = `â— Payment Verified & Paid via ${orderRecord.paymentDetails?.methodName || 'Gateway'} (Ref: ${ref})`;
    }

    if (successOrderSummaryBox) {
        successOrderSummaryBox.innerHTML = `
            <div class="receipt-line"><span>Customer:</span><strong>${orderRecord.name} (+91 ${orderRecord.phone})</strong></div>
            <div class="receipt-line"><span>Address:</span><strong>${orderRecord.address}, Vizag</strong></div>
            <div class="receipt-line"><span>Slot:</span><strong>${orderRecord.deliveryDate} â€¢ ${orderRecord.deliveryTime}</strong></div>
            <div style="margin: 8px 0; border-top: 1px dashed var(--line);"></div>
            ${orderRecord.items.map(i => `
                <div class="receipt-line">
                    <span>${i.quantity} Ã— ${escapeHtml(i.name)} (${escapeHtml(i.variant)})</span>
                    <strong>${formatPrice(i.price * i.quantity)}</strong>
                </div>
            `).join("")}
            <div style="margin: 8px 0; border-top: 1px solid var(--line);"></div>
            <div class="receipt-line" style="font-size: 14px; font-weight: 700;"><span>Total Paid:</span><strong>${formatPrice(orderRecord.total)}</strong></div>
        `;
    }

    if (openWhatsAppNotifyBtn) {
        openWhatsAppNotifyBtn.href = `https://api.whatsapp.com/send?phone=${OWNER_PHONE}&text=${encodeURIComponent(orderRecord.message || "")}`;
    }

    orderSuccessPanel?.classList.add("open");
    orderSuccessBackdrop?.classList.add("open");
    orderSuccessPanel?.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

printReceiptBtn?.addEventListener("click", () => window.print());
closeSuccessBtn?.addEventListener("click", closeOrderSuccess);
orderSuccessBackdrop?.addEventListener("click", closeOrderSuccess);

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (gatewayVerifyModal?.classList.contains("open")) closeGatewayModal();
    else if (bankOtpBackdrop?.classList.contains("open")) closeCardModal();
    else if (orderSuccessPanel?.classList.contains("open")) closeOrderSuccess();
    else if (checkoutPanel?.classList.contains("open")) closeCheckout();
    else if (productModal?.classList.contains("open")) closeProductModal();
    else if (cartPanel?.classList.contains("open")) closeCart();
});

updateCartBadge();
renderCart();
