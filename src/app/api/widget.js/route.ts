import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("host") ?? "localhost:3000";
  const origin = `${proto}://${host}`;

  const js = widgetCSS() + "\n" + widgetHTML() + "\n" + widgetJS(origin);

  return new NextResponse(js, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

/* ────────────────────────────────────────────
   CSS — injected as a <style> tag
   ──────────────────────────────────────────── */
function widgetCSS(): string {
  return `
var AW_CSS = [
"#aw-root{--aw-primary:#6366f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
"#aw-launcher{position:fixed;bottom:20px;right:20px;z-index:10001;width:56px;height:56px;border-radius:50%;border:none;background:var(--aw-primary);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(99,102,241,.35),0 2px 8px rgba(0,0,0,.15);transition:transform .2s,box-shadow .2s}",
"#aw-launcher:hover{transform:scale(1.1);box-shadow:0 6px 32px rgba(99,102,241,.55)}",
"#aw-launcher:active{transform:scale(.95)}",
"#aw-launcher svg{width:24px;height:24px}",
"#aw-launcher .aw-icon-x{display:none}",
"#aw-launcher[aria-expanded='true'] .aw-icon-chat{display:none}",
"#aw-launcher[aria-expanded='true'] .aw-icon-x{display:block}",
"#aw-launcher[aria-expanded='true'] .aw-ping{display:none}",
".aw-ping{position:absolute;inset:0;border-radius:50%;background:var(--aw-primary);opacity:.3;animation:aw-ping 1.5s cubic-bezier(0,0,.2,1) infinite}",
"@keyframes aw-ping{75%,100%{transform:scale(1.6);opacity:0}}",
"@media(min-width:640px){#aw-launcher{bottom:28px;right:28px;width:64px;height:64px}#aw-launcher svg{width:28px;height:28px}}",
"#aw-panel{position:fixed;z-index:10000;bottom:88px;right:12px;left:12px;height:min(560px,calc(100vh - 140px));display:flex;flex-direction:column;background:#fff;border-radius:16px;border:1px solid rgba(0,0,0,.08);box-shadow:0 12px 48px rgba(0,0,0,.12),0 4px 16px rgba(0,0,0,.08);overflow:hidden;transform:translateY(16px) scale(.97);opacity:0;pointer-events:none;transition:transform .3s,opacity .3s}",
"#aw-panel.aw-open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}",
"@media(min-width:640px){#aw-panel{bottom:104px;right:28px;left:auto;width:380px}}",
".aw-header{display:flex;align-items:center;gap:12px;padding:14px 18px;background:linear-gradient(135deg,var(--aw-primary),color-mix(in srgb,var(--aw-primary) 80%,#000));flex-shrink:0}",
".aw-header-icon{width:36px;height:36px;border-radius:8px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;flex-shrink:0}",
".aw-header-icon svg{width:20px;height:20px;color:#fff}",
".aw-header-text{flex:1;min-width:0}",
"#aw-biz-name{display:block;font-size:.93rem;font-weight:600;color:#fff;line-height:1.3}",
".aw-online{display:flex;align-items:center;gap:6px;font-size:.73rem;color:rgba(255,255,255,.85)}",
".aw-dot{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 6px rgba(52,211,153,.5)}",
"#aw-close{width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,.2);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}",
"#aw-close:hover{background:rgba(255,255,255,.3)}",
"#aw-close svg{width:18px;height:18px}",
"#aw-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;background:#fafafa}",
".aw-msg-row{display:flex;animation:aw-msgIn .35s ease-out}",
".aw-msg-bot{justify-content:flex-start}",
".aw-msg-user{justify-content:flex-end}",
".aw-bubble{max-width:82%;padding:12px 16px;border-radius:16px;font-size:.88rem;line-height:1.55;word-break:break-word}",
".aw-bubble-bot{background:#fff;color:#27272a;border-bottom-left-radius:4px;box-shadow:0 1px 4px rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.06)}",
".aw-bubble-user{background:var(--aw-primary);color:#fff;border-bottom-right-radius:4px}",
"@keyframes aw-msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}",
"#aw-typing{justify-content:flex-start}",
"#aw-typing .aw-bubble{display:flex;align-items:center;gap:6px}",
".aw-dot-bounce{width:7px;height:7px;border-radius:50%;background:#d4d4d8;animation:aw-bounce .6s infinite alternate}",
".aw-d2{animation-delay:.15s}",
".aw-d3{animation-delay:.3s}",
"@keyframes aw-bounce{to{transform:translateY(-4px);opacity:.5}}",
"#aw-quick-replies{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 8px;background:#fafafa}",
".aw-qr{padding:8px 16px;border-radius:9999px;border:1px solid rgba(0,0,0,.08);background:#fff;font-size:.84rem;font-weight:500;color:#3f3f46;cursor:pointer;transition:all .15s;box-shadow:0 1px 3px rgba(0,0,0,.04);font-family:inherit}",
".aw-qr:hover{border-color:var(--aw-primary);background:#eef2ff;color:var(--aw-primary)}",
".aw-footer{display:flex;align-items:center;gap:8px;padding:12px 14px;border-top:1px solid rgba(0,0,0,.08);background:#fff;flex-shrink:0}",
"#aw-input{flex:1;padding:10px 16px;border-radius:9999px;border:1px solid rgba(0,0,0,.08);background:#fafafa;font-size:.875rem;color:#18181b;outline:none;font-family:inherit}",
"#aw-input::placeholder{color:#a1a1aa}",
"#aw-input:focus{border-color:var(--aw-primary);box-shadow:0 0 0 3px rgba(99,102,241,.1)}",
"#aw-send{width:38px;height:38px;border-radius:50%;border:none;background:var(--aw-primary);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,transform .15s;flex-shrink:0}",
"#aw-send:hover{filter:brightness(1.1)}",
"#aw-send:active{transform:scale(.9)}",
"#aw-send:disabled{opacity:.45;cursor:not-allowed}",
"#aw-send svg{width:18px;height:18px}"
].join("\\n");
`;
}

/* ────────────────────────────────────────────
   HTML template for the widget DOM
   ──────────────────────────────────────────── */
function widgetHTML(): string {
  // SVGs used in multiple places
  const chatSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const xSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const sendSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  const html = [
    `<button id="aw-launcher" aria-label="Open chat" aria-expanded="false">`,
    `  <span class="aw-ping"></span>`,
    `  <span class="aw-icon-chat">${chatSvg}</span>`,
    `  <span class="aw-icon-x">${xSvg}</span>`,
    `</button>`,
    `<div id="aw-panel" role="dialog" aria-label="Chat">`,
    `  <div class="aw-header">`,
    `    <div class="aw-header-icon">${chatSvg}</div>`,
    `    <div class="aw-header-text">`,
    `      <span id="aw-biz-name">Chat</span>`,
    `      <span class="aw-online"><span class="aw-dot"></span>Online</span>`,
    `    </div>`,
    `    <button id="aw-close" aria-label="Close chat">${xSvg}</button>`,
    `  </div>`,
    `  <div id="aw-messages" aria-live="polite">`,
    `    <div id="aw-typing" class="aw-msg-row" style="display:none">`,
    `      <div class="aw-bubble aw-bubble-bot"><span class="aw-dot-bounce"></span><span class="aw-dot-bounce aw-d2"></span><span class="aw-dot-bounce aw-d3"></span></div>`,
    `    </div>`,
    `  </div>`,
    `  <div id="aw-quick-replies"></div>`,
    `  <div class="aw-footer">`,
    `    <input id="aw-input" type="text" placeholder="Type a message..." maxlength="500" aria-label="Chat message" />`,
    `    <button id="aw-send" aria-label="Send">${sendSvg}</button>`,
    `  </div>`,
    `</div>`,
  ].join("");

  // Escape for embedding inside a JS string literal
  const escaped = JSON.stringify(html);
  return `var AW_HTML = ${escaped};`;
}

/* ────────────────────────────────────────────
   Main widget logic (vanilla JS IIFE)
   ──────────────────────────────────────────── */
function widgetJS(apiOrigin: string): string {
  return `
(function() {
  "use strict";

  var scriptTag = document.currentScript || (function() {
    var s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();
  var WIDGET_ID = scriptTag.getAttribute("data-widget-id");
  if (!WIDGET_ID) {
    console.error("[AppointlyWidget] Missing data-widget-id on script tag.");
    return;
  }

  var API = ${JSON.stringify(apiOrigin)};
  var chatId = null;
  var isBusy = false;
  var opened = false;

  /* Inject CSS */
  var styleEl = document.createElement("style");
  styleEl.textContent = AW_CSS;
  document.head.appendChild(styleEl);

  /* Inject DOM */
  var root = document.createElement("div");
  root.id = "aw-root";
  root.innerHTML = AW_HTML;
  document.body.appendChild(root);

  var launcher  = root.querySelector("#aw-launcher");
  var panel     = root.querySelector("#aw-panel");
  var closeBtn  = root.querySelector("#aw-close");
  var msgArea   = root.querySelector("#aw-messages");
  var typingEl  = root.querySelector("#aw-typing");
  var qrArea    = root.querySelector("#aw-quick-replies");
  var input     = root.querySelector("#aw-input");
  var sendBtn   = root.querySelector("#aw-send");
  var bizName   = root.querySelector("#aw-biz-name");

  var isOpen = false;

  launcher.addEventListener("click", toggle);
  closeBtn.addEventListener("click", toggle);
  sendBtn.addEventListener("click", function() { send(); });
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && isOpen) toggle();
  });

  function toggle() {
    isOpen = !isOpen;
    panel.classList.toggle("aw-open", isOpen);
    launcher.setAttribute("aria-expanded", String(isOpen));
    if (isOpen && !opened) {
      opened = true;
      fetchConfig();
    }
    if (isOpen) setTimeout(function() { input.focus(); }, 320);
  }

  function fetchConfig() {
    fetch(API + "/api/config?widgetId=" + encodeURIComponent(WIDGET_ID))
      .then(function(r) { return r.json(); })
      .then(function(cfg) {
        if (cfg.error) { addMsg("bot", "Configuration error: " + cfg.error); return; }
        if (cfg.businessName) bizName.textContent = cfg.businessName;
        if (cfg.primaryColor) root.style.setProperty("--aw-primary", cfg.primaryColor);
        addMsg("bot", cfg.greeting);
        if (cfg.quickReplies && cfg.quickReplies.length) showQR(cfg.quickReplies);
      })
      .catch(function() { addMsg("bot", "Could not load chat. Please refresh the page."); });
  }

  function send(text) {
    var msg = (text || input.value || "").trim();
    if (!msg || isBusy) return;
    input.value = "";
    clearQR();
    addMsg("user", msg);
    isBusy = true;
    typingEl.style.display = "flex";
    scrollDown();

    fetch(API + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ widgetId: WIDGET_ID, userMessage: msg, previousChatId: chatId })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      typingEl.style.display = "none";
      if (data.error) {
        addMsg("bot", "Sorry, something went wrong. Please try again.");
      } else {
        if (data.chatId) chatId = data.chatId;
        addMsg("bot", data.reply);
        var qr = getSuggestions(data.reply);
        if (qr) showQR(qr);
      }
    })
    .catch(function() {
      typingEl.style.display = "none";
      addMsg("bot", "I'm having trouble connecting. Please try again.");
    })
    .then(function() { isBusy = false; input.focus(); });
  }

  function addMsg(role, content) {
    var row = document.createElement("div");
    row.className = "aw-msg-row aw-msg-" + role;
    var bubble = document.createElement("div");
    bubble.className = "aw-bubble aw-bubble-" + role;
    bubble.textContent = content;
    row.appendChild(bubble);
    msgArea.insertBefore(row, typingEl);
    scrollDown();
  }

  function showQR(opts) {
    clearQR();
    opts.forEach(function(opt) {
      var btn = document.createElement("button");
      btn.className = "aw-qr";
      btn.textContent = opt;
      btn.addEventListener("click", function() { clearQR(); send(opt); });
      qrArea.appendChild(btn);
    });
    scrollDown();
  }

  function clearQR() { qrArea.innerHTML = ""; }

  function scrollDown() {
    setTimeout(function() { msgArea.scrollTop = msgArea.scrollHeight; }, 50);
  }

  function getSuggestions(text) {
    var t = text.toLowerCase();
    if ((t.includes("book") || t.includes("schedule")) && t.includes("reschedule") && t.includes("cancel"))
      return ["Book Appointment", "Reschedule", "Cancel"];
    if (t.includes("treatment") && (t.includes("interested") || t.includes("looking for")))
      return ["Cleaning", "Consultation", "Other"];
    if (t.includes("chart") && (t.includes("cleaning") || t.includes("checkup")))
      return ["Cleaning", "Checkup", "Something else"];
    if (t.includes("last") && (t.includes("cleaning") || t.includes("dental")))
      return ["Less than 6 months", "6-12 months ago", "Over a year ago", "Not sure"];
    if (t.includes("consultation") && (t.includes("open to") || t.includes("something you")))
      return ["Yes, sounds great!", "What does it include?"];
    if (t.includes("shall i book") || t.includes("want me to book") || t.includes("shall i go ahead"))
      return ["Yes, book it!", "Pick a different time"];
    if (t.includes("available") && (t.includes("book") || t.includes("shall")))
      return ["Yes, book it!", "Pick a different time"];
    if (t.includes("sure you want to cancel"))
      return ["Yes, cancel it", "No, keep it"];
    if (t.includes("anything else") || t.includes("help you with"))
      return ["No, that's all. Thanks!", "I have a question"];
    return null;
  }
})();
`;
}
