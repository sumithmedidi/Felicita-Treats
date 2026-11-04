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
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerAddress = document.getElementById("customerAddress");
const customerNotes = document.getElementById("customerNotes");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const placeOrderBtnText = document.getElementById("placeOrderBtnText");

const paymentCards = document.querySelectorAll(".payment-card");
const upiPaymentView = document.getElementById("upiPaymentView");
const cardPaymentView = document.getElementById("cardPaymentView");
const copyUpiBtn = document.getElementById("copyUpiBtn");
const upiIntentBtn = document.getElementById("upiIntentBtn");
const customerUtr = document.getElementById("customerUtr");
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("cardExpiry");
const cardCvv = document.getElementById("cardCvv");
const cardHolder = document.getElementById("cardHolder");

const orderSuccessPanel = document.getElementById("orderSuccessPanel");
const orderSuccessBackdrop = document.getElementById("orderSuccessBackdrop");
const closeSuccessXBtn = document.getElementById("closeSuccessXBtn");
const successGreeting = document.getElementById("successGreeting");
const successOrderId = document.getElementById("successOrderId");
const successPaymentStatus = document.getElementById("successPaymentStatus");
const successCustomerName = document.getElementById("successCustomerName");
const successCustomerPhone = document.getElementById("successCustomerPhone");
const successDeliveryAddress = document.getElementById("successDeliveryAddress");
const successOrderDate = document.getElementById("successOrderDate");
const successItemsTable = document.getElementById("successItemsTable");
const successReceiptSubtotal = document.getElementById("successReceiptSubtotal");
const successReceiptTotal = document.getElementById("successReceiptTotal");
const printReceiptBtn = document.getElementById("printReceiptBtn");
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

function addToCart(product, variant, priceText, quantityToAdd = 1) {
    const price = Number(String(priceText).replace(/[^0-9.]/g, "")) || 0;
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
            image: product.image,
            quantity: qty
        });
    }

    saveCart();
    updateCartBadge();
    renderCart();

    cartTrigger.classList.remove("bump");
    void cartTrigger.offsetWidth;
    cartTrigger.classList.add("bump");

    showToast(`Added ${qty} × ${product.name} to cart`);
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

let selectedPaymentMethod = "upi";
let isSubmitting = false;

// Field error elements
const nameError = document.getElementById("nameError");
const phoneError = document.getElementById("phoneError");
const addressError = document.getElementById("addressError");
const cardError = document.getElementById("cardError");
const btnSpinner = document.getElementById("btnSpinner");

function setFieldError(input, errorEl, message) {
    if (!input || !errorEl) return;
    if (message) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
        errorEl.textContent = message;
        errorEl.classList.add("visible");
    } else {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        errorEl.textContent = "";
        errorEl.classList.remove("visible");
    }
}

function clearFieldErrors() {
    [customerName, customerPhone, customerAddress, cardNumber, cardExpiry, cardCvv].forEach(input => {
        input?.classList.remove("is-invalid", "is-valid");
    });
    [nameError, phoneError, addressError, cardError].forEach(el => {
        if (el) {
            el.textContent = "";
            el.classList.remove("visible");
        }
    });
}

// Live Validation listeners
customerName?.addEventListener("input", () => {
    const val = customerName.value.trim();
    if (val.length >= 2) {
        setFieldError(customerName, nameError, "");
    }
});
customerName?.addEventListener("blur", () => {
    const val = customerName.value.trim();
    if (!val) {
        setFieldError(customerName, nameError, "Please enter your full name");
    } else if (val.length < 2) {
        setFieldError(customerName, nameError, "Name must be at least 2 characters");
    } else {
        setFieldError(customerName, nameError, "");
    }
});

customerPhone?.addEventListener("input", () => {
    const raw = customerPhone.value.replace(/\D/g, "");
    if (raw.length === 10) {
        setFieldError(customerPhone, phoneError, "");
    }
});
customerPhone?.addEventListener("blur", () => {
    const raw = customerPhone.value.replace(/\D/g, "");
    if (!raw) {
        setFieldError(customerPhone, phoneError, "Please enter your 10-digit phone number");
    } else if (raw.length !== 10) {
        setFieldError(customerPhone, phoneError, "Phone number must be exactly 10 digits");
    } else {
        setFieldError(customerPhone, phoneError, "");
    }
});

