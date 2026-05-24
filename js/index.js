// ── Language switcher ──
function lcDetectLang(){
  var SUP=['tr','en','ru','es'];
  try{ var s=localStorage.getItem('lc-lang'); if(s&&SUP.indexOf(s)!==-1) return s; }catch(e){}
  var navs=navigator.languages||[navigator.language||'en'];
  for(var i=0;i<navs.length;i++){ var c=(navs[i]||'').toLowerCase().split('-')[0]; if(SUP.indexOf(c)!==-1) return c; }
  return 'en';
}
function setLang(l){
  ['en','tr','ru','es'].forEach(lng=>{
    document.querySelectorAll('[data-lang="'+lng+'"]').forEach(el=>{
      const isBlock = getComputedStyle(el).display==='none'||el.dataset.langInline===undefined;
      el.classList.toggle('active', lng===l);
      if(lng===l){
        el.style.display = el.dataset.langInline!==undefined ? 'inline' : '';
      } else {
        el.style.display = 'none';
      }
    });
    document.getElementById('btn-'+lng).classList.toggle('active',lng===l);
  });
  // fix breakdown labels
  document.querySelectorAll('.bd-label[data-lang]').forEach(el=>{
    el.style.display = el.dataset.lang===l ? 'block' : 'none';
  });
  // fix stat labels
  document.querySelectorAll('.stat-lbl[data-lang]').forEach(el=>{
    el.style.display = el.dataset.lang===l ? 'block' : 'none';
  });
  // fix section labels
  document.querySelectorAll('.section-label[data-lang],.platform-pill [data-lang]').forEach(el=>{
    el.style.display = el.dataset.lang===l ? 'block' : 'none';
  });
  try { localStorage.setItem('lc-lang', l); } catch(e) {}
}

// Otomatik dil (kayitli > tarayici > EN)
setLang(lcDetectLang());
// Dil butonlari (CSP-guvenli: inline onclick yerine)
['en','tr','ru','es'].forEach(function(l){
  var b = document.getElementById('btn-'+l);
  if (b) b.addEventListener('click', function(){ setLang(l); });
});

// ── Waveform animation ──
const canvas = document.getElementById('wave-canvas');
const ctx = canvas.getContext('2d');
let points = Array.from({length:80}, ()=>9+Math.random()*4);
let frame=0;

function resizeCanvas(){
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = 60;
}
resizeCanvas();
window.addEventListener('resize',resizeCanvas);

function drawWave(){
  const w=canvas.width, h=canvas.height;
  ctx.clearRect(0,0,w,h);

  // Add new point
  if(frame%2===0){
    const newVal = points[points.length-1] + (Math.random()-0.5)*1.5;
    points.push(Math.min(20,Math.max(4,newVal)));
    if(points.length>80)points.shift();
  }

  const max=Math.max(...points);
  const min=Math.min(...points);
  const range=max-min||1;

  ctx.beginPath();
  const step=w/(points.length-1);
  points.forEach((v,i)=>{
    const x=i*step;
    const y=h-4-(v-min)/range*(h-12);
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });

  const grad=ctx.createLinearGradient(0,0,w,0);
  grad.addColorStop(0,'rgba(255,184,0,0.3)');
  grad.addColorStop(1,'rgba(255,184,0,0.9)');
  ctx.strokeStyle=grad;
  ctx.lineWidth=2;
  ctx.stroke();

  // Fill
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();
  const fillGrad=ctx.createLinearGradient(0,0,0,h);
  fillGrad.addColorStop(0,'rgba(255,184,0,0.15)');
  fillGrad.addColorStop(1,'rgba(255,184,0,0)');
  ctx.fillStyle=fillGrad;
  ctx.fill();

  frame++;
  requestAnimationFrame(drawWave);
}
drawWave();

// ── Live watt simulation ──
let watt = 9.8;
function animateWatt(){
  watt += (Math.random()-0.48)*0.3;
  watt = Math.min(18,Math.max(5,watt));
  document.getElementById('watt-num').textContent = watt.toFixed(1);
  // update breakdown proportionally
  const cpu = (watt*0.50).toFixed(1);
  const gpu = (watt*0.05+0.3).toFixed(1);
  const ram = (watt*0.14).toFixed(1);
  const oth = (watt - cpu - gpu - ram).toFixed(1);
  document.getElementById('bd-cpu').textContent=cpu+' W';
  document.getElementById('bd-gpu').textContent=gpu+' W';
  document.getElementById('bd-ram').textContent=ram+' W';
  document.getElementById('bd-other').textContent=oth+' W';

  const badge = document.getElementById('eff-badge');
  const labels = {
    en:['⚡ EFFICIENT','✦ BALANCED','🔥 HIGH LOAD'],
    tr:['⚡ VERİMLİ','✦ DENGELİ','🔥 YÜKSEK'],
    ru:['⚡ ЭФФЕКТ.','✦ БАЛАНС','🔥 НАГРУЗКА'],
    es:['⚡ EFICIENTE','✦ EQUILIBRADO','🔥 CARGA ALTA']
  };
  const activeLang = document.querySelector('.lang-nav button.active')?.id?.replace('btn-','') || 'en';
  const lvl = watt<12?0:watt<16?1:2;
  badge.textContent=(labels[activeLang]||labels.en)[lvl];
  badge.style.color=lvl===0?'#4ADE80':lvl===1?'#FFB800':'#FF6B6B';
  setTimeout(animateWatt, 1200+Math.random()*800);
}
setTimeout(animateWatt,1500);
