(function(){
  'use strict';

  function el(tag, attrs, children){
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function(k){
      var v = attrs[k];
      if (k === 'class') node.className = v;
      else if (k === 'dataset') Object.keys(v).forEach(function(dk){ node.dataset[dk] = v[dk]; });
      else if (k === 'text') node.textContent = v;
      else if (k === 'html') node.innerHTML = v;
      else node.setAttribute(k, v);
    });
    (children||[]).forEach(function(c){ node.appendChild(c); });
    return node;
  }

  function fmt(dt){
    var opts = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Intl.DateTimeFormat(undefined, opts).format(dt);
  }

  function addMinutes(date, mins){ return new Date(date.getTime() + mins*60000); }

  function nextWeekday(date, weekday){
    var d = new Date(date);
    var diff = (weekday + 7 - d.getDay()) % 7; // 0..6
    if (diff === 0) diff = 7; // next week
    d.setDate(d.getDate() + diff);
    return d;
  }

  function startOfDay(d){ var x = new Date(d); x.setHours(0,0,0,0); return x; }

  function makeSuggestions(now){
    var base = new Date(now);
    var suggestions = [];
    // Tomorrow 09:00-09:30
    var t1 = startOfDay(addMinutes(base, 24*60)); t1.setHours(9,0,0,0);
    suggestions.push({ id: 's1', start: t1, end: addMinutes(t1, 30), score: 92, reason: 'Low overlap, high availability', tags: ['follow-up','in-person'] });
    // Friday 14:00-14:30
    var fri = nextWeekday(base, 5); fri.setHours(14,0,0,0);
    suggestions.push({ id: 's2', start: fri, end: addMinutes(fri, 30), score: 88, reason: 'Optimized for follow-ups', tags: ['telehealth'] });
    // Monday 11:30-12:00
    var mon = nextWeekday(base, 1); mon.setHours(11,30,0,0);
    suggestions.push({ id: 's3', start: mon, end: addMinutes(mon, 30), score: 84, reason: 'Doctor availability matched', tags: ['new-patient'] });
    return suggestions;
  }

  function renderSuggestions(listEl, suggestions){
    listEl.innerHTML = '';
    suggestions.forEach(function(s, idx){
      var item = el('div', { class: 'suggestion-item p-2 rounded border d-flex align-items-start mb-2', role: 'button', tabindex: '0', 'aria-pressed': 'false' , dataset: { key: s.id } }, [
        el('div', { class: 'time-info me-2' }, [
          el('h6', { class: 'mb-0 fw-bold text-primary', text: fmt(s.start) + ' - ' + s.end.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }),
          el('small', { class: 'd-block', text: s.reason })
        ]),
        el('div', { class: 'ms-auto score-info text-end' }, [
          el('span', { class: 'badge bg-info-transparent text-info' , text: 'Score ' + s.score + '%' })
        ])
      ]);
      item.addEventListener('click', function(){ selectSuggestion(item, listEl); });
      item.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSuggestion(item, listEl);} });
      listEl.appendChild(item);
      if (idx === 0) item.classList.add('bg-primary-transparent');
    });
  }

  function selectSuggestion(item, listEl){
    listEl.querySelectorAll('.suggestion-item').forEach(function(n){
      n.classList.remove('bg-primary-transparent');
      n.setAttribute('aria-pressed','false');
    });
    item.classList.add('bg-primary-transparent');
    item.setAttribute('aria-pressed','true');
  }

  function getSelectedSuggestion(listEl, model){
    var sel = listEl.querySelector('.suggestion-item.bg-primary-transparent');
    if (!sel) return null;
    var key = sel.dataset.key;
    return model.find(function(s){ return s.id === key; }) || null;
  }

  function announce(msg){
    var live = document.getElementById('cal-live');
    if (live){ live.textContent = ''; setTimeout(function(){ live.textContent = msg; }, 10); }
  }

  function ensureAICSS(){
    if (!document.querySelector('link[href="assets/css/ai-features.css"]')){
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'assets/css/ai-features.css'; document.head.appendChild(l);
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    var cal = document.getElementById('calendar');
    if (!cal) return;

    ensureAICSS();

    // Insert live region if missing
    if (!document.getElementById('cal-live')){
      cal.insertAdjacentElement('afterend', el('div', { id: 'cal-live', class: 'visually-hidden', 'aria-live': 'polite', 'aria-atomic': 'true' }));
    }

    // Insert suggestions panel
    var container = el('section', { class: 'smart-suggestions-panel cal-suggestions mt-3', 'aria-labelledby': 'cal-suggest-title' }, [
      el('div', { class: 'card' }, [
        el('div', { class: 'card-header d-flex align-items-center justify-content-between' }, [
          el('h6', { id: 'cal-suggest-title', class: 'mb-0', text: 'Smart Suggestions' }),
          (function(){
            var wrap = el('div', { class: 'form-check form-switch smart-mode-toggle m-0', dataset: { calSmartToggle: '' } }, []);
            var inp = el('input', { class: 'form-check-input', type: 'checkbox', id: 'calSmartMode', 'aria-label': 'Enable smart scheduling' });
            var lab = el('label', { class: 'form-check-label ms-1', for: 'calSmartMode', text: 'Smart mode' });
            wrap.appendChild(inp); wrap.appendChild(lab); return wrap;
          })()
        ]),
        el('div', { class: 'card-body' }, [
          el('div', { class: 'conflict-warnings cal-conflicts d-none', role: 'region', 'aria-label': 'Conflict warnings' }),
          el('div', { class: 'cal-suggestions-list', role: 'list', dataset: { calSuggestions: '' } })
        ]),
        el('div', { class: 'card-footer suggestions-footer d-flex align-items-center justify-content-between' }, [
          el('small', { text: 'Suggestions auto-update' }),
          (function(){
            var btns = el('div', { class: 'd-flex gap-1' }, []);
            btns.appendChild(el('button', { class: 'btn btn-light btn-sm', type: 'button', dataset: { calRefresh: '' }, text: 'Refresh' }));
            btns.appendChild(el('button', { class: 'btn btn-primary btn-sm', type: 'button', dataset: { calCreate: '' }, text: 'Book selected' }));
            return btns;
          })()
        ])
      ])
    ]);
    cal.parentNode.insertBefore(container, cal.nextSibling);

    var listEl = container.querySelector('[data-cal-suggestions]');
    var model = makeSuggestions(new Date());
    renderSuggestions(listEl, model);

    // Toggle smart mode
    var toggle = container.querySelector('#calSmartMode');
    toggle.addEventListener('change', function(){
      if (toggle.checked){
        container.querySelector('.card-body').classList.remove('d-none');
        model = makeSuggestions(new Date());
        renderSuggestions(listEl, model);
        announce('Smart suggestions enabled');
      } else {
        container.querySelector('.card-body').classList.add('d-none');
        announce('Smart suggestions disabled');
      }
    });

    // Refresh suggestions
    container.querySelector('[data-cal-refresh]').addEventListener('click', function(){
      model = makeSuggestions(new Date());
      renderSuggestions(listEl, model);
      announce('Suggestions refreshed');
    });

    // Book selected: navigate to new-appointment with prefilled params
    container.querySelector('[data-cal-create]').addEventListener('click', function(){
      var sel = getSelectedSuggestion(listEl, model);
      if (!sel){ announce('Select a suggestion first'); return; }
      var params = new URLSearchParams({ start: sel.start.toISOString(), end: sel.end.toISOString(), source: 'smart' });
      window.location.href = 'new-appointment.html?' + params.toString();
    });
  });
})();
