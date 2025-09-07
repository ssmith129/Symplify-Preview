(function(){
  'use strict';

  function createToolbar(){
    var header = document.querySelector('.content .card .card-header');
    if (!header || document.getElementById('uchat-toolbar')) return null;
    var wrap = document.createElement('div');
    wrap.id = 'uchat-toolbar';
    wrap.className = 'w-100 border-top';
    wrap.innerHTML = '\
      <div class="p-2 d-flex align-items-center justify-content-between flex-wrap gap-2">\
        <div class="d-flex align-items-center gap-2 flex-wrap">\
          <div class="dropdown">\
            <button class="btn btn-sm btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">All Channels</button>\
            <ul class="dropdown-menu">\
              <li><a class="dropdown-item" href="#" data-uch-filter-channel="all">All</a></li>\
              <li><a class="dropdown-item" href="#" data-uch-filter-channel="direct">Direct</a></li>\
              <li><a class="dropdown-item" href="#" data-uch-filter-channel="team">Team</a></li>\
              <li><a class="dropdown-item" href="#" data-uch-filter-channel="external">External</a></li>\
            </ul>\
          </div>\
          <div class="form-check form-check-inline">\
            <input class="form-check-input" type="checkbox" id="uchatUnread">\
            <label class="form-check-label" for="uchatUnread">Unread</label>\
          </div>\
          <div class="form-check form-check-inline">\
            <input class="form-check-input" type="checkbox" id="uchatMentions">\
            <label class="form-check-label" for="uchatMentions">Mentions</label>\
          </div>\
        </div>\
        <div class="input-group input-group-sm" style="max-width:280px;">\
          <span class="input-group-text"><i class="ti ti-search"></i></span>\
          <input type="text" class="form-control" placeholder="Search messages" id="uchatSearch">\
        </div>\
      </div>';
    header.parentNode.insertBefore(wrap, header.nextSibling);
    return wrap;
  }

  function normalizeUserList(){
    document.querySelectorAll('.chat-user-nav .user-list').forEach(function(item){
      var nameEl = item.querySelector('h6 a, h6');
      var previewEl = item.querySelector('p');
      var text = ((nameEl?nameEl.textContent:'')+' '+(previewEl?previewEl.textContent:'')).toLowerCase();
      item.dataset.uchText = text;
      // simple channel tagging heuristics
      if (/project|team|standup|design|marketing/.test(text)) item.dataset.uchChannel = 'team';
      else if (/client|external|support/.test(text)) item.dataset.uchChannel = 'external';
      else item.dataset.uchChannel = 'direct';
      // unread detection
      item.dataset.uchUnread = !!item.querySelector('.message-count') ? '1' : '0';
      // mentions heuristic
      item.dataset.uchMention = /@|mention/.test(text) ? '1' : '0';
    });
  }

  function applyFilters(){
    var channel = window.__UCH_FILTER__ || 'all';
    var onlyUnread = !!document.getElementById('uchatUnread')?.checked;
    var onlyMentions = !!document.getElementById('uchatMentions')?.checked;
    var q = (document.getElementById('uchatSearch')?.value || '').toLowerCase();
    document.querySelectorAll('.chat-user-nav .user-list').forEach(function(item){
      var ok = true;
      if (channel !== 'all' && item.dataset.uchChannel !== channel) ok = false;
      if (onlyUnread && item.dataset.uchUnread !== '1') ok = false;
      if (onlyMentions && item.dataset.uchMention !== '1') ok = false;
      if (q && !(item.dataset.uchText||'').includes(q)) ok = false;
      item.style.display = ok ? '' : 'none';
    });
  }

  function bindEvents(toolbar){
    toolbar.addEventListener('click', function(e){
      var link = e.target.closest('[data-uch-filter-channel]');
      if (link){ e.preventDefault(); window.__UCH_FILTER__ = link.getAttribute('data-uch-filter-channel'); applyFilters(); }
    });
    ['uchatUnread','uchatMentions'].forEach(function(id){ var el = document.getElementById(id); if (el) el.addEventListener('change', applyFilters); });
    var inp = document.getElementById('uchatSearch'); if (inp) inp.addEventListener('input', applyFilters);
  }

  document.addEventListener('DOMContentLoaded', function(){
    if (!document.querySelector('.chat-users')) return;
    var tb = createToolbar();
    normalizeUserList();
    if (tb) bindEvents(tb);
    applyFilters();
  });
})();
