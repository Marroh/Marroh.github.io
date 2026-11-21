const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const drawings={refiner:'<rect x="6" y="14" width="34" height="24" rx="5"/><path d="M40 26h18m-5-4 5 4-5 4"/><rect x="61" y="14" width="34" height="24" rx="5"/><path d="M95 26h18m-5-4 5 4-5 4M116 25l6 6 12-14"/><path d="M78 39v8H23v-8" stroke-dasharray="3 3"/>',vgepf:'<rect x="8" y="8" width="58" height="36" rx="3"/><path d="M37 8v36M8 26h58"/><circle cx="37" cy="26" r="8"/><circle cx="21" cy="18" r="2"/><circle cx="49" cy="34" r="2"/><path d="M74 26h18m-5-4 5 4-5 4"/><path d="M102 38V21m13 17V12m13 26V5" stroke-width="4"/>',cory:'<rect x="8" y="12" width="40" height="29" rx="6"/><rect x="94" y="12" width="40" height="29" rx="6"/><path d="M52 19h35m-5-4 5 4-5 4M89 33H55m5-4-5 4 5 4"/><circle cx="21" cy="24" r="2"/><circle cx="35" cy="24" r="2"/><circle cx="106" cy="24" r="2"/><circle cx="121" cy="24" r="2"/>'};
document.querySelector('#papers').innerHTML=window.PUBLICATIONS.map(p=>`<article class="publication" data-key="${p.key}" data-year="${p.year}"><div class="visual" aria-hidden="true"><svg style="${drawings[p.key] ? '' : 'display:none'}" viewBox="0 0 142 52">${drawings[p.key] || ''}</svg><b>${p.name}</b><span>${p.tag}</span></div><div><h3><a href="${p.paper}">${escapeHTML(p.title)}</a></h3><p class="authors">${p.authors.map(a=>a==='Hao Ma'?'<strong>Hao Ma</strong>':escapeHTML(a)).join(', ')}</p><p class="venue">${p.venue}</p><div class="paper-links"><a href="${p.paper}">Paper ↗</a>${p.code?`<a href="${p.code}">Code ↗</a>`:''}<details><summary aria-label="Abstract: ${escapeHTML(p.title)}">Abstract +</summary><div class="detail">${escapeHTML(p.abstract)}</div></details><details><summary aria-label="BibTeX: ${escapeHTML(p.title)}">BibTeX</summary><div class="detail bibbox"><button class="copy" data-key="${p.key}">Copy citation</button><pre>${escapeHTML(p.bib)}</pre></div></details></div></div></article>`).join('');
const topics = {
  coordination: ['multi'], amat: ['multi'], refiner: ['lm'],
  vgepf: ['multi'], ctd: ['control'],
  cory: ['lm', 'multi']
};
const topicPicker = document.querySelector('#topic');
const years = document.querySelectorAll('.filters button');
let year = 'all';
function filterPapers() {
  let count = 0;
  for (const paper of document.querySelectorAll('.publication')) {
    const matchesYear = year === 'all' || paper.dataset.year === year;
    const matchesTopic = topicPicker.value === 'all' || topics[paper.dataset.key].includes(topicPicker.value);
    paper.hidden = !(matchesYear && matchesTopic);
    if (!paper.hidden) count++;
  }
  for (const button of years) {
    const active = button.dataset.year === year;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  }
  document.querySelector('#no-papers').hidden = count > 0;
}
for (const button of years) {
  button.addEventListener('click', () => { year = button.dataset.year; filterPapers(); });
}
topicPicker.addEventListener('change', filterPapers);
document.querySelector('#clear-filters').addEventListener('click', () => {
  year = 'all';
  topicPicker.value = 'all';
  filterPapers();
  topicPicker.focus();
});
let toastTimer;document.querySelectorAll('.copy').forEach(button=>button.addEventListener('click',async()=>{const value=window.PUBLICATIONS.find(p=>p.key===button.dataset.key).bib;try{await navigator.clipboard.writeText(value);const toast=document.querySelector('#toast');toast.textContent='Citation copied';toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2000);}catch{button.textContent='Select the citation below to copy';}}));
const themeButton=document.querySelector('#theme');function setTheme(theme){document.documentElement.dataset.theme=theme;themeButton.textContent=theme==='dark'?'☾':'☼';themeButton.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} mode`);}try{setTheme(localStorage.getItem('theme')||'light');}catch{setTheme('light');}themeButton.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';setTheme(theme);try{localStorage.setItem('theme',theme);}catch{}});
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}});},{rootMargin:'-10% 0px -60% 0px'});document.querySelectorAll('main section').forEach(s=>observer.observe(s));
