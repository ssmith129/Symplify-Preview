/**
 * Email AI Toggle Injector
 * Dynamically adds AI toggle switch to the email page header
 */
(function(){
  'use strict';

  function injectEmailAIToggle() {
    // Check if we're on the email page and toggle doesn't already exist
    if (!window.location.pathname.includes('email.html') || document.getElementById('emailAIToggle')) {
      return;
    }

    // Find the AI Assistance button to place our toggle nearby
    const aiAssistanceBtn = document.querySelector('a.btn-liner-gradient');
    if (!aiAssistanceBtn) {
      console.log('[Email AI] AI Assistance button not found, trying alternative placement');
      // Alternative: find any header container
      const headerContainer = document.querySelector('.d-flex.align-items-center');
      if (headerContainer) {
        placeToggleInContainer(headerContainer);
      }
      return;
    }

    // Create the Email AI toggle element
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'header-item me-3';
    
    // Get current Email AI status
    const isEnabled = localStorage.getItem('ai_email_enabled') !== '0';
    
    toggleContainer.innerHTML = `
      <div class="form-check form-switch d-flex align-items-center">
        <input class="form-check-input me-2" type="checkbox" id="emailAIToggle" 
               ${isEnabled ? 'checked' : ''} data-bs-toggle="tooltip" 
               title="Toggle Email AI Features">
        <label class="form-check-label fw-medium text-nowrap d-flex align-items-center" for="emailAIToggle">
          <i class="ti ti-brain me-1 ${isEnabled ? 'text-primary' : 'text-muted'}"></i>
          <span class="d-none d-md-inline">Email AI</span>
        </label>
      </div>
    `;

    // Insert the toggle right after the AI Assistance button
    const parentContainer = aiAssistanceBtn.parentNode;
    parentContainer.insertBefore(toggleContainer, aiAssistanceBtn.nextSibling);

    console.log('[Email AI] Toggle injected successfully');

    // Add event listener for toggle functionality
    setupToggleEventListener();

    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
      new bootstrap.Tooltip(document.getElementById('emailAIToggle'));
    }
  }

  function placeToggleInContainer(container) {
    // Fallback placement in any suitable container
    const toggleHtml = `
      <div class="header-item me-3">
        <div class="form-check form-switch d-flex align-items-center">
          <input class="form-check-input me-2" type="checkbox" id="emailAIToggle" 
                 ${localStorage.getItem('ai_email_enabled') !== '0' ? 'checked' : ''} 
                 data-bs-toggle="tooltip" title="Toggle Email AI Features">
          <label class="form-check-label fw-medium text-nowrap d-flex align-items-center" for="emailAIToggle">
            <i class="ti ti-brain me-1 text-primary"></i>
            <span class="d-none d-md-inline">Email AI</span>
          </label>
        </div>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', toggleHtml);
    setupToggleEventListener();
  }

  function setupToggleEventListener() {
    const toggle = document.getElementById('emailAIToggle');
    if (!toggle) return;

    toggle.addEventListener('change', function() {
      const enabled = this.checked;
      const icon = this.parentNode.querySelector('.ti-brain');
      
      // Update localStorage
      localStorage.setItem('ai_email_enabled', enabled ? '1' : '0');
      
      // Update visual state
      icon.className = `ti ti-brain me-1 ${enabled ? 'text-primary' : 'text-muted'}`;
      
      // Show notification
      showEmailAINotification(enabled);
      
      // Dispatch event for other scripts
      window.dispatchEvent(new CustomEvent('emailAIToggle', {
        detail: { enabled }
      }));
      
      console.log(`[Email AI] ${enabled ? 'Enabled' : 'Disabled'}`);
      
      // Reload page after short delay to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
  }

  function showEmailAINotification(enabled) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${enabled ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="ti ti-mail me-2 fs-18"></i>
        <div>
          <div class="fw-bold">Email AI ${enabled ? 'Enabled' : 'Disabled'}</div>
          <div class="small">
            ${enabled 
              ? 'Smart email classification and inbox triage activated.' 
              : 'AI email features deactivated.'
            }
          </div>
        </div>
        <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  function updateToggleState() {
    const toggle = document.getElementById('emailAIToggle');
    if (!toggle) return;
    
    const isEnabled = localStorage.getItem('ai_email_enabled') !== '0';
    toggle.checked = isEnabled;
    
    const icon = toggle.parentNode.querySelector('.ti-brain');
    if (icon) {
      icon.className = `ti ti-brain me-1 ${isEnabled ? 'text-primary' : 'text-muted'}`;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectEmailAIToggle);
  } else {
    setTimeout(injectEmailAIToggle, 100);
  }

  // Also try injection after a delay for dynamic content
  setTimeout(injectEmailAIToggle, 1000);

  // Listen for AI toggle events from other scripts
  window.addEventListener('aiFeatureToggle', function(e) {
    if (e.detail.feature === 'email') {
      updateToggleState();
    }
  });

  // Expose function globally for manual calling
  window.injectEmailAIToggle = injectEmailAIToggle;

  console.log('[Email AI] Toggle injector loaded');
})();
