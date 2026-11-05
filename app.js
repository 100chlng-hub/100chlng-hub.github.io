// 100Challenges Hub App
const TOTAL_CHALLENGES = 100;
const END_OF_YEAR = new Date('2026-12-31T23:59:59').getTime();

// Inlined fallback dataset in case file:// protocol restricts fetch
const DEFAULT_CHALLENGES = [
  {
    id: 1,
    slug: "001-streampulse",
    title: "StreamPulse",
    tagline: "100% Local-First Android Watch History Tracker",
    status: "completed",
    completedDate: "2026-11-04",
    category: "mobile",
    tags: ["React Native", "Expo CNG", "SQLite", "Drizzle ORM", "Keystore", "TypeScript", "Local-First"],
    description: "Unified streaming watch history tracker across Netflix, Amazon Prime Video, and Disney+. Operates 100% on-device with zero proprietary backend or cloud analytics, encrypting session cookies exclusively in Android Keystore.",
    highlights: [
      "100% Local-First: Zero cloud servers, encrypted keystore session isolation",
      "Hybrid scraping engine with multi-profile and anti-bump accumulation",
      "Sub-10ms composite indexed SQLite offline search and filtering",
      "Binge and rewatch grouping with Italian TMDb metadata enrichment"
    ],
    repoUrl: "https://github.com/100chlng-hub/001-streampulse",
    demoUrl: "https://github.com/100chlng-hub/001-streampulse/releases",
    docsUrl: "https://github.com/100chlng-hub/001-streampulse/blob/main/docs/architecture.md"
  }
];

let challenges = DEFAULT_CHALLENGES;
let activeCategory = 'all';
let searchQuery = '';

async function loadChallenges() {
  try {
    const res = await fetch('./challenges.json');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        challenges = data;
      }
    }
  } catch (_e) {
    // Keep DEFAULT_CHALLENGES fallback
  }
  updateStats();
  renderGrid();
}

function updateStats() {
  const completedCount = challenges.filter(c => c.status === 'completed').length;
  const remainingCount = TOTAL_CHALLENGES - completedCount;
  const pct = Math.round((completedCount / TOTAL_CHALLENGES) * 100);

  const completedEl = document.getElementById('stat-completed');
  const remainingEl = document.getElementById('stat-remaining');
  const pctEl = document.getElementById('progress-pct');
  const fillEl = document.getElementById('progress-bar-fill');

  if (completedEl) completedEl.textContent = String(completedCount);
  if (remainingEl) remainingEl.textContent = String(remainingCount);
  if (pctEl) pctEl.textContent = `${pct}% Complete (${completedCount}/${TOTAL_CHALLENGES})`;
  if (fillEl) fillEl.style.width = `${Math.max(pct, 1)}%`;
}

