// -------------------- Loader --------------------
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hidden");
        document.getElementById("gate").classList.remove("hidden");
    }, 1200);
});

// -------------------- Password Gate --------------------
const PASSWORD = "taniya❤️aditya";

document.getElementById("passBtn").addEventListener("click", () => {
    const input = document.getElementById("passInput").value.trim().toLowerCase();

    if (input === PASSWORD) {
        document.getElementById("gate").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        loadSections();
    } else {
        const wrong = document.getElementById("wrong");
        wrong.classList.remove("hidden");
        setTimeout(() => wrong.classList.add("hidden"), 2000);
    }
});

// -------------------- Load Sections --------------------
function loadSections() {
    const app = document.getElementById("app");
    app.innerHTML = "";

    Object.keys(SECTIONS).forEach(key => {
        const sec = SECTIONS[key];

        const box = document.createElement("div");
        box.className = "section-box";

        box.innerHTML = `
            <h2>${sec.title}</h2>
            <p class="meta">${sec.meta}</p>
            <button class="openBtn" data-sec="${key}">Open</button>
        `;

        app.appendChild(box);
    });

    document.querySelectorAll(".openBtn").forEach(btn => {
        btn.addEventListener("click", e => {
            const secName = e.target.dataset.sec;
            openSection(secName);
        });
    });
}

// -------------------- Section Modal --------------------
function openSection(name) {
    const sec = SECTIONS[name];

    const modal = document.createElement("div");
    modal.className = "modal";

    let storyHtml = "";
    sec.storyParts.forEach((txt, i) => {
        storyHtml += `<p class="story">${txt}</p>`;
        if (sec.photosInline[i]) {
            storyHtml += `<img class="inline-img" src="images/${name}/${sec.photosInline[i]}">`;
        }
    });

    let slideHtml = "";
    sec.photosForSlideshow.forEach(p => {
        slideHtml += `<img class="slide-img" src="images/${name}/${p}">`;
    });

    let videoHtml = "";
    sec.videos.forEach(v => {
        videoHtml += `<video controls class="vid">
            <source src="videos/${name}/${v}" type="video/mp4">
        </video>`;
    });

    modal.innerHTML = `
        <div class="modal-content">
            <button class="closeBtn">×</button>
            <h2>${sec.title}</h2>
            ${storyHtml}
            <div class="slideshow">${slideHtml}</div>
            <div class="video-box">${videoHtml}</div>
        </div>
    `;

    document.body.appendChild(modal);

    document.querySelector(".closeBtn").addEventListener("click", closeModal);
}

// -------------------- Close Modal (ONLY ONE VERSION) --------------------
function closeModal() {
    const m = document.querySelector(".modal");
    if (m) m.remove();
}
