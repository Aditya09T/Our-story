/* ===========================
      PASSWORD
=========================== */
const PASSWORD = "Taniyaditya09";

/* ===========================
      PAGE LOADER
=========================== */
window.onload = () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.classList.add("hidden");
        document.getElementById("login").classList.remove("hidden");
    }, 800);
};

/* ===========================
      CHECK PASSWORD
=========================== */
function checkPassword() {
    const val = document.getElementById("password").value;
    const err = document.getElementById("error");

    if (val === PASSWORD) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        startHomeSlideshow();
    } else {
        err.textContent = "Wrong Password 💔";
    }
}

/* ===========================
      HOME PAGE SLIDESHOW
=========================== */
let homeImages = [];
let homeIndex = 0;

function startHomeSlideshow() {
    homeImages = [
        "images/proposal/proposal1.jpg",
        "images/proposal/proposal2.jpg",
        "images/memories/memory1.jpg",
        "images/school/school1.jpg"
    ];

    const bg = document.getElementById("home-bg");

    setInterval(() => {
        bg.style.backgroundImage = `url('${homeImages[homeIndex]}')`;
        homeIndex = (homeIndex + 1) % homeImages.length;
    }, 2500);
}

/* ===========================
      OPEN SECTION
=========================== */
function openSection(key) {
    const sec = SECTIONS[key];
    const out = document.getElementById("display-area");
    out.innerHTML = "";

    /* ---- Title ---- */
    let html = `
        <div class="section-block">
            <h2>${sec.title}</h2>
            <p class="meta">${sec.meta}</p>
    `;

    /* ---- Story + inline photos ---- */
    sec.storyParts.forEach((text, i) => {
        html += `<p class="para">${text}</p>`;

        if (sec.photosInline[i]) {
            html += `
                <img class="inline-img" src="images/${key}/${sec.photosInline[i]}"/>
            `;
        }
    });

    html += `</div>
        <h3 class="sub-heading">More Photos</h3>
        <div class="grid">
    `;

    /* ---- Slideshow photos ---- */
    sec.photosForSlideshow.forEach(p => {
        html += `<img src="images/${key}/${p}" class="grid-img">`;
    });

    html += "</div>";

    /* ---- Videos ---- */
    if (sec.videos.length > 0) {
        html += `<h3 class="sub-heading">Videos</h3><div class="grid">`;
        sec.videos.forEach(v => {
            html += `<video controls class="grid-video" src="videos/${key}/${v}"></video>`;
        });
        html += "</div>";
    }

    out.innerHTML = html;

    /* Reveal animation */
    revealAnimation();
}

/* ===========================
      SCROLL REVEAL
=========================== */
function revealAnimation() {
    const items = document.querySelectorAll(".para, .inline-img, .grid-img, .grid-video");

    items.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = "translateY(20px)";
    });

    let idx = 0;
    const show = () => {
        if (idx >= items.length) return;
        const el = items[idx];
        el.style.transition = "0.6s";
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
        idx++;
        setTimeout(show, 120);
    };
    show();
}
