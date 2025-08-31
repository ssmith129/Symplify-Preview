# AI Features Technical Integration Guide

## Overview

This guide provides detailed technical instructions for integrating AI features into your Symplify healthcare dashboard. The AI components are built using vanilla JavaScript and can be easily integrated into existing HTML/Bootstrap projects.

## 🛠️ Prerequisites

### Required Dependencies
- **Bootstrap 5.x**: For styling and layout
- **jQuery 3.7+**: For DOM manipulation and events
- **Tabler Icons**: For iconography
- **Modern Browser**: ES6+ support required

### File Dependencies
```
assets/
├── css/
│   ├── bootstrap.min.css           # Required
│   ├── style.css                   # Your main stylesheet
│   └── ai-features.css             # AI components styling
├── js/
│   ├── jquery-3.7.1.min.js        # Required
│   ├── bootstrap.bundle.min.js     # Required
│   └── ai-inbox-triage.js          # AI component logic
└── plugins/
    └── tabler-icons/               # Icon library
```

## 📦 Installation

### Step 1: Include CSS Files
Add to your HTML `<head>` section:

```html
<!-- Bootstrap CSS (if not already included) -->
<link rel="stylesheet" href="assets/css/bootstrap.min.css">

<!-- Main stylesheet -->
<link rel="stylesheet" href="assets/css/style.css">

<!-- AI Features CSS -->
<link rel="stylesheet" href="assets/css/ai-features.css">

<!-- Tabler Icons -->
<link rel="stylesheet" href="assets/plugins/tabler-icons/tabler-icons.min.css">
```

### Step 2: Include JavaScript Files
Add before closing `</body>` tag:

```html
<!-- jQuery -->
<script src="assets/js/jquery-3.7.1.min.js"></script>

<!-- Bootstrap Bundle -->
<script src="assets/js/bootstrap.bundle.min.js"></script>

<!-- AI Inbox Triage Component -->
<script src="assets/js/ai-inbox-triage.js"></script>
```

### Step 3: Add HTML Container
Place where you want the AI Inbox Triage Card to appear:

```html
<!-- AI Inbox Triage Card Container -->
<div id="ai-inbox-triage-container"></div>
```

## 🔧 Component Configuration

### Basic Initialization
The component auto-initializes when the DOM loads. For custom configuration:

```javascript
// Custom initialization with options
document.addEventListener('DOMContentLoaded', function() {
    new AIInboxTriageCard('ai-inbox-triage-container', {
        maxItems: 8,                    // Number of messages to display
        showHeader: true,               // Show/hide card header
        userRole: 'doctor',             // User role: 'admin', 'doctor', 'nurse'
        department: 'Cardiology'        // Department filter
    });
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxItems` | number | 6 | Maximum messages to display |
| `showHeader` | boolean | true | Show card header with title and controls |
| `userRole` | string | 'admin' | User role for role-based filtering |
| `department` | string | 'General' | Department for department-specific messages |

## 🏗️ Component Architecture

### Class Structure
```javascript
class AIInboxTriageCard {
    constructor(containerId, options)
    init()                          // Initialize component
    loadMessages()                  // Load and sort messages
    render()                        // Render complete component
    renderMessagesList()            // Render messages list
    formatTimeAgo(timestamp)        // Format relative time
    getPriorityColor(priority)      // Get priority color class
    getCategoryIcon(category)       // Get category icon
    markAsRead(id)                  // Mark message as read
    setCategoryFilter(category)     // Set filter category
    bindEvents()                    // Bind event handlers
}
```

### Data Structure

#### Message Object
```javascript
{
    id: "unique_id",
    from: "Sender Name",
    subject: "Message Subject",
    preview: "Message preview text...",
    avatar: "path/to/avatar.jpg",
    timestamp: Date,
    isRead: boolean,
    category: "medical|emergency|appointment|administrative|follow-up",
    aiClassification: {
        confidence: 0.95,           // 0-1 scale
        priority: "critical|high|medium|low",
        urgency: 5,                 // 1-5 scale
        actionRequired: boolean,
        estimatedResponseTime: "Within 10 minutes"
    },
    tags: ["tag1", "tag2"],
    attachments: 2                  // Number of attachments
}
```

## 🎨 Styling Customization

### CSS Variables
Define in your main CSS file to customize colors:

```css
:root {
    --ai-primary-color: #0d6efd;
    --ai-success-color: #198754;
    --ai-danger-color: #dc3545;
    --ai-warning-color: #ffc107;
    --ai-info-color: #0dcaf0;
    --ai-card-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

### Priority Color Customization
```css
.priority-critical {
    background-color: var(--ai-danger-color);
    animation: pulse-critical 2s infinite;
}

.priority-high {
    background-color: var(--ai-warning-color);
}

.priority-medium {
    background-color: var(--ai-info-color);
}

