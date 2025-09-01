(function(){
  'use strict';

  function insertPanel(){
    if (document.getElementById('ai-notif-settings')) return null;
    var hdr = document.querySelector('.content .mb-3.border-bottom, .content .mb-3.pb-3.border-bottom');
    if (!hdr) return null;
    var card = document.createElement('div');
    card.id = 'ai-notif-settings';
    card.className = 'card mb-3';
    card.innerHTML = '\
      <div class="card-header d-flex align-items-center justify-content-between">\
        <h6 class="mb-0">AI Notification & Triage Settings</h6>\
        <span class="badge bg-info-transparent text-info"><i class="ti ti-brain me-1"></i>AI</span>\
      </div>\
      <div class="card-body">\
        <div class="row g-3">\
          <div class="col-md-4">\
            <label class="form-label">Priority Threshold</label>\
            <input type="range" min="0" max="100" step="1" class="form-range" id="ais-threshold">\
            <div class="d-flex align-items-center justify-content-between"><small>Lenient</small><small>Strict</small></div>\
          </div>\
          <div class="col-md-4">\
            <label class="form-label">Categories</label>\
            <div class="d-flex gap-3 flex-wrap">\
              <div class="form-check"><input class="form-check-input" type="checkbox" id="ais-emergency"><label class="form-check-label" for="ais-emergency">Emergency</label></div>\
              <div class="form-check"><input class="form-check-input" type="checkbox" id="ais-appointment"><label class="form-check-label" for="ais-appointment">Appointments</label></div>\
              <div class="form-check"><input class="form-check-input" type="checkbox" id="ais-admin"><label class="form-check-label" for="ais-admin">Administrative</label></div>\
            </div>\
          </div>\
          <div class="col-md-4">\
            <label class="form-label">Delivery</label>\
            <div class="d-flex gap-3 flex-wrap">\
              <div class="form-check"><input class="form-check-input" type="checkbox" id="ais-email"><label class="form-check-label" for="ais-email">Email</label></div>\
              <div class="form-check"><input class="form-check-input" type="checkbox" id="ais-push"><label class="form-check-label" for="ais-push">Push</label></div>\
              <div class="form-check"><input class="form-check-input" type="checkbox" id="ais-inapp"><label class="form-check-label" for="ais-inapp">In‑App</label></div>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="card-footer d-flex align-items-center justify-content-end gap-2">\
        <button class="btn btn-light btn-sm" type="button" id="ais-reset">Reset</button>\
        <button class="btn btn-primary btn-sm" type="button" id="ais-save">Save</button>\
      </div>';
    hdr.after(card);
    return card;
  }

  var KEY = 'ai_notif_settings_v1';
  function loadSettings(){ try{ return JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){ return {}; } }
  function saveSettings(obj){ localStorage.setItem(KEY, JSON.stringify(obj||{})); }

  function hydrate(){
    var s = loadSettings();
    document.getElementById('ais-threshold').value = (s.threshold||65);
    ['emergency','appointment','admin','email','push','inapp'].forEach(function(k){
      var el = document.getElementById('ais-'+k.replace('admin','admin'));
      if (el) el.checked = s[k] !== false; // default on
    });
  }

  function bind(){
    var save = document.getElementById('ais-save');
    var reset = document.getElementById('ais-reset');
    if (save) save.addEventListener('click', function(){
      var obj = {
        threshold: parseInt(document.getElementById('ais-threshold').value,10)||65,
        emergency: !!document.getElementById('ais-emergency').checked,
        appointment: !!document.getElementById('ais-appointment').checked,
        admin: !!document.getElementById('ais-admin').checked,
        email: !!document.getElementById('ais-email').checked,
        push: !!document.getElementById('ais-push').checked,
        inapp: !!document.getElementById('ais-inapp').checked
      };
      saveSettings(obj);
    });
    if (reset) reset.addEventListener('click', function(){ localStorage.removeItem(KEY); hydrate(); });
  }

  document.addEventListener('DOMContentLoaded', function(){
    if (!(document.title||'').toLowerCase().includes('notifications settings')) return;
    var card = insertPanel();
    if (!card) return;
    hydrate();
    bind();
  });
})();
