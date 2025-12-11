/* PASSWORD */
const PASSWORD = "Taniyaditya09";

/* UI refs */
const loader = document.getElementById('loader');
const gate = document.getElementById('gate');
const pwInput = document.getElementById('pwInput');
const pwBtn = document.getElementById('pwBtn');
const pwError = document.getElementById('pwError');
const app = document.getElementById('app');
const container = document.getElementById('sectionContainer');
const nav = document.getElementById('nav');
const themeEffects = document.getElementById('theme-effects');

/* Modal controls */
const modal = document.getElementById('slideshowModal');
const slideImg = document.getElementById('slideImg');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
const closeModal = document.getElementById('closeModal');
const playPause = document.getElementById('playPause');
const slideIndex = document.getElementById('slideIndex');

let slideInterval = null;
let modalSlides = [];
let modalIndex = 0;
let modalAutoplay = false;

/* ---------- loader -> show login ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    loader.classList.add('hidden');
    gate.classList.remove('hidden');
  }, 900);
});

/* ---------- password ---------- */
function checkPassword(){
  const v = pwInput.value.trim();
  if(v === PASSWORD){
    gate.classList.add('hidden');
    app.classList.remove('hidden');
    applySpecialThemeIfNeeded();
  } else {
    pwError.textContent = 'Wrong password ❤️';
    setTimeout(()=> pwError.textContent = '', 2200);
  }
}
pwBtn.addEventListener('click', checkPassword);
pwInput.addEventListener('keydown', e => { if(e.key === 'Enter') checkPassword(); });

/* ---------- nav attach ---------- */
nav.querySelectorAll('.nav-btn').forEach(b=>{
  b.addEventListener('click', ()=> {
    openSection(b.getAttribute('data-key'));
    container.scrollIntoView({behavior:'smooth'});
  });
});

/* ---------- open and render ---------- */
let globalSlideshowTimer = null;
function openSection(key){
  const data = SECTIONS[key];
  if(!data) return;
  // clear existing timers
  if(globalSlideshowTimer) { clearInterval(globalSlideshowTimer); globalSlideshowTimer = null; }

  container.innerHTML = '';

  const box = document.createElement('div'); box.className = 'section-box';

  const h = document.createElement('h2'); h.innerText = data.title; box.appendChild(h);
  const meta = document.createElement('div'); meta.className = 'meta'; meta.innerText = data.meta || ''; box.appendChild(meta);

  // slideshow container
  if(Array.isArray(data.photosForSlideshow) && data.photosForSlideshow.length){
    const ss = document.createElement('div'); ss.className = 'slideshow';
    data.photosForSlideshow.forEach((fn, i) => {
      const img = document.createElement('img');
      img.src = `images/${key}/${fn}`;
      img.alt = fn;
      if(i===0) img.classList.add('active');
      // hide broken images silently
      img.onerror = () => { img.style.display = 'none'; startSafeSlideshow(ss); };
      ss.appendChild(img);
    });
    box.appendChild(ss);
  }

  // story parts + inline images
  data.storyParts.forEach((p, idx) => {
    const pEl = document.createElement('div'); pEl.className='story-text';
    pEl.innerText = '';
    box.appendChild(pEl);
    // type animation
    typeText(pEl, p, 16);

    // inline photo if present
    if(data.photosInline && data.photosInline[idx]){
      const inline = document.createElement('img');
      inline.className = 'inline-img';
      inline.src = `images/${key}/${data.photosInline[idx]}`;
      inline.alt = data.photosInline[idx];
      inline.onerror = () => inline.style.display='none';
      box.appendChild(inline);
    }
  });

  // videos
  if(data.videos && data.videos.length){
    data.videos.forEach(vn=>{
      const v = document.createElement('video');
      v.controls = true; v.playsInline = true; v.preload = 'metadata';
      v.src = `videos/${key}/${vn}`;
      v.onerror = () => { v.style.display = 'none'; };
      box.appendChild(v);
    });
  }

  container.appendChild(box);
  // reveal animation
  setTimeout(()=> box.classList.add('show'), 40);

  // start slideshow if present
  startSafeSlideshow(document.querySelector('.slideshow'));
}

