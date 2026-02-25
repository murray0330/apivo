/* =============================================
   APPOINTLY AI — Script
   ============================================= */

// ===== Dark / Light Mode =====
const html = document.documentElement;
const STORAGE_KEY = 'appointly-theme';

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

// Init: check storage, then system preference, default to dark
(function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { setTheme(saved); return; }
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
})();

// ===== Tubelight Navbar — Scroll Spy & Indicator =====
const navItems = document.querySelectorAll('.nav-item[data-nav]');
const navIndicator = document.getElementById('nav-indicator');
const navPill = document.getElementById('nav-pill');

// Move the indicator to match the given nav item
function moveIndicator(item) {
  if (!item || !navIndicator || !navPill) return;
  const pillRect = navPill.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  navIndicator.style.left = (itemRect.left - pillRect.left) + 'px';
  navIndicator.style.width = itemRect.width + 'px';
}

// Set active nav item by element
function setActiveNav(item) {
  navItems.forEach(n => n.classList.remove('active'));
  item.classList.add('active');
  moveIndicator(item);
}

// Position indicator on the initially active item once DOM is ready
function initIndicator() {
  const active = document.querySelector('.nav-item.active');
  if (active) moveIndicator(active);
}

// Run on load and resize
window.addEventListener('load', initIndicator);
window.addEventListener('resize', () => {
  const active = document.querySelector('.nav-item.active');
  if (active) moveIndicator(active);
});

// Scroll spy — track which section is in view
const sectionIds = Array.from(navItems).map(a => a.getAttribute('href').slice(1));

function onScroll() {
  const scrollY = window.scrollY + 120;
  let currentId = sectionIds[0];
  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) {
      currentId = id;
    }
  }
  const match = document.querySelector(`.nav-item[href="#${currentId}"]`);
  if (match && !match.classList.contains('active')) {
    setActiveNav(match);
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ===== Scroll Reveal (Intersection Observer) =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach((el) => revealObserver.observe(el));

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Sent! We\'ll be in touch.';
  btn.disabled = true;
  btn.style.opacity = '0.6';
  setTimeout(() => {
    btn.textContent = orig;
    btn.disabled = false;
    btn.style.opacity = '1';
    contactForm.reset();
  }, 3000);
});

// =========================================================
//  Interactive Demo Chatbot
// =========================================================
const chatBody = document.getElementById('chat-body');
const chatOptions = document.getElementById('chat-options');
const restartBtn = document.getElementById('restart-demo');

