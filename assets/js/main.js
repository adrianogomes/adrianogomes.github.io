// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

// ---------- Ordem cronológica inversa (mais recente → mais antigo) ----------
// Todo contêiner com [data-sortable] tem os filhos ordenados pelo atributo data-sort
// (AAAA ou AAAA-MM; use 9999 para itens em andamento). Assim, basta editar as datas.
document.querySelectorAll('[data-sortable]').forEach(lista => {
  [...lista.children]
    .sort((a, b) => (b.dataset.sort || '').localeCompare(a.dataset.sort || ''))
    .forEach(el => lista.appendChild(el));
});

// ---------- Tema claro/escuro ----------
const root = document.documentElement;
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const atual = root.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const novo = atual === 'dark' ? 'light' : 'dark';
  root.dataset.theme = novo;
  try { localStorage.setItem('tema', novo); } catch (e) {}
});

// ---------- Menu mobile ----------
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => {
  const aberto = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', aberto);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

// ---------- Destaca a seção atual no menu ----------
const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));

// ---------- Animação ao rolar ----------
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); reveal.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.timeline-item, .card, .pub, .stats li').forEach(el => {
  el.classList.add('reveal');
  reveal.observe(el);
});

// ---------- Filtro de publicações ----------
const chips = document.querySelectorAll('.chip');
const pubs = document.querySelectorAll('.pub');
const vazio = document.querySelector('.empty-msg');
chips.forEach(chip => chip.addEventListener('click', () => {
  chips.forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  const f = chip.dataset.filter;
  let visiveis = 0;
  pubs.forEach(p => {
    const mostra = f === 'all' || p.dataset.type === f;
    p.hidden = !mostra;
    if (mostra) visiveis++;
  });
  vazio.hidden = visiveis > 0;
}));

// ---------- Copiar BibTeX ----------
const toast = document.querySelector('.toast');
function aviso(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(aviso.t);
  aviso.t = setTimeout(() => toast.classList.remove('show'), 2000);
}
document.querySelectorAll('.copy-bib').forEach(btn => btn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(btn.dataset.bib);
    aviso('BibTeX copiado!');
  } catch (e) {
    aviso('Não foi possível copiar');
  }
}));