/* ---------- typing helper ---------- */
function typeText(el, text, speed=25){
  return new Promise(res=>{
    let i=0;
    el.style.opacity = 0; el.style.transform='translateY(8px)';
    const iv = setInterval(()=>{
      el.textContent += text.charAt(i);
      i++;
      if(i >= text.length){
        clearInterval(iv);
        el.style.opacity = 1; el.style.transform='translateY(0)';
        res();
      }
    }, speed);
  });
}

/* ---------- safe slideshow ---------- */
function startSafeSlideshow(slideshowEl){
  // stop previous
  if(globalSlideshowTimer) { clearInterval(globalSlideshowTimer); globalSlideshowTimer = null; }
  if(!slideshowEl) return;

  const imgs = Array.from(slideshowEl.querySelectorAll('img')).filter(im => im.style.display !== 'none');
  if(!imgs.length) return;

  let idx = imgs.findIndex(i=>i.classList.contains('active')); if(idx < 0) idx = 0;

  // ensure only idx active
  imgs.forEach((im,i)=> { im.classList.toggle('active', i===idx); });

  globalSlideshowTimer = setInterval(()=>{
    imgs[idx].classList.remove('active');
    idx = (idx + 1) % imgs.length;
    imgs[idx].classList.add('active');
  }, 3000);
}

/* ---------- modal slideshow controls ---------- */
function openModal(array, start=0){
  modalSlides = array.slice(); modalIndex = start;
  if(!modalSlides.length) return;
  slideImg.src = modalSlides[modalIndex];
  slideIndex.innerText = `${modalIndex+1} / ${modalSlides.length}`;
  modal.classList.remove('hidden'); modal.style.display='flex';
  modalAutoplay = false; playPause.textContent = 'Play';
}
function closeModal(){ modal.classList.add('hidden'); modal.style.display='none'; stopModalAutoplay(); }
function prevModal(){ if(!modalSlides.length) return; modalIndex = (modalIndex - 1 + modalSlides.length) % modalSlides.length; slideImg.src = modalSlides[modalIndex]; slideIndex.innerText = `${modalIndex+1} / ${modalSlides.length}`; }
function nextModal(){ if(!modalSlides.length) return; modalIndex = (modalIndex + 1) % modalSlides.length; slideImg.src = modalSlides[modalIndex]; slideIndex.innerText = `${modalIndex+1} / ${modalSlides.length}`; }
function startModalAutoplay(){ if(modalAutoplay) return; modalAutoplay = true; playPause.textContent='Pause'; slideInterval = setInterval(nextModal, 2800); }
function stopModalAutoplay(){ modalAutoplay = false; playPause.textContent='Play'; if(slideInterval){ clearInterval(slideInterval); slideInterval=null; } }

document.addEventListener('click', (e) => {
  // thumbnail click opens modal (delegated)
  if(e.target && e.target.tagName === 'IMG' && e.target.closest('.grid-thumb')) {
    // not used in final layout; kept for extensibility
  }
});
prevBtn && prevBtn.addEventListener('click', prevModal);
nextBtn && nextBtn.addEventListener('click', nextModal);
closeModal && closeModal.addEventListener('click', closeModal);
playPause && playPause.addEventListener('click', ()=> { if(modalAutoplay) stopModalAutoplay(); else startModalAutoplay(); });
document.addEventListener('keydown', e => {
  if(modal && !modal.classList.contains('hidden')){
    if(e.key === 'Escape') closeModal();
    if(e.key === 'ArrowLeft') prevModal();
    if(e.key === 'ArrowRight') nextModal();
  }
});

