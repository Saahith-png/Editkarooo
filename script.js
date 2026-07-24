// ==========================
// MOBILE MENU
// ==========================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        if (menuBtn.innerHTML.includes("bars")) {
            menuBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Close menu after clicking a link
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

}

// ==========================
// STICKY HEADER
// ==========================

const header = document.querySelector(".header");

if (header) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            header.style.background = "#0b0f14";
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,.4)";
        } else {
            header.style.background = "rgba(13,17,23,.95)";
            header.style.boxShadow = "none";
        }

    });

}

// ==========================
// PORTFOLIO FILTER
// (shared by the home page portfolio section
//  and portfolio.html - portfolio.js handles
//  search + video modal only, to avoid double
//  event handlers on the same buttons)
// ==========================

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll(".portfolio-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        portfolioCards.forEach(card => {

            if (filter === "all") {

                card.style.display = "block";

            } else if (card.classList.contains(filter)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});

// ==========================
// GOOGLE SHEETS / FORM HANDLERS
// ==========================
// Optional: Paste your Google Apps Script Web App URL here (see google-sheets-setup.md)
const GOOGLE_SHEETS_WEB_APP_URL = "";

const newsletterForm = document.getElementById("newsletterForm");

if (newsletterForm) {

    newsletterForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const emailInput = document.getElementById("email");
        const email = emailInput.value.trim();
        const message = document.getElementById("newsletterMessage");
        const submitBtn = newsletterForm.querySelector("button[type='submit']");

        if (email === "") {
            message.innerHTML = "Please enter a valid email address.";
            message.style.color = "#ff4d4d";
            return;
        }

        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = "Subscribing...";

        // Save to local storage array as fallback
        const existingSubscribers = JSON.parse(localStorage.getItem("editkaro_subscribers") || "[]");
        existingSubscribers.push({ email: email, date: new Date().toISOString() });
        localStorage.setItem("editkaro_subscribers", JSON.stringify(existingSubscribers));

        // Submit to Google Sheets if URL provided
        if (GOOGLE_SHEETS_WEB_APP_URL && GOOGLE_SHEETS_WEB_APP_URL.length > 5) {
            fetch(GOOGLE_SHEETS_WEB_APP_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formType: "newsletter", email: email })
            })
            .then(() => {
                message.innerHTML = "🎉 Thank you for subscribing! Your email is saved.";
                message.style.color = "#00ff88";
                newsletterForm.reset();
            })
            .catch(err => {
                console.error("Sheet Error:", err);
                message.innerHTML = "🎉 Thank you for subscribing!";
                message.style.color = "#00ff88";
                newsletterForm.reset();
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            });
        } else {
            setTimeout(() => {
                message.innerHTML = "🎉 Thank you for subscribing! (Saved to local database)";
                message.style.color = "#00ff88";
                newsletterForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }, 400);
        }

    });

}

// ==========================
// SCROLL TO TOP BUTTON
// ==========================

const scrollBtn = document.createElement("div");

scrollBtn.id = "scrollTop";
scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';

document.body.appendChild(scrollBtn);

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        scrollBtn.classList.add("show");

    } else {

        scrollBtn.classList.remove("show");

    }

});

scrollBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

});

// ==========================
// ACTIVE NAVIGATION (in-page sections, e.g. home page)
// ==========================

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

if (sections.length) {

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute("id");
            }

        });

        navItems.forEach(link => {

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            } else if (link.getAttribute("href")?.startsWith("#")) {

                link.classList.remove("active");

            }

        });

    });

}

// ==========================
// COUNTER ANIMATION
// ==========================
// Fixed: the original version used parseInt() on the whole string,
// which silently threw away any non-numeric suffix (e.g. "50M+" -> "50+",
// "24/7" -> "24+", "98%" -> "98+"). This version separates the leading
// number from its suffix and restores the suffix at the end.

const counters = document.querySelectorAll(".stat-card h2");

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const counter = entry.target;
            const originalText = counter.innerText.trim();
            const match = originalText.match(/^(\d+)(.*)$/);

            if (!match) {
                counterObserver.unobserve(counter);
                return;
            }

            const target = parseInt(match[1], 10);
            const suffix = match[2];

            let count = 0;
            const increment = Math.max(target / 100, 1);

            const update = () => {

                count += increment;

                if (count < target) {

                    counter.innerText = Math.ceil(count) + suffix;
                    requestAnimationFrame(update);

                } else {

                    counter.innerText = target + suffix;

                }

            };

            update();

            counterObserver.unobserve(counter);

        }

    });

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});

// ==========================
// SCROLL REVEAL
// ==========================

const revealElements = document.querySelectorAll(
    ".service-card, .portfolio-card, .stat-card"
);

const revealObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

});

revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(50px)";
    element.style.transition = "0.6s ease";

    revealObserver.observe(element);

});

// ==========================
// CONSOLE MESSAGE
// ==========================

console.log("EditKaro Website Loaded Successfully 🚀");
