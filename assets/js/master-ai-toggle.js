/**
 * Master AI Toggle System
 * Transforms the "AI Assistance" button into a master toggle for all AI features
 */
(function(){
  'use strict';

  // AI Features Configuration
  const AI_FEATURES = {
    email: {
      name: 'Email AI',
      storageKey: 'ai_email_enabled',
      default: true,
      description: 'Smart email classification and inbox triage'
    },
    calendar: {
      name: 'Calendar AI', 
      storageKey: 'ai_calendar_enabled',
      default: true,
      description: 'Intelligent appointment scheduling'
    },
    chat: {
      name: 'Chat AI',
      storageKey: 'ai_chat_enabled', 
      default: true,
      description: 'Enhanced chat features and filtering'
    },
    notifications: {
      name: 'Notifications AI',
      storageKey: 'ai_notifications_enabled',
      default: true,
      description: 'Priority-based notification filtering'
    }
  };

  let masterToggleInjected = false;

  function getMasterAIStatus() {
    // Check if any AI feature is enabled
    return Object.keys(AI_FEATURES).some(feature => {
      const stored = localStorage.getItem(AI_FEATURES[feature].storageKey);
      return stored === null ? AI_FEATURES[feature].default : stored === '1';
    });
  }

  function setMasterAIStatus(enabled) {
    console.log(`[Master AI] ${enabled ? 'Enabling' : 'Disabling'} all AI features`);
    
    // Set all features to the same state
    Object.keys(AI_FEATURES).forEach(feature => {
      localStorage.setItem(AI_FEATURES[feature].storageKey, enabled ? '1' : '0');
    });
    
    // Update the toggle button visual state
    updateToggleVisualState(enabled);
    
    // Show notification
    showMasterToggleNotification(enabled);
    
    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('masterAIToggle', {
      detail: { enabled, features: AI_FEATURES }
    }));
    
    // Reload page after delay to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  function updateToggleVisualState(enabled) {
    const toggleBtn = document.getElementById('masterAIToggle');
    if (!toggleBtn) return;

    const icon = toggleBtn.querySelector('i');
    const text = toggleBtn.querySelector('.toggle-text');
    
    if (enabled) {
      toggleBtn.className = 'btn btn-liner-gradient me-3 d-lg-flex d-none ai-enabled';
      toggleBtn.style.background = 'linear-gradient(45deg, #4f46e5, #06b6d4)';
      if (icon) icon.className = 'ti ti-brain-filled ms-1';
      if (text) text.textContent = 'AI Features ON';
      toggleBtn.setAttribute('title', 'Click to disable all AI features');
    } else {
      toggleBtn.className = 'btn btn-outline-secondary me-3 d-lg-flex d-none ai-disabled';
      toggleBtn.style.background = '';
      if (icon) icon.className = 'ti ti-brain ms-1';
      if (text) text.textContent = 'AI Features OFF';
      toggleBtn.setAttribute('title', 'Click to enable all AI features');
    }
  }

  function showMasterToggleNotification(enabled) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${enabled ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 350px;
      max-width: 450px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border: none;
      border-radius: 12px;
    `;
    
    const enabledFeatures = Object.keys(AI_FEATURES).filter(feature => {
      return localStorage.getItem(AI_FEATURES[feature].storageKey) === '1';
    }).length;

    notification.innerHTML = `
      <div class="d-flex align-items-start">
        <div class="me-3 mt-1">
          <i class="ti ti-brain${enabled ? '-filled' : ''} fs-24 text-${enabled ? 'success' : 'muted'}"></i>
        </div>
        <div class="flex-grow-1">
          <div class="fw-bold mb-1">
            AI Features ${enabled ? 'Activated' : 'Deactivated'}
          </div>
          <div class="small mb-2">
            ${enabled 
              ? `All ${enabledFeatures} AI features are now active and ready to assist you.`
              : 'All AI features have been turned off. You can re-enable them anytime.'
            }
          </div>
          ${enabled ? `
            <div class="small text-muted">
              <div class="d-flex flex-wrap gap-1">
                ${Object.keys(AI_FEATURES).map(feature => `
                  <span class="badge bg-light text-dark">${AI_FEATURES[feature].name}</span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 4000);
  }

  function createMasterToggle() {
    // Find the existing AI Assistance button
    const aiAssistanceBtn = document.querySelector('a.btn-liner-gradient, .btn:contains("AI Assistance")');
    if (!aiAssistanceBtn) {
      console.log('[Master AI] AI Assistance button not found');
      return false;
    }

    // Get current master AI status
    const masterEnabled = getMasterAIStatus();
    
    // Create new toggle button to replace the AI Assistance button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'masterAIToggle';
    toggleBtn.type = 'button';
    toggleBtn.innerHTML = `
      <span class="toggle-text">AI Features ${masterEnabled ? 'ON' : 'OFF'}</span>
      <i class="ti ti-brain${masterEnabled ? '-filled' : ''} ms-1"></i>
    `;
    
    // Set initial visual state
    updateToggleVisualState(masterEnabled);
    
    // Add click event listener
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const currentStatus = getMasterAIStatus();
      setMasterAIStatus(!currentStatus);
    });
    
    // Replace the original button
    aiAssistanceBtn.parentNode.replaceChild(toggleBtn, aiAssistanceBtn);
    
    console.log('[Master AI] AI Assistance button transformed into master toggle');
    return true;
  }

  function initializeAIDefaults() {
    // Set default values for first-time users
    let hasChanges = false;
    Object.keys(AI_FEATURES).forEach(feature => {
      const config = AI_FEATURES[feature];
      if (localStorage.getItem(config.storageKey) === null) {
        localStorage.setItem(config.storageKey, config.default ? '1' : '0');
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      console.log('[Master AI] Initialized default AI settings');
    }
  }

  function injectMasterToggle() {
    if (masterToggleInjected) return;

    // Initialize defaults first
    initializeAIDefaults();
    
    // Try to create the master toggle
    const success = createMasterToggle();
    
    if (success) {
      masterToggleInjected = true;
      
      // Initialize tooltips if Bootstrap is available
      if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const toggle = document.getElementById('masterAIToggle');
        if (toggle) {
          new bootstrap.Tooltip(toggle);
        }
      }
    }
  }

  // Status check function for debugging
  function getAIStatus() {
    const status = {};
    Object.keys(AI_FEATURES).forEach(feature => {
      const config = AI_FEATURES[feature];
      const stored = localStorage.getItem(config.storageKey);
      status[feature] = {
        enabled: stored === null ? config.default : stored === '1',
        stored: stored,
        config: config
      };
    });
    return {
      master: getMasterAIStatus(),
      features: status,
      toggleExists: !!document.getElementById('masterAIToggle')
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectMasterToggle);
  } else {
    setTimeout(injectMasterToggle, 100);
  }

  // Also try injection after delays for dynamic content
  setTimeout(injectMasterToggle, 500);
  setTimeout(injectMasterToggle, 1000);

  // Listen for page changes (for SPAs)
  window.addEventListener('popstate', function() {
    masterToggleInjected = false;
    setTimeout(injectMasterToggle, 200);
  });

  // Expose global functions for debugging and manual control
  window.MasterAI = {
    getStatus: getAIStatus,
    enable: () => setMasterAIStatus(true),
    disable: () => setMasterAIStatus(false),
    toggle: () => setMasterAIStatus(!getMasterAIStatus()),
    inject: injectMasterToggle,
    features: AI_FEATURES
  };

  console.log('[Master AI] Toggle system loaded');
})();
