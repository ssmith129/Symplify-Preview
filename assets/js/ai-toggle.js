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
  function enableEmailAI(){
    ensureCss();
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
  function enableSmartAppointment(){
    ensureCss();
    var toggle = document.getElementById('smartModeToggle');
    if (toggle) toggle.checked = true;
    var panel = document.getElementById('smartSuggestionsPanel');
    var main = document.getElementById('mainFormColumn');
    if (panel){ panel.style.display = 'block'; }
    if (main){ main.className = 'col-lg-8'; }
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
    document.querySelectorAll('[data-ai-toggle]').forEach(initToggle);
  });
})();
