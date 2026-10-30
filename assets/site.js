// HANDYMAN RENTCAR — 新サイト共通スクリプト（2026-10）
(function(){
  // 多言語（official-i18n.js の hdmT があれば訳文、無ければ日本語フォールバック）
  function T(k,fb){try{if(window.hdmT){var v=window.hdmT(k);if(v!=null&&v!==k)return v;}}catch(e){}return fb;}
  function curL(){try{return window.hdmLang?window.hdmLang():'ja';}catch(e){return 'ja';}}
  var langHooks=[];
  (function(prev){window.hdmOnLang=function(l){langHooks.forEach(function(h){try{h(l);}catch(e){}});if(typeof prev==='function')try{prev(l);}catch(e){}};})(window.hdmOnLang);
  // メニュー（スマホ）
  var hb=document.querySelector('.ham'),dr=document.querySelector('.drawer'),bk=document.querySelector('.dback');
  // ヘッダーの backdrop-filter の影響を受けないよう、メニューは body 直下へ移す
  if(dr)document.body.appendChild(dr);if(bk)document.body.appendChild(bk);
  function dOpen(o){if(!dr)return;dr.classList.toggle('open',o);bk&&bk.classList.toggle('open',o);document.body.style.overflow=o?'hidden':''}
  if(hb)hb.addEventListener('click',function(){dOpen(true)});
  if(bk)bk.addEventListener('click',function(){dOpen(false)});
  var dc=document.querySelector('.drawer .dclose');if(dc)dc.addEventListener('click',function(){dOpen(false)});
  if(dr)dr.addEventListener('click',function(e){if(e.target.tagName==='A')dOpen(false)});

  // キービジュアルのスライド
  var sl=[].slice.call(document.querySelectorAll('.kv .slide')),cp=document.querySelector('.kv h1[data-copies]');
  var copiesJa=cp?cp.getAttribute('data-copies').split('|'):[];
  function copies(){if(curL()!=='ja'){var t=T('tp_copies','');if(t){var a=t.split('|');if(a.length===copiesJa.length)return a;}}return copiesJa;}
  var i=0;
  if(cp){langHooks.push(function(){var c=copies();if(c[i])cp.innerHTML=c[i];});}
  // 写真とキャッチを同じ流れで切り替える（10/30 オーナー指摘「画像とキャッチの切替タイミングがずれている」）：
  // ①今のキャッチを消す(0.45秒) → ②消え切ってから写真を切替＋文字を差し替え → ③新しい写真が見えてきたところで新しいキャッチを出す
  // 前の写真の上に次のキャッチが出る／次の写真の上に前のキャッチが残る、を無くす。キャッチは独立した層にして描き残しを出さない
  var kvT1=0,kvT2=0;
  if(cp){cp.style.transition='opacity .45s ease';cp.style.willChange='opacity';cp.style.transform='translateZ(0)';cp.style.webkitTransform='translateZ(0)';}
  function kvNext(){clearTimeout(kvT1);clearTimeout(kvT2);var n=(i+1)%sl.length;
    if(cp)cp.style.opacity=0;
    kvT1=setTimeout(function(){sl[i].classList.remove('on');i=n;sl[i].classList.add('on');
      if(!cp)return;cp.style.visibility='hidden';var c=copies();if(c[i])cp.innerHTML=c[i];void cp.offsetHeight;
      kvT2=setTimeout(function(){cp.style.visibility='';cp.style.opacity=1},800)},cp?480:0)}
  if(sl.length>1){setInterval(function(){if(document.hidden)return;kvNext()},6500);}


  // 店舗カード内ギャラリー：data-gallery の実写を順番に切り替え、キャプションと点を表示
  [].forEach.call(document.querySelectorAll('.store[data-gallery]'),function(card,ci){
    var g;try{g=JSON.parse(card.getAttribute('data-gallery'))}catch(e){return}if(!g||!g.length)return;
    card.style.backgroundImage='none';
    var layers=g.map(function(x,k){var d=document.createElement('div');d.className='sg'+(k===0?' on':'');d.style.backgroundImage='url('+x.s+')';card.insertBefore(d,card.firstChild);return d});
    var cap=document.createElement('span');cap.className='gcap';card.appendChild(cap);
    var dots=document.createElement('span');dots.className='gdots';dots.innerHTML=g.map(function(_,k){return '<i'+(k===0?' class="on"':'')+'></i>'}).join('');
    var more=card.querySelector('.more');card.insertBefore(dots,more);
    var n=0;function show(){layers.forEach(function(l,k){l.classList.toggle('on',k===n)});[].forEach.call(dots.children,function(d,k){d.classList.toggle('on',k===n)});cap.textContent=T(g[n].k,g[n].c)}
    show();langHooks.push(show);
    setTimeout(function(){setInterval(function(){n=(n+1)%g.length;show()},4200)},ci*1400);
  });

  // 空車検索 → 予約画面（official-flow.html）へ
  var f=document.getElementById('finder');if(!f)return;
  var area=f.querySelector('[name=area]'),pd=f.querySelector('[name=pd]'),pt=f.querySelector('[name=pt]'),rd=f.querySelector('[name=rd]'),rt=f.querySelector('[name=rt]');
  var mbox=f.querySelector('.methods'),note=f.querySelector('.note');
  function ymd(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  var base=new Date();base.setHours(0,0,0,0);
  var minP=new Date(base);minP.setDate(minP.getDate()+2);var defR=new Date(base);defR.setDate(defR.getDate()+3);
  var MIN=ymd(minP);pd.min=MIN;rd.min=MIN;if(!pd.value)pd.value=MIN;if(!rd.value)rd.value=ymd(defR);
  pd.addEventListener('change',function(){if(pd.value<MIN)pd.value=MIN;rd.min=pd.value;if(rd.value<pd.value)rd.value=pd.value});
  // 時間（9:00〜19:00・30分刻み）
  [pt,rt].forEach(function(s){for(var h=9;h<=19;h++){for(var m=0;m<60;m+=30){if(h===19&&m>0)break;var t=('0'+h).slice(-2)+':'+('0'+m).slice(-2);var o=document.createElement('option');o.value=o.textContent=t;s.appendChild(o)}}});
  pt.value='10:00';rt.value='10:00';
  // [method, 日本語ラベル, 辞書キー]
  var M={naha:[['airport','空港の無料送迎','nv_m_airport'],['delivery','ホテル・自宅へお届け','nv_m_deliv_nha'],['store','店舗で受け取り','nv_m_store']],
         takamatsu:[['airport','空港の無料送迎','nv_m_airport'],['store','店舗で受け取り','nv_m_store']],sapporo:[['delivery','ホテル・自宅・駅へお届け','nv_m_deliv_spk']]};
  var N={naha:'那覇空港の構内では車の受け渡しができません。空港の送迎バスのりば（11-B）から店舗へご案内します。',
         sapporo:'札幌はお届け専門です。お届け先は次の画面の地図で指定します（新千歳空港は対象外）。',
         takamatsu:'国内線到着口付近でスタッフがお迎えし、店舗（約5分）へご案内します。'};
  function renderM(keep){var a=area.value;var cur=keep&&mbox.querySelector('.m.on');var sel=cur?cur.dataset.m:null;
    if(sel&&M[a]&&!M[a].some(function(x){return x[0]===sel}))sel=null;
    mbox.innerHTML='';note.textContent=N[a]?T('nv_mn_'+a,N[a]):'';
    if(!M[a]){mbox.hidden=true;return}mbox.hidden=false;
    M[a].forEach(function(x,k){var b=document.createElement('button');b.type='button';b.className='m'+((sel?x[0]===sel:k===0)?' on':'');b.dataset.m=x[0];b.textContent=T(x[2],x[1]);
      b.onclick=function(){[].forEach.call(mbox.children,function(c){c.classList.remove('on')});b.classList.add('on')};mbox.appendChild(b)})}
  area.addEventListener('change',function(){area.classList.remove('need');renderM()});
  var q=new URLSearchParams(location.search);if(M[q.get('area')]){area.value=q.get('area')}
  if(f.dataset.area){area.value=f.dataset.area}
  renderM();
  langHooks.push(function(){renderM(true)});
  f.addEventListener('submit',function(e){e.preventDefault();
    if(!area.value){area.classList.add('need');area.focus();return}
    if(rd.value<pd.value){rd.classList.add('need');rd.focus();return}
    var on=mbox.querySelector('.m.on'),m=on?on.dataset.m:'delivery';
    var u='official-flow.html?area='+encodeURIComponent(area.value)+'&method='+m+'&pd='+pd.value+'&pt='+encodeURIComponent(pt.value)+'&rd='+rd.value+'&rt='+encodeURIComponent(rt.value);
    location.href=(f.dataset.root||'')+u;});
})();