/* ---------- special day themes ---------- */
function applySpecialThemeIfNeeded(){
  const today = new Date();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();

  // helper to clear effects
  themeEffects.innerHTML = '';

  // Anniversary 6 Mar
  if(mm === 3 && dd === 6){
    showPopup(`Happy Anniversary Puchu & Golu ❤️`, 3500);
    addFloatingHearts(18);
    document.body.style.background = 'linear-gradient(135deg,#fff0f6,#fffaf0)';
  }

  // Valentine Week 7-14 Feb
  if(mm === 2 && dd >=7 && dd <=14){
    const map = {7:'Rose Day 🌹',8:'Propose Day',9:'Chocolate Day',10:'Teddy Day',11:'Promise Day',12:'Hug Day',13:'Kiss Day',14:'Valentine\'s Day ❤️'};
    showPopup(map[dd] ? `${map[dd]} Golu ❤️` : 'Happy Valentine Week', 3000);
    addFloatingHearts(28);
    document.body.style.background = 'linear-gradient(135deg,#fff0f6,#fff1f6)';
  }

  // Her Birthday 9 Nov
  if(mm === 11 && dd === 9){
    showPopup(`Happy Birthday Golu 🎂`, 3000);
    addConfetti(40);
    document.body.style.background = 'linear-gradient(135deg,#fff8ff,#fff0fb)';
  }

  // Your Birthday 9 Apr
  if(mm === 4 && dd === 9){
    showPopup(`Happy Birthday Puchu 🎂`, 3000);
    addConfetti(36);
    document.body.style.background = 'linear-gradient(135deg,#f0fbff,#f7fbff)';
  }

  // Girlfriend Day 1 Aug
  if(mm === 8 && dd === 1){
    showPopup(`Happy Girlfriend Day Golu 💛`, 2800);
    addFloatingHearts(18);
  }

  // Wife Day -> third Sunday of Sep (approx)
  if(mm === 9){
    const d = new Date(today.getFullYear(),8,1); // sept 1
    let sundayCount = 0; let thirdSunday = null;
    for(let i=1;i<=30;i++){
      const ddt = new Date(today.getFullYear(),8,i);
      if(ddt.getDay() === 0){ sundayCount++; if(sundayCount===3) { thirdSunday = i; break; } }
    }
    if(thirdSunday === dd){
      showPopup(`My future wife ❤️`, 3500);
      addFloatingHearts(20);
    }
  }

  // Promise Day extra (11 April)
  if(mm === 4 && dd === 11){
    showPopup(`Happy Promise Day Golu 🤝`, 2800);
    addFloatingHearts(12);
  }

  // Relationship Appreciation (26 June)
  if(mm === 6 && dd === 26){
    showPopup(`Appreciating our journey 🌟`, 2800);
    addFloatingHearts(12);
  }
}

/* small popup (non-blocking) */
function showPopup(text, ms=2200){
  const el = document.createElement('div'); el.className='popup-note';
  el.innerText = text;
  el.style.position='fixed'; el.style.left='50%'; el.style.top='14%'; el.style.transform='translateX(-50%)'; el.style.background='rgba(255,255,255,0.98)';
  el.style.padding='10px 16px'; el.style.borderRadius='10px'; el.style.boxShadow='0 10px 30px rgba(0,0,0,0.12)'; el.style.zIndex=200;
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), ms);
}

/* falling hearts & confetti generators */
function addFloatingHearts(n=12){
  for(let i=0;i<n;i++){
    const h = document.createElement('div'); h.className='falling-heart';
    h.style.left = Math.random()*100 + 'vw'; h.style.top = -Math.random()*40 + 'vh';
    h.style.width = 12 + Math.random()*18 + 'px'; h.style.height = h.style.width;
    h.style.background = ['#ff6b8a','#ff4d88','#ff9bb3'][Math.floor(Math.random()*3)];
    themeEffects.appendChild(h);
    setTimeout(()=> h.remove(), 9000 + Math.random()*3000);
  }
}
function addConfetti(n=20){
  const colors = ['#ff5c8a','#ffd166','#9ad3bc','#9ad3ff','#f6a6ff'];
  for(let i=0;i<n;i++){
    const c = document.createElement('div'); c.className='confetti';
    c.style.left = Math.random()*100 + 'vw'; c.style.top = -Math.random()*30 + 'vh';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.width = 6 + Math.random()*14 + 'px'; c.style.height = 8 + Math.random()*12 + 'px';
    themeEffects.appendChild(c);
    setTimeout(()=> c.remove(), 4200 + Math.random()*3000);
  }
}

/* ---------- Helpful: ensure filenames lowercase (inform) ---------- */
console.log('Reminder: filenames must match exactly (lowercase) as used in sections.js');

/* ---------- END ---------- */