const demoFlow = [
  {
    id: 'start',
    bot: 'Hi there! Welcome to ABC Dental Clinic. I\'m your AI scheduling assistant. How can I help you today?',
    options: [
      { label: 'Book an appointment', next: 'treatment' },
      { label: 'Ask a question', next: 'question' },
      { label: 'Reschedule', next: 'reschedule' },
    ],
  },
  {
    id: 'treatment',
    user: 'I\'d like to book an appointment',
    bot: 'I\'d be happy to help! What type of treatment are you interested in?',
    options: [
      { label: 'Dental cleaning', next: 'cleaning_history' },
      { label: 'Consultation', next: 'consultation' },
      { label: 'Teeth whitening', next: 'consultation' },
    ],
  },
  {
    id: 'cleaning_history',
    user: 'I need a dental cleaning',
    bot: 'Great choice! When was your last dental cleaning?',
    options: [
      { label: 'About 6 months ago', next: 'pick_time' },
      { label: 'Over a year ago', next: 'pick_time' },
      { label: 'I\'m not sure', next: 'pick_time' },
    ],
  },
  {
    id: 'consultation',
    user: 'I\'d like a consultation',
    bot: 'The next step is a complimentary 30-minute consultation with Dr. Murray Vega. Would you like to schedule one?',
    options: [
      { label: 'Yes, let\'s do it!', next: 'pick_time' },
      { label: 'What does it include?', next: 'consult_info' },
    ],
  },
  {
    id: 'consult_info',
    user: 'What does the consultation include?',
    bot: 'Your complimentary consultation includes a thorough examination, X-rays if needed, and a personalized treatment plan. No obligation. Want to schedule?',
    options: [
      { label: 'Yes, schedule me!', next: 'pick_time' },
    ],
  },
  {
    id: 'pick_time',
    user: 'Yes, let\'s schedule it!',
    bot: 'What day and time works best for you?',
    options: [
      { label: 'Tomorrow at 2 PM', next: 'check_availability' },
      { label: 'Thursday at 10 AM', next: 'check_availability_alt' },
      { label: 'Next Monday afternoon', next: 'check_availability' },
    ],
  },
  {
    id: 'check_availability',
    user: 'Tomorrow at 2:00 PM',
    action: 'calendar_check',
    bot: 'Great news! 2:00 PM tomorrow is available. Can I get your name and email to confirm?',
    options: [
      { label: 'John Smith / john@email.com', next: 'confirm_booking' },
    ],
  },
  {
    id: 'check_availability_alt',
    user: 'Thursday at 10:00 AM',
    action: 'calendar_check',
    bot: '10:00 AM Thursday is already booked. I have 10:30 AM and 1:00 PM available. Which works?',
    options: [
      { label: '10:30 AM works', next: 'confirm_booking_alt' },
      { label: '1:00 PM works', next: 'confirm_booking_alt' },
    ],
  },
  {
    id: 'confirm_booking',
    user: 'John Smith, john@email.com',
    bot: 'To confirm: 30-minute appointment tomorrow at 2:00 PM with Dr. Murray Vega. Shall I book it?',
    options: [
      { label: 'Yes, book it!', next: 'booked' },
    ],
  },
  {
    id: 'confirm_booking_alt',
    user: 'That works for me',
    bot: 'Can I get your name and email to finalize?',
    options: [
      { label: 'John Smith / john@email.com', next: 'confirm_booking_final' },
    ],
  },
  {
    id: 'confirm_booking_final',
    user: 'John Smith, john@email.com',
    bot: 'Let me book that for you...',
    action: 'booking',
    options: [],
  },
  {
    id: 'booked',
    user: 'Yes, book it!',
    action: 'booking',
    options: [],
  },
  {
    id: 'question',
    user: 'I have a question',
    bot: 'Of course! What would you like to know?',
    options: [
      { label: 'What are your hours?', next: 'hours_answer' },
      { label: 'Do you accept insurance?', next: 'insurance_answer' },
      { label: 'Where are you located?', next: 'location_answer' },
    ],
  },
  {
    id: 'hours_answer',
    user: 'What are your hours?',
    action: 'rag_search',
    bot: 'We\'re open Monday through Friday, 8:00 AM to 6:00 PM. Closed weekends. Would you like to book?',
    options: [
      { label: 'Yes, book an appointment', next: 'treatment' },
      { label: 'No thanks!', next: 'goodbye' },
    ],
  },
  {
    id: 'insurance_answer',
    user: 'Do you accept insurance?',
    action: 'rag_search',
    bot: 'Yes! We accept Delta Dental, Cigna, Aetna, MetLife, and more. We also offer payment plans. Want to schedule?',
    options: [
      { label: 'Yes, book an appointment', next: 'treatment' },
      { label: 'That\'s all, thanks!', next: 'goodbye' },
    ],
  },
  {
    id: 'location_answer',
    user: 'Where are you located?',
    action: 'rag_search',
    bot: 'We\'re in the heart of Las Vegas with convenient parking. Want to schedule a visit?',
    options: [
      { label: 'Yes, book an appointment', next: 'treatment' },
      { label: 'Thanks!', next: 'goodbye' },
    ],
  },
  {
    id: 'reschedule',
    user: 'I need to reschedule',
    action: 'calendar_lookup',
    bot: 'I found your upcoming appointment on Wednesday at 3:00 PM. What new time works?',
    options: [
      { label: 'Friday at 11 AM', next: 'reschedule_confirm' },
      { label: 'Next Tuesday at 2 PM', next: 'reschedule_confirm' },
    ],
  },
  {
    id: 'reschedule_confirm',
    user: 'Friday at 11:00 AM',
    action: 'calendar_check',
    bot: 'Friday at 11:00 AM is available! Shall I move your appointment?',
    options: [
      { label: 'Yes, reschedule it', next: 'rescheduled' },
    ],
  },
  {
    id: 'rescheduled',
    user: 'Yes, reschedule it',
    action: 'reschedule_action',
    options: [],
  },
  {
    id: 'goodbye',
    user: 'That\'s all, thanks!',
    bot: 'You\'re welcome! I\'m here 24/7 if you need anything. Have a great day!',
    options: [
      { label: 'Start over', next: 'restart' },
    ],
  },
];

function getStep(id) {
  return demoFlow.find((s) => s.id === id);
}

