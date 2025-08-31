/**
 * AI Smart Appointment Scheduling Module
 * Provides intelligent scheduling with AI-powered time suggestions and conflict detection
 */

class SmartAppointmentScheduler {
    constructor(options = {}) {
        this.isSmartMode = true;
        this.selectedPatient = null;
        this.selectedDepartment = null;
        this.selectedDoctor = null;
        this.selectedAppointmentType = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.selectedSmartSlot = null;
        this.isLoading = false;
        this.smartSlots = [];
        this.conflicts = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSmartModeDisplay();
    }

    // Mock data for smart time slots
    getMockSmartSlots() {
        return [
            {
                id: "slot-1",
                time: "10:30 AM",
                date: "Today",
                score: 95,
                confidence: 92,
                availability: "High",
                estimatedDuration: "30 min",
                reasons: [
                    "Doctor's peak performance time",
                    "Low patient traffic period", 
                    "Optimal for consultation type",
                    "High historical success rate"
                ],
                conflicts: [],
                doctorMatch: 98,
                patientPreference: 87,
                departmentLoad: 65
            },
            {
                id: "slot-2", 
                time: "2:00 PM",
                date: "Tomorrow",
                score: 89,
                confidence: 88,
                availability: "Medium",
                estimatedDuration: "45 min",
                reasons: [
                    "Good patient-doctor compatibility",
                    "Adequate preparation time",
                    "Reduced wait time expected"
                ],
                conflicts: ["Minor overlap with lunch break"],
                doctorMatch: 85,
                patientPreference: 92,
                departmentLoad: 78
            },
            {
                id: "slot-3",
                time: "9:00 AM",
                date: "Jan 23",
                score: 86,
                confidence: 90,
                availability: "High",
                estimatedDuration: "30 min", 
                reasons: [
                    "Start of day efficiency",
                    "Doctor freshness optimal",
                    "Lower interruption risk"
                ],
                conflicts: [],
                doctorMatch: 88,
                patientPreference: 75,
                departmentLoad: 55
            },
            {
                id: "slot-4",
                time: "11:15 AM",
                date: "Jan 24",
                score: 82,
                confidence: 85,
                availability: "Medium",
                estimatedDuration: "30 min",
                reasons: [
                    "Good department availability",
                    "Reasonable patient preference match"
                ],
                conflicts: ["Potential equipment conflict"],
                doctorMatch: 78,
                patientPreference: 82,
                departmentLoad: 85
            },
            {
                id: "slot-5",
                time: "4:30 PM",
                date: "Jan 24",
                score: 78,
                confidence: 80,
                availability: "Low",
                estimatedDuration: "45 min",
                reasons: [
                    "Available slot for urgent cases",
                    "Department has capacity"
                ],
                conflicts: ["End of day fatigue factor", "Potential overtime"],
                doctorMatch: 70,
                patientPreference: 65,
                departmentLoad: 90
            }
        ];
    }

