// Screenshot mapping per slide per language
const BASE = 'file:///Users/onur/Desktop/lumina%20core/';

function lcDetectLang(){
  var SUP=['tr','en','ru','es'];
  try{ var s=localStorage.getItem('lc-lang'); if(s&&SUP.indexOf(s)!==-1) return s; }catch(e){}
  var navs=navigator.languages||[navigator.language||'en'];
  for(var i=0;i<navs.length;i++){ var c=(navs[i]||'').toLowerCase().split('-')[0]; if(SUP.indexOf(c)!==-1) return c; }
  return 'en';
}
function setLang(lang) {
    ['en','tr','ru','es'].forEach(l => {
        document.querySelectorAll('.lang.' + l).forEach(el => {
            el.style.display = (l === lang) ? '' : 'none';
        });
        document.getElementById('btn-' + l).classList.toggle('active', l === lang);
    });
    try { localStorage.setItem('lc-lang', lang); } catch(e) {}
}

// Init: hepsini gizle, algilanan dili goster
document.querySelectorAll('.lang').forEach(el => el.style.display = 'none');
setLang(lcDetectLang());
// Dil butonlari (CSP-guvenli: inline onclick yerine)
['en','tr','ru','es'].forEach(function(l){
  var b = document.getElementById('btn-' + l);
  if (b) b.addEventListener('click', function(){ setLang(l); });
});
