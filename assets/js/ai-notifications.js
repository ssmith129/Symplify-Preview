/* AI Notifications Intelligence: enhances notification dropdown with AI classification and summary */
(function(){
  function classifyNotification(text){
    const t = text.toLowerCase();
    let category = 'general';
    let priority = 'low';
    let actionRequired = false;
    let confidence = 0.82;

    if (t.includes('emergency') || t.includes('critical')) { category = 'emergency'; priority = 'critical'; actionRequired = true; confidence = 0.94; }
    else if (t.includes('surgery') || t.includes('lab') || t.includes('result')) { category = 'medical'; priority = 'high'; actionRequired = true; confidence = 0.9; }
    else if (t.includes('appointment') || t.includes('booked') || t.includes('reschedul')) { category = 'appointment'; priority = 'medium'; actionRequired = true; confidence = 0.88; }
    else if (t.includes('questionnaire') || t.includes('pre-visit') || t.includes('policy') || t.includes('update')) { category = 'administrative'; priority = 'low'; actionRequired = false; confidence = 0.84; }

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

  function ensureSummary(body){
    if (body.querySelector('.ai-notification-summary')) return;
    const summary = document.createElement('div');
    summary.className = 'ai-notification-summary p-2 bg-light border-bottom';
    summary.innerHTML = '<div class="d-flex align-items-center justify-content-between">\
      <div class="d-flex align-items-center gap-2">\
        <span class="badge bg-info-transparent text-info d-inline-flex align-items-center"><i class="ti ti-brain me-1"></i>AI Insights</span>\
      </div>\
      <div class="d-flex align-items-center gap-2">\
        <span class="badge bg-danger-transparent text-danger" data-ai-critical="0">Critical: 0</span>\
        <span class="badge bg-warning-transparent text-warning" data-ai-high="0">High: 0</span>\
        <span class="badge bg-info-transparent text-info" data-ai-medium="0">Medium: 0</span>\
        <span class="badge bg-success-transparent text-success" data-ai-low="0">Low: 0</span>\
      </div></div>';
    body.prepend(summary);
  }

  function enhanceNotifications(){
    const bodies = document.querySelectorAll('.notification-body');
    bodies.forEach(body => {
      ensureSummary(body);
      let counts = { critical:0, high:0, medium:0, low:0 };
      body.querySelectorAll('.notification-item').forEach(item => {
        if (item.dataset.aiEnhanced === '1') return;
        const text = item.textContent || '';
        const info = classifyNotification(text);
        counts[info.priority] = (counts[info.priority]||0) + 1;

        const container = item.querySelector('.flex-grow-1');
        if (container){
          const badges = document.createElement('div');
          badges.className = 'mt-1 d-flex align-items-center gap-1 flex-wrap';
          badges.innerHTML = '\
            <span class="badge bg-'+priorityColor(info.priority)+'-transparent text-'+priorityColor(info.priority)+' fs-10 text-capitalize">'+info.priority+'</span>\
            <span class="badge bg-light text-muted fs-10">AI: '+Math.round(info.confidence*100)+'%</span>' +
            (info.actionRequired ? ' <span class="badge bg-warning-transparent text-warning fs-10"><i class="ti ti-clock me-1"></i>Action</span>' : '');
          container.appendChild(badges);
        }
        item.dataset.aiEnhanced = '1';
      });

      const summary = body.querySelector('.ai-notification-summary');
      if (summary){
        const set = (sel, v, label) => { const el = summary.querySelector(sel); if (el){ el.setAttribute('data-count', String(v)); el.textContent = label+': '+v; } };
        set('[data-ai-critical]', counts.critical, 'Critical');
        set('[data-ai-high]', counts.high, 'High');
        set('[data-ai-medium]', counts.medium, 'Medium');
        set('[data-ai-low]', counts.low, 'Low');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', enhanceNotifications);
})();