customerAddress?.addEventListener("input", () => {
    const val = customerAddress.value.trim();
    if (val.length >= 8) {
        setFieldError(customerAddress, addressError, "");
    }
});
customerAddress?.addEventListener("blur", () => {
    const val = customerAddress.value.trim();
    if (!val) {
        setFieldError(customerAddress, addressError, "Please provide your delivery address in Vizag");
    } else if (val.length < 8) {
        setFieldError(customerAddress, addressError, "Please include house/flat no., street and landmark");
    } else {
        setFieldError(customerAddress, addressError, "");
    }
});

const OFFICIAL_UPI_ID = "9059499756@axl";
const OFFICIAL_UPI_NAME = "Felicita Treats";

function updatePaymentUI() {
    paymentCards.forEach(card => {
        const method = card.dataset.method;
        const isSelected = method === selectedPaymentMethod;
        card.classList.toggle("is-selected", isSelected);
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = isSelected;
    });

    if (upiPaymentView) upiPaymentView.classList.toggle("is-hidden", selectedPaymentMethod !== "upi");
    if (cardPaymentView) cardPaymentView.classList.toggle("is-hidden", selectedPaymentMethod !== "card");

    const total = totalCartValue();
    if (placeOrderBtnText && !isSubmitting) {
        if (selectedPaymentMethod === "upi") {
            placeOrderBtnText.textContent = `Pay ${formatPrice(total)} via UPI & Place Order`;
        } else {
            placeOrderBtnText.textContent = `Pay ${formatPrice(total)} Securely`;
        }
    }

    const tempOrderId = `FT-${Date.now().toString().slice(-6)}`;
    const upiPayload = `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=${encodeURIComponent(OFFICIAL_UPI_NAME)}&am=${total}&cu=INR&tn=Order%20${tempOrderId}`;

    if (upiIntentBtn) {
        upiIntentBtn.href = upiPayload;
    }

    const upiQrCodeImg = document.getElementById("upiQrCodeImg");
    if (upiQrCodeImg) {
        upiQrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPayload)}&margin=4`;
    }
}

paymentCards.forEach(card => {
    card.addEventListener("click", () => {
        selectedPaymentMethod = card.dataset.method;
        updatePaymentUI();
    });
});

copyUpiBtn?.addEventListener("click", async () => {
    const vpa = document.getElementById("upiVpaValue")?.textContent.trim() || OFFICIAL_UPI_ID;
    try {
        await navigator.clipboard.writeText(vpa);
        const origText = copyUpiBtn.textContent;
        copyUpiBtn.textContent = "Copied! ✓";
        showToast("UPI ID (9059499756@axl) copied to clipboard");
        setTimeout(() => {
            copyUpiBtn.textContent = origText;
        }, 2000);
    } catch {
        showToast("UPI ID: " + vpa);
    }
});

// Card input auto-formatters & validation
cardNumber?.addEventListener("input", e => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 16);
    e.target.value = val.replace(/(\d{4})(?=\d)/g, "$1 ");
    if (val.length >= 15 && cardError) {
        cardError.textContent = "";
        cardError.classList.remove("visible");
    }
});

cardExpiry?.addEventListener("input", e => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length >= 2) {
        e.target.value = val.slice(0, 2) + "/" + val.slice(2);
    } else {
        e.target.value = val;
    }
});

cardCvv?.addEventListener("input", e => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
});

function openCheckout() {
    if (!cart.length) {
        showToast("Your cart is empty");
        return;
    }
    closeCart();

    checkoutOrder.innerHTML = cart.map(item => `
        <div class="checkout-row">
            <span>${item.quantity} × ${escapeHtml(item.name)} (${escapeHtml(item.variant)})</span>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        </div>
    `).join("");

    const total = totalCartValue();
    if (checkoutSubtotal) checkoutSubtotal.textContent = formatPrice(total);
    if (checkoutTotal) checkoutTotal.textContent = formatPrice(total);

    updatePaymentUI();

    checkoutPanel.classList.add("open");
    checkoutBackdrop.classList.add("open");
    checkoutPanel.setAttribute("aria-hidden", "false");
    checkoutBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeCheckout() {
    checkoutPanel.classList.remove("open");
    checkoutBackdrop.classList.remove("open");
    checkoutPanel.setAttribute("aria-hidden", "true");
    checkoutBackdrop.setAttribute("aria-hidden", "true");
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

// Product card initialization: Selectable size variants, quantity stepper, dynamic live price and Add to Cart button
productCards.forEach(card => {
    const product = getProductFromCard(card);
    const info = card.querySelector(".product-info");
    if (!info) return;

    const cakePrices = card.querySelector(".cake-prices");
    const cakeOptions = cakePrices ? [...cakePrices.querySelectorAll(".cake-price")] : [];

    let currentVariant = "Standard";
    let currentUnitPrice = 0;
    let currentQuantity = 1;

    // Build the dynamic order bar
    const orderBar = document.createElement("div");
    orderBar.className = "product-order-bar";

    const pricingWrap = document.createElement("div");
    pricingWrap.className = "product-pricing-wrap";

    const dynamicPrice = document.createElement("div");
    dynamicPrice.className = "product-dynamic-price";

    const unitHint = document.createElement("div");
    unitHint.className = "product-unit-hint";
    unitHint.style.display = "none";

    pricingWrap.appendChild(dynamicPrice);
    pricingWrap.appendChild(unitHint);

    const stepper = document.createElement("div");
    stepper.className = "card-qty-stepper";
    stepper.innerHTML = `
        <button type="button" class="card-qty-btn minus" aria-label="Decrease quantity">−</button>
        <span class="card-qty-val">1</span>
        <button type="button" class="card-qty-btn plus" aria-label="Increase quantity">+</button>
    `;

    const minusBtn = stepper.querySelector(".minus");
    const qtyVal = stepper.querySelector(".card-qty-val");
    const plusBtn = stepper.querySelector(".plus");

    orderBar.appendChild(pricingWrap);
    orderBar.appendChild(stepper);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "card-add-btn";
    addBtn.innerHTML = `
        <span class="card-add-icon">🛒</span>
        <span class="card-add-text">Add to Cart</span>
    `;

    function updateCardPriceDisplay() {
        const total = currentUnitPrice * currentQuantity;
        dynamicPrice.textContent = formatPrice(total);

        // Subtle pop animation
        dynamicPrice.classList.remove("pop");
        void dynamicPrice.offsetWidth;
        dynamicPrice.classList.add("pop");

        if (currentQuantity > 1) {
            unitHint.textContent = `${formatPrice(currentUnitPrice)} each`;
            unitHint.style.display = "block";
        } else {
            unitHint.style.display = "none";
        }
        qtyVal.textContent = currentQuantity;
    }

    plusBtn.addEventListener("click", event => {
        event.stopPropagation();
        if (currentQuantity < 50) {
            currentQuantity += 1;
            updateCardPriceDisplay();
        }
    });

    minusBtn.addEventListener("click", event => {
        event.stopPropagation();
        if (currentQuantity > 1) {
            currentQuantity -= 1;
            updateCardPriceDisplay();
        }
    });

    addBtn.addEventListener("click", event => {
        event.stopPropagation();
        if (!currentUnitPrice) return;

        addToCart(product, currentVariant, currentUnitPrice, currentQuantity);

        // Tactile button success feedback
        addBtn.classList.add("is-added");
        const originalText = addBtn.innerHTML;
        addBtn.innerHTML = `<span>✓</span><span>Added (${currentQuantity})</span>`;

        setTimeout(() => {
            addBtn.classList.remove("is-added");
            addBtn.innerHTML = originalText;
        }, 1200);
    });

    if (cakeOptions.length) {
        // Find available options
        const selectableOptions = [];
        cakeOptions.forEach(opt => {
            const variant = opt.querySelector("span")?.textContent.trim() || "";
            const priceText = opt.querySelector("strong")?.textContent.trim() || "";
            const isUnavailable = !priceText || priceText.includes("-");

            if (isUnavailable) {
                opt.classList.add("is-unavailable");
                opt.setAttribute("aria-disabled", "true");
            } else {
                opt.classList.add("is-selectable");
                opt.setAttribute("role", "button");
                opt.setAttribute("tabindex", "0");
                const price = Number(priceText.replace(/[^0-9.]/g, "")) || 0;
                selectableOptions.push({ element: opt, variant, price });

                opt.addEventListener("click", event => {
                    event.stopPropagation();
                    cakeOptions.forEach(o => o.classList.remove("is-selected"));
                    opt.classList.add("is-selected");
                    currentVariant = variant;
                    currentUnitPrice = price;
                    updateCardPriceDisplay();
                });
            }
        });

        if (selectableOptions.length > 0) {
            selectableOptions[0].element.classList.add("is-selected");
            currentVariant = selectableOptions[0].variant;
            currentUnitPrice = selectableOptions[0].price;
            updateCardPriceDisplay();
        }

        info.appendChild(orderBar);
        info.appendChild(addBtn);
    } else {
        // Non-cake items (cookies, brownies, cupcakes)
        const priceEl = card.querySelector(".product-price");
        if (priceEl) {
            const basePrice = Number(priceEl.textContent.replace(/[^0-9.]/g, "")) || 0;
            currentUnitPrice = basePrice;
            currentVariant = "Standard";
            priceEl.style.display = "none"; // replace with dynamic order bar
            updateCardPriceDisplay();
        }
        info.appendChild(orderBar);
        info.appendChild(addBtn);
    }
});

// Mobile bottom navigation
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

const mobileSectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        mobileNavItems.forEach(item => {
            item.classList.toggle("active", item.dataset.navTarget === entry.target.id);
        });
    });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

sections.forEach(section => mobileSectionObserver.observe(section));

document.querySelector(".cart-shop-link")?.addEventListener("click", () => {
    closeCart();
});

function openOrderSuccess(orderRecord) {
    if (!orderRecord) return;
    successOrderId.textContent = orderRecord.orderId;
    if (successGreeting) successGreeting.textContent = `Thank you, ${orderRecord.name}!`;
    if (successCustomerName) successCustomerName.textContent = orderRecord.name;
    if (successCustomerPhone) successCustomerPhone.textContent = orderRecord.phone;
    if (successDeliveryAddress) successDeliveryAddress.textContent = `${orderRecord.address}, Visakhapatnam`;
    if (successOrderDate) {
        successOrderDate.textContent = new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    if (successPaymentStatus) {
        if (orderRecord.paymentMethod === "card") {
            successPaymentStatus.textContent = `Payment Completed via Card (${formatPrice(orderRecord.total)})`;
        } else {
            successPaymentStatus.textContent = `Payment Completed via UPI (${formatPrice(orderRecord.total)})`;
        }
        document.getElementById("successStatusBanner")?.style.removeProperty("background");
        document.getElementById("successStatusBanner")?.style.removeProperty("color");
    }

    if (successItemsTable) {
        successItemsTable.innerHTML = orderRecord.items.map(item => `
            <div class="receipt-item-line">
                <span>${item.quantity} × ${escapeHtml(item.name)} (${escapeHtml(item.variant)})</span>
                <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
        `).join("");
    }

    if (successReceiptSubtotal) successReceiptSubtotal.textContent = formatPrice(orderRecord.total);
    if (successReceiptTotal) successReceiptTotal.textContent = formatPrice(orderRecord.total);

    // Update WhatsApp notification action button in receipt modal
    const openWhatsAppNotifyBtn = document.getElementById("openWhatsAppNotifyBtn");
    if (openWhatsAppNotifyBtn) {
        const ownerPhone = localStorage.getItem("felicita_owner_phone") || "919515372424";
        const waText = encodeURIComponent(orderRecord.message || "");
        openWhatsAppNotifyBtn.href = `https://api.whatsapp.com/send?phone=${ownerPhone}&text=${waText}`;
    }

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

