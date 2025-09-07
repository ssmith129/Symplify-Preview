'use strict';
(function(){
  var CONFIG = (window.SYMPLIFY_AI && window.SYMPLIFY_AI.chat) || { enabled: true, defaultLanguage: 'en' };
  if (CONFIG.enabled === false) return;

  function createAIHeader(){
    var header = document.querySelector('.chat-messages .card-header');
    if (!header || document.getElementById('ai-msg-header')) return null;
    var bar = document.createElement('div');
    bar.id = 'ai-msg-header';
    bar.className = 'w-100 border-top';
    bar.innerHTML = '\
      <div class="p-2 d-flex align-items-center justify-content-between flex-wrap gap-2" role="region" aria-label="AI conversation insights">\
        <div class="d-flex align-items-center gap-2 flex-wrap">\
          <span class="smart-sorting-badge d-inline-flex align-items-center" aria-label="Smart Sorting Enabled"><i class="ti ti-brain me-1"></i>Smart Sorting</span>\
          <span class="badge bg-light text-dark ai-badge" id="ai-insight-priority" aria-live="polite">Priority: —</span>\
          <span class="badge bg-light text-dark ai-badge" id="ai-insight-sentiment" aria-live="polite">Sentiment: —</span>\
          <span class="badge bg-light text-dark ai-badge" id="ai-insight-length">Msgs: —</span>\
        </div>\
        <div class="d-flex align-items-center gap-2">\
          <div class="dropdown">\
            <button class="btn btn-sm btn-outline-dark dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Translation Language">Translate</button>\
            <ul class="dropdown-menu dropdown-menu-end" aria-label="Select language">\
              <li><a class="dropdown-item" href="#" data-ai-lang="en">English</a></li>\
              <li><a class="dropdown-item" href="#" data-ai-lang="es">Español</a></li>\
              <li><a class="dropdown-item" href="#" data-ai-lang="fr">Français</a></li>\
              <li><a class="dropdown-item" href="#" data-ai-lang="de">Deutsch</a></li>\
            </ul>\
          </div>\
        </div>\
      </div>';
    header.parentNode.insertBefore(bar, header.nextSibling);
    return bar;
  }

  function sentimentScore(text){
    var pos = /(great|good|love|perfect|thanks|👍|😊|success)/i;
    var neg = /(bad|issue|problem|delay|angry|sorry|fail|😠|👎)/i;
    if (neg.test(text) && !pos.test(text)) return -1;
    if (pos.test(text) && !neg.test(text)) return 1;
    return 0;
  }

  function categorize(text){
    if (/emergency|urgent|immediately|asap|critical/i.test(text)) return { key: 'emergency', label: 'Emergency', badge: 'priority-critical' };
    if (/appointment|schedule|meeting|book/i.test(text)) return { key: 'appointment', label: 'Appointment', badge: 'priority-high' };
    if (/report|invoice|policy|admin|update/i.test(text)) return { key: 'administrative', label: 'Administrative', badge: 'priority-medium' };
    if (/follow.?up|check in|review/i.test(text)) return { key: 'follow-up', label: 'Follow-up', badge: 'priority-low' };
    return { key: 'general', label: 'General', badge: 'priority-medium' };
  }

  function summarizeConversation(){
    var chunks = Array.from(document.querySelectorAll('.message-body .message-box'))
      .map(function(box){ return (box.textContent||'').trim(); })
      .filter(Boolean)
      .slice(-8);
    if (!chunks.length) return 'No recent messages.';
    var keyLines = chunks.map(function(t){ return t.replace(/\s+/g,' ').slice(0,80); });
    var summary = keyLines[0];
    if (keyLines.length > 1) summary += ' • ' + keyLines[1];
    if (keyLines.length > 2) summary += ' • ' + keyLines[2];
    return summary;
  }

  function translateText(text, lang){
    if (!lang || lang === 'en') return text;
    var prefix = { es: '[ES] ', fr: '[FR] ', de: '[DE] ' }[lang] || '['+lang.toUpperCase()+'] ';
    return prefix + text;
  }

  function applyTranslation(lang){
    document.querySelectorAll('.message-box .fs-16, .message-box p').forEach(function(p){
      var original = p.getAttribute('data-ai-original');
      if (!original) {
        original = (p.textContent||'').trim();
        p.setAttribute('data-ai-original', original);
      }
      p.textContent = translateText(original, lang);
    });
  }

  function injectSummary(){
    if (document.getElementById('ai-convo-summary')) return;
    var container = document.querySelector('.message-body');
    if (!container) return;
    var sum = document.createElement('div');
    sum.id = 'ai-convo-summary';
    sum.className = 'px-3 pb-2';
    sum.innerHTML = '\
      <div class="alert ai-performance-indicator d-flex align-items-center gap-2 mb-2" role="status" aria-live="polite">\
        <span class="avatar avatar-sm rounded-circle d-inline-flex align-items-center justify-content-center text-white"><i class="ti ti-sparkles"></i></span>\
        <div class="flex-grow-1">\
          <div class="fw-semibold">Conversation Summary</div>\
          <div class="small" id="ai-convo-summary-text"></div>\
        </div>\
        <span class="ai-confidence" id="ai-convo-confidence">92% confidence</span>\
      </div>';
    container.insertBefore(sum, container.firstChild);
    document.getElementById('ai-convo-summary-text').textContent = summarizeConversation();
  }

  function injectReplySuggestions(){
    if (document.getElementById('ai-reply-suggestions')) return;
    var footer = document.querySelector('.message-footer .d-flex.align-items-center.gap-2');
    var input = document.querySelector('.message-footer input.form-control');
    if (!footer || !input) return;
    var wrap = document.createElement('div');
    wrap.id = 'ai-reply-suggestions';
    wrap.className = 'd-flex flex-wrap gap-2 me-2';
    wrap.setAttribute('role','group');
    wrap.setAttribute('aria-label','AI reply suggestions');

    var latest = (document.querySelector('.message-body .receive-message p')||{}).textContent || '';
    var cat = categorize(latest).key;
    var suggestions = {
      'emergency': ['We are addressing this immediately.','Calling you now to resolve.','Please proceed to the nearest care center.'],
      'appointment': ['I can schedule that for you.','Does tomorrow at 10 AM work?','I will confirm and send a calendar invite.'],
      'administrative': ['I have noted this and will update records.','Thanks, I will follow up with the paperwork.','Acknowledged. We will proceed accordingly.'],
      'follow-up': ['Thanks for the update.','Let’s schedule a follow-up to review.','Noted. I’ll check back shortly.'],
      'general': ['Thanks for sharing.','Got it, I will take a look.','Sounds good.']
    }[cat] || ['Okay.','Understood.','Thanks!'];

    suggestions.slice(0,3).forEach(function(txt, idx){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-sm btn-outline-primary ai-action-btn';
      btn.setAttribute('aria-label','Insert suggestion '+(idx+1));
      btn.textContent = txt;
      btn.addEventListener('click', function(){ input.value = txt; input.focus(); });
      wrap.appendChild(btn);
    });

    var footerParent = document.querySelector('.message-footer');
    if (footerParent) footerParent.insertBefore(wrap, footerParent.firstChild);
  }

  function annotateMessages(){
    var msgs = Array.from(document.querySelectorAll('.message-body .message-box'));
    if (!msgs.length) return { count: 0, avgSent: 0 };
    var total = 0; var count = 0;
    msgs.forEach(function(box){
      var text = (box.textContent||'').trim();
      var s = sentimentScore(text);
      total += s; count++;
      var badge = box.querySelector('.ai-sentiment-badge');
      if (!badge){
        badge = document.createElement('span');
        badge.className = 'badge rounded-pill ms-2 ai-badge ai-sentiment-badge';
        badge.setAttribute('aria-label','Message sentiment');
        var ts = box.parentElement?.previousElementSibling || null;
        if (ts && ts.classList.contains('d-flex')) ts.appendChild(badge); else box.appendChild(badge);
      }
      if (s > 0) { badge.classList.remove('bg-warning','bg-danger'); badge.classList.add('bg-success'); badge.textContent = 'Positive'; }
      else if (s < 0) { badge.classList.remove('bg-success','bg-warning'); badge.classList.add('bg-danger'); badge.textContent = 'Negative'; }
      else { badge.classList.remove('bg-success','bg-danger'); badge.classList.add('bg-warning'); badge.textContent = 'Neutral'; }
    });
    return { count: count, avgSent: Math.round((total/(count||1))*100)/100 };
  }

  function prioritizeThreads(){
    document.querySelectorAll('.chat-user-nav .user-list').forEach(function(item){
      var text = (item.textContent||'').toLowerCase();
      var cat = categorize(text);
      var dot = item.querySelector('.priority-indicator');
      if (!dot){
        dot = document.createElement('span');
        dot.className = 'priority-indicator '+cat.badge;
        dot.setAttribute('aria-hidden','true');
        item.style.position = 'relative';
        item.appendChild(dot);
      } else {
        dot.className = 'priority-indicator '+cat.badge;
      }
      item.dataset.aiPriority = cat.badge;
    });
    var list = document.querySelector('.chat-users');
    if (!list) return;
    var items = Array.from(list.querySelectorAll('.user-list'));
    var weight = { 'priority-critical': 4, 'priority-high': 3, 'priority-medium': 2, 'priority-low': 1 };
    items.sort(function(a,b){ return (weight[b.dataset.aiPriority]||0) - (weight[a.dataset.aiPriority]||0); });
    items.forEach(function(it){ list.appendChild(it); });
  }

  function updateInsights(){
    var latest = (document.querySelector('.message-body .receive-message p')||{}).textContent || '';
    var cat = categorize(latest);
    var stats = annotateMessages();
    var pr = document.getElementById('ai-insight-priority'); if (pr) pr.textContent = 'Priority: '+cat.label;
    var se = document.getElementById('ai-insight-sentiment'); if (se) se.textContent = 'Sentiment: '+(stats.avgSent>0?'Positive':stats.avgSent<0?'Negative':'Neutral');
    var ln = document.getElementById('ai-insight-length'); if (ln) ln.textContent = 'Msgs: '+stats.count;
  }

  function bindHeaderActions(header){
    if (!header) return;
    header.addEventListener('click', function(e){
      var langEl = e.target.closest('[data-ai-lang]');
      if (langEl){ e.preventDefault(); var lang = langEl.getAttribute('data-ai-lang'); applyTranslation(lang); }
    });
  }

  function observeMutations(){
    var body = document.querySelector('.message-body');
    if (!body) return;
    var obs = new MutationObserver(function(){
      injectSummary();
      updateInsights();
    });
    obs.observe(body, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', function(){
    if (!document.querySelector('.chat-messages')) return;
    var header = createAIHeader();
    bindHeaderActions(header);
    injectSummary();
    injectReplySuggestions();
    annotateMessages();
    prioritizeThreads();
    updateInsights();
    observeMutations();
  });
})();
