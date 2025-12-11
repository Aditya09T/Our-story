/* script.js
   - Auto-load (recommended) using GitHub API (public repo)
   - Fallback to local data.json if API isn't configured or fails
*/

/* === CONFIG === */
const PASSWORD = 'Taniyaditya09';     // site password
const REPO_OWNER = '';                // <--- set your GitHub username here to auto-load (e.g. "adityachowdhury")
const REPO_NAME  = '';                // <--- set your repo name here (e.g. "aditya-taniya-love")
/* ========== end config ========== */

const enterBtn = document.getElementById('enterBtn');
const loginWrap = document.getElementById('login');
const contentWrap = document.getElementById('content');
const display = document.getElementById('display-area');

enterBtn.addEventListener('click', tryLogin);
window.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

function tryLogin(){
  const val = document.getElementById('password').value.trim();
  const err = document.getElementById('error'); err.innerText = '';
  if(val === PASSWORD){
    loginWrap.classList.add('hidden');
    playOpen();
    initAfterAuth();
  } else {
    err.innerText = 'Wrong password ❤️';
    shake('.login-box');
  }
}

function playOpen(){
  const pre = document.getElementById('preloader');
  if(pre) pre.classList.remove('hidden');
  setTimeout(()=>{ if(pre) pre.classList.add('hidden'); contentWrap.classList.remove('hidden'); }, 600);
}

function shake(sel){
  const el = document.querySelector(sel) || document.getElementById('login');
  if(!el) return;
  el.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300});
}

/* Initialize UI after login */
function initAfterAuth(){
  // big buttons open sections
  document.querySelectorAll('.big-btn').forEach(b=>{
    b.addEventListener('click', ()=> openSection(b.dataset.target));
  });
  // tabs
  document.querySelectorAll('.tab-btn').forEach(t=>{
    t.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      const tab = t.dataset.tab;
      const current = display.dataset.currentSection || 'proposal';
      renderSection(current, tab);
    });
  });
  // show nice welcome
  showHero();
}

/* Show hero prompt */
function showHero(){
  display.innerHTML = '<div class="section"><p style="text-align:center">Welcome — choose Proposal / School / Memories.</p></div>';
}

/* Open a top-level section (proposal / school / memories)
   Default tab = story
*/
function openSection(key){
  // set default tab to story
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tab-btn[data-tab="story"]').classList.add('active');
  renderSection(key, 'story');
}

/* Render a section and chosen tab (story | photos | videos) */
async function renderSection(key, tab){
  display.dataset.currentSection = key;
  display.innerHTML = ''; // clear
  if(tab === 'story') {
    // load story content (from data.json fallback or from data.json in repo via API)
    const data = await loadSiteData();
    const list = (data && data[key]) || [];
    if(!list.length){
      display.innerHTML = `<div class="section"><p>No story content yet for ${key}.</p></div>`;
      return;
    }
    // build event cards
    let html = '<div class="section">';
    list.forEach((ev, idx) => {
      html += `<div class="event-card"><div class="summary"><div><strong>${escapeHtml(ev.title)}</strong><div class="muted">${escapeHtml(ev.date || '')}</div></div><div>▶</div></div><div class="details">${buildRichHTML(ev.story, (data && data[`${key}_photos`] && data[`${key}_photos`][idx]) || [], key)}</div></div>`;
    });
    html += '</div>';
    display.innerHTML = html;
    document.querySelectorAll('.event-card').forEach(c => c.addEventListener('click', ()=> c.classList.toggle('open')));
    observeReveal();
  }
  else if(tab === 'photos') {
    // photos: prefer GitHub API listing if configured, otherwise read data.json lists
    const files = await loadMediaFileList('images', key);
    if(!files.length) {
      display.innerHTML = `<div class="section"><p>No photos found for ${key}.</p></div>`;
      return;
    }
    let html = '<div class="section"><div class="grid">';
    files.forEach(fn=>{
      const src = buildMediaUrl('images', key, fn);
      html += `<img src="${src}" alt="" />`;
    });
    html += '</div></div>';
    display.innerHTML = html; observeReveal();
  }
  else if(tab === 'videos') {
    const files = await loadMediaFileList('videos', key);
    if(!files.length) {
      display.innerHTML = `<div class="section"><p>No videos found for ${key}.</p></div>`;
      return;
    }
    let html = '<div class="section"><div class="grid">';
    files.forEach(fn=>{
      const src = buildMediaUrl('videos', key, fn);
      html += `<div class="video-card"><video controls playsinline src="${src}"></video></div>`;
    });
    html += '</div></div>';
    display.innerHTML = html; observeReveal();
  }
}