.priority-low {
    background-color: var(--ai-success-color);
}
```

### Responsive Breakpoints
```css
/* Mobile adjustments */
@media (max-width: 768px) {
    .ai-inbox-triage-card .message-item {
        padding: 8px !important;
    }
    
    .ai-inbox-triage-card .fs-12 {
        font-size: 11px !important;
    }
}
```

## 🔗 Event Handling

### Available Events
```javascript
// Message click event
document.addEventListener('click', function(e) {
    if (e.target.closest('.message-item')) {
        const messageId = e.target.closest('.message-item').dataset.messageId;
        console.log('Message clicked:', messageId);
    }
});

// Filter change event
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('filter-option')) {
        const filter = e.target.dataset.filter;
        console.log('Filter changed:', filter);
    }
});
```

### Custom Event Handlers
```javascript
// Override default behaviors
const aiTriage = new AIInboxTriageCard('container-id', {
    onMessageClick: function(messageId, messageData) {
        // Custom message click handler
        console.log('Custom handler:', messageId);
    },
    onFilterChange: function(newFilter) {
        // Custom filter change handler
        console.log('Filter changed to:', newFilter);
    }
});
```

## 🔌 API Integration

### Data Source Integration
Replace mock data with real API calls:

```javascript
class AIInboxTriageCard {
    async loadMessages() {
        try {
            // Replace with your API endpoint
            const response = await fetch('/api/messages/triage');
            const messages = await response.json();
            
            this.messages = messages
                .filter(msg => this.categoryFilter === 'all' || msg.category === this.categoryFilter)
                .sort((a, b) => {
                    if (a.aiClassification.urgency !== b.aiClassification.urgency) {
                        return b.aiClassification.urgency - a.aiClassification.urgency;
                    }
                    return b.timestamp.getTime() - a.timestamp.getTime();
                })
                .slice(0, this.options.maxItems);
            
            this.unreadCount = this.messages.filter(m => !m.isRead).length;
        } catch (error) {
            console.error('Failed to load messages:', error);
            // Fallback to mock data
            this.loadMockMessages();
        }
    }
}
```

### Real-time Updates
```javascript
// WebSocket integration for real-time updates
const ws = new WebSocket('wss://your-websocket-server.com');

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'new_message') {
        // Update AI Triage Card with new message
        aiTriageCard.addMessage(data.message);
    }
};
```

## 🧪 Testing

### Unit Testing Setup
```javascript
// Jest test example
describe('AIInboxTriageCard', () => {
    let container;
    let aiTriage;
    
    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
        
        aiTriage = new AIInboxTriageCard('test-container');
    });
    
    afterEach(() => {
        document.body.removeChild(container);
    });
    
    test('should initialize with default options', () => {
        expect(aiTriage.options.maxItems).toBe(6);
        expect(aiTriage.options.showHeader).toBe(true);
    });
    
    test('should filter messages by category', () => {
        aiTriage.setCategoryFilter('emergency');
        expect(aiTriage.categoryFilter).toBe('emergency');
    });
});
```

### Manual Testing Checklist
- [ ] Component renders correctly
- [ ] Messages display with proper priority indicators
- [ ] Filtering works for all categories
- [ ] Mark as read functionality works
- [ ] Responsive design on mobile devices
- [ ] AI classification displays correctly
- [ ] Action buttons function properly

## 🚀 Performance Optimization

### Best Practices
1. **Lazy Loading**: Load messages on demand
2. **Virtual Scrolling**: For large message lists
3. **Debounced Filtering**: Prevent excessive API calls
4. **Caching**: Cache AI classification results

```javascript
// Debounced search implementation
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

const debouncedFilter = debounce((filter) => {
    aiTriage.setCategoryFilter(filter);
}, 300);
```

## 🔍 Troubleshooting

### Common Issues

#### Component Not Rendering
**Problem**: AI Inbox Triage Card doesn't appear
**Solutions**:
- Check if container element exists
- Verify JavaScript files are loaded
- Check browser console for errors
- Ensure DOM is fully loaded

#### Styling Issues
**Problem**: Component looks broken or unstyled
**Solutions**:
- Verify CSS files are included
- Check for CSS conflicts
- Ensure Bootstrap is loaded
- Validate CSS file paths

#### Performance Issues
**Problem**: Component is slow or unresponsive
**Solutions**:
- Reduce maxItems count
- Implement pagination
- Optimize message data structure
- Use requestAnimationFrame for animations

### Debug Mode
Enable debug logging:

```javascript
const aiTriage = new AIInboxTriageCard('container-id', {
    debug: true
});
```

## 📚 Additional Resources

### Related Documentation
- [AI Features Overview](README-AI-Features.md)
- [User Guide](README-AI-Usage.md)
- [Component API Reference](docs/api-reference.md)

### External Dependencies
- [Bootstrap Documentation](https://getbootstrap.com/docs/5.0/)
- [Tabler Icons](https://tabler-icons.io/)
- [jQuery Documentation](https://jquery.com/)

---

*For questions or issues with integration, refer to the troubleshooting section or consult the main AI Features documentation.*
