/* AI Appointment Calendar Insights: adds scheduling insights below FullCalendar */
(function(){
  function renderInsights(target){
    const wrap = document.createElement('div');
    wrap.id = 'ai-calendar-insights';
    wrap.className = 'mt-3';

    const recommendedSlots = [
      { time: 'Tomorrow 09:00 - 09:30', reason: 'Low overlap, high availability', score: 92 },
      { time: 'Fri 14:00 - 14:30', reason: 'Optimized for follow-ups', score: 88 },
      { time: 'Mon 11:30 - 12:00', reason: 'Doctor availability matched', score: 84 }
    ];
    const risks = [
      { label: 'No-show Risk', value: 6, unit: '%', color: 'warning' },
      { label: 'Overbook Risk', value: 2, unit: '%', color: 'danger' },
      { label: 'Utilization', value: 78, unit: '%', color: 'success' }
    ];

    const slotHtml = recommendedSlots.map(s => (
      '<li class="list-group-item d-flex align-items-start">\
         <span class="avatar bg-success-transparent text-success me-2"><i class="ti ti-calendar-check"></i></span>\
         <div class="flex-fill">\
           <div class="d-flex align-items-center justify-content-between">\
             <span class="fw-semibold">'+s.time+'</span>\
             <span class="badge bg-info-transparent text-info">Score '+s.score+'%</span>\
           </div>\
           <small class="text-muted">'+s.reason+'</small>\
         </div>\
       </li>'
    )).join('');

    const riskHtml = risks.map(r => (
      '<div class="col-4 text-center">\
         <p class="mb-0 fw-bold text-'+r.color+'">'+r.value+ r.unit+'</p>\
         <small class="text-muted">'+r.label+'</small>\
       </div>'
    )).join('');

    wrap.innerHTML = '\
      <div class="card">\
        <div class="card-header d-flex align-items-center justify-content-between">\
          <div class="d-flex align-items-center">\
            <h6 class="mb-0 me-2">AI Scheduling Insights</h6>\
            <span class="badge bg-info-transparent text-info d-inline-flex align-items-center"><i class="ti ti-robot me-1"></i>Active</span>\
          </div>\
          <small class="text-muted">Auto-optimized suggestions</small>\
        </div>\
        <div class="card-body">\
          <div class="row g-2 mb-2">'+riskHtml+'\
          </div>\
          <ul class="list-group list-group-flush">'+slotHtml+'</ul>\
        </div>\
      </div>';

    target.parentNode && target.parentNode.appendChild(wrap);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var cal = document.getElementById('calendar');
    if (cal && !document.getElementById('ai-calendar-insights')){
      renderInsights(cal);
    }
  });
})();
