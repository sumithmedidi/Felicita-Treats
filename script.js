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