function buildOrderMessage(orderId, name, phone, address, paymentMethod) {
    const paymentLabel = paymentMethod === "card" ? "Paid via Card" : "Paid via UPI";
    return [
        "🍰 FELICITA TREATS",
        "━━━━━━━━━━━━━━━━━━",
        "🆕 NEW ORDER",
        `Order ID: ${orderId}`,
        "",
        "👤 CUSTOMER",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Address: ${address}, Visakhapatnam`,
        `Payment: ${paymentLabel}`,
        "",
        "🛒 ITEMS",
        ...cart.map(item => `${item.quantity} × ${item.name} (${item.variant}) — ${formatPrice(item.price * item.quantity)}`),
        "",
        `💰 TOTAL: ${formatPrice(totalCartValue())}`,
        "",
        "🌐 Ordered via Felicita Treats website"
    ].join("\n");
}

placeOrderBtn.addEventListener("click", async () => {
    if (isSubmitting) return;

    const name = customerName?.value.trim() || "";
    const phone = customerPhone?.value.replace(/\D/g, "") || "";
    const address = customerAddress?.value.trim() || "";
    const notes = customerNotes?.value.trim() || "";

    let hasError = false;

    if (!name || name.length < 2) {
        setFieldError(customerName, nameError, "Please enter your full name (at least 2 characters)");
        if (!hasError) customerName?.focus();
        hasError = true;
    } else {
        setFieldError(customerName, nameError, "");
    }

    if (!phone || phone.length !== 10) {
        setFieldError(customerPhone, phoneError, "Please enter a valid 10-digit mobile number");
        if (!hasError) customerPhone?.focus();
        hasError = true;
    } else {
        setFieldError(customerPhone, phoneError, "");
    }

    if (!address || address.length < 6) {
        setFieldError(customerAddress, addressError, "Please enter your delivery address with landmark in Vizag");
        if (!hasError) customerAddress?.focus();
        hasError = true;
    } else {
        setFieldError(customerAddress, addressError, "");
    }

    if (selectedPaymentMethod === "card") {
        const rawCard = cardNumber?.value.replace(/\s/g, "") || "";
        const expiry = cardExpiry?.value.trim() || "";
        const cvv = cardCvv?.value.trim() || "";

        if (rawCard.length < 15 || expiry.length < 4 || cvv.length < 3) {
            if (cardError) {
                cardError.textContent = "Please fill in valid card details (number, MM/YY and CVV)";
                cardError.classList.add("visible");
            }
            if (!hasError) cardNumber?.focus();
            hasError = true;
        } else {
            if (cardError) {
                cardError.textContent = "";
                cardError.classList.remove("visible");
            }
        }
    }

    if (hasError) {
        showToast("Please fill in required fields highlighted in red");
        return;
    }

    if (!cart.length) {
        showToast("Your cart is empty");
        closeCheckout();
        return;
    }

    // Set submitting loading state
    isSubmitting = true;
    placeOrderBtn.disabled = true;
    btnSpinner?.classList.add("is-spinning");
    if (placeOrderBtnText) placeOrderBtnText.textContent = "Processing Order...";

    try {
        const orderId = `FT-${Math.floor(100000 + Math.random() * 900000)}`;
        const total = totalCartValue();
        latestOrderText = buildOrderMessage(orderId, name, phone, address, selectedPaymentMethod);

        const orderRecord = {
            orderId,
            name,
            phone,
            address,
            notes,
            status: "received",
            paymentMethod: selectedPaymentMethod,
            paymentDetails: {
                methodName: selectedPaymentMethod === "upi" ? "UPI / QR Code" : "Credit / Debit Card",
                utr: customerUtr?.value.trim() || "",
                status: "Paid"
            },
            items: cart.map(item => ({ ...item })),
            total,
            createdAt: new Date().toISOString(),
            message: latestOrderText
        };

        // Save last customer order
        localStorage.setItem("felicitaLastOrder", JSON.stringify(orderRecord));

        // Save to central orders repository for Owner Portal
        try {
            const allOrders = JSON.parse(localStorage.getItem("felicita_all_orders") || "[]");
            allOrders.unshift(orderRecord);
            localStorage.setItem("felicita_all_orders", JSON.stringify(allOrders));

            // Real-time broadcast to open Owner Portal tabs
            if (window.BroadcastChannel) {
                const bc = new BroadcastChannel("felicita_orders");
                bc.postMessage({ type: "NEW_ORDER", order: orderRecord });
                bc.close();
            }
        } catch (storageErr) {
            console.warn("Storage sync error:", storageErr);
        }

        // Send order to API
        try {
            await fetch("/api/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderRecord)
            });
        } catch (error) {
            console.warn("Order API unavailable:", error);
        }

        // WhatsApp notification directly to owner (+91 9515372424)
        const ownerPhone = localStorage.getItem("felicita_owner_phone") || "919515372424";
        const waUrl = `https://api.whatsapp.com/send?phone=${ownerPhone}&text=${encodeURIComponent(latestOrderText)}`;
        try {
            window.open(waUrl, "_blank");
        } catch (waErr) {
            console.log("Browser prevented auto-popup, button ready on screen", waErr);
        }

        // Clear cart
        cart = [];
        saveCart();
        updateCartBadge();
        renderCart();

        closeCheckout();
        openOrderSuccess(orderRecord);
        showToast(`Order ${orderId} placed & WhatsApp notification sent! 🎉`);
    } finally {
        isSubmitting = false;
        placeOrderBtn.disabled = false;
        btnSpinner?.classList.remove("is-spinning");
        updatePaymentUI();
    }
});

