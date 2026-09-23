const pages = JSON.parse(document.getElementById('book-data').textContent);
const img = document.getElementById('book-page');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const select = document.getElementById('page-select');
const paper = document.getElementById('paper');
const status = document.getElementById('load-status');
const names = ['封面','认识皮普','搭桥的主意','向上搭','积木倒了','再试一次','朋友来了','开口求助','一起试试','选好积木','一起搭桥','小鸭过桥','一起成功','跟读练习','想一想','封底'];
const tips = ['先看看封面：这两个朋友准备一起做什么？','找一找小玩具鸭。皮普还有哪些玩具？','蓝色的布像什么？小鸭想去哪里？','和孩子一起指一指、数一数积木。','试着轻声读出“Wobble, wobble”，再读“CRASH!”。','皮普现在是什么心情？你遇到过类似的事吗？','如果朋友遇到困难，你会怎样问候他？','邀请孩子试着说：Can you help me?','轮流扮演皮普和波波，说一说：Let’s try together.','看看大积木和长积木分别放在哪里。','和孩子一起数：One, two, three!','你发现这一次的小桥有什么不同吗？','一起说：We did it! 也练习向朋友道谢。','每次读一句，留一点时间，让孩子自愿跟着说。','和大人一起，用大积木在地垫上搭一搭，再用故事里的句子邀请对方合作。','再说一说：这个故事里，你最喜欢哪一刻？'];
let current = 0, request = 0;
select.replaceChildren(...pages.map((_, i) => {const o=document.createElement('option');o.value=i;o.textContent=`${i+1} ${names[i]}`;return o;}));
function updateText(i) {
  const p=pages[i];const area=document.getElementById('page-text');area.replaceChildren();
  p.en.forEach(s=>{const el=document.createElement('p');el.lang='en';el.textContent=s;area.append(el)});
  const zh=document.createElement('p');zh.lang='zh-CN';zh.textContent=p.zh.replaceAll('|','　');area.append(zh);
  document.getElementById('page-name').textContent=`${i+1} / ${pages.length}　${names[i]}`;
  document.getElementById('reading-tip').textContent=tips[i];
}
function show(i,changeHash=true) {
  if(i<0||i>=pages.length)return;
  current=i;const id=++request;
  previous.disabled=i===0;next.disabled=i===pages.length-1;select.value=String(i);
  updateText(i);paper.setAttribute('aria-busy','true');status.hidden=true;
  const source=`pages/page-${String(i+1).padStart(2,'0')}-line.jpg`;
  const image=new Image();image.onload=()=>{if(id!==request)return;img.src=source;img.alt=`第${i+1}页：${pages[i].alt}`;paper.setAttribute('aria-busy','false');status.hidden=true;};
  image.onerror=()=>{if(id!==request)return;paper.setAttribute('aria-busy','false');status.textContent='这一页暂未加载成功，请重新选择页码，或下载 PDF 阅读。';status.hidden=false;};
  image.src=source;
  if(changeHash)history.replaceState(null,'',`#page=${i+1}`);
  if(i+1<pages.length){const preload=new Image();preload.src=`pages/page-${String(i+2).padStart(2,'0')}-line.jpg`;}
}
previous.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
select.addEventListener('change',()=>show(Number(select.value)));
document.addEventListener('keydown',event=>{if(/INPUT|SELECT|TEXTAREA/.test(event.target.tagName)||event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==='ArrowRight'){event.preventDefault();show(current+1)}if(event.key==='ArrowLeft'){event.preventDefault();show(current-1)}});
let start=null;
paper.addEventListener('touchstart',event=>{if(event.touches.length===1)start={x:event.touches[0].clientX,y:event.touches[0].clientY};else start=null},{passive:true});
paper.addEventListener('touchend',event=>{if(!start||!event.changedTouches.length)return;const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;start=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)show(current+(dx<0?1:-1));},{passive:true});
const initial=Number(new URLSearchParams(location.hash.slice(1)).get('page'));
show(Number.isInteger(initial)&&initial>=1&&initial<=pages.length?initial-1:0,false);

window.addEventListener('hashchange',()=>{const p=Number(new URLSearchParams(location.hash.slice(1)).get('page'));if(Number.isInteger(p)&&p>=1&&p<=pages.length)show(p-1,false)});
