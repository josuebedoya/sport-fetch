(function(){
'use strict';

/* =========================================================
   DATOS — se cargan desde data/blog.json
   ========================================================= */
const DATA_URL='data/blog.json';
let CATEGORIES=[],TOPIC_LABEL={},CONCEPTS=[],SRC={},ARTICLES=[],NEWS=[],MYTHS=[],VIDEOS=[],RESOURCES=[],TICKER=[];
function setData(d){
  ({categories:CATEGORIES,topics:TOPIC_LABEL,concepts:CONCEPTS,sources:SRC,articles:ARTICLES,news:NEWS,myths:MYTHS,videos:VIDEOS,resources:RESOURCES,ticker:TICKER}=d);
}

/* =========================================================
   HELPERS
   ========================================================= */
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ic=(n,cls='')=>`<svg class="ic ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const dfmt=new Intl.DateTimeFormat('es',{day:'numeric',month:'short',year:'numeric'});
const fdate=iso=>dfmt.format(new Date(iso+'T12:00:00')).replace('.','').replace(/ de /g,' ').replace(/(\d+ )(\p{L})/u,(m,a,b)=>a+b.toUpperCase());
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const thumb=id=>`images/videos/${id}.jpg`;
const ytUrl=id=>`https://www.youtube.com/watch?v=${id}`;
const conceptLabel=id=>(CONCEPTS.find(c=>c.id===id)||{}).label||id;
const pillFor=(topic,cls='')=>`<span class="pill ${cls}">${esc(TOPIC_LABEL[topic]||topic)}</span>`;

/* índice de búsqueda: item -> texto normalizado */
const REG=new Map();
function register(key,item,text){REG.set(key,{item,text:norm(text+' '+(item.tags||[]).map(conceptLabel).join(' ')+' '+(item.tags||[]).join(' ')+' '+(TOPIC_LABEL[item.topic]||''))})}

/* =========================================================
   RENDER
   ========================================================= */
const SKETCH={
  stadium:`<svg class="sketch-pop" viewBox="0 0 74 50" aria-hidden="true" filter="url(#rough)"><ellipse class="sk" cx="37" cy="32" rx="32" ry="12" fill="#fff"/><ellipse class="sk sk-thin" cx="37" cy="33" rx="18" ry="5" fill="#d9ecff"/><path class="sk sk-thin" d="M6 30 C10 14 64 14 68 30 M14 10 v-8 M60 10 v-8"/></svg>`
};

function renderTicker(){
  const items=TICKER.map(t=>`<span>${esc(t)}</span>`).join('');
  $('#ticker').innerHTML=items+items;
}

function renderTabs(){
  $('#tabs').innerHTML=CATEGORIES.map(c=>`<button type="button" class="tab" data-cat="${c.id}" aria-pressed="false">${esc(c.label)} <span class="tab__n" data-count="${c.id}"></span></button>`).join('');
}

function renderFeatured(){
  const a=ARTICLES.find(x=>x.featured), v=VIDEOS.find(x=>x.featured);
  register('a:'+a.id,a,a.title+' '+a.excerpt);
  register('v:'+v.id,v,v.title+' '+v.label+' '+v.desc);
  $('#featuredRow').innerHTML=`
  <article class="feature" data-item="a:${a.id}" data-reveal>
    <svg class="feature__doodle" viewBox="0 0 70 70" aria-hidden="true" filter="url(#rough)"><path class="sk draw" pathLength="1" d="M10 60 C6 40 14 18 34 12 M24 6 L36 12 L28 22"/><path class="sk sk-blue draw" pathLength="1" style="--d:300" d="M46 30 l6 -8 M54 40 l9 -3 M50 50 l8 4"/></svg>
    <div class="feature__media"><img src="${a.img}" alt="${esc(a.alt)}" loading="lazy"><span class="feature__temp" aria-hidden="true">${ic('thermometer')}<i></i></span></div>
    <div class="feature__body">
      <div class="meta">${pillFor(a.topic,'pill--yellow')}<time datetime="${a.date}">${fdate(a.date)}</time></div>
      <h3>${esc(a.title)}</h3>
      <p>${esc(a.excerpt)}</p>
      <div class="feature__foot">
        <button class="more more--ink" type="button" data-read="${a.id}">Leer más ${ic('arrow-right')}</button>
        <svg class="feature__swoosh" viewBox="0 0 110 24" aria-hidden="true"><path class="sk sk-blue sk-thick draw" pathLength="1" style="--d:400" d="M4 20 C30 14 70 8 106 4"/></svg>
      </div>
    </div>
  </article>
  <article class="vcard" data-item="v:${v.id}" data-reveal style="--i:1">
    <button class="vthumb" type="button" data-play="${v.id}" aria-label="Reproducir: ${esc(v.label)}"><img src="${thumb(v.id)}" alt="" loading="lazy"><span class="play">${ic('play')}</span></button>
    <div class="vcard__body">
      <div class="meta"><span class="pill pill--sky">Video</span><span>${ic('clock')} ${v.dur}</span></div>
      <h3>${esc(v.label)}</h3>
      <p>${esc(v.desc)}</p>
      <div class="vcard__foot">
        <a class="more" href="${ytUrl(v.id)}" target="_blank" rel="noopener">Ver video ${ic('arrow-right')}</a>
        <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path class="sk draw wiggle" pathLength="1" d="M22 4 L6 20 M6 10 V20 H16"/></svg>
      </div>
    </div>
  </article>`;
}

function articleCard(a,i){
  const top=`<div class="art__top">${pillFor(a.topic)}<time class="meta" datetime="${a.date}">${fdate(a.date)}</time></div>`;
  const img=a.img?`<div class="art__img"><img src="${a.img}" alt="${esc(a.alt)}" loading="lazy" width="640" height="420"></div>`:'';
  const read=`<button class="more" type="button" data-read="${a.id}">Leer más ${ic('arrow-right')}</button>`;
  const body=`<div class="art__body"><h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p>${read}</div>`;
  const base=`class="art art--${a.layout}" data-item="a:${a.id}" data-reveal style="--i:${i%3}"`;
  switch(a.layout){
    case 'wide': return `<article ${base}>
      <p class="leer-tambien hand" aria-hidden="true">
        <svg width="44" height="40" viewBox="0 0 44 40" filter="url(#rough)"><path class="sk" d="M22 8 C12 8 8 18 14 24 C16 26 16 30 16 32 H28 C28 30 28 26 30 24 C36 18 32 8 22 8Z M17 36 H27"/><path class="sk sk-blue sk-thin twinkle" d="M22 1 v3 M6 8 l3 2 M38 8 l-3 2"/></svg>
        Leer<br>también
        <svg width="70" height="30" viewBox="0 0 70 30"><path class="sk draw" pathLength="1" d="M6 4 C10 20 30 26 60 22 M52 14 L62 22 L52 28"/></svg>
      </p>${img}<div class="art__body">${top}<h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p>${read}</div></article>`;
    case 'split': return `<article ${base}>${img}<div class="art__body">${top}<h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p>${read}</div></article>`;
    case 'note': return `<article ${base}>
      <svg class="note-art" viewBox="0 0 300 110" aria-hidden="true" filter="url(#rough)">
        <path class="sk draw" pathLength="1" d="M150 10 V96 M90 96 H210 M150 22 L70 34 M150 22 L230 34"/>
        <path class="sk draw" pathLength="1" style="--d:300" d="M70 34 L48 70 H92Z M230 34 L208 70 H252Z"/>
        <g class="bob"><circle cx="70" cy="62" r="8" fill="#1a8cff"/></g><g class="bob" style="animation-delay:1s"><rect x="222" y="56" width="16" height="12" rx="3" fill="#0b1a33"/></g>
        <path class="sk sk-blue sk-thin twinkle" d="M120 12 l-6 -6 M180 12 l6 -6"/>
      </svg>
      ${top}<h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p>${read}</article>`;
    case 'tall': return `<article ${base}>${img}${top}${body}</article>`;
    default: return `<article ${base}>${a.sketch?SKETCH[a.sketch]:''}${top}${img}${body}</article>`;
  }
}

function renderArticles(){
  const list=ARTICLES.filter(a=>!a.featured);
  list.forEach(a=>register('a:'+a.id,a,a.title+' '+a.excerpt+' '+a.body.join(' ')));
  $('#articles').innerHTML=list.map(articleCard).join('');
}

function renderNews(){
  NEWS.forEach(n=>register('n:'+n.id,n,n.title+' '+n.excerpt));
  MYTHS.forEach(m=>register('m:'+m.id,m,m.q+' '+m.a));
  $('#timeline').insertAdjacentHTML('beforeend',NEWS.map((n,i)=>`
    <article class="tl" data-item="n:${n.id}" data-reveal style="--i:${i}">
      <span class="tl__n" aria-hidden="true">0${i+1}</span>
      <div class="meta">${pillFor(n.topic,'pill--sky')}<time datetime="${n.date}">${n.dateLabel||fdate(n.date)}</time></div>
      <h3>${esc(n.title)}</h3><p>${esc(n.excerpt)}</p>
      <a class="more" href="${SRC[n.src].url}" target="_blank" rel="noopener">Leer la fuente ${ic('arrow-up-right')}</a>
    </article>`).join(''));
  $('#myths').innerHTML=MYTHS.map((m,i)=>`
    <button type="button" class="myth" data-item="m:${m.id}" aria-pressed="false" data-reveal style="--i:${i}">
      <span class="myth__in">
        <span class="myth__face myth__front"><span class="pill">¿Mito o realidad?</span><strong>${esc(m.q)}</strong><em>Toca para descubrir ${ic('sparkles')}</em></span>
        <span class="myth__face myth__back"><b>Respuesta</b>${esc(m.a)}</span>
      </span>
    </button>`).join('');
}

function renderLatest(){
  const vids=VIDEOS.filter(v=>v.latest);
  $('#latest').innerHTML=vids.map(v=>`
    <li data-item="v:${v.id}" data-latest>
      <button type="button" data-play="${v.id}">
        <span class="lthumb"><img src="${thumb(v.id)}" alt="" loading="lazy"><span class="play play--sm">${ic('play')}</span></span>
        <span><strong>${esc(v.label)}</strong><small>YouTube · ${v.dur}</small></span>
      </button>
    </li>`).join('');
}

function renderPlaylist(){
  VIDEOS.forEach(v=>register('v:'+v.id,v,v.title+' '+v.label+' '+v.desc+' '+v.channel));
  $('#playlist').innerHTML=VIDEOS.map((v,i)=>`
    <li class="pl" data-item="v:${v.id}" data-pl="${v.id}">
      <button class="vthumb" type="button" data-stage="${v.id}" aria-label="Reproducir en la página: ${esc(v.label)}"><img src="${thumb(v.id)}" alt="" loading="lazy"><span class="play play--sm">${ic('play')}</span><span class="badge badge--abs">${v.dur}</span></button>
      <div>
        <h3>${esc(v.label)}</h3>
        <p>${esc(v.desc)}</p>
        <div class="meta">${pillFor(v.topic,'pill--sky')}<span>${esc(v.channel)}</span><a href="${ytUrl(v.id)}" target="_blank" rel="noopener" aria-label="Ver ${esc(v.label)} en YouTube">YouTube ${ic('external-link')}</a></div>
      </div>
    </li>`).join('');
}

function renderResources(){
  $('#resources').innerHTML=RESOURCES.map(r=>`
    <article class="res" data-res-topic="${r.topic}">
      <span class="res__ic">${ic(r.icon)}</span>
      <div><small>${esc(r.kind)} · ${esc(r.source)}</small><strong>${esc(r.title)}</strong><p>${esc(r.desc)}</p></div>
      <a class="btn btn--ghost" href="${SRC[r.src].url}" target="_blank" rel="noopener">${esc(r.cta)} ${ic('arrow-right')}</a>
    </article>`).join('');
}

function renderChips(){
  const all=[...REG.values()];
  $('#chips').innerHTML=CONCEPTS.map(c=>{
    const n=all.filter(r=>(r.item.tags||[]).includes(c.id)).length;
    return `<button type="button" class="chip" data-concept="${c.id}" aria-pressed="false">${esc(c.label)}<sup>${n}</sup></button>`;
  }).join('');
}

/* =========================================================
   VIDEO STAGE (iframe solo al reproducir)
   ========================================================= */
let current=null;
function setStage(id,autoplay){
  const v=VIDEOS.find(x=>x.id===id); if(!v) return;
  current=id;
  const screen=$('#stageScreen');
  if(autoplay){
    screen.innerHTML=`<div class="loader"><span>Cargando video…</span></div><iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    const fr=$('iframe',screen); fr.addEventListener('load',()=>$('.loader',screen)?.classList.add('done'),{once:true});
  }else{
    screen.innerHTML=`<button class="vthumb" type="button" data-stage-play="${id}" aria-label="Reproducir: ${esc(v.label)}"><img src="${thumb(id)}" alt="" loading="lazy"><span class="play">${ic('play')}</span></button>`;
  }
  $('#stageInfo').innerHTML=`<h3>${esc(v.label)}</h3><span class="meta"><span class="badge">${ic('clock')} ${v.dur}</span>${esc(v.channel)}</span><p>${esc(v.desc)} <span class="hand" style="font-size:18px;color:var(--ink-3)">· Título original: “${esc(v.title)}”</span></p><a class="more" href="${ytUrl(id)}" target="_blank" rel="noopener">Ver en YouTube ${ic('external-link')}</a>`;
  $$('.pl').forEach(p=>p.classList.toggle('is-current',p.dataset.pl===id));
}

/* =========================================================
   LECTOR (dialog)
   ========================================================= */
function openReader(id){
  const a=ARTICLES.find(x=>x.id===id); if(!a) return;
  const dlg=$('#reader');
  $('#readerContent').innerHTML=`
    ${a.img?`<div class="reader__img"><img src="${a.img}" alt="${esc(a.alt)}"></div>`:''}
    <div class="reader__body">
      <div class="meta">${pillFor(a.topic,'pill--yellow')}<time datetime="${a.date}">${fdate(a.date)}</time><span>· ${a.read} de lectura</span></div>
      <h2 id="readerTitle">${esc(a.title)}</h2>
      ${a.body.map(p=>`<p>${esc(p)}</p>`).join('')}
      <h4>Fuentes para profundizar</h4>
      <ul class="reader__src">${a.sources.map(s=>`<li><a href="${SRC[s].url}" target="_blank" rel="noopener">${esc(SRC[s].label)} ${ic('arrow-up-right')}</a></li>`).join('')}</ul>
      <p class="reader__note">Conceptos: ${a.tags.map(conceptLabel).join(' · ')}</p>
    </div>`;
  if(typeof dlg.showModal==='function') dlg.showModal(); else dlg.setAttribute('open','');
  dlg.scrollTop=0;
}

/* =========================================================
   FILTRADO
   ========================================================= */
const state={cat:'todo',q:'',concept:null};
function match(item,{cat=state.cat,q=state.q,concept=state.concept}={},text=''){
  const c=cat==='todo'||item.topic===cat||item.type===cat;
  const t=!q||norm(text).includes(norm(q.trim()));
  const k=!concept||(item.tags||[]).includes(concept);
  return c&&t&&k;
}

function updateCounts(){
  CATEGORIES.forEach(c=>{
    const keys=new Set();
    REG.forEach((r,k)=>{if(match(r.item,{cat:c.id},r.text)) keys.add(k)});
    const el=$(`[data-count="${c.id}"]`); if(el) el.textContent=keys.size;
  });
}

function apply(animate=true){
  const run=()=>{
    $$('[data-item]').forEach(el=>{
      const r=REG.get(el.dataset.item); if(!r) return;
      const ok=match(r.item,undefined,r.text);
      const was=!el.classList.contains('is-hidden');
      el.classList.toggle('is-hidden',!ok);
      if(ok&&!was&&animate&&!useVT){el.classList.remove('is-entering');void el.offsetWidth;el.classList.add('is-entering')}
      if(ok) el.classList.add('is-in');
    });
    let total=0;
    REG.forEach(r=>{if(match(r.item,undefined,r.text)) total++});
    $$('[data-group]').forEach(g=>g.classList.toggle('is-collapsed',!$('[data-item]:not(.is-hidden)',g)));
    const latestVis=$$('#latest [data-item]:not(.is-hidden)').length;
    $('#latestEmpty').classList.toggle('is-hidden',latestVis>0);
    const isTopic=(CATEGORIES.find(c=>c.id===state.cat)||{}).kind==='topic';
    $$('.res').forEach(r=>r.classList.toggle('is-hidden',isTopic&&r.dataset.resTopic!==state.cat));
    $('#empty').classList.toggle('is-on',total===0);
    // si el video actual del escenario se ocultó, mostrar el primero visible
    const firstVisible=$('.pl:not(.is-hidden)');
    if(firstVisible&&$(`.pl[data-pl="${current}"]`)?.classList.contains('is-hidden')) setStage(firstVisible.dataset.pl,false);
    renderStatus(total);
  };
  const useVT=animate&&!reduced&&document.startViewTransition;
  if(useVT) document.startViewTransition(run); else run();
  $$('.tab').forEach(t=>t.setAttribute('aria-pressed',String(t.dataset.cat===state.cat)));
  $$('.chip').forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.concept===state.concept)));
  $('#searchBox').classList.toggle('has-value',!!state.q);
  updateCounts();
  try{history.replaceState(null,'',state.cat==='todo'?location.pathname+location.search:'#'+state.cat)}catch(e){}
}

function renderStatus(total){
  const parts=[];
  if(state.cat!=='todo'||state.q||state.concept){
    parts.push(`<span><strong>${total}</strong> ${total===1?'contenido':'contenidos'}${state.cat!=='todo'?' en <strong>'+esc(CATEGORIES.find(c=>c.id===state.cat).label)+'</strong>':''}${state.q?' para “'+esc(state.q)+'”':''}</span>`);
    if(state.concept) parts.push(`<span class="chip-active">Concepto: ${esc(conceptLabel(state.concept))}<button type="button" data-clear-concept aria-label="Quitar concepto">${ic('x')}</button></span>`);
    parts.push(`<button type="button" class="linkbtn" data-reset>Limpiar filtros</button>`);
  }
  $('#status').innerHTML=parts.join('');
}

function resetAll(){state.cat='todo';state.q='';state.concept=null;$('#q').value='';apply()}

/* =========================================================
   EVENTOS
   ========================================================= */
function bind(){
  $('#tabs').addEventListener('click',e=>{
    const b=e.target.closest('.tab'); if(!b) return;
    state.cat=b.dataset.cat; apply();
    b.scrollIntoView({inline:'center',block:'nearest',behavior:reduced?'auto':'smooth'});
  });
  // flechas entre pestañas
  $('#tabs').addEventListener('keydown',e=>{
    if(!['ArrowRight','ArrowLeft'].includes(e.key)) return;
    const tabs=$$('.tab'),i=tabs.indexOf(document.activeElement); if(i<0) return;
    e.preventDefault(); tabs[(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length].focus();
  });
  let t; $('#q').addEventListener('input',e=>{clearTimeout(t);t=setTimeout(()=>{state.q=e.target.value;apply()},180)});
  $('.search__clear').addEventListener('click',()=>{$('#q').value='';state.q='';apply();$('#q').focus()});
  $('#chips').addEventListener('click',e=>{
    const c=e.target.closest('.chip'); if(!c) return;
    state.concept=state.concept===c.dataset.concept?null:c.dataset.concept;
    state.cat='todo'; apply();
    if(state.concept) $('#filtros').scrollIntoView({behavior:reduced?'auto':'smooth'});
  });
  document.addEventListener('click',e=>{
    const r=e.target.closest('[data-read]'); if(r){openReader(r.dataset.read);return}
    const p=e.target.closest('[data-play]'); if(p){setStage(p.dataset.play,true);$('#videos').scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});return}
    const s=e.target.closest('[data-stage]'); if(s){setStage(s.dataset.stage,true);if(innerWidth<960)$('.stage').scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});return}
    const sp=e.target.closest('[data-stage-play]'); if(sp){setStage(sp.dataset.stagePlay,true);return}
    const m=e.target.closest('.myth'); if(m){m.setAttribute('aria-pressed',String(m.getAttribute('aria-pressed')!=='true'));return}
    if(e.target.closest('[data-reset]')){resetAll();return}
    if(e.target.closest('[data-clear-concept]')){state.concept=null;apply();return}
  });
  const dlg=$('#reader');
  dlg.addEventListener('click',e=>{if(e.target===dlg||e.target.closest('[data-close]')) dlg.close()});

  // sombra de la barra al quedar fija
  const sentinel=document.createElement('div');$('#filtros').before(sentinel);
  new IntersectionObserver(([en])=>$('#filtros').classList.toggle('is-stuck',!en.isIntersecting)).observe(sentinel);
}

/* animaciones de aparición al hacer scroll */
function reveal(){
  const els=$$('[data-reveal], .shead, .hero__art svg, .art, .quote, .cta, .concepts, .resources, .footer');
  if(reduced||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('is-in'));return}
  const io=new IntersectionObserver(ents=>ents.forEach(en=>{if(en.isIntersecting){en.target.classList.add('is-in');io.unobserve(en.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
  els.forEach(e=>io.observe(e));
}

/* =========================================================
   INIT
   ========================================================= */
function showLoadError(err){
  console.error('No se pudo cargar '+DATA_URL,err);
  $('#articles').innerHTML=`<p class="load-error">No se pudo cargar el contenido del blog (<code>${DATA_URL}</code>). Si abriste el archivo con doble clic, ábrelo desde un servidor local, por ejemplo <code>npx serve .</code></p>`;
  $('#articles').closest('section').classList.remove('is-collapsed');
}

async function boot(){
  requestAnimationFrame(()=>$('.hero').classList.add('is-in'));
  try{
    const res=await fetch(DATA_URL,{cache:'no-cache'});
    if(!res.ok) throw new Error('HTTP '+res.status);
    setData(await res.json());
  }catch(err){showLoadError(err);reveal();return}
  current=VIDEOS[0].id;
  renderTicker();renderTabs();renderFeatured();renderArticles();renderNews();renderLatest();renderPlaylist();renderResources();renderChips();
  setStage(current,false);
  bind();
  const hash=location.hash.slice(1); if(CATEGORIES.some(c=>c.id===hash)) state.cat=hash;
  apply(false);
  requestAnimationFrame(reveal);
}
boot();
})();
