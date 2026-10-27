// HANDYMAN RENTCAR — 新サイト共通スクリプト（2026-10）
(function(){
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
  var copies=cp?cp.getAttribute('data-copies').split('|'):[];
  if(sl.length>1){var i=0;setInterval(function(){sl[i].classList.remove('on');i=(i+1)%sl.length;sl[i].classList.add('on');
    if(cp&&copies[i]){cp.style.opacity=0;setTimeout(function(){cp.innerHTML=copies[i];cp.style.opacity=1},500)}},6500);}

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
  var M={naha:[['airport','空港の無料送迎'],['delivery','ホテル・自宅へお届け'],['store','店舗で受け取り']],
         takamatsu:[['airport','空港の無料送迎'],['store','店舗で受け取り']],sapporo:[['delivery','ホテル・自宅・駅へお届け']]};
  var N={naha:'那覇空港の構内では車の受け渡しができません。空港の送迎バスのりば（11-B）から店舗へご案内します。',
         sapporo:'札幌はお届け専門です。お届け先は次の画面の地図で指定します（新千歳空港は対象外）。',
         takamatsu:'国内線到着口付近でスタッフがお迎えし、店舗（約5分）へご案内します。'};
  function renderM(){var a=area.value;mbox.innerHTML='';note.textContent=N[a]||'';
    if(!M[a]){mbox.hidden=true;return}mbox.hidden=false;
    M[a].forEach(function(x,k){var b=document.createElement('button');b.type='button';b.className='m'+(k===0?' on':'');b.dataset.m=x[0];b.textContent=x[1];
      b.onclick=function(){[].forEach.call(mbox.children,function(c){c.classList.remove('on')});b.classList.add('on')};mbox.appendChild(b)})}
  area.addEventListener('change',function(){area.classList.remove('need');renderM()});
  var q=new URLSearchParams(location.search);if(M[q.get('area')]){area.value=q.get('area')}
  if(f.dataset.area){area.value=f.dataset.area}
  renderM();
  f.addEventListener('submit',function(e){e.preventDefault();
    if(!area.value){area.classList.add('need');area.focus();return}
    if(rd.value<pd.value){rd.classList.add('need');rd.focus();return}
    var on=mbox.querySelector('.m.on'),m=on?on.dataset.m:'delivery';
    var u='official-flow.html?area='+encodeURIComponent(area.value)+'&method='+m+'&pd='+pd.value+'&pt='+encodeURIComponent(pt.value)+'&rd='+rd.value+'&rt='+encodeURIComponent(rt.value);
    location.href=(f.dataset.root||'')+u;});
})();
