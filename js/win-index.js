const i18n = {
  'nav-privacy': {en:'Privacy',tr:'Gizlilik',ru:'Конфиденциальность',es:'Privacidad'},
  'nav-terms':   {en:'Terms',  tr:'Koşullar',ru:'Условия',           es:'Términos'},
  'footer-mac':  {en:'macOS Version',tr:'macOS Sürümü',ru:'Версия для macOS',es:'Versión macOS'},
  'footer-privacy':{en:'Privacy Policy',tr:'Gizlilik Politikası',ru:'Конфиденциальность',es:'Privacidad'},
  'footer-terms':  {en:'Terms of Use',tr:'Kullanım Koşulları',ru:'Условия использования',es:'Términos de uso'},
};

function lcDetectLang(){
  var SUP=['tr','en','ru','es'];
  try{ var s=localStorage.getItem('lc-lang'); if(s&&SUP.indexOf(s)!==-1) return s; }catch(e){}
  var navs=navigator.languages||[navigator.language||'en'];
  for(var i=0;i<navs.length;i++){ var c=(navs[i]||'').toLowerCase().split('-')[0]; if(SUP.indexOf(c)!==-1) return c; }
  return 'en';
}
function setLang(l) {
  ['en','tr','ru','es'].forEach(lng => {
    const block = document.getElementById('lang-' + lng);
    if (block) block.classList.toggle('active', lng === l);
    const btn = document.getElementById('btn-' + lng);
    if (btn) btn.classList.toggle('active', lng === l);
  });
  Object.keys(i18n).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = i18n[id][l] || i18n[id].en;
  });
  try { localStorage.setItem('lc-lang', l); } catch(e) {}
}

setLang(lcDetectLang());
// Dil butonlari (CSP-guvenli: inline onclick yerine)
['en','tr','ru','es'].forEach(function(l){
  var b = document.getElementById('btn-'+l);
  if (b) b.addEventListener('click', function(){ setLang(l); });
});
