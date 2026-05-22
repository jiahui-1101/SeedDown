import { API_BASE } from '../utils/apiBase.js';
import { showToast } from '../utils/toast.js';

let isOpen = false;
let chatHistory = []; // tracks conversation for multi-turn
let fabObserver = null;

function isAiAllowedOnCurrentScreen() {
    const hasSession = Boolean(localStorage.getItem('token'));
    if (!hasSession) return false;

    return Boolean(
        document.getElementById('homeScreen') ||
        document.getElementById('controlScreen') ||
        document.getElementById('diseaseScreen') ||
        document.getElementById('featureScreen') ||
        document.getElementById('whatifProScreen')
    );
}


export function initAiChat() {
    const container = document.getElementById('globalAiChat');
    if (!container) return;

    container.innerHTML = `
        <style>
            #aiFab {
                width: clamp(52px, 12vw, 60px); height: clamp(52px, 12vw, 60px); background: var(--accent); 
                border-radius: 50%; display: flex; align-items: center; 
                justify-content: center; font-size: 30px; cursor: pointer; 
                box-shadow: 0 8px 24px rgba(0,0,0,0.2); transition: all 0.3s ease;
                z-index: 1000; position: fixed; bottom: calc(20px + env(safe-area-inset-bottom, 0px)); right: calc(20px + env(safe-area-inset-right, 0px));
            }
            #aiFab:hover { transform: scale(1.1) rotate(5deg); }

            #aiWindow {
                display: none; position: fixed; bottom: calc(90px + env(safe-area-inset-bottom, 0px)); right: calc(20px + env(safe-area-inset-right, 0px)); 
                width: min(350px, calc(100vw - 32px)); height: min(500px, calc(100dvh - 120px)); background: var(--surface); 
                border-radius: 24px; flex-direction: column; 
                box-shadow: 0 12px 40px rgba(0,0,0,0.15); 
                border: 1px solid var(--border); overflow: hidden;
                z-index: 1000; animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }

            .msg-bubble {
                max-width: 85%; padding: 12px 16px; border-radius: 18px; 
                font-size: 0.95rem; line-height: 1.4; position: relative;
                margin-bottom: 4px;
            }
            
            .bot-msg { 
                align-self: flex-start; background: var(--surface); 
                border: 1px solid var(--border); border-bottom-left-radius: 4px; 
                color: var(--text-main);
            }

            .user-msg { 
                align-self: flex-end; background: var(--accent); 
                color: white; border-bottom-right-radius: 4px;
                box-shadow: 0 4px 10px rgba(var(--accent-rgb), 0.3);
            }

            .typing-indicator {
                font-style: italic; font-size: 0.8rem; color: var(--text-muted);
                margin-left: 12px; margin-bottom: 8px; display: none;
            }
        </style>

        <div id="aiFab">🌿</div>

        <div id="aiWindow">
            <!-- Header -->
            <div style="background: var(--accent); padding: 20px; color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 800; font-size: 1.1rem; letter-spacing: -0.5px;">SeedDown AI</div>
                        <div style="font-size: 0.75rem; opacity: 0.9; display: flex; align-items: center; gap: 4px;">
                            <span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%;"></span>
                            System Sync: Optimal
                        </div>
                    </div>
                    <button id="closeAi" style="background:rgba(255,255,255,0.2); border:none; color:white; cursor:pointer; width:30px; height:30px; border-radius:50%; font-size: 0.8rem;">✕</button>
                </div>
            </div>

            <!-- Messages Area -->
            <div id="aiMessages" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; background: var(--bg-alt);">
                <div class="msg-bubble bot-msg">
                    Hello! I'm your SeedDown assistant. I'm connected to your farm's sensors. Ask me anything about your plants!
                </div>
            </div>

            <div id="typingIndicator" class="typing-indicator">SeedDown is analyzing...</div>

            <!-- Input Area -->
            <div style="padding: 16px; background: var(--surface); border-top: 1px solid var(--border);">
                <div style="display: flex; gap: 8px; background: var(--bg); padding: 4px; border-radius: 25px; border: 1px solid var(--border);">
                    <input id="aiInput" type="text" placeholder="Ask about your farm..." 
                        style="flex: 1; background: transparent; border: none; padding: 10px 15px; outline: none; color: var(--text-main);">
                    <button id="aiSend" style="background: var(--accent); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; transition: transform 0.2s;">
                        ➤
                    </button>
                </div>
            </div>
        </div>
    `;

    const fab = document.getElementById('aiFab');
    const windowDiv = document.getElementById('aiWindow');
    const input = document.getElementById('aiInput');
    const msgDiv = document.getElementById('aiMessages');
    const typingIndicator = document.getElementById('typingIndicator');

    fab.addEventListener('click', () => {
        isOpen = !isOpen;
        windowDiv.style.display = isOpen ? 'flex' : 'none';
        if (isOpen) input.focus();
    });

    document.getElementById('closeAi').addEventListener('click', () => {
        isOpen = false;
        windowDiv.style.display = 'none';
    });

    function appendBubble(text, isUser) {
        const b = document.createElement('div');
        b.className = `msg-bubble ${isUser ? 'user-msg' : 'bot-msg'}`;
        b.innerText = text;
        msgDiv.appendChild(b);
        msgDiv.scrollTop = msgDiv.scrollHeight;
    }

    async function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        appendBubble(text, true);
        input.value = '';
        typingIndicator.style.display = 'block';
        msgDiv.scrollTop = msgDiv.scrollHeight;

        try {
            const res = await fetch(`${API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: chatHistory,
                    mode: 'beginner'
                })
            });

            const data = await res.json();
            typingIndicator.style.display = 'none';

            if (data.reply) {
                appendBubble(data.reply, false);
                // Keep conversation history for multi-turn context
                chatHistory.push({ role: 'user', content: text });
                chatHistory.push({ role: 'assistant', content: data.reply });
                // Cap history at 10 messages to avoid large payloads
                if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
            } else {
                appendBubble('Sorry, I had trouble connecting. Try again!', false);
            }
        } catch (err) {
            typingIndicator.style.display = 'none';
            appendBubble('Connection error — is the backend running?', false);
        }
    }

    document.getElementById('aiSend').addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

    // Only show after login on app feature pages. Commercial has its own embedded chat.
    function syncFabVisibility() {
        const onCommercial = !!document.getElementById('commercialScreen');
        const shouldShow = !onCommercial && isAiAllowedOnCurrentScreen();
        fab.style.display = shouldShow ? '' : 'none';
        if (!shouldShow && isOpen) {
            isOpen = false;
            windowDiv.style.display = 'none';
        }
    }

    // Watch for DOM changes so we react when pages are swapped in/out
    if (fabObserver) fabObserver.disconnect();
    fabObserver = new MutationObserver(syncFabVisibility);
    fabObserver.observe(document.getElementById('screenContainer') || document.body, {
        childList: true,
        subtree: false,
    });
    window.addEventListener('storage', syncFabVisibility);
    syncFabVisibility(); // run once on init
}

/*
import { showToast } from '../utils/toast.js';

let isOpen = false;
let chatWindow = null;

export function initAiChat() {
    const container = document.getElementById('globalAiChat');
    container.innerHTML = `
        <div class="ai-fab" id="aiFab">🤖</div>
        <div class="ai-window" id="aiWindow" style="display:none; position:absolute; bottom:70px; right:0; width:280px; height:360px; background:var(--surface); border-radius:24px; box-shadow:var(--shadow-lg); flex-direction:column; overflow:hidden;">
            <div style="background:var(--accent); padding:12px; color:white; display:flex; justify-content:space-between;">
                <span>🤖 AI Assistant</span>
                <button id="closeAiChat" style="background:none; border:none; color:white;">✕</button>
            </div>
            <div id="aiChatMessages" style="flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px;"></div>
            <div style="display:flex; padding:8px; gap:8px; border-top:1px solid var(--border);">
                <input id="aiChatInput" type="text" placeholder="Ask about your farm..." style="flex:1; border-radius:20px; padding:8px; border:1px solid var(--border);">
                <button id="aiSendBtn" style="background:var(--accent); border:none; border-radius:20px; padding:8px 12px; color:white;">Send</button>
            </div>
        </div>
    `;
    
    const fab = document.getElementById('aiFab');
    const windowDiv = document.getElementById('aiWindow');
    const closeBtn = document.getElementById('closeAiChat');
    const sendBtn = document.getElementById('aiSendBtn');
    const input = document.getElementById('aiChatInput');
    const messagesDiv = document.getElementById('aiChatMessages');
    
    fab.addEventListener('click', () => {
        isOpen = !isOpen;
        windowDiv.style.display = isOpen ? 'flex' : 'none';
        if (isOpen && messagesDiv.children.length === 0) {
            addMessage('Hello! I can help analyze your farm data. Ask me anything!', false);
        }
    });
    closeBtn.addEventListener('click', () => {
        isOpen = false;
        windowDiv.style.display = 'none';
    });
    
    function addMessage(text, isUser) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${isUser ? 'mine' : 'theirs'}`;
        bubble.style.maxWidth = '80%';
        bubble.style.padding = '8px 12px';
        bubble.style.borderRadius = '16px';
        bubble.style.marginBottom = '4px';
        bubble.style.background = isUser ? 'var(--accent)' : 'var(--surface)';
        bubble.style.color = isUser ? 'white' : 'var(--text)';
        bubble.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
        bubble.innerText = text;
        messagesDiv.appendChild(bubble);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    
    async function sendMessage() {
        const q = input.value.trim();
        if (!q) return;
        addMessage(q, true);
        input.value = '';
        // 模拟AI回复
        setTimeout(() => {
            const reply = `Based on current sensors: Temp ${Math.floor(Math.random()*30+20)}°C, Humidity ${Math.floor(Math.random()*40+50)}%. ${q.includes('water') ? 'Consider watering in the morning.' : 'All systems nominal.'}`;
            addMessage(reply, false);
        }, 800);
    }
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
}

*/
