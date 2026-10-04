document.addEventListener('DOMContentLoaded',()=>{
  const nodes=[...document.querySelectorAll('.route-node')];
  const cards=[...document.querySelectorAll('.section-card')];
  const buttons=[...document.querySelectorAll('.section-start')];
  const ball=document.getElementById('routeBall');
  const progress=document.getElementById('routeProgress');
  const status=document.getElementById('routeStatus');
  const percent=document.getElementById('routePercent');
  const hint=document.getElementById('routeHint');
  const data=[
    ['Деньги','Язык денег'],['Проценты','Считаем изменения'],['Бюджет','Планируем деньги'],
    ['Кредиты','Считаем стоимость'],['Инвестиции','Смотрим на рост'],['Решения','Делаем вывод']
  ];

  function moveRoute(i){
    i=Math.max(0,Math.min(5,i));
    if(window.innerWidth<=700){
      ball.style.left='23px';
      ball.style.top=(17+i*86)+'px';
      progress.style.height=(i*86+3)+'px';
      progress.style.bottom='auto';
    }else{
      const pct=[7,24.2,41.4,58.6,75.8,93][i];
      ball.style.left=pct+'%';
      progress.style.width=(pct-7)+'%';
    }
    nodes.forEach((n,k)=>n.classList.toggle('active',k===i));
    cards.forEach((c,k)=>c.classList.toggle('active',k===i));
    status.textContent=`ШАГ ${String(i+1).padStart(2,'0')} / 06`;
    percent.textContent=Math.round((i+1)/6*100)+'%';
    hint.textContent=`${data[i][0]} — ${data[i][1]}.`;
  }

  function choose(i, scroll=true){
    moveRoute(i);
    if(scroll){
      const card=cards[i];
      card.scrollIntoView({behavior:'smooth',block:'center'});
    }
  }

  nodes.forEach((node,i)=>node.addEventListener('click',()=>choose(i,true)));
  cards.forEach((card,i)=>card.addEventListener('click',e=>{
    if(e.target.closest('.section-start')) return;
    choose(i,false);
  }));
  buttons.forEach(button=>button.addEventListener('click',e=>{
    e.stopPropagation();
    const i=Number(button.dataset.step||0);
    choose(i,false);
    // Пока это архитектурный вход. Здесь позже откроется реальная ситуация модуля.
    button.classList.add('pressed');
    setTimeout(()=>button.classList.remove('pressed'),180);
  }));
  window.addEventListener('resize',()=>{
    const active=nodes.findIndex(n=>n.classList.contains('active'));
    moveRoute(active<0?0:active);
  });
  moveRoute(0);
});
