/* AI Email Insights & Filters: adds AI toolbar and classifies email list items */
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

  function priorityColor(priority){
    switch(priority){
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'secondary';
    }
  }

  function enhanceEmailList(){
    const header = document.querySelector('.mail-notifications .p-3.border-bottom');
    if (header && !document.querySelector('.ai-email-toolbar')){
      const bar = document.createElement('div');
      bar.className = 'ai-email-toolbar p-2 border-bottom bg-light';
      bar.innerHTML = '\
        <div class="d-flex align-items-center justify-content-between">\
          <div class="d-flex align-items-center gap-2">\
            <span class="badge bg-info-transparent text-info d-inline-flex align-items-center"><i class="ti ti-brain me-1"></i>AI Triage</span>\
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
          </div>\
        </div>';
      header.after(bar);

      bar.addEventListener('click', function(e){
        const btn = e.target.closest('[data-ai-filter]');
        if (!btn) return;
        const filter = btn.getAttribute('data-ai-filter');
        filterEmails(filter);
      });
    }

    const items = document.querySelectorAll('.mails-list .list-group-item');
    let counts = { critical:0, high:0, medium:0, low:0 };
    items.forEach(item => {
      if (item.dataset.aiEmailEnhanced === '1') return;
      const subjectEl = item.querySelector('.fw-semibold');
      const previewEl = item.querySelector('p');
      const subject = subjectEl ? subjectEl.textContent || '' : '';
      const preview = previewEl ? previewEl.textContent || '' : '';
      const info = classifyEmail(subject, preview);

      item.dataset.aiPriority = info.priority;
      item.dataset.aiCategory = info.category;

      const right = item.querySelector('.d-flex.align-items-center > span.d-inline-flex, .d-flex.align-items-center > .dropdown');
      const badgeWrap = document.createElement('div');
      badgeWrap.className = 'd-flex align-items-center gap-1 ms-2';
      badgeWrap.innerHTML = '\
        <span class="badge bg-'+priorityColor(info.priority)+'-transparent text-'+priorityColor(info.priority)+' fs-10 text-capitalize">'+info.priority+'</span>\
        <span class="badge bg-light text-muted fs-10">AI '+Math.round(info.confidence*100)+'%</span>' +
        (info.actionRequired ? ' <span class="badge bg-warning-transparent text-warning fs-10"><i class="ti ti-clock me-1"></i>Action</span>' : '');
      if (right && right.parentElement){ right.parentElement.appendChild(badgeWrap); }

      item.dataset.aiEmailEnhanced = '1';
      counts[info.priority] = (counts[info.priority]||0)+1;
    });

    document.querySelectorAll('.ai-email-toolbar [data-ai-cnt]').forEach(el => {
      const key = el.getAttribute('data-ai-cnt');
      el.textContent = (key in counts ? counts[key] : 0);
    });
  }

  function filterEmails(level){
    const items = document.querySelectorAll('.mails-list .list-group-item');
    items.forEach(it => {
      if (level === 'all') { it.style.display = ''; return; }
      it.style.display = (it.dataset.aiPriority === level) ? '' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', enhanceEmailList);
})();