/* Build story HTML (paragraphs + interleaved images) */
function buildRichHTML(text, imagesArray, key){
  // text can be a string or an array of paragraphs
  const paras = Array.isArray(text) ? text : splitParagraphs(text || '');
  let html = '';
  for(let i=0;i<paras.length;i++){
    html += `<div class="paragraph">${escapeHtml(paras[i])}</div>`;
    if(imagesArray[i]) {
      const src = buildMediaUrl('images', key, imagesArray[i]);
      html += `<img class="story-img" src="${src}" alt="" />`;
    }
  }
  // append leftover images
  for(let j=paras.length;j<imagesArray.length;j++){
    const src = buildMediaUrl('images', key, imagesArray[j]);
    html += `<img class="story-img" src="${src}" alt="" />`;
  }
  return html;
}

/* === Loading helpers ===
   - loadSiteData() reads data.json from repo root if available (via API or local file)
   - loadMediaFileList(kind, section) returns an array of file names for that folder
   - buildMediaUrl(kind, section, filename) returns a usable URL (api download_url if using API, else relative path)
*/

/* Try to fetch data.json from repo (API) or local */
async function loadSiteData(){
  // if we've already loaded it, return
  if(window._siteData) return window._siteData;

  // 1) Try GitHub API if configured
  if(REPO_OWNER && REPO_NAME){
    try {
      const apiUrl = `https://api.github.com/repos/${encodeURIComponent(REPO_OWNER)}/${encodeURIComponent(REPO_NAME)}/contents/data.json`;
      const res = await fetch(apiUrl);
      if(res.ok){
        const json = await res.json();
        if(json && json.content){
          const text = atob(json.content.replace(/\n/g,'')); // base64 decode
          const data = JSON.parse(text);
          window._siteData = data;
          return data;
        }
      }
    } catch(e){
      console.warn('GitHub API data.json fetch failed', e);
    }
  }

  // 2) Try local /data.json (served with site)
  try {
    const r = await fetch('data.json');
    if(r.ok){
      const j = await r.json(); window._siteData = j; return j;
    }
  } catch(e){
    // no local data.json
  }
  // fallback to empty object
  window._siteData = {}; return {};
}

/* Load filenames from GitHub API (preferred) else from data.json manifest */
async function loadMediaFileList(kind, section){
  // kind = 'images' or 'videos'
  // section = 'proposal' | 'school' | 'memories'
  // 1) GitHub API listing if repo configured
  if(REPO_OWNER && REPO_NAME){
    try {
      const apiUrl = `https://api.github.com/repos/${encodeURIComponent(REPO_OWNER)}/${encodeURIComponent(REPO_NAME)}/contents/${kind}/${encodeURIComponent(section)}`;
      const res = await fetch(apiUrl);
      if(res.ok){
        const arr = await res.json();
        // arr is list of files and directories — filter files and return their names in natural order
        const files = arr.filter(i=> i.type === 'file').map(i=> i.name).sort();
        return files;
      }
    } catch(e){
      console.warn('GitHub API folder list failed', e);
    }
  }

  // 2) Fallback: read from data.json manifest arrays like proposal_photos / proposal_videos
  const data = await loadSiteData();
  const keyPhotos = `${section}_photos`;
  const keyVideos = `${section}_videos`;
  if(kind === 'images' && data && data[keyPhotos]) return data[keyPhotos].flat();
  if(kind === 'videos' && data && data[keyVideos]) return data[keyVideos].flat();
  return [];
}

/* Build usable URL for media:
   - If GitHub API is available and we set REPO_OWNER/REPO_NAME, use raw.githubusercontent download URL
   - Else use relative path (images/<section>/<filename>)
*/
function buildMediaUrl(kind, section, filename){
  if(REPO_OWNER && REPO_NAME){
    // raw.githubusercontent URL (public repo)
    const url = `https://raw.githubusercontent.com/${encodeURIComponent(REPO_OWNER)}/${encodeURIComponent(REPO_NAME)}/main/${kind}/${encodeURIComponent(section)}/${encodeURIComponent(filename)}`;
    return url;
  } else {
    // relative path (works if files are in repo root and served via GitHub Pages)
    return `${kind}/${section}/${filename}`;
  }
}

/* Utilities */
function splitParagraphs(text){
  if(!text) return [];
  const raw = text.split(/\n\n|\.\s+|\!\s+|\?\s+/).filter(s=>s.trim());
  return raw.map(s=> s.trim().endsWith('.') ? s.trim() : s.trim() + '.');
}
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

/* IntersectionObserver reveal */
function observeReveal(){
  const obs = new IntersectionObserver((entries, o)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('visible'); o.unobserve(en.target); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.paragraph, .story-img, .grid img, .grid video').forEach(el=>{
    try{ obs.observe(el); } catch(e){ /* ignore */ }
  });
}