function updateCountdown() {
  const countdownEl = document.getElementById('stat-countdown');
  if (!countdownEl) return;

  const now = Date.now();
  const diff = END_OF_YEAR - now;
  if (diff <= 0) {
    countdownEl.textContent = 'Year Completed';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  countdownEl.textContent = `${days}d ${hours}h ${minutes}m`;
}

function renderGrid() {
  const gridEl = document.getElementById('challenges-grid');
  if (!gridEl) return;

  const filtered = challenges.filter(c => {
    // Category filter
    if (activeCategory !== 'all') {
      const cat = (c.category || '').toLowerCase();
      const tags = (c.tags || []).map(t => t.toLowerCase());
      const matchesCategory = cat.includes(activeCategory) || tags.includes(activeCategory);
      if (!matchesCategory) return false;
    }
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const inTitle = c.title.toLowerCase().includes(q);
      const inDesc = (c.description || '').toLowerCase().includes(q);
      const inTags = (c.tags || []).some(t => t.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inTags) return false;
    }
    return true;
  });

  const cardsHtml = [];

  // 1. Render actual registered challenge cards
  for (const item of filtered) {
    const padId = String(item.id).padStart(3, '0');
    const isCompleted = item.status === 'completed';

    const tagsHtml = (item.tags || []).slice(0, 4).map(t => `
      <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
        ${escapeHtml(t)}
      </span>
    `).join('');

    cardsHtml.push(`
      <div class="glass-card rounded-2xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-indigo-500/5 group border border-zinc-800 relative">
        <div class="absolute top-5 right-5">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold ${isCompleted ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'}">
            <span class="w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}"></span>
            ${isCompleted ? 'Completed' : 'In Progress'}
          </span>
        </div>

        <div>
          <div class="text-xs font-mono font-bold text-indigo-400 mb-2">
            CHALLENGE #${padId}
          </div>
          <h3 class="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
            ${escapeHtml(item.title)}
          </h3>
          <p class="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-3">
            ${escapeHtml(item.description)}
          </p>

          <div class="flex flex-wrap gap-1.5 mb-6">
            ${tagsHtml}
          </div>
        </div>

        <div class="border-t border-zinc-800/80 pt-4 flex items-center justify-between">
          <button onclick="openModal(${item.id})" class="inline-flex items-center gap-1 text-xs font-semibold text-zinc-300 hover:text-white transition-colors">
            <span>Details & Highlights</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>

          <div class="flex items-center space-x-2">
            ${item.repoUrl ? `
              <a href="${item.repoUrl}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors" title="View Source on GitHub">
                <i data-lucide="github" class="w-4 h-4"></i>
              </a>
            ` : ''}
            ${item.docsUrl ? `
              <a href="${item.docsUrl}" target="_blank" rel="noopener noreferrer" class="p-2 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors" title="Architecture Docs (ADR)">
                <i data-lucide="file-text" class="w-4 h-4"></i>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `);
  }

  // 2. Render future / placeholder challenge slots (if no search active)
  if (!searchQuery && activeCategory === 'all') {
    const nextSlot = challenges.length + 1;
    // Show a sample of upcoming milestone slots
    const milestones = [nextSlot, 10, 25, 50, 75, 100].filter((val, idx, arr) => val <= 100 && arr.indexOf(val) === idx);

    for (const slotId of milestones) {
      if (slotId <= challenges.length) continue;
      const padSlot = String(slotId).padStart(3, '0');
      const isNext = slotId === nextSlot;

      cardsHtml.push(`
        <div class="glass-card rounded-2xl p-6 flex flex-col justify-between border border-dashed border-zinc-800/80 bg-zinc-950/40 opacity-75 hover:opacity-100 transition-opacity">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-mono font-bold text-zinc-500">
                CHALLENGE #${padSlot}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-mono ${isNext ? 'bg-amber-950/60 text-amber-400 border border-amber-600/30' : 'bg-zinc-900 text-zinc-600'}">
                ${isNext ? 'Next Up' : 'Milestone'}
              </span>
            </div>

            <h3 class="text-lg font-bold text-zinc-400 mb-2">
              ${isNext ? 'Upcoming Challenge' : `Milestone #${padSlot}`}
            </h3>
            <p class="text-xs text-zinc-600 leading-relaxed mb-4">
              ${isNext ? 'Next autonomous project being designed and developed for the 100Challenges Initiative.' : 'Target checkpoint on the road to shipping 100 open source software repositories.'}
            </p>
          </div>

          <div class="pt-4 border-t border-zinc-900 text-xs text-zinc-600 font-mono flex items-center gap-1.5">
            <i data-lucide="lock" class="w-3.5 h-3.5"></i>
            <span>Stay tuned</span>
          </div>
        </div>
      `);
    }
  }

  gridEl.innerHTML = cardsHtml.join('');
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function openModal(challengeId) {
  const item = challenges.find(c => c.id === challengeId);
  if (!item) return;

  const modalEl = document.getElementById('project-modal');
  const contentEl = document.getElementById('modal-content');
  if (!modalEl || !contentEl) return;

  const padId = String(item.id).padStart(3, '0');
  const highlightsHtml = (item.highlights || []).map(h => `
    <li class="flex items-start gap-2 text-xs text-zinc-300">
      <i data-lucide="check" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
      <span>${escapeHtml(h)}</span>
    </li>
  `).join('');

  const tagsHtml = (item.tags || []).map(t => `
    <span class="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-zinc-800 text-zinc-200 border border-zinc-700/80">
      ${escapeHtml(t)}
    </span>
  `).join('');

  contentEl.innerHTML = `
    <div class="text-xs font-mono font-bold text-indigo-400 mb-2">
      CHALLENGE #${padId} • COMPLETED ${item.completedDate ? `ON ${item.completedDate}` : ''}
    </div>
    <h2 class="text-2xl font-extrabold text-white mb-1">
      ${escapeHtml(item.title)}
    </h2>
    <p class="text-sm font-medium text-indigo-300 mb-4">
      ${escapeHtml(item.tagline || '')}
    </p>

    <p class="text-sm text-zinc-300 leading-relaxed mb-6">
      ${escapeHtml(item.description)}
    </p>

    <div class="mb-6">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Key Technical Highlights</h4>
      <ul class="space-y-2">
        ${highlightsHtml}
      </ul>
    </div>

    <div class="mb-8">
      <h4 class="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">Stack & Components</h4>
      <div class="flex flex-wrap gap-2">
        ${tagsHtml}
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-zinc-800">
      ${item.repoUrl ? `
        <a href="${item.repoUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/20">
          <i data-lucide="github" class="w-4 h-4"></i>
          <span>View Source on GitHub</span>
        </a>
      ` : ''}
      ${item.docsUrl ? `
        <a href="${item.docsUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors">
          <i data-lucide="book-open" class="w-4 h-4"></i>
          <span>Architecture Decision Records (ADRs)</span>
        </a>
      ` : ''}
    </div>
  `;

  modalEl.classList.remove('hidden');
  modalEl.classList.add('flex');
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function closeModal() {
  const modalEl = document.getElementById('project-modal');
  if (modalEl) {
    modalEl.classList.add('hidden');
    modalEl.classList.remove('flex');
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Event Listeners setup
document.addEventListener('DOMContentLoaded', () => {
  loadChallenges();
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderGrid();
    });
  }

  // Category filter buttons
  const catButtons = document.querySelectorAll('.category-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'active');
        b.classList.add('bg-zinc-900', 'text-zinc-400');
      });
      btn.classList.add('bg-indigo-600', 'text-white', 'active');
      btn.classList.remove('bg-zinc-900', 'text-zinc-400');
      activeCategory = btn.dataset.cat || 'all';
      renderGrid();
    });
  });

  // Modal close handlers
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  const modalEl = document.getElementById('project-modal');
  if (modalEl) {
    modalEl.addEventListener('click', (e) => {
      if (e.target === modalEl) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
});
