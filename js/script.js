//  Year utility
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// ====== Theme Toggle ======
(function themeToggle(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  btn.addEventListener('click', () => {
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') !== 'light';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('origin-theme', isDark ? 'light' : 'dark');
  });
  const saved = localStorage.getItem('origin-theme');
  if(saved) document.documentElement.setAttribute('data-theme', saved);
})();

// ====== Hero Section BG ======
(function particles(){
  const canvas = document.getElementById('particles');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = {x: null, y: null};

  function resize(){
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    particles = Array.from({length: Math.max(70, Math.floor(W*H/16000))}, () => ({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.5)*0.6,
      r: Math.random()*1.8 + 0.8
    }));
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = mouse.y = null; });

  function step(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles){
      // drift
      p.x += p.vx; p.y += p.vy;
      if(p.x<0 || p.x>W) p.vx *= -1;
      if(p.y<0 || p.y>H) p.vy *= -1;

      if(mouse.x!=null){
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx*dx + dy*dy;
        if(d2 < 140*140){
          p.x += dx * -0.0008;
          p.y += dy * -0.0008;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(124,92,255,0.8)';
      ctx.fill();

      for(const q of particles){
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.hypot(dx,dy);
        if(dist < 110){
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);
          ctx.lineTo(q.x,q.y);
          ctx.strokeStyle = 'rgba(124,92,255,' + (0.15 - dist/1100) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  step();
})();

// ====== Event Data ======
const EVENT_DATA = [
  {
    id: 'idea25',
    title: 'Ecell Eureka! 2025',
    type: 'Ideathon',
    date: '2025-08-28',
    short: 'A dynamic event to ideate and showcase fresh solutions.',
    long: 'Collaborate in teams of 3-5 during an engaging ideathon. Guidance from experts, fun rewards, and plenty of innovation await.',
    timeline: ['10:00 AM — Check-in & opening ceremony', '12:00 PM — Hacking begins', '09:00 PM — Midnight snack & mini-events', '09:00 AM — Submissions close', '11:00 AM — Demos & judging', '01:00 PM — Winners & closing'],
    reg: '#',
    image: ''
  },
  {
    id: 'aisem',
    title: 'AI Seminar: GenAI in the Real World',
    type: 'Seminar',
    date: '2025-10-05',
    short: 'Practitioners discuss deploying LLMs safely in products.',
    long: 'A deep dive into guardrails, evals, and shipping GenAI features at scale, followed by Q&A.',
    timeline: ['02:00 PM — Welcome & intro', '02:15 PM — Talk', '03:15 PM — Case studies', '04:00 PM — Q&A & networking'],
    reg: '#',
    image: ''
  },
  {
    id: 'cyberwrk',
    title: 'Cybersecurity Workshop: Threat Hunting',
    type: 'Workshop',
    date: '2025-11-12',
    short: 'Hands-on lab: detect and respond to threats.',
    long: 'Learn SIEM basics and endpoint forensics in a guided, practical session. Bring your laptop.',
    timeline: ['05:00 PM — Setup & tooling', '05:30 PM — Lab 1: Logs', '06:10 PM — Lab 2: Alerts', '06:50 PM — Debrief & resources'],
    reg: '#',
    image: ''
  },
  {
    id: 'startupshow',
    title: 'Startup Showcase: Demo Day',
    type: 'Showcase',
    date: '2025-12-02',
    short: 'Student founders pitch to mentors & investors.',
    long: 'Top campus startups present. Network with founders, mentors, and recruiters.',
    timeline: ['03:00 PM — Arrival', '03:30 PM — Founder pitches', '05:00 PM — Networking', '06:00 PM — Closing'],
    reg: '#',
    image: ''
  },
  
  {
    id: 'dsboot',
    title: 'Data Science Bootcamp',
    type: 'Workshop',
    date: '2026-01-15',
    short: 'Weekend bootcamp: Python, Pandas, and ML intro.',
    long: 'From data wrangling to first ML model — beginner friendly with coaches to help you progress.',
    timeline: ['10:00 AM — Setup & intro', '11:00 AM — Pandas basics', '02:00 PM — ML 101', '04:00 PM — Mini project'],
    reg: '#',
    image: ''
  }
];

// ====== Create Event Cards ======
function createEventCard(evt){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <div class="pill">${evt.type}</div>
    <h3>${evt.title}</h3>
    <div class="date">📅 ${new Date(evt.date).toDateString()}</div>
    <p class="muted">${evt.short}</p>
    <div class="actions">
      <button class="btn primary" data-id="${evt.id}" data-view>View Details</button>
      <a class="btn ghost" href="${evt.reg}" target="_blank" rel="noopener">Register</a>
    </div>
  `;
  el.querySelector('[data-view]').addEventListener('click', () => openModal(evt.id));
  return el;
}

function renderEvents(containerId, opts={}){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  let data = [...EVENT_DATA].sort((a,b)=> new Date(a.date)-new Date(b.date));
  if(opts.limit) data = data.slice(0, opts.limit);
  if(opts.search){
    const q = opts.search.toLowerCase();
    data = data.filter(e => [e.title, e.short, e.long, e.type].join(' ').toLowerCase().includes(q));
  }
  if(opts.type){
    data = data.filter(e => e.type === opts.type);
  }
  if(data.length===0){
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No events found. Try clearing filters.';
    container.appendChild(empty);
    return;
  }
  data.forEach(e => container.appendChild(createEventCard(e)));
}

// ====== Showing Event Details ======
function openModal(id){
  const evt = EVENT_DATA.find(e=>e.id===id);
  if(!evt) return;
  const modal = document.getElementById('modal');
  const body = document.getElementById('modal-body');
  body.innerHTML = `
    <h2>${evt.title}</h2>
    <div class="pill">${evt.type}</div>
    <p class="date">📅 ${new Date(evt.date).toDateString()}</p>
    <p class="muted">${evt.long}</p>
    <h3>Timeline</h3>
    <ul class="timeline">${evt.timeline.map(t=>`<li>${t}</li>`).join('')}</ul>
    <div style="margin-top:.8rem;">
      <a class="btn primary" href="${evt.reg}" target="_blank" rel="noopener">Register</a>
      <button class="btn ghost" data-close>Close</button>
    </div>
  `;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', escClose);
}

// Close using esc
function escClose(e){ if(e.key==='Escape') closeModal(); }
function closeModal(){
  const modal = document.getElementById('modal');
  if(!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.removeEventListener('keydown', escClose);
}
document.addEventListener('click', (e)=>{
  if(e.target && e.target.matches('.modal-backdrop')) closeModal();
});

// ====== Page initializing part ======
document.addEventListener('DOMContentLoaded', () => {
  // Home events (3 highlights)
  if(document.getElementById('home-events')){
    renderEvents('home-events', {limit: 3});
  }

  // Events page: grid + filters
  if(document.getElementById('events-grid')){
    const search = document.getElementById('searchInput');
    const filter = document.getElementById('typeFilter');
    const rerender = () => renderEvents('events-grid', {
      search: search.value.trim(),
      type: filter.value
    });
    search.addEventListener('input', rerender);
    filter.addEventListener('change', rerender);
    rerender();
  }

  // Contact form validation
  const form = document.getElementById('contactForm');
  if(form){
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      ['name','email','message'].forEach(id => {
        const input = document.getElementById(id);
        const err = document.querySelector(`.error[data-for="${id}"]`);
        if(!input.value.trim()){
          err.textContent = 'This field is required.';
          ok = false;
        } else if(id==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)){
          err.textContent = 'Please enter a valid email.';
          ok = false;
        } else {
          err.textContent = '';
        }
      });
      if(ok){
        status.textContent = 'Thanks! Your message was captured (demo only). Replace with backend integration.';
        form.reset();
      } else {
        status.textContent = 'Please fix the highlighted fields.';
      }
    });
  }

  // Auth demo (localStorage)
  const reg = document.getElementById('registerForm');
  const login = document.getElementById('loginForm');
  if(reg){
    reg.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const pwd = document.getElementById('regPassword').value;
      const status = document.getElementById('registerStatus');
      if(!name || !email || pwd.length<6){
        status.textContent = 'Please fill all fields (password ≥ 6 chars).';
        return;
      }
      const users = JSON.parse(localStorage.getItem('origin-users')||'{}');
      if(users[email]){
        status.textContent = 'An account with this email already exists.';
        return;
      }
      users[email] = {name, email, pwdHash: btoa(pwd)}; // simple demo, not secure
      localStorage.setItem('origin-users', JSON.stringify(users));
      status.textContent = 'Account created! You can now log in.';
      reg.reset();
    });
  }
  if(login){
    login.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const pwd = document.getElementById('loginPassword').value;
      const status = document.getElementById('loginStatus');
      const users = JSON.parse(localStorage.getItem('origin-users')||'{}');
      if(!users[email]){ status.textContent = 'No account found for this email.'; return; }
      if(users[email].pwdHash !== btoa(pwd)){ status.textContent = 'Incorrect password.'; return; }
      localStorage.setItem('origin-session', JSON.stringify({email, ts: Date.now()}));
      status.textContent = 'Logged in! (demo only)';
    });
  }
});


function handleBugBountyFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  // Data gathering (adapt if you have a backend/API)
  const data = {
    name: form.reporterName.value.trim(),
    email: form.reporterEmail.value.trim(),
    title: form.bugTitle.value.trim(),
    description: form.bugDescription.value.trim(),
    steps: form.steps.value.trim(),
    impact: form.impact.value.trim(),
  };
  // Simple form validation feedback (example)
  if (!data.email.includes("@") || !data.description) {
    alert("Please complete all required fields correctly.");
    return;
  }
  alert("Thank you for your submission. Our security team will review your report shortly.");
  form.reset();
}
document.getElementById('bugBountyForm').addEventListener('submit', handleBugBountyFormSubmit);