printReceiptBtn?.addEventListener("click", () => {
    window.print();
});

closeSuccessBtn?.addEventListener("click", () => {
    closeOrderSuccess();
    const shopSection = document.getElementById("shop");
    if (shopSection) {
        shopSection.scrollIntoView({ behavior: "smooth" });
    }
});

closeSuccessXBtn?.addEventListener("click", closeOrderSuccess);
orderSuccessBackdrop?.addEventListener("click", closeOrderSuccess);

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (orderSuccessPanel.classList.contains("open")) closeOrderSuccess();
    else if (checkoutPanel.classList.contains("open")) closeCheckout();
    else if (productModal.classList.contains("open")) closeProductModal();
    else if (cartPanel.classList.contains("open")) closeCart();
});

// Image loading shimmer removal
document.querySelectorAll(".product-img").forEach(wrap => {
    const img = wrap.querySelector("img");
    if (!img) return;
    if (!img.complete) {
        wrap.classList.add("is-loading");
        img.addEventListener("load", () => wrap.classList.remove("is-loading"), { once: true });
        img.addEventListener("error", () => wrap.classList.remove("is-loading"), { once: true });
    }
});

// Offline & Online Network Monitoring
function getOrCreateOfflineBanner() {
    let banner = document.getElementById("offlineBanner");
    if (!banner) {
        banner = document.createElement("div");
        banner.id = "offlineBanner";
        banner.className = "offline-banner";
        banner.setAttribute("role", "status");
        banner.setAttribute("aria-live", "polite");
        banner.textContent = "⚠️ You are offline. Your cart and order details remain saved safely.";
        document.body.prepend(banner);
    }
    return banner;
}

window.addEventListener("offline", () => {
    const banner = getOrCreateOfflineBanner();
    banner.classList.add("is-visible");
    showToast("Internet connection lost. Cart is saved locally.");
});

window.addEventListener("online", () => {
    const banner = document.getElementById("offlineBanner");
    if (banner) {
        banner.classList.remove("is-visible");
        showToast("Connection restored ✓");
    }
});

// Global Error & Promise Monitoring
window.addEventListener("error", event => {
    console.warn("[Felicita Error Catch]:", event.message);
});
window.addEventListener("unhandledrejection", event => {
    console.warn("[Felicita Rejection Catch]:", event.reason);
});

updateCartBadge();
renderCart();