    bindEvents() {
        // Smart mode toggle
        const smartModeToggle = document.getElementById('smartModeToggle');
        if (smartModeToggle) {
            smartModeToggle.addEventListener('change', (e) => {
                this.isSmartMode = e.target.checked;
                this.updateSmartModeDisplay();
                if (this.isSmartMode) {
                    this.triggerSmartAnalysis();
                }
            });
        }

        // Form field changes
        const patientSelect = document.getElementById('patientSelect');
        const departmentSelect = document.getElementById('departmentSelect');
        const doctorSelect = document.getElementById('doctorSelect');
        const appointmentTypeSelect = document.getElementById('appointmentTypeSelect');
        const dateInput = document.getElementById('appointmentDate');
        const timeInput = document.getElementById('appointmentTime');

        if (patientSelect) {
            patientSelect.addEventListener('change', (e) => {
                this.selectedPatient = e.target.value;
                this.triggerSmartAnalysis();
            });
        }

        if (departmentSelect) {
            departmentSelect.addEventListener('change', (e) => {
                this.selectedDepartment = e.target.value;
                this.triggerSmartAnalysis();
            });
        }

        if (doctorSelect) {
            doctorSelect.addEventListener('change', (e) => {
                this.selectedDoctor = e.target.value;
                this.triggerSmartAnalysis();
            });
        }

        if (appointmentTypeSelect) {
            appointmentTypeSelect.addEventListener('change', (e) => {
                this.selectedAppointmentType = e.target.value;
                this.triggerSmartAnalysis();
            });
        }

        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                this.selectedDate = e.target.value;
                this.checkForConflicts();
            });
        }

        if (timeInput) {
            timeInput.addEventListener('change', (e) => {
                this.selectedTime = e.target.value;
                this.checkForConflicts();
            });
        }
    }

    updateSmartModeDisplay() {
        const smartPanel = document.getElementById('smartSuggestionsPanel');
        const mainForm = document.getElementById('mainFormColumn');
        
        if (smartPanel && mainForm) {
            if (this.isSmartMode) {
                smartPanel.style.display = 'block';
                mainForm.className = 'col-lg-8';
            } else {
                smartPanel.style.display = 'none';
                mainForm.className = 'col-lg-12';
            }
        }

        // Update field labels
        this.updateFieldLabels();
    }

    updateFieldLabels() {
        const dateLabel = document.querySelector('label[for="appointmentDate"]');
        const timeLabel = document.querySelector('label[for="appointmentTime"]');
        
        if (dateLabel) {
            const aiBadge = dateLabel.querySelector('.ai-badge');
            if (this.isSmartMode && !aiBadge) {
                const badge = document.createElement('span');
                badge.className = 'badge badge-soft-info ms-2 fs-10 ai-badge';
                badge.innerHTML = '<i class="ti ti-robot me-1"></i>AI Enhanced';
                dateLabel.appendChild(badge);
            } else if (!this.isSmartMode && aiBadge) {
                aiBadge.remove();
            }
        }

        if (timeLabel) {
            const aiBadge = timeLabel.querySelector('.ai-badge');
            if (this.isSmartMode && !aiBadge) {
                const badge = document.createElement('span');
                badge.className = 'badge badge-soft-info ms-2 fs-10 ai-badge';
                badge.innerHTML = '<i class="ti ti-robot me-1"></i>Smart Suggestions Available';
                timeLabel.appendChild(badge);
            } else if (!this.isSmartMode && aiBadge) {
                aiBadge.remove();
            }
        }
    }

    triggerSmartAnalysis() {
        if (!this.isSmartMode || !this.selectedPatient || !this.selectedDepartment || !this.selectedDoctor) {
            this.renderEmptyState();
            return;
        }
        
        this.setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            this.smartSlots = this.getMockSmartSlots();
            this.renderSmartSlots();
            this.setLoading(false);
        }, 1000);
    }

    setLoading(loading) {
        this.isLoading = loading;
        const loadingState = document.getElementById('loadingState');
        const suggestionsContent = document.getElementById('suggestionsContent');
        
        if (loadingState && suggestionsContent) {
            if (loading) {
                loadingState.style.display = 'block';
                suggestionsContent.style.display = 'none';
            } else {
                loadingState.style.display = 'none';
                suggestionsContent.style.display = 'block';
            }
        }
    }

    renderEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const suggestionsContent = document.getElementById('suggestionsContent');
        const loadingState = document.getElementById('loadingState');
        
        if (emptyState && suggestionsContent && loadingState) {
            emptyState.style.display = 'block';
            suggestionsContent.style.display = 'none';
            loadingState.style.display = 'none';
        }
    }

    renderSmartSlots() {
        const slotsList = document.getElementById('smartSlotsList');
        if (!slotsList) return;

        slotsList.innerHTML = this.smartSlots.map(slot => this.renderSlotItem(slot)).join('');
        
        // Bind click events for slots
        slotsList.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const slotId = item.getAttribute('data-slot-id');
                this.handleSmartSlotSelect(slotId);
            });
        });

        // Update AI insights
        this.renderAIInsights();
    }

    renderSlotItem(slot) {
        const scoreColor = this.getScoreColor(slot.score);
        const availabilityColor = this.getAvailabilityColor(slot.availability);
        const isSelected = this.selectedSmartSlot === slot.id;

        return `
            <div class="suggestion-item p-3 border-bottom cursor-pointer ${isSelected ? 'bg-primary-transparent border-primary' : ''}" 
                 data-slot-id="${slot.id}">
                <div class="d-flex align-items-start justify-content-between mb-2">
                    <div class="time-info">
                        <h6 class="mb-0 fw-bold text-primary">${slot.time}</h6>
                        <small class="text-muted">${slot.date}</small>
                    </div>
                    <div class="score-info text-end">
                        <span class="badge badge-soft-${scoreColor} mb-1">
                            Score: ${slot.score}
                        </span>
                        <div class="d-flex align-items-center">
                            <small class="text-muted me-1">Confidence:</small>
                            <span class="fw-bold fs-12">${slot.confidence}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="slot-metrics mb-2">
                    <div class="row g-2 text-center">
                        <div class="col-4">
                            <div class="metric-card">
                                <div class="metric-value text-success fs-12 fw-bold">
                                    ${slot.doctorMatch}%
                                </div>
                                <small class="metric-label text-muted">Doctor Match</small>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="metric-card">
                                <div class="metric-value text-info fs-12 fw-bold">
                                    ${slot.patientPreference}%
                                </div>
                                <small class="metric-label text-muted">Patient Pref</small>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="metric-card">
                                <div class="metric-value text-${slot.departmentLoad > 80 ? 'warning' : 'success'} fs-12 fw-bold">
                                    ${slot.departmentLoad}%
                                </div>
                                <small class="metric-label text-muted">Dept Load</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="slot-details">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span class="badge badge-soft-${availabilityColor} fs-10">
                            <i class="ti ti-clock me-1"></i>
                            ${slot.availability} Availability
                        </span>
                        <small class="text-muted">
                            <i class="ti ti-clock-hour-4 me-1"></i>
                            ${slot.estimatedDuration}
                        </small>
                    </div>
                    
                    <div class="reasons">
                        <small class="fw-medium text-muted d-block mb-1">Why this works:</small>
                        <ul class="list-unstyled mb-0">
                            ${slot.reasons.slice(0, 2).map(reason => `
                                <li class="d-flex align-items-start">
                                    <i class="ti ti-check text-success me-2 fs-10 mt-1"></i>
                                    <span class="fs-12 text-muted">${reason}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    ${slot.conflicts.length > 0 ? `
                        <div class="conflicts mt-2">
                            <small class="fw-medium text-warning d-block mb-1">
                                <i class="ti ti-alert-triangle me-1"></i>
                                Minor Issues:
                            </small>
                            <ul class="list-unstyled mb-0">
                                ${slot.conflicts.map(conflict => `
                                    <li class="d-flex align-items-start">
                                        <i class="ti ti-info-circle text-warning me-2 fs-10 mt-1"></i>
                                        <span class="fs-12 text-muted">${conflict}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                
                <div class="slot-actions mt-3">
                    <button class="btn btn-sm w-100 ${isSelected ? 'btn-primary' : 'btn-outline-primary'}" 
                            onclick="event.stopPropagation();">
                        <i class="ti ${isSelected ? 'ti-check' : 'ti-calendar-plus'} me-1"></i>
                        ${isSelected ? 'Selected' : 'Select This Time'}
                    </button>
                </div>
            </div>
        `;
    }

    renderAIInsights() {
        const insightsContainer = document.getElementById('aiInsights');
        if (!insightsContainer) return;

        const insights = [
            {
                icon: 'ti-trending-up',
                color: 'success',
                title: 'Peak Performance',
                description: 'Dr. Smith performs best during 10-11 AM slots (95% success rate)'
            },
            {
                icon: 'ti-user-check',
                color: 'info',
                title: 'Patient Preference',
                description: 'Similar patients prefer afternoon appointments (78% satisfaction)'
            },
            {
                icon: 'ti-clock',
                color: 'warning',
                title: 'Wait Time',
                description: 'Booking 10:30 AM reduces average wait time by 12 minutes'
            }
        ];

        insightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item d-flex align-items-start mb-2">
                <i class="ti ${insight.icon} text-${insight.color} me-2 mt-1"></i>
                <div>
                    <small class="fw-medium">${insight.title}</small>
                    <p class="fs-12 text-muted mb-0">${insight.description}</p>
                </div>
            </div>
        `).join('');
    }

    handleSmartSlotSelect(slotId) {
        const slot = this.smartSlots.find(s => s.id === slotId);
        if (!slot) return;

        this.selectedSmartSlot = slotId;
        
        // Update form fields
        const timeInput = document.getElementById('appointmentTime');
        if (timeInput) {
            timeInput.value = slot.time;
        }

        // Update date based on slot date
        const dateInput = document.getElementById('appointmentDate');
        if (dateInput) {
            const today = new Date();
            let targetDate = today;
            
            if (slot.date === 'Tomorrow') {
                targetDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            } else if (slot.date.includes('Jan')) {
                // Parse date like "Jan 23"
                const day = parseInt(slot.date.split(' ')[1]);
                targetDate = new Date(today.getFullYear(), 0, day); // January is month 0
            }
            
            const formatDate = targetDate.toISOString().split('T')[0];
            dateInput.value = formatDate;
        }

        // Re-render slots to show selection
        this.renderSmartSlots();
    }

    checkForConflicts() {
        if (!this.selectedDate || !this.selectedTime) {
            this.renderConflicts([]);
            return;
        }

        const mockConflicts = [];
        
        // Parse time (simple check for demonstration)
        const timeStr = this.selectedTime.toLowerCase();
        const hour = this.parseTimeToHour(timeStr);
        
        if (hour < 8 || hour > 17) {
            mockConflicts.push({
                type: 'scheduling',
                severity: 'medium',
                message: 'Selected time is outside normal business hours',
                suggestions: [
                    'Consider 10:30 AM slot (95% optimal)',
                    'Try 2:00 PM tomorrow (89% optimal)'
                ]
            });
        }
        
        if (hour >= 12 && hour <= 13) {
            mockConflicts.push({
                type: 'doctor',
                severity: 'high',
                message: 'Doctor typically takes lunch break during this time',
                suggestions: [
                    'Book at 11:15 AM instead',
                    'Schedule for 2:00 PM or later'
                ]
            });
        }
        
        this.conflicts = mockConflicts;
        this.renderConflicts(mockConflicts);
    }

    parseTimeToHour(timeStr) {
        // Simple time parsing - in real app would use proper date library
        const matches = timeStr.match(/(\d+):?(\d*)\s*(am|pm)?/i);
        if (!matches) return 0;
        
        let hour = parseInt(matches[1]);
        const ampm = matches[3];
        
        if (ampm && ampm.toLowerCase() === 'pm' && hour !== 12) {
            hour += 12;
        } else if (ampm && ampm.toLowerCase() === 'am' && hour === 12) {
            hour = 0;
        }
        
        return hour;
    }

    renderConflicts(conflicts) {
        const conflictsContainer = document.getElementById('conflictWarnings');
        if (!conflictsContainer) return;

        if (conflicts.length === 0) {
            conflictsContainer.innerHTML = '';
            return;
        }

        conflictsContainer.innerHTML = conflicts.map(conflict => `
            <div class="alert alert-${this.getSeverityColor(conflict.severity)} border-start border-${this.getSeverityColor(conflict.severity)} border-3">
                <div class="d-flex align-items-start">
                    <div class="me-3">
                        <i class="ti ti-alert-triangle text-${this.getSeverityColor(conflict.severity)} fs-18"></i>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1 fw-bold">
                            ${conflict.type.charAt(0).toUpperCase() + conflict.type.slice(1)} Conflict Detected
                        </h6>
                        <p class="mb-2">${conflict.message}</p>
                        ${conflict.suggestions.length > 0 ? `
                            <div class="suggestions">
                                <small class="fw-medium text-muted">Suggestions:</small>
                                <ul class="list-unstyled mb-0 mt-1">
                                    ${conflict.suggestions.map(suggestion => `
                                        <li class="d-flex align-items-center">
                                            <i class="ti ti-arrow-right text-muted me-2 fs-12"></i>
                                            <span class="fs-13">${suggestion}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    getScoreColor(score) {
        if (score >= 90) return 'success';
        if (score >= 80) return 'primary'; 
        if (score >= 70) return 'warning';
        return 'danger';
    }

    getAvailabilityColor(availability) {
        switch (availability) {
            case 'High': return 'success';
            case 'Medium': return 'warning';
            case 'Low': return 'danger';
            default: return 'secondary';
        }
    }

    getSeverityColor(severity) {
        switch (severity) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'secondary';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on smart appointment page
    if (document.getElementById('smartAppointmentForm')) {
        window.smartScheduler = new SmartAppointmentScheduler();
    }
});