function addMessage(type, content) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  const label = document.createElement('div');
  label.className = 'msg-label';
  label.textContent = type === 'bot' ? 'Appointly AI' : 'You';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = content;
  msg.appendChild(label);
  msg.appendChild(bubble);
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addCustom(html) {
  const wrapper = document.createElement('div');
  wrapper.className = 'chat-msg bot';
  wrapper.innerHTML = html;
  chatBody.appendChild(wrapper);
  chatBody.scrollTop = chatBody.scrollHeight;
  return wrapper;
}

function showTyping() {
  return addCustom('<div class="msg-label">Appointly AI</div><div class="typing-indicator"><span></span><span></span><span></span></div>');
}

function showCalendarCheck() {
  return addCustom('<div class="msg-label">Appointly AI</div><div class="calendar-check"><div class="calendar-spinner"></div><span>Checking calendar availability...</span></div>');
}

function showRagSearch() {
  return addCustom('<div class="msg-label">Appointly AI</div><div class="calendar-check"><div class="calendar-spinner"></div><span>Searching knowledge base...</span></div>');
}

function showCalendarLookup() {
  return addCustom('<div class="msg-label">Appointly AI</div><div class="calendar-check"><div class="calendar-spinner"></div><span>Looking up your appointment...</span></div>');
}

function showBookingConfirmation() {
  addCustom(`
    <div class="msg-label">Appointly AI</div>
    <div class="demo-booking-confirmation">
      <div class="confirm-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="confirm-text">
        <strong>Appointment Booked!</strong>
        <span>Added to calendar. Confirmation email sent.</span>
        <div class="confirm-details">
          <div><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> Google Calendar updated</div>
          <div><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Confirmation email sent</div>
          <div><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Contact saved to CRM</div>
        </div>
      </div>
    </div>
  `);
}

function showRescheduleConfirmation() {
  addCustom(`
    <div class="msg-label">Appointly AI</div>
    <div class="demo-booking-confirmation">
      <div class="confirm-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="confirm-text">
        <strong>Rescheduled!</strong>
        <span>Your appointment has been moved.</span>
        <div class="confirm-details">
          <div><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Calendar updated</div>
          <div><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Rescheduling email sent</div>
        </div>
      </div>
    </div>
  `);
}

function showOptions(options) {
  chatOptions.innerHTML = '';
  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'chat-option-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => handleOption(opt));
    chatOptions.appendChild(btn);
  });
}

