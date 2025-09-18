/**
 * Figma Messages Interface JavaScript
 * Handles interactive functionality for the messages page
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize Figma Messages functionality
    initFigmaMessages();
    
    function initFigmaMessages() {
        setupPriorityFilters();
        setupContactSelection();
        setupAIAssistance();
        setupMessageInput();
        setupResponsiveHandling();
    }
    
    // Priority Filter Functionality
    function setupPriorityFilters() {
        const filterButtons = document.querySelectorAll('.figma-filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active state from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                
                // Add active state to clicked button
                this.classList.add('active');
                this.setAttribute('aria-pressed', 'true');
                
                // Get selected priority
                const priority = this.getAttribute('data-priority');
                
                // Filter contacts based on priority
                filterContacts(priority);
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
            
            // Keyboard support
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }
    
    // Filter contacts based on priority
    function filterContacts(priority) {
        const contacts = document.querySelectorAll('.figma-contact-item');
        
        contacts.forEach(contact => {
            if (priority === 'all') {
                contact.style.display = 'flex';
            } else {
                const priorityBadge = contact.querySelector('.d-flex[style*="background: rgba"]');
                if (priorityBadge) {
                    const priorityText = priorityBadge.textContent.toLowerCase();
                    if (priorityText.includes(priority)) {
                        contact.style.display = 'flex';
                    } else {
                        contact.style.display = 'none';
                    }
                } else {
                    // Hide contacts without priority badges if not showing all
                    contact.style.display = 'none';
                }
            }
        });
        
        // Add animation effect
        setTimeout(() => {
            contacts.forEach(contact => {
                if (contact.style.display !== 'none') {
                    contact.style.animation = 'messageSlideIn 0.3s ease-out';
                }
            });
        }, 50);
    }
    
    // Contact Selection Functionality
    function setupContactSelection() {
        const contacts = document.querySelectorAll('.figma-contact-item');
        
        contacts.forEach(contact => {
            contact.addEventListener('click', function() {
                // Remove active state from all contacts
                contacts.forEach(c => {
                    c.classList.remove('active', 'bg-light');
                });
                
                // Add active state to clicked contact
                this.classList.add('active', 'bg-light');
                
                // Update chat header with selected contact info
                updateChatHeader(this);
                
                // Add ripple effect
                createRippleEffect(this);
            });
            
            // Keyboard support
            contact.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.click();
                }
            });
            
            // Make contacts focusable
            contact.setAttribute('tabindex', '0');
        });
    }
    
    // Update chat header with selected contact
    function updateChatHeader(contactElement) {
        const contactName = contactElement.querySelector('h6').textContent;
        const contactAvatar = contactElement.querySelector('.avatar img').src;
        
        // Update chat header
        const chatHeader = document.querySelector('.figma-chat-header');
        if (chatHeader) {
            const headerName = chatHeader.querySelector('h6');
            const headerAvatar = chatHeader.querySelector('.avatar img');
            
            if (headerName) headerName.textContent = contactName;
            if (headerAvatar) headerAvatar.src = contactAvatar;
        }
    }
    
    // Create ripple effect for interactions
    function createRippleEffect(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(13, 110, 253, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // AI Assistance Functionality
    function setupAIAssistance() {
        const aiButtons = document.querySelectorAll('.figma-ai-assistance .btn');
        
        aiButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim().toLowerCase();
                
                // Add loading state
                const originalContent = this.innerHTML;
                this.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Loading...';
                this.disabled = true;
                
                // Simulate AI processing
                setTimeout(() => {
                    this.innerHTML = originalContent;
                    this.disabled = false;
                    
                    // Show success feedback
                    showNotification(`AI ${action} completed successfully!`, 'success');
                }, 1500);
            });
        });
    }
    
    // Message Input Functionality
    function setupMessageInput() {
        const messageInput = document.querySelector('.figma-message-input input');
        const sendButton = document.querySelector('.figma-message-input .btn:last-child');
        
        if (messageInput && sendButton) {
            // Handle Enter key
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // Handle send button click
            sendButton.addEventListener('click', sendMessage);
            
            // Auto-resize input on focus
            messageInput.addEventListener('focus', function() {
                this.parentElement.style.boxShadow = '0 0 0 2px rgba(13, 110, 253, 0.25)';
            });
            
            messageInput.addEventListener('blur', function() {
                this.parentElement.style.boxShadow = '';
            });
        }
    }
    
    // Send message functionality
    function sendMessage() {
        const messageInput = document.querySelector('.figma-message-input input');
        const messageText = messageInput.value.trim();
        
        if (messageText) {
            // Add message to chat
            addMessageToChat(messageText, 'sent');
            
            // Clear input
            messageInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate response after delay
            setTimeout(() => {
                hideTypingIndicator();
                addMessageToChat('Message received! This is a demo response.', 'received');
            }, 2000);
        }
    }
    
    // Add message to chat
    function addMessageToChat(text, type) {
        const chatMessages = document.querySelector('.figma-chat-messages');
        const messageTemplate = type === 'sent' ? createSentMessage(text) : createReceivedMessage(text);
        
        chatMessages.appendChild(messageTemplate);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Create sent message element
    function createSentMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'figma-message d-flex align-items-start justify-content-end mb-3';
        messageDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="me-2">
                    <button class="btn btn-sm p-0">
                        <i class="ti ti-dots-vertical" style="color: #0A1B39; font-size: 14px;"></i>
                    </button>
                </div>
                <div class="message-bubble p-3 rounded" style="border-radius: 5px 0 5px 5px; border: 1px solid #E7E8EB; background: #F7F8FA; max-width: 400px;">
                    <p class="mb-0" style="color: #6C7688; font-size: 16px; line-height: 24px;">${text}</p>
                </div>
            </div>
            <div class="avatar ms-2 flex-shrink-0 position-relative">
                <img src="assets/img/users/user-01.jpg" alt="user" class="rounded" style="width: 40px; height: 40px;">
                <div class="position-absolute" style="width: 11px; height: 11px; border-radius: 50%; border: 2px solid #FFF; background: #27AE60; bottom: 0; right: 0;"></div>
            </div>
        `;
        return messageDiv;
    }
    
    // Create received message element
    function createReceivedMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'figma-message d-flex align-items-start mb-3';
        messageDiv.innerHTML = `
            <div class="avatar me-2 flex-shrink-0 position-relative">
                <img src="assets/img/users/user-10.jpg" alt="user" class="rounded" style="width: 40px; height: 40px;">
                <div class="position-absolute" style="width: 11px; height: 11px; border-radius: 50%; border: 2px solid #FFF; background: #27AE60; bottom: 0; right: 0;"></div>
            </div>
            <div class="flex-grow-1">
                <div class="d-flex align-items-center mb-1">
                    <h6 class="fs-14 mb-0 me-2" style="color: #0A1B39;">Mark Smith</h6>
                    <i class="ti ti-point-filled mx-1" style="color: #6C7688; font-size: 14px;"></i>
                    <span style="color: #6C7688; font-size: 14px;">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div class="d-flex align-items-center">
                    <div class="message-bubble p-3 rounded" style="border-radius: 0 5px 5px 5px; border: 1px solid #E7E8EB; background: #FCFDFD; max-width: 400px;">
                        <p class="mb-0" style="color: #6C7688; font-size: 16px; line-height: 24px;">${text}</p>
                    </div>
                    <div class="ms-2">
                        <button class="btn btn-sm p-0">
                            <i class="ti ti-dots-vertical" style="color: #0A1B39; font-size: 14px;"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return messageDiv;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const chatMessages = document.querySelector('.figma-chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'figma-message d-flex align-items-start mb-3';
        typingDiv.innerHTML = `
            <div class="avatar me-2 flex-shrink-0">
                <img src="assets/img/users/user-10.jpg" alt="user" class="rounded" style="width: 40px; height: 40px;">
            </div>
            <div class="message-bubble p-3 rounded" style="border-radius: 0 5px 5px 5px; border: 1px solid #E7E8EB; background: #FCFDFD;">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Responsive handling
    function setupResponsiveHandling() {
        // Handle window resize
        window.addEventListener('resize', debounce(handleResize, 250));
        
        // Initial responsive setup
        handleResize();
    }
    
    // Handle responsive layout changes
    function handleResize() {
        const container = document.querySelector('.figma-messages-container');
        const sidebar = document.querySelector('.figma-sidebar');
        const mainChat = document.querySelector('.figma-main-chat');
        
        if (window.innerWidth <= 767) {
            // Mobile layout
            container.style.flexDirection = 'column';
            sidebar.style.width = '100%';
            sidebar.style.minWidth = '100%';
            sidebar.style.borderRight = 'none';
            sidebar.style.borderBottom = '1px solid #E7E8EB';
        } else {
            // Desktop layout
            container.style.flexDirection = 'row';
            sidebar.style.width = window.innerWidth >= 1200 ? '380px' : '350px';
            sidebar.style.minWidth = window.innerWidth >= 1200 ? '380px' : '350px';
            sidebar.style.borderRight = '1px solid #E7E8EB';
            sidebar.style.borderBottom = 'none';
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
});

// CSS animations for typing indicator and notifications
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .typing-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #6C7688;
        animation: typing 1.4s infinite ease-in-out both;
    }
    
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
        0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes ripple {
        to {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
