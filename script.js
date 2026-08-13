const root = document.documentElement;
const body = document.body;
const toggle = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem('ixa-theme');
if (savedTheme) root.dataset.theme = savedTheme;

function updateTheme() {
  const isDark = root.dataset.theme === 'dark';
  toggle.setAttribute('aria-label', isDark ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren');
  themeColor.content = isDark ? '#050606' : '#f6f8f7';
}
toggle.addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('ixa-theme', root.dataset.theme); updateTheme(); });
document.querySelector('#year').textContent = new Date().getFullYear();
updateTheme();

if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.querySelector('.cursor-dot'); const ring = document.querySelector('.cursor-ring'); const label = ring.querySelector('span');
  let px = innerWidth / 2, py = innerHeight / 2, rx = px, ry = py;
  addEventListener('mousemove', e => { px = e.clientX; py = e.clientY; dot.style.transform = `translate3d(${px}px,${py}px,0)`; body.classList.add('cursor-active'); }, { passive: true });
  (function animate() { rx += (px-rx)*.16; ry += (py-ry)*.16; ring.style.transform = `translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(animate); })();
  document.querySelectorAll('[data-cursor]').forEach(el => { el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; body.classList.add('cursor-hover'); }); el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover')); });
  document.querySelectorAll('.magnetic').forEach(el => { el.addEventListener('mousemove', e => { const r=el.getBoundingClientRect(); el.style.transform=`translate3d(${(e.clientX-r.left-r.width/2)*.025}px,${(e.clientY-r.top-r.height/2)*.05}px,0)`; }); el.addEventListener('mouseleave',()=>el.style.transform=''); });
  const stage=document.querySelector('.hero-stage'); stage.addEventListener('mousemove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`perspective(900px) rotateX(${-y*3.5}deg) rotateY(${x*4.5}deg)`;}); stage.addEventListener('mouseleave',()=>stage.style.transform='');
}
document.querySelectorAll('[data-link]').forEach(link => link.addEventListener('click', () => window.dispatchEvent(new CustomEvent('ixa:link-click', { detail: { link: link.dataset.link } }))));
