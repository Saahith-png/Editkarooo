// ==========================================
// EditKaro Portfolio JavaScript
// ==========================================
// Note: the portfolio filter buttons are handled in script.js
// (shared with the home page). Keeping a second handler here
// caused clicking a filter to double-fire and fight itself,
// so it has been removed from this file.

const portfolioItems = document.querySelectorAll(".portfolio-card");

// ---------- Search ----------

const searchBox = document.getElementById("searchBox");

if (searchBox) {

    searchBox.addEventListener("keyup", function () {

        let value = this.value.toLowerCase();

        portfolioItems.forEach(card => {

            let text = card.innerText.toLowerCase();

            if (text.includes(value)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

}

// ---------- Video Popup ----------

const modal = document.getElementById("videoModal");
const iframe = document.getElementById("portfolioIframe");
const watchBtns = document.querySelectorAll(".watch-btn");
const closeBtn = document.querySelector(".close-modal");

watchBtns.forEach(button => {

    button.addEventListener("click", () => {

        let videoUrl = button.dataset.video;

        if (iframe) {
            iframe.src = videoUrl;
        }

        if (modal) {
            modal.classList.add("active");
        }

    });

});

function closeModal() {
    if (modal) {
        modal.classList.remove("active");
    }
    if (iframe) {
        iframe.src = "";
    }
}

// ---------- Close Button ----------

if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
}

// ---------- Close Outside ----------

window.addEventListener("click", (e) => {

    if (e.target === modal) {
        closeModal();
    }

});

// ---------- ESC Key ----------

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
        closeModal();
    }

});

// ---------- Scroll Reveal ----------

const revealCards = document.querySelectorAll(".portfolio-card");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

});

revealCards.forEach(card => {

    card.style.opacity = "0";
    card.style.transform = "translateY(50px)";
    card.style.transition = ".6s ease";

    observer.observe(card);

});

// ---------- Lazy Loading ----------

const images = document.querySelectorAll("img");

images.forEach(img => {

    img.loading = "lazy";

});

// ---------- Smooth Scroll ----------

document.querySelectorAll("a[href^='#']").forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const targetId = this.getAttribute("href");

        // Skip empty "#" links and the filter buttons don't use hrefs,
        // so this only affects genuine in-page anchors like #contactForm
        if (targetId.length <= 1) return;

        const target = document.querySelector(targetId);

        if (target) {

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        }

    });

});

// ---------- Console ----------

console.log("Portfolio Page Loaded Successfully 🚀");
