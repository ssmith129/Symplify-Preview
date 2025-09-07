(function(){
  'use strict';

  function insertWorkflow(){
    if (document.getElementById('ai-onboarding')) return null;
    var anchor = document.querySelector('.content .mb-3.border-bottom, .content .mb-3.pb-3.border-bottom');
    if (!anchor) return null;
    var card = document.createElement('div');
    card.id = 'ai-onboarding';
    card.className = 'card mb-3';
    card.innerHTML = '\
      <div class="card-header d-flex align-items-center justify-content-between">\
        <h6 class="mb-0">AI Onboarding Workflow</h6>\
        <span class="badge bg-info-transparent text-info"><i class="ti ti-brain me-1"></i>AI</span>\
      </div>\
      <div class="card-body">\
        <ol class="mb-0">\
          <li class="mb-2">Enable email AI features on the Email page using the AI Insights toggle.</li>\
          <li class="mb-2">Connect integrations as needed (Gmail, Calendar, etc.).</li>\
          <li class="mb-2">Optionally connect external apps via MCP: Neon, Zapier, Figma, Builder CMS, Linear, Supabase, Context7, Semgrep, Prisma Postgres. Open MCP popover to connect.</li>\
          <li>Review Notification & Triage Settings to fine‑tune priorities and delivery.</li>\
        </ol>\
      </div>';
    anchor.after(card);
    return card;
  }

  document.addEventListener('DOMContentLoaded', function(){
    if (!(document.title||'').toLowerCase().includes('integrations settings')) return;
    insertWorkflow();
  });
})();
