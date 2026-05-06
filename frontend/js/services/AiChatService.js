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