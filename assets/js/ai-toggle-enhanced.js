/**
 * Enhanced AI Toggle Management System
 * Provides user-friendly controls for all AI features
 */
(function(){
  'use strict';

  // AI Feature Configuration
  const AI_FEATURES = {
    email: {
      name: 'Email AI',
      icon: 'ti-mail',
      description: 'Smart email classification, priority detection, and inbox triage',
      storageKey: 'ai_email_enabled',
      default: true
    },
    calendar: {
      name: 'Calendar AI',
      icon: 'ti-calendar',
      description: 'Intelligent appointment scheduling and time optimization',
      storageKey: 'ai_calendar_enabled',
      default: true
    },
    chat: {
      name: 'Chat AI',
      icon: 'ti-messages',
      description: 'Enhanced chat features with smart filtering and search',
      storageKey: 'ai_chat_enabled',
      default: true
    },
    notifications: {
      name: 'Notifications AI',
      icon: 'ti-bell',
      description: 'Priority-based notification filtering and smart alerts',
      storageKey: 'ai_notifications_enabled',
      default: true
    }
  };

  let aiControlsInjected = false;

  function getAIFeatureStatus(feature) {
    const stored = localStorage.getItem(AI_FEATURES[feature].storageKey);
    return stored === null ? AI_FEATURES[feature].default : stored === '1';
  }

  function setAIFeatureStatus(feature, enabled) {
    localStorage.setItem(AI_FEATURES[feature].storageKey, enabled ? '1' : '0');
    console.log(`[AI Toggle] ${AI_FEATURES[feature].name} ${enabled ? 'enabled' : 'disabled'}`);
    
    // Dispatch custom event for other scripts to listen
    window.dispatchEvent(new CustomEvent('aiFeatureToggle', {
      detail: { feature, enabled, featureConfig: AI_FEATURES[feature] }
    }));
  }

  function getMasterAIStatus() {
    return Object.keys(AI_FEATURES).some(feature => getAIFeatureStatus(feature));
  }

  function setMasterAIStatus(enabled) {
    Object.keys(AI_FEATURES).forEach(feature => {
      setAIFeatureStatus(feature, enabled);
    });
    updateToggleUI();
    
    // Show notification
    showNotification(
      enabled ? 'AI Features Enabled' : 'AI Features Disabled',
      enabled ? 'All AI features have been activated.' : 'All AI features have been deactivated.',
      enabled ? 'success' : 'info'
    );
    
    // Reload page after short delay to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  function showNotification(title, message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="ti ti-robot me-2 fs-18"></i>
        <div>
          <div class="fw-bold">${title}</div>
          <div class="small">${message}</div>
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

  function createMasterToggle() {
    const masterEnabled = getMasterAIStatus();
    
    return `
      <div class="header-item me-2">
        <div class="form-check form-switch d-flex align-items-center">
          <input class="form-check-input me-2" type="checkbox" id="masterAIToggle" 
                 ${masterEnabled ? 'checked' : ''} data-bs-toggle="tooltip" 
                 title="Toggle all AI features">
          <label class="form-check-label fw-medium text-nowrap" for="masterAIToggle">
            <i class="ti ti-brain me-1 ${masterEnabled ? 'text-primary' : 'text-muted'}"></i>
            <span class="d-none d-md-inline">AI Features</span>
          </label>
        </div>
      </div>
    `;
  }

  function createAISettingsButton() {
    return `
      <div class="header-item me-2">
        <button class="btn btn-light btn-sm" type="button" data-bs-toggle="modal" 
                data-bs-target="#aiSettingsModal" data-bs-toggle="tooltip" 
                title="AI Settings">
          <i class="ti ti-settings fs-16"></i>
        </button>
      </div>
    `;
  }

  function createAISettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'aiSettingsModal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'aiSettingsModalLabel');
    modal.setAttribute('aria-hidden', 'true');
    
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="aiSettingsModalLabel">
              <i class="ti ti-robot me-2"></i>AI Features Settings
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="alert alert-info d-flex align-items-center mb-4">
                  <i class="ti ti-info-circle me-2"></i>
                  <div>
                    <strong>AI Features</strong><br>
                    <small>Control which AI enhancements are active. Changes take effect immediately and persist across sessions.</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="aiFeaturesList" class="row">
              ${Object.keys(AI_FEATURES).map(feature => {
                const config = AI_FEATURES[feature];
                const enabled = getAIFeatureStatus(feature);
                
                return `
                  <div class="col-md-6 mb-3">
                    <div class="card h-100 ${enabled ? 'border-primary' : ''}">
                      <div class="card-body">
                        <div class="d-flex align-items-start justify-content-between">
                          <div class="flex-grow-1">
                            <h6 class="card-title d-flex align-items-center">
                              <i class="${config.icon} me-2 text-primary"></i>
                              ${config.name}
                            </h6>
                            <p class="card-text text-muted small">${config.description}</p>
                          </div>
                          <div class="form-check form-switch ms-2">
                            <input class="form-check-input ai-feature-toggle" type="checkbox" 
                                   id="toggle_${feature}" data-feature="${feature}" 
                                   ${enabled ? 'checked' : ''}>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            
            <div class="row mt-4">
              <div class="col-12">
                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-success" id="enableAllAI">
                    <i class="ti ti-check-circle me-1"></i>Enable All
                  </button>
                  <button type="button" class="btn btn-outline-secondary" id="disableAllAI">
                    <i class="ti ti-x-circle me-1"></i>Disable All
                  </button>
                  <div class="ms-auto">
                    <button type="button" class="btn btn-outline-primary" id="reloadPageBtn">
                      <i class="ti ti-refresh me-1"></i>Apply Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    return modal;
  }

  function updateToggleUI() {
    const masterToggle = document.getElementById('masterAIToggle');
    if (masterToggle) {
      const masterEnabled = getMasterAIStatus();
      masterToggle.checked = masterEnabled;
      
      const icon = masterToggle.parentNode.querySelector('.ti-brain');
      if (icon) {
        icon.className = `ti ti-brain me-1 ${masterEnabled ? 'text-primary' : 'text-muted'}`;
      }
    }

    // Update individual feature toggles if modal is open
    Object.keys(AI_FEATURES).forEach(feature => {
      const toggle = document.getElementById(`toggle_${feature}`);
      if (toggle) {
        toggle.checked = getAIFeatureStatus(feature);
        
        const card = toggle.closest('.card');
        if (card) {
          card.classList.toggle('border-primary', toggle.checked);
        }
      }
    });
  }

  function attachEventListeners() {
    // Master toggle
    const masterToggle = document.getElementById('masterAIToggle');
    if (masterToggle) {
      masterToggle.addEventListener('change', function() {
        setMasterAIStatus(this.checked);
      });
    }

    // Individual feature toggles
    document.addEventListener('change', function(e) {
      if (e.target.classList.contains('ai-feature-toggle')) {
        const feature = e.target.dataset.feature;
        setAIFeatureStatus(feature, e.target.checked);
        updateToggleUI();
        
        const card = e.target.closest('.card');
        if (card) {
          card.classList.toggle('border-primary', e.target.checked);
        }
        
        showNotification(
          `${AI_FEATURES[feature].name} ${e.target.checked ? 'Enabled' : 'Disabled'}`,
          e.target.checked ? 'Feature activated successfully.' : 'Feature deactivated.',
          e.target.checked ? 'success' : 'info'
        );
      }
    });

    // Bulk actions
    document.addEventListener('click', function(e) {
      if (e.target.id === 'enableAllAI' || e.target.closest('#enableAllAI')) {
        setMasterAIStatus(true);
      } else if (e.target.id === 'disableAllAI' || e.target.closest('#disableAllAI')) {
        setMasterAIStatus(false);
      } else if (e.target.id === 'reloadPageBtn' || e.target.closest('#reloadPageBtn')) {
        window.location.reload();
      }
    });
  }

  function injectAIControls() {
    if (aiControlsInjected) return;

    // Find AI Assistance button to place our controls nearby
    const aiAssistanceBtn = document.querySelector('a[href*="AI Assistance"], .btn:contains("AI Assistance")');
    let targetContainer = null;

    if (aiAssistanceBtn) {
      targetContainer = aiAssistanceBtn.parentNode;
    } else {
      // Fallback: find header items container
      targetContainer = document.querySelector('.d-flex.align-items-center:has(.header-item)');
      if (!targetContainer) {
        // Second fallback: any header container
        targetContainer = document.querySelector('.navbar-header .d-flex.align-items-center');
      }
    }

    if (targetContainer) {
      // Create master toggle
      const toggleHtml = createMasterToggle();
      const toggleElement = document.createElement('div');
      toggleElement.innerHTML = toggleHtml;
      
      // Create settings button
      const settingsHtml = createAISettingsButton();
      const settingsElement = document.createElement('div');
      settingsElement.innerHTML = settingsHtml;
      
      // Insert controls
      if (aiAssistanceBtn) {
        targetContainer.insertBefore(toggleElement.firstElementChild, aiAssistanceBtn);
        targetContainer.insertBefore(settingsElement.firstElementChild, aiAssistanceBtn);
      } else {
        targetContainer.appendChild(toggleElement.firstElementChild);
        targetContainer.appendChild(settingsElement.firstElementChild);
      }

      // Create and inject modal
      const modal = createAISettingsModal();
      document.body.appendChild(modal);

      // Attach event listeners
      attachEventListeners();

      // Initialize tooltips
      if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });
      }

      aiControlsInjected = true;
      console.log('[AI Toggle] Enhanced UI controls injected');
    } else {
      console.warn('[AI Toggle] Could not find suitable container for AI controls');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAIControls);
  } else {
    setTimeout(injectAIControls, 100);
  }

  // Also try to inject after a delay for dynamic content
  setTimeout(injectAIControls, 1000);

  // Expose global functions
  window.AIToggle = {
    getStatus: getAIFeatureStatus,
    setStatus: setAIFeatureStatus,
    getMasterStatus: getMasterAIStatus,
    setMasterStatus: setMasterAIStatus,
    updateUI: updateToggleUI,
    features: AI_FEATURES
  };

  console.log('[AI Toggle] Enhanced management system loaded');
})();
