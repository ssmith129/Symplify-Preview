/**
 * Individual AI Toggles System
 * Creates page-specific AI feature toggles for granular control
 */
(function(){
  'use strict';

  // Configuration for different AI features by page
  const AI_FEATURE_CONFIG = {
    email: {
      name: 'Email AI',
      storageKey: 'ai_email_enabled',
      icon: 'ti-mail',
      description: 'Smart email classification and priority detection',
      selector: '.mails-list',
      pageTitles: ['email'],
      toggleId: 'emailAIToggle'
    },
    calendar: {
      name: 'Calendar AI',
      storageKey: 'ai_calendar_enabled', 
      icon: 'ti-calendar',
      description: 'Intelligent appointment scheduling insights',
      selector: '#calendar',
      pageTitles: ['appointment', 'calendar'],
      toggleId: 'calendarAIToggle'
    },
    chat: {
      name: 'Chat AI',
      storageKey: 'ai_chat_enabled',
      icon: 'ti-message',
      description: 'Enhanced chat filtering and features',
      selector: '.chat-users, .chat-messages',
      pageTitles: ['chat'],
      toggleId: 'chatAIToggle'
    },
    notifications: {
      name: 'Notifications AI',
      storageKey: 'ai_notifications_enabled',
      icon: 'ti-bell',
      description: 'Priority-based notification filtering',
      selector: '.notification-body, .notication-list',
      pageTitles: ['notification'],
      toggleId: 'notificationsAIToggle'
    }
  };

  function getCurrentPageFeature() {
    const title = (document.title || '').toLowerCase();
    const url = window.location.pathname.toLowerCase();
    
    for (const [feature, config] of Object.entries(AI_FEATURE_CONFIG)) {
      // Check if this page should have this feature
      const hasPageTitle = config.pageTitles.some(pageTitle => 
        title.includes(pageTitle) || url.includes(pageTitle)
      );
      const hasElement = document.querySelector(config.selector);
      
      if (hasPageTitle || hasElement) {
        return { feature, config };
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

  function createIndividualToggle(feature, config) {
    const isEnabled = getFeatureStatus(config.storageKey);
    
    // Create toggle container
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'ai-individual-toggle-container position-fixed';
    toggleContainer.style.cssText = `
      top: 80px;
      right: 20px;
      z-index: 1050;
      max-width: 300px;
    `;

    // Create toggle card
    const toggleCard = document.createElement('div');
    toggleCard.className = 'card shadow-lg border-0';
    toggleCard.innerHTML = `
      <div class="card-body p-3">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center">
            <i class="${config.icon} fs-18 text-primary me-2"></i>
            <h6 class="mb-0">${config.name}</h6>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="${config.toggleId}" ${isEnabled ? 'checked' : ''}>
          </div>
        </div>
        <p class="text-muted small mb-2">${config.description}</p>
        <div class="d-flex align-items-center justify-content-between">
          <small class="text-muted">Status:</small>
          <span class="badge bg-${isEnabled ? 'success' : 'secondary'}" id="${config.toggleId}Status">
            ${isEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    `;

    toggleContainer.appendChild(toggleCard);

    // Add click handler
    const checkbox = toggleCard.querySelector(`#${config.toggleId}`);
    const statusBadge = toggleCard.querySelector(`#${config.toggleId}Status`);

    checkbox.addEventListener('change', function() {
      const enabled = this.checked;
      setFeatureStatus(config.storageKey, enabled);
      
      // Update visual status
      statusBadge.textContent = enabled ? 'Active' : 'Inactive';
      statusBadge.className = `badge bg-${enabled ? 'success' : 'secondary'}`;
      
      // Show notification
      showToggleNotification(config.name, enabled);
      
      // Reload page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    });

    // Make it draggable (simple version)
    let isDragging = false;
    let currentX, currentY, initialX, initialY;

    toggleCard.addEventListener('mousedown', initDrag);

    function initDrag(e) {
      if (e.target.closest('.form-check-input')) return; // Don't drag when clicking checkbox
      
      initialX = e.clientX - toggleContainer.offsetLeft;
      initialY = e.clientY - toggleContainer.offsetTop;
      
      if (e.target === toggleCard || e.target.closest('.card-body')) {
        isDragging = true;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
      }
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        toggleContainer.style.left = currentX + 'px';
        toggleContainer.style.top = currentY + 'px';
        toggleContainer.style.right = 'auto';
      }
    }

    function stopDrag() {
      isDragging = false;
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    }

    return toggleContainer;
  }

  function showToggleNotification(featureName, enabled) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${enabled ? 'success' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
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

  function injectIndividualToggle() {
    // Don't inject if master toggle is present and working
    if (document.getElementById('masterAIToggle')) {
      console.log('[Individual AI] Master toggle detected, skipping individual toggle');
      return;
    }

    const pageFeature = getCurrentPageFeature();
    if (!pageFeature) {
      console.log('[Individual AI] No AI features detected for this page');
      return;
    }

    const { feature, config } = pageFeature;
    console.log(`[Individual AI] Creating toggle for ${feature} on this page`);

    // Remove existing toggle if present
    const existing = document.querySelector('.ai-individual-toggle-container');
    if (existing) {
      existing.remove();
    }

    // Create and inject new toggle
    const toggle = createIndividualToggle(feature, config);
    document.body.appendChild(toggle);

    console.log(`[Individual AI] Individual toggle for ${feature} created successfully`);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectIndividualToggle);
  } else {
    setTimeout(injectIndividualToggle, 100);
  }

  // Try injection after delays for dynamic content
  setTimeout(injectIndividualToggle, 500);
  setTimeout(injectIndividualToggle, 1000);

  // Listen for page changes
  window.addEventListener('popstate', function() {
    setTimeout(injectIndividualToggle, 200);
  });

  // Global API for manual control
  window.IndividualAI = {
    inject: injectIndividualToggle,
    getPageFeature: getCurrentPageFeature,
    features: AI_FEATURE_CONFIG
  };

  console.log('[Individual AI] System loaded');
})();
