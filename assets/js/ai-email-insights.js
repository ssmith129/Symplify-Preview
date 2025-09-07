(function(){
  function classifyEmail(subject, preview){
    const t = (subject+' '+preview).toLowerCase();
    let category = 'administrative';
    let priority = 'low';
    let actionRequired = false;
    let confidence = 0.83;

    if (t.includes('urgent') || t.includes('asap') || t.includes('emergency')) { category='medical'; priority='critical'; actionRequired=true; confidence=0.95; }
    else if (t.includes('follow-up') || t.includes('follow up') || t.includes('lab')) { category='medical'; priority='high'; actionRequired=true; confidence=0.9; }
    else if (t.includes('appointment') || t.includes('schedule') || t.includes('reschedul')) { category='appointment'; priority='medium'; actionRequired=true; confidence=0.88; }
    else if (t.includes('invoice') || t.includes('policy') || t.includes('update')) { category='administrative'; priority='low'; actionRequired=false; confidence=0.84; }

    return { category, priority, actionRequired, confidence };
  }

  function priorityToClass(priority){
    switch(priority){
      case 'critical': return { cls:'ai-flag ai-flag-critical', icon:'ti ti-alert-triangle-filled', label:'Critical' };
      case 'high': return { cls:'ai-flag ai-flag-warning', icon:'ti ti-exclamation-circle', label:'High' };
      case 'medium': return { cls:'ai-flag', icon:'ti ti-info-circle', label:'Medium' };
      case 'low': return { cls:'ai-flag ai-flag-recommended', icon:'ti ti-check', label:'Low' };
      default: return { cls:'ai-flag', icon:'ti ti-info-circle', label:priority };
    }
  }

  function ensureToolbar(){
    const header = document.querySelector('.mail-notifications .p-3.border-bottom');
    if (!header) return null;
    if (document.querySelector('.ai-email-toolbar')) return document.querySelector('.ai-email-toolbar');

    const bar = document.createElement('div');
    bar.className = 'ai-email-toolbar p-2 border-bottom bg-light';
    bar.innerHTML = '\
      <div class="d-flex align-items-center justify-content-between">\
        <div class="d-flex align-items-center gap-2">\
          <span class="smart-sorting-badge"><i class="ti ti-brain"></i> Smart Sorting</span>\
          <div class="btn-group btn-group-sm" role="group" aria-label="AI Filters">\
            <button type="button" class="btn btn-outline-dark" data-ai-filter="all">All</button>\
            <button type="button" class="btn btn-outline-danger" data-ai-filter="critical">Critical</button>\
            <button type="button" class="btn btn-outline-warning" data-ai-filter="high">High</button>\
            <button type="button" class="btn btn-outline-info" data-ai-filter="medium">Medium</button>\
            <button type="button" class="btn btn-outline-success" data-ai-filter="low">Low</button>\
          </div>\
        </div>\
        <div class="d-flex align-items-center gap-2">\
          <span class="badge bg-danger-transparent text-danger" data-ai-cnt="critical">0</span>\
          <span class="badge bg-warning-transparent text-warning" data-ai-cnt="high">0</span>\
          <span class="badge bg-info-transparent text-info" data-ai-cnt="medium">0</span>\
          <span class="badge bg-success-transparent text-success" data-ai-cnt="low">0</span>\
          <span class="ai-confidence ms-1" data-ai-avg aria-label="AI accuracy">AI --%</span>\
        </div>\
      </div>';
    header.after(bar);

    bar.addEventListener('click', function(e){
      const btn = e.target.closest('[data-ai-filter]');
      if (!btn) return;
      const filter = btn.getAttribute('data-ai-filter');
      filterEmails(filter);
    });
    return bar;
  }

  function enhanceEmailList(){
    const toolbar = ensureToolbar();
    const items = document.querySelectorAll('.mails-list .list-group-item');
    let counts = { critical:0, high:0, medium:0, low:0 };
    let total = 0, sumConf = 0;

    items.forEach(item => {
      if (item.dataset.aiEmailEnhanced === '1') return;
      const subjectEl = item.querySelector('.fw-semibold');
      const previewEl = item.querySelector('p');
      const subject = subjectEl ? subjectEl.textContent || '' : '';
      const preview = previewEl ? previewEl.textContent || '' : '';
      const info = classifyEmail(subject, preview);

      item.dataset.aiPriority = info.priority;
      item.dataset.aiCategory = info.category;

      const metaRight = item.querySelector('.d-flex.align-items-center > span.d-inline-flex, .d-flex.align-items-center > .dropdown');
      const wrap = document.createElement('div');
      wrap.className = 'd-flex align-items-center gap-1 ms-2';

      const flag = priorityToClass(info.priority);
      const flagEl = document.createElement('span');
      flagEl.className = flag.cls;
      flagEl.setAttribute('aria-label', 'AI priority');
      flagEl.innerHTML = '<i class="'+flag.icon+'"></i> '+flag.label;

      const confEl = document.createElement('span');
      confEl.className = 'fs-10 ai-confidence';
      confEl.textContent = Math.round(info.confidence*100) + '%';

      wrap.appendChild(flagEl);
      wrap.appendChild(confEl);
      if (info.actionRequired){
        const act = document.createElement('span');
        act.className = 'badge bg-warning-transparent text-warning fs-10';
        act.innerHTML = '<i class="ti ti-clock me-1"></i>Action';
        wrap.appendChild(act);
      }
      if (metaRight && metaRight.parentElement){ metaRight.parentElement.appendChild(wrap); }

      item.dataset.aiEmailEnhanced = '1';
      counts[info.priority] = (counts[info.priority]||0)+1;
      sumConf += info.confidence;
      total += 1;
    });

    // Update counters and average confidence
    document.querySelectorAll('.ai-email-toolbar [data-ai-cnt]').forEach(el => {
      const key = el.getAttribute('data-ai-cnt');
      el.textContent = (key in counts ? counts[key] : 0);
    });
    const avgEl = document.querySelector('.ai-email-toolbar [data-ai-avg]');
    if (avgEl && total){
      const pct = Math.round((sumConf/total)*100);
      avgEl.textContent = 'AI ' + pct + '%';
      avgEl.setAttribute('aria-label', 'AI accuracy '+pct+' percent');
    }
  }

  function filterEmails(level){
    const items = document.querySelectorAll('.mails-list .list-group-item');
    items.forEach(it => {
      if (level === 'all') { it.style.display = ''; return; }
      it.style.display = (it.dataset.aiPriority === level) ? '' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    ensureToolbar();
    enhanceEmailList();
  });
})();
