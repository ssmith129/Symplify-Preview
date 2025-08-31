/**
 * AI Inbox Triage Card Component
 * Provides AI-powered message classification and triage functionality
 */

class AIInboxTriageCard {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            maxItems: options.maxItems || 6,
            showHeader: options.showHeader !== false,
            userRole: options.userRole || 'admin',
            department: options.department || 'General',
            ...options
        };
        
        this.messages = [];
        this.unreadCount = 0;
        this.categoryFilter = 'all';
        
        // Mock messages with AI classification
        this.mockMessages = [
            {
                id: "1",
                from: "Dr. Sarah Chen",
                subject: "Emergency Patient Consultation Required",
                preview: "Need immediate consultation for patient with severe chest pain and irregular ECG readings...",
                avatar: "assets/img/doctors/doctor-02.jpg",
                timestamp: new Date(Date.now() - 5 * 60 * 1000),
                isRead: false,
                category: "emergency",
                aiClassification: {
                    confidence: 0.95,
                    priority: "critical",
                    urgency: 5,
                    actionRequired: true,
                    estimatedResponseTime: "Within 10 minutes"
                },
                tags: ["urgent", "cardiology", "icu"],
                attachments: 2
            },
            {
                id: "2",
                from: "Lab Department",
                subject: "Critical Lab Results - Patient ID: 12847",
                preview: "Abnormal blood work results requiring immediate physician review and patient contact...",
                avatar: "assets/img/users/user-09.jpg",
                timestamp: new Date(Date.now() - 12 * 60 * 1000),
                isRead: false,
                category: "medical",
                aiClassification: {
                    confidence: 0.92,
                    priority: "critical",
                    urgency: 5,
                    actionRequired: true,
                    estimatedResponseTime: "Within 30 minutes"
                },
                tags: ["lab-results", "critical", "follow-up"],
                attachments: 1
            },
            {
                id: "3",
                from: "Emily Johnson",
                subject: "Appointment Rescheduling Request",
                preview: "Due to a family emergency, I need to reschedule my appointment from tomorrow to next week...",
                avatar: "assets/img/profiles/avatar-14.jpg",
                timestamp: new Date(Date.now() - 25 * 60 * 1000),
                isRead: false,
                category: "appointment",
                aiClassification: {
                    confidence: 0.88,
                    priority: "medium",
                    urgency: 3,
                    actionRequired: true,
                    estimatedResponseTime: "Within 2 hours"
                },
                tags: ["appointment", "reschedule", "patient-request"]
            },
            {
                id: "4",
                from: "Administration",
                subject: "Policy Update: New COVID-19 Protocols",
                preview: "Updated guidelines for patient screening and safety protocols effective immediately...",
                avatar: "assets/img/users/user-12.jpg",
                timestamp: new Date(Date.now() - 45 * 60 * 1000),
                isRead: true,
                category: "administrative",
                aiClassification: {
                    confidence: 0.85,
                    priority: "medium",
                    urgency: 3,
                    actionRequired: false,
                    estimatedResponseTime: "Within 1 day"
                },
                tags: ["policy", "covid", "protocols"],
                attachments: 3
            },
            {
                id: "5",
                from: "Dr. Michael Roberts",
                subject: "Post-Surgery Follow-up Report",
                preview: "Patient recovery is proceeding as expected. Vital signs stable, no complications observed...",
                avatar: "assets/img/doctors/doctor-07.jpg",
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                isRead: true,
                category: "follow-up",
                aiClassification: {
                    confidence: 0.90,
                    priority: "low",
                    urgency: 2,
                    actionRequired: false,
                    estimatedResponseTime: "Within 24 hours"
                },
                tags: ["surgery", "follow-up", "recovery"]
            },
            {
                id: "6",
                from: "Insurance Department",
                subject: "Pre-authorization Approval - Patient Martinez",
                preview: "Pre-authorization for MRI scan has been approved. Patient can proceed with scheduling...",
                avatar: "assets/img/users/user-05.jpg",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                isRead: false,
                category: "administrative",
                aiClassification: {
                    confidence: 0.82,
                    priority: "medium",
                    urgency: 3,
                    actionRequired: true,
                    estimatedResponseTime: "Within 4 hours"
                },
                tags: ["insurance", "pre-auth", "radiology"]
            }
        ];
        
        this.init();
    }
    
    init() {
        this.loadMessages();
        this.render();
        this.bindEvents();
    }
    
    loadMessages() {
        // Sort by AI urgency and priority
        const filteredMessages = this.mockMessages
            .filter(msg => this.categoryFilter === 'all' || msg.category === this.categoryFilter)
            .sort((a, b) => {
                // First sort by urgency (higher first)
                if (a.aiClassification.urgency !== b.aiClassification.urgency) {
                    return b.aiClassification.urgency - a.aiClassification.urgency;
                }
                // Then by timestamp (newer first)
                return b.timestamp.getTime() - a.timestamp.getTime();
            })
            .slice(0, this.options.maxItems);
        
        this.messages = filteredMessages;
        this.unreadCount = filteredMessages.filter(m => !m.isRead).length;
    }
    
    formatTimeAgo(timestamp) {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
    
    getPriorityColor(priority) {
        switch (priority) {
            case 'critical': return 'danger';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'success';
            default: return 'secondary';
        }
    }
    
    getPriorityIcon(priority) {
        switch (priority) {
            case 'critical': return 'ti ti-alert-triangle-filled';
            case 'high': return 'ti ti-exclamation-circle';
            case 'medium': return 'ti ti-info-circle';
            case 'low': return 'ti ti-check-circle';
            default: return 'ti ti-circle';
        }
    }
    
    getCategoryIcon(category) {
        switch (category) {
            case 'medical': return 'ti ti-stethoscope';
            case 'emergency': return 'ti ti-emergency-bed';
            case 'appointment': return 'ti ti-calendar';
            case 'administrative': return 'ti ti-file-text';
            case 'follow-up': return 'ti ti-user-check';
            default: return 'ti ti-mail';
        }
    }
    
    markAsRead(id) {
        const messageIndex = this.messages.findIndex(m => m.id === id);
        if (messageIndex !== -1 && !this.messages[messageIndex].isRead) {
            this.messages[messageIndex].isRead = true;
            this.unreadCount = Math.max(0, this.unreadCount - 1);
            this.updateUnreadBadge();
        }
    }
    
    updateUnreadBadge() {
        const badge = document.querySelector(`#${this.containerId} .unread-badge`);
        if (badge) {
            if (this.unreadCount > 0) {
                badge.textContent = this.unreadCount;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    setCategoryFilter(category) {
        this.categoryFilter = category;
        this.loadMessages();
        this.renderMessages();
    }
    
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }
        
        const criticalCount = this.messages.filter(m => m.aiClassification.priority === 'critical').length;
        const actionRequiredCount = this.messages.filter(m => m.aiClassification.actionRequired).length;
        
        container.innerHTML = `
            <div class="col-xl-4 col-lg-6 d-flex">
                <div class="card shadow-sm flex-fill w-100">
                    ${this.options.showHeader ? `
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <h5 class="fw-bold mb-0 me-2">AI Inbox Triage</h5>
                            <span class="badge bg-info-transparent text-info fs-10 d-inline-flex align-items-center">
                                <i class="ti ti-brain me-1"></i>
                                Smart Sorting
                            </span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            ${this.unreadCount > 0 ? `<span class="badge bg-primary rounded-pill unread-badge">${this.unreadCount}</span>` : '<span class="badge bg-primary rounded-pill unread-badge" style="display: none;"></span>'}
                            <div class="dropdown">
                                <a href="#" class="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                    Filter <i class="ti ti-chevron-down ms-1"></i>
                                </a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item filter-option" href="#" data-filter="all">All Messages</a></li>
                                    <li><a class="dropdown-item filter-option" href="#" data-filter="emergency">Emergency</a></li>
                                    <li><a class="dropdown-item filter-option" href="#" data-filter="medical">Medical</a></li>
                                    <li><a class="dropdown-item filter-option" href="#" data-filter="appointment">Appointments</a></li>
                                    <li><a class="dropdown-item filter-option" href="#" data-filter="administrative">Administrative</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    ` : ''}

                    <div class="card-body">
                        <!-- AI Triage Summary -->
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <div class="p-2 bg-light rounded-2 text-center">
                                    <h6 class="fw-bold mb-1 text-danger">${criticalCount}</h6>
                                    <p class="mb-0 fs-12 text-muted">Critical Messages</p>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-2 bg-light rounded-2 text-center">
                                    <h6 class="fw-bold mb-1 text-warning">${actionRequiredCount}</h6>
                                    <p class="mb-0 fs-12 text-muted">Need Action</p>
                                </div>
                            </div>
                        </div>

                        <!-- AI Performance Indicator -->
                        <div class="d-flex align-items-center justify-content-between mb-3 p-2 bg-success-transparent rounded-2">
                            <div class="d-flex align-items-center gap-2">
                                <span class="avatar bg-success-transparent text-success rounded-2 fs-14">
                                    <i class="ti ti-robot"></i>
                                </span>
                                <div>
                                    <p class="mb-0 fw-semibold fs-14 text-success">AI Triage Active</p>
                                    <p class="mb-0 fs-11 text-muted">Auto-categorization enabled</p>
                                </div>
                            </div>
                            <div class="text-end">
                                <p class="mb-0 fw-bold text-success fs-14">92%</p>
                                <p class="mb-0 fs-11 text-muted">Accuracy</p>
                            </div>
                        </div>

                        <!-- Messages List -->
                        <div class="inbox-messages" id="messages-container">
                            ${this.renderMessagesList()}
                        </div>

                        <!-- Action Buttons -->
                        <div class="d-flex gap-2 mt-3">
                            <a href="ai-inbox-triage.html" class="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center">
                                <i class="ti ti-inbox me-1"></i>
                                View Full Inbox
                            </a>
                            <a href="#" class="btn btn-outline-primary d-inline-flex align-items-center justify-content-center" style="min-width: 40px;">
                                <i class="ti ti-adjustments"></i>
                            </a>
                        </div>

                        <!-- Quick Stats -->
                        <div class="mt-3 p-2 bg-light rounded-2">
                            <div class="row g-2 text-center">
                                <div class="col-4">
                                    <p class="mb-0 fw-bold fs-14">${this.messages.length}</p>
                                    <p class="mb-0 fs-11 text-muted">Total</p>
                                </div>
                                <div class="col-4">
                                    <p class="mb-0 fw-bold fs-14 text-primary">${this.unreadCount}</p>
                                    <p class="mb-0 fs-11 text-muted">Unread</p>
                                </div>
                                <div class="col-4">
                                    <p class="mb-0 fw-bold fs-14 text-success">
                                        ${Math.round((this.messages.filter(m => m.isRead).length / this.messages.length) * 100) || 0}%
                                    </p>
                                    <p class="mb-0 fs-11 text-muted">Processed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderMessagesList() {
        if (this.messages.length === 0) {
            return `
                <div class="text-center py-4">
                    <i class="ti ti-inbox fs-24 text-muted mb-2"></i>
                    <p class="text-muted mb-0">No messages</p>
                </div>
            `;
        }
        
        return this.messages.map((message, index) => `
            <div class="message-item d-flex align-items-start gap-2 p-2 rounded-2 transition-hover ${
                index < this.messages.length - 1 ? 'border-bottom' : ''
            } ${!message.isRead ? 'bg-soft-primary' : ''}" 
                data-message-id="${message.id}" 
                style="cursor: pointer;">
                
                <!-- Avatar with Priority -->
                <div class="position-relative flex-shrink-0">
                    <div class="avatar avatar-sm">
                        <img src="${message.avatar}" class="rounded-circle" alt="Sender">
                    </div>
                    <!-- Priority Indicator -->
                    <span class="position-absolute top-0 start-100 translate-middle d-flex align-items-center justify-content-center rounded-circle bg-${this.getPriorityColor(message.aiClassification.priority)}" 
                        style="width: 12px; height: 12px; font-size: 8px;" 
                        title="${message.aiClassification.priority} priority">
                        <i class="${this.getPriorityIcon(message.aiClassification.priority)} text-white" style="font-size: 6px;"></i>
                    </span>
                </div>

                <!-- Message Content -->
                <div class="flex-grow-1 min-w-0">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <div class="d-flex align-items-center gap-1">
                            <i class="${this.getCategoryIcon(message.category)} text-${this.getPriorityColor(message.aiClassification.priority)} fs-12"></i>
                            <h6 class="mb-0 fs-12 fw-semibold text-truncate">${message.from}</h6>
                            ${!message.isRead ? '<span class="badge bg-primary rounded-pill" style="width: 5px; height: 5px; padding: 0;"></span>' : ''}
                            ${message.attachments ? `<i class="ti ti-paperclip fs-10 text-muted" title="${message.attachments} attachments"></i>` : ''}
                        </div>
                        <small class="text-muted fs-10">${this.formatTimeAgo(message.timestamp)}</small>
                    </div>
                    
                    <p class="mb-1 fs-12 fw-medium text-truncate">${message.subject}</p>
                    
                    <p class="mb-1 fs-11 text-muted" style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                        ${message.preview}
                    </p>
                    
                    <!-- AI Classification Info -->
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-1">
                            <span class="badge bg-${this.getPriorityColor(message.aiClassification.priority)}-transparent text-${this.getPriorityColor(message.aiClassification.priority)} fs-10">
                                ${message.aiClassification.priority}
                            </span>
                            ${message.aiClassification.actionRequired ? `
                                <span class="badge bg-warning-transparent text-warning fs-10">
                                    <i class="ti ti-clock me-1"></i>
                                    Action Required
                                </span>
                            ` : ''}
                        </div>
                        <div class="text-end">
                            <small class="text-muted fs-10 d-block">
                                AI: ${Math.round(message.aiClassification.confidence * 100)}%
                            </small>
                            <small class="text-muted fs-10">
                                ${message.aiClassification.estimatedResponseTime}
                            </small>
                        </div>
                    </div>

                    <!-- Tags -->
                    ${message.tags.length > 0 ? `
                        <div class="d-flex gap-1 mt-1 flex-wrap">
                            ${message.tags.slice(0, 2).map(tag => `
                                <span class="badge bg-light text-dark fs-10">${tag}</span>
                            `).join('')}
                            ${message.tags.length > 2 ? `
                                <span class="badge bg-light text-muted fs-10">+${message.tags.length - 2}</span>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    renderMessages() {
        const container = document.getElementById('messages-container');
        if (container) {
            container.innerHTML = this.renderMessagesList();
            this.bindMessageEvents();
        }
    }
    
    bindEvents() {
        // Filter dropdown events
        const filterOptions = document.querySelectorAll(`#${this.containerId} .filter-option`);
        filterOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = e.target.getAttribute('data-filter');
                this.setCategoryFilter(filter);
            });
        });
        
        this.bindMessageEvents();
    }
    
    bindMessageEvents() {
        // Message click events
        const messageItems = document.querySelectorAll(`#${this.containerId} .message-item`);
        messageItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const messageId = e.currentTarget.getAttribute('data-message-id');
                this.markAsRead(messageId);
                // Update visual state
                e.currentTarget.classList.remove('bg-soft-primary');
                const unreadBadge = e.currentTarget.querySelector('.badge.bg-primary.rounded-pill');
                if (unreadBadge && unreadBadge.style.width === '5px') {
                    unreadBadge.remove();
                }
            });
        });
    }
}

// Initialize AI Inbox Triage Card when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page that should have the AI Inbox Triage Card
    const aiInboxContainer = document.getElementById('ai-inbox-triage-container');
    if (aiInboxContainer) {
        new AIInboxTriageCard('ai-inbox-triage-container', {
            maxItems: 6,
            showHeader: true,
            userRole: 'admin',
            department: 'General'
        });
    }
});