function clearOptions() {
  chatOptions.innerHTML = '';
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function handleOption(option) {
  if (option.next === 'restart') { startDemo(); return; }
  const step = getStep(option.next);
  if (!step) return;
  clearOptions();

  if (step.user) {
    addMessage('user', step.user);
    await delay(400);
  }

  if (step.action === 'calendar_check') {
    const el = showCalendarCheck(); await delay(1600); el.remove();
  } else if (step.action === 'rag_search') {
    const el = showRagSearch(); await delay(1400); el.remove();
  } else if (step.action === 'calendar_lookup') {
    const el = showCalendarLookup(); await delay(1400); el.remove();
  } else if (step.action === 'booking') {
    const t = showTyping(); await delay(1100); t.remove();
    showBookingConfirmation();
    await delay(600);
    showOptions([{ label: 'Try again', next: 'restart' }]);
    return;
  } else if (step.action === 'reschedule_action') {
    const t = showTyping(); await delay(1100); t.remove();
    showRescheduleConfirmation();
    await delay(600);
    showOptions([{ label: 'Try again', next: 'restart' }]);
    return;
  }

  if (step.bot) {
    const t = showTyping();
    await delay(800 + Math.random() * 400);
    t.remove();
    addMessage('bot', step.bot);
  }

  await delay(250);
  showOptions(step.options);
}

async function startDemo() {
  chatBody.innerHTML = '';
  clearOptions();
  await delay(400);
  const step = getStep('start');
  const t = showTyping();
  await delay(1000);
  t.remove();
  addMessage('bot', step.bot);
  await delay(250);
  showOptions(step.options);
}

startDemo();
restartBtn.addEventListener('click', startDemo);

// =========================================================
//  Headless Live Chat — fetches /api/chat serverless proxy
// =========================================================
(function initLiveChat() {
  const launcher = document.getElementById('lc-launcher');
  const win      = document.getElementById('lc-window');
  const closeBtn = document.getElementById('lc-close');
  const body     = document.getElementById('lc-body');
  const input    = document.getElementById('lc-input');
  const sendBtn  = document.getElementById('lc-send');

  if (!launcher || !win) return; // guard if elements absent

  let chatId = null;
  let open   = false;
  let busy   = false;

  // ---- open / close ----
  function toggle() {
    open = !open;
    launcher.classList.toggle('open', open);
    launcher.setAttribute('aria-expanded', String(open));
    win.classList.toggle('open', open);
    win.setAttribute('aria-hidden', String(!open));

    if (open) {
      if (!body.children.length) {
        addMsg('bot', 'Hi! Welcome to ABC Dental Clinic. To get started, are you a new or existing patient?');
        addQuickReplies(['New Patient', 'Existing Patient']);
      }
      setTimeout(() => input.focus(), 320);
    }
  }

  // ---- message helpers ----
  function addMsg(role, text) {
    const row    = document.createElement('div');
    row.className = `lc-msg lc-msg--${role}`;
    const bubble  = document.createElement('div');
    bubble.className = 'lc-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }

  function addQuickReplies(options) {
    const row = document.createElement('div');
    row.className = 'lc-quick-replies';
    options.forEach(function(opt) {
      const btn = document.createElement('button');
      btn.className = 'lc-quick-btn';
      btn.textContent = opt;
      btn.addEventListener('click', function() {
        row.remove();
        input.value = opt;
        send();
      });
      row.appendChild(btn);
    });
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
  }

  // Detect which quick-reply buttons to show based on the bot's response
  function getSuggestedReplies(botText) {
    var t = botText.toLowerCase();

    // Phase 1: Existing patient asked to book/reschedule/cancel
    if ((t.includes('book') || t.includes('schedule')) && t.includes('reschedule') && t.includes('cancel')) {
      return ['Book Appointment', 'Reschedule', 'Cancel'];
    }

    // Phase 2: New patient — ask what treatment
    if (t.includes('treatment') && (t.includes('interested') || t.includes('looking for'))) {
      return ['Cleaning', 'Consultation', 'Other'];
    }

    // Phase 2: Since I have your chart — cleaning/checkup/something else
    if (t.includes('chart') && (t.includes('cleaning') || t.includes('checkup'))) {
      return ['Cleaning', 'Checkup', 'Something else'];
    }

    // Phase 2: When was your last cleaning
    if (t.includes('last') && (t.includes('cleaning') || t.includes('dental'))) {
      return ['Less than 6 months', '6-12 months ago', 'Over a year ago', 'Not sure'];
    }

    // Phase 2: Consultation offer — open to it?
    if (t.includes('consultation') && (t.includes('open to') || t.includes('something you'))) {
      return ['Yes, sounds great!', 'What does it include?'];
    }

    // Confirmation — shall I book / want me to book
    if ((t.includes('shall i book') || t.includes('want me to book') || t.includes('shall i go ahead'))) {
      return ['Yes, book it!', 'Pick a different time'];
    }

    // Time is available — confirm
    if (t.includes('available') && (t.includes('book') || t.includes('shall'))) {
      return ['Yes, book it!', 'Pick a different time'];
    }

    // Reschedule confirmation
    if (t.includes('sure you want to cancel')) {
      return ['Yes, cancel it', 'No, keep it'];
    }

    // Wrap-up — anything else
    if (t.includes('anything else') || t.includes('help you with')) {
      return ['No, that\'s all. Thanks!', 'I have a question'];
    }

    return null;
  }

  function showTyping() {
    const row = document.createElement('div');
    row.className = 'lc-msg lc-msg--bot';
    row.innerHTML = '<div class="lc-bubble"><span class="lc-typing"><span></span><span></span><span></span></span></div>';
    body.appendChild(row);
    body.scrollTop = body.scrollHeight;
    return row;
  }

  // ---- send ----
  async function send() {
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    addMsg('user', text);
    busy = true;
    sendBtn.disabled = true;
    const typing = showTyping();

    try {
      const res  = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: text, previousChatId: chatId }),
      });
      const data = await res.json();
      typing.remove();
      if (!res.ok) {
        addMsg('bot', 'Sorry, something went wrong. Please try again.');
      } else {
        if (data.chatId) chatId = data.chatId;
        addMsg('bot', data.reply);
        var suggestions = getSuggestedReplies(data.reply);
        if (suggestions) addQuickReplies(suggestions);
      }
    } catch {
      typing.remove();
      addMsg('bot', "I'm having trouble connecting right now. Please try again.");
    } finally {
      busy = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  // ---- listeners ----
  launcher.addEventListener('click', toggle);
  closeBtn.addEventListener('click', toggle);
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) toggle();
  });
}());
