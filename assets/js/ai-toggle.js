(function(){
  function ensureCss(){
    if (!document.querySelector('link[href="assets/css/ai-features.css"]')){
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = 'assets/css/ai-features.css';
      document.head.appendChild(l);
    }
  }
  function loadScript(src, cb){
    if (document.querySelector('script[src="'+src+'"]')){ if (cb) cb(); return; }
    var s = document.createElement('script');
    s.src = src; s.defer = true; if (cb) s.onload = cb; document.body.appendChild(s);
  }

  // EMAIL AI
  function ensureEmailToggleAndContainer(){
    var header = document.querySelector('.mail-notifications .p-3.border-bottom .d-flex.align-items-center');
    if (header && !document.getElementById('aiToggleEmail')){
      var wrap = document.createElement('div');
      wrap.className = 'form-check form-switch d-flex align-items-center gap-2 ms-2';
      wrap.innerHTML = '<input class="form-check-input" type="checkbox" id="aiToggleEmail" data-ai-toggle="email"><label class="form-check-label fw-medium" for="aiToggleEmail"><i class="ti ti-brain me-1"></i>AI Insights</label>';
      header.appendChild(wrap);
    }
    if (!document.getElementById('ai-inbox-triage-container')){
      var headerBlock = document.querySelector('.mail-notifications .p-3.border-bottom');
      if (headerBlock){
        var tri = document.createElement('div');
        tri.id = 'ai-inbox-triage-container';
        tri.className = 'my-3';
        tri.style.display = 'none';
        headerBlock.parentNode.insertBefore(tri, headerBlock.nextSibling);
      }
    }
  }

  function enableEmailAI(){
    ensureCss();
    ensureEmailToggleAndContainer();
    if (document.querySelector('.mails-list')){
      loadScript('assets/js/ai-email-insights.js');
    }
    var triage = document.getElementById('ai-inbox-triage-container');
    if (triage){
      triage.style.display = '';
      loadScript('assets/js/ai-inbox-triage.js');
    }
  }
  function disableEmailAI(){
    // Remove toolbar
    var toolbar = document.querySelector('.ai-email-toolbar');
    if (toolbar) toolbar.remove();
    // Cleanup list items that were enhanced
    document.querySelectorAll('.mails-list .list-group-item').forEach(function(item){
      if (item.dataset.aiEmailEnhanced === '1'){
        item.querySelectorAll('span.fs-10').forEach(function(badge){
          var txt = (badge.textContent || '').trim().toLowerCase();
          if (txt.startsWith('ai') || txt === 'critical' || txt === 'high' || txt === 'medium' || txt === 'low'){
            badge.remove();
          }
        });
        item.style.display = '';
        delete item.dataset.aiEmailEnhanced;
        delete item.dataset.aiPriority;
        delete item.dataset.aiCategory;
      }
    });
    // Hide triage container and clear
    var triage = document.getElementById('ai-inbox-triage-container');
    if (triage){ triage.innerHTML = ''; triage.style.display = 'none'; }
  }

  // SMART APPOINTMENT
  function ensureSmartAppointmentUI(){
    // Insert toggle near page header if missing
    var headerRow = document.querySelector('.content .mb-4');
    if (headerRow && !document.getElementById('smartModeToggle')){
      var toggleWrap = document.createElement('div');
      toggleWrap.className = 'd-flex align-items-center justify-content-end mb-2';
      toggleWrap.innerHTML = '<div class="form-check form-switch d-flex align-items-center gap-2"><input class="form-check-input" type="checkbox" id="smartModeToggle" data-ai-toggle="smart-appointment"><label class="form-check-label fw-medium" for="smartModeToggle"><i class="ti ti-robot me-1"></i>Smart Scheduling</label></div>';
      headerRow.parentNode.insertBefore(toggleWrap, headerRow.nextSibling);
    }

    // Add IDs to core fields if missing (best-effort by label text)
    function setIdByLabel(labelText, inputSelector, id){
      var label = Array.from(document.querySelectorAll('label.form-label, label.form-label.mb-1, label.form-label.mb-0')).find(function(l){ return (l.textContent||'').trim().toLowerCase().startsWith(labelText); });
      if (label){
        var container = label.closest('.mb-3') || label.parentElement;
        if (container){
          var el = container.querySelector(inputSelector);
          if (el && !el.id){ el.id = id; }
        }
      }
    }
    setIdByLabel('patient', 'select', 'patientSelect');
    setIdByLabel('department', 'select', 'departmentSelect');
    setIdByLabel('doctor', 'select', 'doctorSelect');
    setIdByLabel('appointment type', 'select', 'appointmentTypeSelect');
    setIdByLabel('date of appointment', 'input', 'appointmentDate');
    setIdByLabel('time', 'input', 'appointmentTime');

    // Inject conflict warnings container if missing
    if (!document.getElementById('conflictWarnings')){
      var timeInput = document.getElementById('appointmentTime');
      if (timeInput){
        var group = timeInput.closest('.mb-3');
        var cw = document.createElement('div'); cw.id = 'conflictWarnings'; cw.className = 'mb-3';
        if (group && group.parentNode){ group.parentNode.parentNode.insertBefore(cw, group.parentNode.nextSibling); }
      }
    }

    // Inject smart suggestions panel if missing
    if (!document.getElementById('smartSuggestionsPanel')){
      var mainContent = document.querySelector('.content .row.justify-content-center .col-lg-10') || document.querySelector('.content');
      if (mainContent){
        var panel = document.createElement('div');
        panel.id = 'smartSuggestionsPanel';
        panel.className = 'mt-3';
        panel.style.display = 'none';
        panel.innerHTML = '<div class="smart-suggestions-panel"><div class="card border-primary"><div class="card-header bg-primary text-white"><h6 class="mb-0 fw-bold d-flex align-items-center"><i class="ti ti-robot me-2"></i>Smart Time Suggestions</h6><small class="opacity-75">AI-powered recommendations based on historical data</small></div><div class="card-body p-0"><div id="emptyState" class="empty-state p-4 text-center"><i class="ti ti-info-circle text-muted fs-48 mb-3"></i><h6 class="text-muted mb-2">Complete Basic Information</h6><p class="text-muted fs-13 mb-0">Select patient, department, and doctor to see smart time suggestions</p></div><div id="loadingState" class="loading-state p-4 text-center" style="display: none;"><div class="spinner-border text-primary mb-3" role="status"><span class="visually-hidden">Loading...</span></div><h6 class="text-muted mb-2">Analyzing Optimal Times</h6><p class="text-muted fs-13 mb-0">Processing schedules and preferences...</p></div><div id="suggestionsContent" style="display: none;"><div id="smartSlotsList" class="suggestions-list"></div><div class="suggestions-footer p-3 bg-light"><div class="d-flex align-items-center justify-content-between"><small class="text-muted"><i class="ti ti-refresh me-1"></i>Updated 2 min ago</small><button class="btn btn-outline-primary btn-sm"><i class="ti ti-search me-1"></i>More Options</button></div></div></div></div></div><div class="card border-info mt-3"><div class="card-header bg-info-transparent"><h6 class="mb-0 fw-bold text-info"><i class="ti ti-bulb me-2"></i>AI Insights</h6></div><div class="card-body p-3"><div id="aiInsights" class="insights-list"></div></div></div></div>';
        mainContent.appendChild(panel);
      }
    }
  }

  function enableSmartAppointment(){
    ensureCss();
    ensureSmartAppointmentUI();
    var toggle = document.getElementById('smartModeToggle');
    if (toggle) toggle.checked = true;
    var panel = document.getElementById('smartSuggestionsPanel');
    if (panel){ panel.style.display = 'block'; }
    loadScript('assets/js/ai-smart-appointment.js');
  }
  function disableSmartAppointment(){
    var toggle = document.getElementById('smartModeToggle');
    if (toggle) toggle.checked = false;
    var panel = document.getElementById('smartSuggestionsPanel');
    var main = document.getElementById('mainFormColumn');
    if (panel){
      // Clear dynamic content
      var ids = ['emptyState','loadingState','suggestionsContent','smartSlotsList','aiInsights','conflictWarnings'];
      ids.forEach(function(id){ var el = document.getElementById(id); if (el){ if (id==='suggestionsContent'){ el.style.display='none'; } else { el.innerHTML=''; } } });
      panel.style.display = 'none';
    }
    // Remove AI badges on labels
    document.querySelectorAll('.ai-badge').forEach(function(b){ b.remove(); });
    if (main){ main.className = 'col-lg-12'; }
  }

  function initToggle(el){
    var feature = el.getAttribute('data-ai-toggle');
    if (!feature) return;
    var key = feature === 'email' ? 'ai_email_enabled' : (feature === 'smart-appointment' ? 'ai_smart_appointment_enabled' : null);
    if (!key) return;
    var enabled = localStorage.getItem(key) === '1';
    el.checked = enabled;
    if (feature === 'email'){
      enabled ? enableEmailAI() : disableEmailAI();
    } else if (feature === 'smart-appointment'){
      enabled ? enableSmartAppointment() : disableSmartAppointment();
    }

    el.addEventListener('change', function(){
      var on = !!el.checked;
      localStorage.setItem(key, on ? '1' : '0');
      if (feature === 'email'){
        on ? enableEmailAI() : disableEmailAI();
      } else if (feature === 'smart-appointment'){
        on ? enableSmartAppointment() : disableSmartAppointment();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Proactively inject toggle UIs where applicable
    if (document.querySelector('.mails-list') || document.querySelector('.mail-notifications')){
      ensureEmailToggleAndContainer();
    }
    if (document.querySelector('title') && (document.title || '').toLowerCase().includes('new appointment')){
      ensureSmartAppointmentUI();
    }
    document.querySelectorAll('[data-ai-toggle]').forEach(initToggle);
  });
})();
