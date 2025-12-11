const PASSWORD = "Taniyaditya09";

function checkPassword() {
  const val = document.getElementById("password").value;
  const err = document.getElementById("error");

  if (val === PASSWORD) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("content").classList.remove("hidden");
  } else {
    err.textContent = "Wrong Password ❤️";
  }
}

function openSection(key) {
  const data = SECTIONS[key];

  let html = `
    <div class="story">
      <h2>${data.title}</h2>
      <p>${data.story}</p>
    </div>

    <h3>Photos</h3>
    <div class="grid">
  `;

  data.photos.forEach(img => {
    html += `<img src="images/${key}/${img}" />`;
  });

  html += `</div><h3>Videos</h3><div class="grid">`;

  data.videos.forEach(vid => {
    html += `<video controls src="videos/${key}/${vid}"></video>`;
  });

  html += `</div>`;

  document.getElementById("display-area").innerHTML = html;
}
