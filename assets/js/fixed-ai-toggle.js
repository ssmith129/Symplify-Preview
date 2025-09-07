/**
 * Fixed AI Toggle System
 * Fixes button detection issues and provides both transformation and dedicated toggle options
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

  let toggleInjected = false;

  function getMasterAIStatus() {
    // Check if any AI feature is enabled
    return Object.keys(AI_FEATURES).some(feature => {
      const stored = localStorage.getItem(AI_FEATURES[feature].storageKey);
      return stored === null ? AI_FEATURES[feature].default : stored === '1';
    });
  }

  function setMasterAIStatus(enabled) {
    console.log(`[Fixed AI] ${enabled ? 'Enabling' : 'Disabling'} all AI features`);
    
    // Set all features to the same state
    Object.keys(AI_FEATURES).forEach(feature => {
      localStorage.setItem(AI_FEATURES[feature].storageKey, enabled ? '1' : '0');
    });
    
    // Update visual state
    updateToggleVisualState(enabled);
    
    // Show notification
    showToggleNotification(enabled);
    
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
    const toggleBtn = document.getElementById('fixedAIToggle') || document.getElementById('masterAIToggle');
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

  function showToggleNotification(enabled) {
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

  function findAIAssistanceButton() {
    // Try multiple methods to find the AI Assistance button
    
    // Method 1: Direct selector for the button with exact class and content
    let buttons = document.querySelectorAll('a.btn-liner-gradient');
    for (let btn of buttons) {
      if (btn.textContent.includes('AI Assistance')) {
        console.log('[Fixed AI] Found AI Assistance button via class + text content');
        return btn;
      }
    }
    
    // Method 2: Look for any button containing "AI Assistance" text
    const allButtons = document.querySelectorAll('a, button');
    for (let btn of allButtons) {
      if (btn.textContent.includes('AI Assistance')) {
        console.log('[Fixed AI] Found AI Assistance button via text search');
        return btn;
      }
    }
    
    // Method 3: Look for specific class combinations
    const candidateSelectors = [
      'a.btn-liner-gradient',
      '.btn-liner-gradient',
      'a[href="javascript:void(0);"]',
      '.topbar-menu a.btn'
    ];
    
    for (let selector of candidateSelectors) {
      const elements = document.querySelectorAll(selector);
      for (let element of elements) {
        if (element.textContent.includes('AI') || element.textContent.includes('Assistance')) {
          console.log(`[Fixed AI] Found potential AI button via selector: ${selector}`);
          return element;
        }
      }
    }
    
    console.log('[Fixed AI] AI Assistance button not found');
    return null;
  }

  function transformExistingButton() {
    const aiAssistanceBtn = findAIAssistanceButton();
    if (!aiAssistanceBtn) {
      return false;
    }

    console.log('[Fixed AI] Transforming existing AI Assistance button');
    
    // Get current master AI status
    const masterEnabled = getMasterAIStatus();
    
    // Transform the existing button
    aiAssistanceBtn.id = 'masterAIToggle';
    aiAssistanceBtn.innerHTML = `
      <span class="toggle-text">AI Features ${masterEnabled ? 'ON' : 'OFF'}</span>
      <i class="ti ti-brain${masterEnabled ? '-filled' : ''} ms-1"></i>
    `;
    
    // Update classes and styling
    updateToggleVisualState(masterEnabled);
    
    // Remove existing click handlers and add new one
    aiAssistanceBtn.onclick = null;
    aiAssistanceBtn.removeAttribute('href');
    aiAssistanceBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const currentStatus = getMasterAIStatus();
      setMasterAIStatus(!currentStatus);
    });
    
    console.log('[Fixed AI] AI Assistance button successfully transformed');
    return true;
  }

  function createDedicatedToggle() {
    console.log('[Fixed AI] Creating dedicated AI toggle button');
    
    // Find the header container
    const headerContainer = document.querySelector('.topbar-menu .d-flex:last-child, .navbar-header .d-flex:last-child');
    if (!headerContainer) {
      console.log('[Fixed AI] Header container not found');
      return false;
    }

    // Get current master AI status
    const masterEnabled = getMasterAIStatus();
    
    // Create new toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'fixedAIToggle';
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn me-3 d-lg-flex d-none';
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
    
    // Insert the button into the header
    headerContainer.appendChild(toggleBtn);
    
    console.log('[Fixed AI] Dedicated AI toggle button created successfully');
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
      console.log('[Fixed AI] Initialized default AI settings');
    }
  }

  function injectAIToggle() {
    if (toggleInjected) return;

    // Initialize defaults first
    initializeAIDefaults();
    
    // Try to transform existing button first, then create dedicated if that fails
    const transformSuccess = transformExistingButton();
    
    if (!transformSuccess) {
      console.log('[Fixed AI] Transformation failed, creating dedicated toggle');
      const createSuccess = createDedicatedToggle();
      
      if (!createSuccess) {
        console.log('[Fixed AI] Failed to create dedicated toggle');
        return;
      }
    }
    
    toggleInjected = true;
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
      const toggle = document.getElementById('fixedAIToggle') || document.getElementById('masterAIToggle');
      if (toggle) {
        new bootstrap.Tooltip(toggle);
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
      toggleExists: !!(document.getElementById('fixedAIToggle') || document.getElementById('masterAIToggle'))
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAIToggle);
  } else {
    setTimeout(injectAIToggle, 100);
  }

  // Try injection after delays for dynamic content
  setTimeout(injectAIToggle, 500);
  setTimeout(injectAIToggle, 1000);
  setTimeout(injectAIToggle, 2000);

  // Listen for page changes (for SPAs)
  window.addEventListener('popstate', function() {
    toggleInjected = false;
    setTimeout(injectAIToggle, 200);
  });

  // Expose global functions for debugging and manual control
  window.FixedAI = {
    getStatus: getAIStatus,
    enable: () => setMasterAIStatus(true),
    disable: () => setMasterAIStatus(false),
    toggle: () => setMasterAIStatus(!getMasterAIStatus()),
    inject: injectAIToggle,
    features: AI_FEATURES,
    findButton: findAIAssistanceButton
  };

  console.log('[Fixed AI] Toggle system loaded');
})();
