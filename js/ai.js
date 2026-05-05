/* ============================================================
   GLOBAL AI CHATBOX LOGIC
   PLACEHOLDER: Solution- AI AI-Chatbox + disease diagnosis (ZIQI)
   ============================================================ */
function toggleAiChat() {
  const win = document.getElementById('aiChatWindow');
  win.style.display = win.style.display === 'none' || win.style.display === '' ? 'flex' : 'none';
}

function sendAiChat() {
  const inp = document.getElementById('aiChatInput');
  const val = inp.value.trim();
  if(!val) return;
  const body = document.getElementById('aiChatBody');
  body.innerHTML += `<div class="chat-bubble mine"><div class="chat-bubble-name">You</div>${val}</div>`;
  inp.value = '';
  body.scrollTop = body.scrollHeight;

  // AI Reply Delay Simulation
  setTimeout(() => {
    const replies = [
      "I'm NexusAI. How can I assist you with your crops today?",
      "Checking your sensors... Everything looks stable for now.",
      "Remember to water your plants! Especially the Spinach.",
      "Based on current data, your harvest is right on schedule."
    ];
    const rep = replies[Math.floor(Math.random() * replies.length)];
    body.innerHTML += `<div class="chat-bubble theirs"><div class="chat-bubble-name">NexusAI</div>${rep}</div>`;
    body.scrollTop = body.scrollHeight;
  }, 800);
}