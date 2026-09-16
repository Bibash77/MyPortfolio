document.getElementById("year").textContent=new Date().getFullYear();
const revealTargets=document.querySelectorAll(".hero-copy,.portrait-panel,.section-header,.timeline-entry,.stack-group,.project-card,.engineering-section .pipeline > div,.footer-info article,.contact-inner");
document.documentElement.classList.add("reveal-ready");
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add("is-visible");revealObserver.unobserve(entry.target)}
}),{threshold:.12});
revealTargets.forEach(target=>{target.classList.add("reveal");revealObserver.observe(target)});
const filters=[...document.querySelectorAll(".filter")];
const cards=[...document.querySelectorAll(".project-card")];
const search=document.getElementById("projectSearch");
const count=document.getElementById("projectCount");
let active="all";
function update(){
  const q=(search.value||"").trim().toLowerCase();
  let visible=0;
  cards.forEach(card=>{
    const cats=(card.dataset.category||"").split(" ");
    const text=((card.dataset.search||"")+" "+card.innerText).toLowerCase();
    const okCat=active==="all"||cats.includes(active);
    const okSearch=!q||text.includes(q);
    card.classList.toggle("hidden",!(okCat&&okSearch));
    if(okCat&&okSearch)visible++;
  });
  count.textContent=visible;
}
filters.forEach(btn=>btn.addEventListener("click",()=>{
  filters.forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");active=btn.dataset.filter;update();
}));
search.addEventListener("input",update);
document.addEventListener("keydown",e=>{
  if(e.key==="/"&&document.activeElement!==search){e.preventDefault();search.focus();}
});
update();