// PASSWORD
const PASSWORD = "Taniyaditya09";

// Loader
window.onload = () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("hidden");
        document.getElementById("login").classList.remove("hidden");
    }, 1000);
};

// Password Check
function checkPassword() {
    const input = document.getElementById("password").value;
    const err = document.getElementById("error");

    if (input === PASSWORD) {
        document.getElementById("login").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
    } else {
        err.textContent = "Wrong password 💔";
    }
}

// Section Loader
function openSection(key) {
    document.getElementById("display-area").innerHTML = SECTIONS[key];
}
