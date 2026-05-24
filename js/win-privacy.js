const backLabels={en:'Back to LuminaCore',tr:'LuminaCore\'a Dön',ru:'Назад к LuminaCore',es:'Volver a LuminaCore'};
const termsLabels={en:'Terms of Use',tr:'Kullanım Koşulları',ru:'Условия использования',es:'Términos de uso'};
const coffeeLabels={en:'☕ Buy Me a Coffee',tr:'☕ Bana Kahve Ismarla',ru:'☕ Угостить кофе',es:'☕ Invítame un café'};
const signatureLabels={en:'A LEMORAS PROJECT',tr:'A LEMORAS PROJECT',ru:'ПРОЕКТ LEMORAS',es:'UN PROYECTO LEMORAS'};
const devLabels={en:'Developed by Onur Yasar',tr:'Onur Yaşar tarafından geliştirildi',ru:'Разработано Onur Yasar',es:'Desarrollado por Onur Yaşar'};

function lcDetectLang(){
  var SUP=['tr','en','ru','es'];
  try{ var s=localStorage.getItem('lc-lang'); if(s&&SUP.indexOf(s)!==-1) return s; }catch(e){}
  var navs=navigator.languages||[navigator.language||'en'];
  for(var i=0;i<navs.length;i++){ var c=(navs[i]||'').toLowerCase().split('-')[0]; if(SUP.indexOf(c)!==-1) return c; }
  return 'en';
}
function setLang(l){
  ['en','tr','ru','es'].forEach(lng=>{
    const b=document.getElementById('lang-'+lng);
    if(b)b.classList.toggle('active',lng===l);
    document.getElementById('btn-'+lng).classList.toggle('active',lng===l);
  });
  document.querySelector('.lbl-back').textContent=backLabels[l]||backLabels.en;
  document.querySelector('.lbl-terms').textContent=termsLabels[l]||termsLabels.en;
  document.querySelector('.lbl-coffee').textContent=coffeeLabels[l]||coffeeLabels.en;
  document.querySelector('.lbl-signature').textContent=signatureLabels[l]||signatureLabels.en;
  document.querySelector('.lbl-dev').textContent=devLabels[l]||devLabels.en;
  try { localStorage.setItem('lc-lang', l); } catch(e) {}
}
setLang(lcDetectLang());
// Dil butonlari (CSP-guvenli: inline onclick yerine)
['en','tr','ru','es'].forEach(function(l){
  var b = document.getElementById('btn-'+l);
  if (b) b.addEventListener('click', function(){ setLang(l); });
});
