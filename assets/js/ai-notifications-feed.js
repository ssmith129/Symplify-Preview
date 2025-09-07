(function(){
  'use strict';

  function insertToolbar(){
    var header = document.querySelector('.notification-header');
    if (!header || document.getElementById('ai-notif-toolbar')) return null;
    var bar = document.createElement('div');
    bar.id = 'ai-notif-toolbar';
    bar.className = 'p-2 bg-light border rounded d-flex align-items-center justify-content-between flex-wrap gap-2 mt-2';
    bar.innerHTML = '\
      <div class="d-flex align-items-center gap-2 flex-wrap">\
        <span class="badge bg-info-transparent text-info d-inline-flex align-items-center"><i class="ti ti-brain me-1"></i>AI Feed</span>\
        <div class="btn-group btn-group-sm" role="group" aria-label="Priority">\
          <button type="button" class="btn btn-outline-dark" data-afilter="all">All</button>\
          <button type="button" class="btn btn-outline-danger" data-afilter="critical">Critical</button>\
          <button type="button" class="btn btn-outline-warning" data-afilter="high">High</button>\
          <button type="button" class="btn btn-outline-info" data-afilter="medium">Medium</button>\
          <button type="button" class="btn btn-outline-success" data-afilter="low">Low</button>\
        </div>\
      </div>\
      <div class="input-group input-group-sm" style="max-width:280px;">\
        <span class="input-group-text"><i class="ti ti-search"></i></span>\
        <input type="text" class="form-control" placeholder="Search notifications" id="an-search">\
      </div>';
    header.after(bar);
    return bar;
  }

  function classify(text){
    var t = (text||'').toLowerCase();
    if (/emergency|urgent|fail|error|critical/.test(t)) return 'critical';
    if (/follow-up|warning|delay|reschedul/.test(t)) return 'high';
    if (/appointment|report|update|completed|booked/.test(t)) return 'medium';
    return 'low';
  }

  function tagItems(){
    document.querySelectorAll('.notication-list .notication-item').forEach(function(it){
      if (it.dataset.aiNotifTagged === '1') return;
      var body = it.querySelector('.notify-time') || it.querySelector('.notication-info') || it;
      var txt = body ? body.textContent : '';
      var p = classify(txt);
      it.dataset.aiPriority = p;
      // add small badge
      var timeCol = it.querySelector('.col-lg-3 p, .col-lg-3 .m-0');
      if (timeCol){
        var b = document.createElement('span');
        b.className = 'badge ms-2 bg-'+(p==='critical'?'danger':p)+'-transparent text-'+(p==='critical'?'danger':p)+' text-capitalize';
        b.textContent = p;
        timeCol.appendChild(b);
      }
      it.dataset.aiNotifTagged = '1';
    });
  }

  function apply(filter, q){
    document.querySelectorAll('.notication-list .notication-item').forEach(function(it){
      var ok = true;
      if (filter !== 'all' && it.dataset.aiPriority !== filter) ok = false;
      if (q){
        var txt = (it.textContent||'').toLowerCase();
        if (!txt.includes(q)) ok = false;
      }
      it.style.display = ok ? '' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    if (!document.querySelector('.notication-list')) return;
    var tb = insertToolbar();
    tagItems();
    var current = 'all';
    var search = '';
    if (tb){
      tb.addEventListener('click', function(e){
        var btn = e.target.closest('[data-afilter]');
        if (!btn) return;
        current = btn.getAttribute('data-afilter');
        apply(current, search);
      });
      var s = document.getElementById('an-search');
      if (s){ s.addEventListener('input', function(){ search = (s.value||'').toLowerCase(); apply(current, search); }); }
    }
    apply(current, search);
  });
})();
