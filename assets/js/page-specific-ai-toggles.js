/**
 * Page-Specific AI Toggle System
 * Removes global "AI Assistance" button and replaces with page-specific AI toggles
 */
(function(){
  'use strict';

  // Page-specific AI feature configurations
  const PAGE_AI_CONFIGS = {
    email: {
      pages: ['email.html'],
      feature: {
        name: 'Email AI',
        storageKey: 'ai_email_enabled',
        icon: 'ti-mail',
        description: 'Smart email classification and priority detection',
        color: 'primary'
      }
    },
    calendar: {
      pages: ['calendar.html', 'appointment-calendar.html', 'appointments.html', 'appointment-consultations.html'],
      feature: {
        name: 'Calendar AI',
        storageKey: 'ai_calendar_enabled',
        icon: 'ti-calendar',
        description: 'Intelligent appointment scheduling insights',
        color: 'success'
      }
    },
    chat: {
      pages: ['chat.html', 'messages.html'],
      feature: {
        name: 'Chat AI',
        storageKey: 'ai_chat_enabled',
        icon: 'ti-message',
        description: 'Enhanced chat filtering and smart features',
        color: 'warning'
      }
    },
    notifications: {
      pages: ['notifications.html', 'doctors-notifications.html', 'patient-notifications.html'],
      feature: {
        name: 'Notifications AI',
        storageKey: 'ai_notifications_enabled',
        icon: 'ti-bell',
        description: 'Priority-based notification filtering',
        color: 'info'
      }
    }
  };

  function getCurrentPageConfig() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    for (const [configKey, config] of Object.entries(PAGE_AI_CONFIGS)) {
      if (config.pages.includes(currentPage)) {
        return { configKey, config };
      }
    }
    return null;
  }

  function getFeatureStatus(storageKey, defaultValue = true) {
    const stored = localStorage.getItem(storageKey);
    return stored === null ? defaultValue : stored === '1';
  }

  function setFeatureStatus(storageKey, enabled) {
    localStorage.setItem(storageKey, enabled ? '1' : '0');
    
    // Dispatch event for other scripts
    window.dispatchEvent(new CustomEvent('aiFeatureToggle', {
      detail: { feature: storageKey, enabled }
    }));
  }

  function removeGlobalAIButton() {
    // Find and remove all instances of the AI Assistance button
    const aiButtons = document.querySelectorAll('a.btn-liner-gradient');
    let removedCount = 0;
    
    aiButtons.forEach(btn => {
      if (btn.textContent.includes('AI Assistance')) {
        console.log('[Page AI] Removing global AI Assistance button');
        btn.remove();
        removedCount++;
      }
    });
    
    return removedCount;
  }

  function createPageSpecificToggle(configKey, config) {
    const feature = config.feature;
    const isEnabled = getFeatureStatus(feature.storageKey);
    
    // Find the header container
    const headerContainer = document.querySelector('.topbar-menu .d-flex:last-child, .navbar-header .d-flex:last-child');
    if (!headerContainer) {
      console.log('[Page AI] Header container not found');
      return false;
    }

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = `${configKey}AIToggle`;
    toggleBtn.type = 'button';
    toggleBtn.className = `btn me-3 d-lg-flex d-none page-ai-toggle`;
    toggleBtn.setAttribute('data-feature', configKey);
    toggleBtn.setAttribute('title', `Toggle ${feature.name}`);
    
    // Set initial state
    updateToggleState(toggleBtn, feature, isEnabled);
    
    // Add click event listener
    toggleBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const currentStatus = getFeatureStatus(feature.storageKey);
      const newStatus = !currentStatus;
      
      setFeatureStatus(feature.storageKey, newStatus);
      updateToggleState(toggleBtn, feature, newStatus);
      showToggleNotification(feature.name, newStatus);
      
      // Reload page after delay to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });
    
    // Insert the button into the header
    headerContainer.appendChild(toggleBtn);
    
    console.log(`[Page AI] Created ${feature.name} toggle for this page`);
    return true;
  }

  function updateToggleState(toggleBtn, feature, enabled) {
    const iconClass = feature.icon;
    const colorClass = feature.color;

    if (enabled) {
      toggleBtn.className = `btn btn-${colorClass} me-3 d-flex page-ai-toggle ai-enabled`;
      toggleBtn.style.cssText = `
        min-width: 140px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        z-index: 1000;
        position: relative;
      `;
      toggleBtn.innerHTML = `
        <i class="${iconClass} me-2"></i>
        <span class="toggle-text">${feature.name} ON</span>
      `;
      toggleBtn.setAttribute('title', `${feature.description} (Click to disable)`);
    } else {
      toggleBtn.className = `btn btn-outline-${colorClass} me-3 d-flex page-ai-toggle ai-disabled`;
      toggleBtn.style.cssText = `
        min-width: 140px;
        font-weight: 600;
        border-width: 2px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 1000;
        position: relative;
      `;
      toggleBtn.innerHTML = `
        <i class="${iconClass} me-2"></i>
        <span class="toggle-text">${feature.name} OFF</span>
      `;
      toggleBtn.setAttribute('title', `${feature.description} (Click to enable)`);
    }
  }

  function showToggleNotification(featureName, enabled) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${enabled ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 9999;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border: none;
      border-radius: 12px;
    `;
    
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="ti ti-${enabled ? 'check' : 'x'} fs-20 me-2"></i>
        <div class="flex-grow-1">
          <div class="fw-bold">${featureName} ${enabled ? 'Enabled' : 'Disabled'}</div>
          <div class="small">Page will reload to apply changes...</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
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

  let initialized = false;

  function initializePageSpecificToggles() {
    if (initialized) {
      console.log('[Page AI] Already initialized, skipping...');
      return;
    }

    console.log('[Page AI] Initializing page-specific AI toggles...');

    // Remove global AI Assistance button
    const removedCount = removeGlobalAIButton();
    if (removedCount > 0) {
      console.log(`[Page AI] Removed ${removedCount} global AI Assistance button(s)`);
    }

    // Check if this page should have a specific AI toggle
    const pageConfig = getCurrentPageConfig();
    if (pageConfig) {
      const { configKey, config } = pageConfig;

      // Check if toggle already exists
      if (document.getElementById(`${configKey}AIToggle`)) {
        console.log('[Page AI] Toggle already exists, skipping creation');
        initialized = true;
        return;
      }

      console.log(`[Page AI] Current page needs ${config.feature.name} toggle`);

      // Set default if not set
      if (localStorage.getItem(config.feature.storageKey) === null) {
        localStorage.setItem(config.feature.storageKey, '1');
        console.log(`[Page AI] Initialized ${config.feature.name} as enabled`);
      }

      // Create the page-specific toggle
      createPageSpecificToggle(configKey, config);
      initialized = true;
    } else {
      console.log('[Page AI] No AI features available for this page');
      initialized = true;
    }
  }

  // Status check function for debugging
  function getPageAIStatus() {
    const pageConfig = getCurrentPageConfig();
    if (!pageConfig) return { hasAI: false };
    
    const { configKey, config } = pageConfig;
    const feature = config.feature;
    const stored = localStorage.getItem(feature.storageKey);
    const enabled = stored === null ? true : stored === '1';
    
    return {
      hasAI: true,
      page: window.location.pathname.split('/').pop(),
      feature: configKey,
      featureName: feature.name,
      enabled: enabled,
      stored: stored,
      toggleExists: !!document.getElementById(`${configKey}AIToggle`)
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePageSpecificToggles);
  } else {
    setTimeout(initializePageSpecificToggles, 100);
  }

  // Listen for page changes (for SPAs)
  window.addEventListener('popstate', function() {
    initialized = false;
    setTimeout(initializePageSpecificToggles, 200);
  });

  // Expose global API for debugging and manual control
  window.PageAI = {
    getStatus: getPageAIStatus,
    getCurrentConfig: getCurrentPageConfig,
    configs: PAGE_AI_CONFIGS,
    reinitialize: function() {
      initialized = false;
      initializePageSpecificToggles();
    }
  };

  console.log('[Page AI] Page-specific toggle system loaded');
})();
