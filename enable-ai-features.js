// Quick script to enable all AI features
console.log('🤖 Enabling AI Features...');

// Enable Email AI
localStorage.setItem('ai_email_enabled', '1');
console.log('✅ Email AI enabled');

// Enable Calendar AI (if needed)
localStorage.setItem('ai_calendar_enabled', '1');
console.log('✅ Calendar AI enabled');

// Enable Chat AI (if needed) 
localStorage.setItem('ai_chat_enabled', '1');
console.log('✅ Chat AI enabled');

// Enable Notifications AI (if needed)
localStorage.setItem('ai_notifications_enabled', '1');
console.log('✅ Notifications AI enabled');

console.log('🎉 All AI features enabled! Reload the page to see changes.');
console.log('📧 Visit email.html to see Email AI features');
console.log('📅 Visit appointment-calendar.html to see Calendar AI');
console.log('💬 Visit chat.html to see Chat AI features');

// Auto-reload after 2 seconds
setTimeout(() => {
    console.log('🔄 Reloading page...');
    location.reload();
}, 2000);
