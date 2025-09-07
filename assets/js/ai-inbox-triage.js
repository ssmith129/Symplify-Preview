
// ai-inbox-triage.js — Symplify
// Shared AI helpers for inbox triage, notifications, email, appointments

(function(global){
  const AI = {};

  // Apply priority badge styles
  AI.setPriority = function(el, priority){
    if(!el) return;
    const val = String(priority || 'Low').toLowerCase();
    el.textContent = priority;
    el.className = 'badge rounded-pill ai-priority-badge ai-priority-' + val;
  };

  // Update AI status strip
  AI.updateStatus = function(stripEl, {priority, category, confidence, eta}){
    if(!stripEl) return;
    AI.setPriority(stripEl.querySelector('.ai-priority-badge'), priority);
    const catEl = stripEl.querySelector('.ai-category-badge');
    if(catEl) catEl.textContent = category || 'General';
    const confText = stripEl.querySelector('.ai-confidence-text');
    const confBar = stripEl.querySelector('.progress-bar');
    const etaEl = stripEl.querySelector('.ai-eta');
    if(confText) confText.textContent = `Confidence: ${confidence || 0}%`;
    if(confBar) {
      confBar.style.width = confidence + '%';
      confBar.setAttribute('aria-valuenow', confidence);
    }
    if(etaEl) etaEl.textContent = `ETA: ~${eta || '--'}`;
  };

  // Render AI suggestions
  AI.renderSuggestions = function(listEl, suggestions){
    if(!listEl) return;
    listEl.innerHTML = '';
    (suggestions || []).forEach(s => {
      const li = document.createElement('li');
      li.className = 'mb-2 d-flex align-items-start gap-2';
      li.innerHTML = `<i class="ti ti-bulb" aria-hidden="true"></i><span>${s.text}</span>`;
      listEl.appendChild(li);
    });
  };

  // Filter items by attribute
  AI.applyFilter = function(buttons, items, key, renderFn){
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const [, value] = btn.getAttribute('data-ai-filter').split(':');
        const filtered = items.filter(i => String(i[key]).toLowerCase() === value.toLowerCase());
        renderFn(filtered.length ? filtered : items);
      });
    });
  };

  // Hook quick actions
  AI.bindActions = function(buttons, handler){
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-ai-action');
        if(typeof handler === 'function') handler(action);
      });
    });
  };

  global.AI = AI;
})(window);
