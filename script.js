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

function addToCart(product, variant, priceText) {
    const price = Number(priceText.replace(/[^0-9.]/g, "")) || 0;
    if (!price) return;

    const id = `${product.name}__${variant}`;
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id,
            name: product.name,
            variant,
            price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartBadge();
    renderCart();

    cartTrigger.classList.remove("bump");
    void cartTrigger.offsetWidth;
    cartTrigger.classList.add("bump");

    showToast(`${product.name} added to cart`);
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

// Product actions: cake price cards themselves are the Add to Cart controls.
// This avoids showing the same cake size/price twice. Existing image paths are untouched.
productCards.forEach(card => {
    const product = getProductFromCard(card);
    const info = card.querySelector(".product-info");
    if (!info) return;

    const cakeOptions = [...card.querySelectorAll(".cake-price")];

    if (cakeOptions.length) {
        // Use the existing price cards as the single Add to Cart controls.
        cakeOptions.forEach(optionEl => {
            const variant = optionEl.querySelector("span")?.textContent.trim() || "";
            const priceText = optionEl.querySelector("strong")?.textContent.trim() || "";
            const isUnavailable = !priceText || priceText.includes("-");

            if (isUnavailable) {
                optionEl.classList.add("is-unavailable");
                return;
            }

            optionEl.classList.add("is-addable");
            optionEl.setAttribute("role", "button");
            optionEl.setAttribute("tabindex", "0");
            optionEl.setAttribute("aria-label", `Add ${product.name} ${variant} ${priceText} to cart`);

            const selectOption = event => {
                event.stopPropagation();
                addToCart(product, variant, priceText);
            };

            optionEl.addEventListener("click", selectOption);
            optionEl.addEventListener("keydown", event => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectOption(event);
                }
            });
        });

        return;
    }

    // Non-cake products keep one simple Add to Cart button.
    if (info.querySelector(".product-actions")) return;

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const option = product.options[0];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-to-cart-btn";
    button.textContent = "Add to Cart";

    button.addEventListener("click", event => {
        event.stopPropagation();
        addToCart(product, option.variant, option.priceText);
    });

    actions.appendChild(button);
    info.appendChild(actions);
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

function buildOrderMessage(orderId, name, phone) {
    return [
        "🍰 FELICITA TREATS",
        "━━━━━━━━━━━━━━━━━━",
        "🆕 NEW ORDER",
        `Order ID: ${orderId}`,
        "",
        "👤 CUSTOMER",
        `Name: ${name}`,
        `Phone: ${phone}`,
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
    const name = customerName.value.trim();
    const phone = customerPhone.value.trim();

    if (!name || !phone) {
        showToast("Please enter your name and phone number");
        return;
    }

    if (!/^[0-9+()\-\s]{8,}$/.test(phone)) {
        showToast("Please enter a valid phone number");
        return;
    }

    if (!cart.length) {
        showToast("Your cart is empty");
        closeCheckout();
        return;
    }

    const orderId = `FT-${Date.now().toString().slice(-6)}`;
    latestOrderText = buildOrderMessage(orderId, name, phone);

    const orderRecord = {
        orderId,
        name,
        phone,
        items: cart.map(item => ({ ...item })),
        total: totalCartValue(),
        createdAt: new Date().toISOString(),
        message: latestOrderText
    };

    localStorage.setItem("felicitaLastOrder", JSON.stringify(orderRecord));
    localStorage.setItem("felicitaPendingInstagramOrder", JSON.stringify(orderRecord));

    // Send the order to our server-side API. The Instagram access token is NEVER
    // exposed to the browser. The server stores the order for the webhook.
    try {
        const response = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderRecord)
        });

        if (!response.ok) {
            console.warn("Order API returned an error: - script.js:1089", await response.text());
        }
    } catch (error) {
        // The local order is still kept so the customer does not lose the order.
        console.warn("Order API unavailable: - script.js:1093", error);
    }

    navigator.clipboard?.writeText(orderId).catch(() => {});
    closeCheckout();
    openOrderSuccess(orderId);
    showToast(`Order ${orderId} prepared`);
});

instagramOrderBtn?.addEventListener("click", async () => {
    const orderId = successOrderId.textContent.trim();
    if (!orderId) return;

    // Copy the exact Order ID so the customer only has to paste it into Instagram.
    try {
        await navigator.clipboard.writeText(orderId);
    } catch {
        // Clipboard access can be unavailable in some browsers; opening Instagram still works.
    }

    window.open("https://ig.me/m/Felicita_treats", "_blank", "noopener,noreferrer");
    showToast("Order ID copied — send it in the Instagram chat");
});

copyOrderBtn.addEventListener("click", async () => {
    if (!latestOrderText) return;
    try {
        await navigator.clipboard.writeText(latestOrderText);
        showToast("Order details copied");
    } catch {
        showToast("Order details are ready to copy");
    }
});

closeSuccessBtn.addEventListener("click", closeOrderSuccess);
orderSuccessBackdrop.addEventListener("click", closeOrderSuccess);

document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    if (orderSuccessPanel.classList.contains("open")) closeOrderSuccess();
    else if (checkoutPanel.classList.contains("open")) closeCheckout();
    else if (productModal.classList.contains("open")) closeProductModal();
    else if (cartPanel.classList.contains("open")) closeCart();
});

updateCartBadge();
renderCart();
