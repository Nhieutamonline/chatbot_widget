(function () {
  // === CẤU HÌNH WEBHOOK ===
  const CHAT_CONFIG = {
    webhook: {
      url: "https://nhieutam.com/webhook/0d68a9fa-06b2-4479-aefb-97478f1dbc83/chat",
      route: "general"
    }
  };

  // BIẾN LƯU TRỮ TẠM THỜI (Sẽ mất khi F5 trang)
  let tempChatHistory = "";
  let currentChatId = "chat_" + Math.random().toString(36).substr(2, 9);
  let isWelcomeShown = false;

  // === HTML KHUNG CHAT ===
  const html = `
  <div id="chat-bar">Trợ lý AI Nhiêu Tâm</div>
  <div id="chat-widget">
    <div id="chat-header">
      <span>Trợ lý AI Nhiêu Tâm</span>
      <div>
        <button id="toggle-size" title="Phóng to / Thu nhỏ">🗖</button>
        <button id="close-chat" title="Đóng">✖</button>
      </div>
    </div>
    <div id="chat-body"></div>
    <div id="chat-footer">
      <input type="text" id="chat-input" placeholder="Nhập tin nhắn...">
      <button id="chat-send">Gửi</button>
    </div>
  </div>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // === CSS ===
  const style = document.createElement('style');
  style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  #chat-widget { position: fixed; bottom: 20px; right: 20px; width: 360px; height: 500px; border-radius: 16px; box-shadow: 0 6px 16px rgba(0,0,0,0.12); display: none; flex-direction: column; overflow: hidden; background: #fff; z-index: 9999; transition: all 0.3s ease; font-family: 'Inter', sans-serif; }
  #chat-widget.maximized { width: 80vw; height: 80vh; bottom: 10vh; right: 10vw; }
  #chat-header { background: linear-gradient(135deg, #0099ff, #00cc99); color: white; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; font-weight: 600; }
  #chat-header button { background: transparent; border: none; color: white; cursor: pointer; font-size: 18px; margin-left: 5px; }
  #chat-body { flex: 1; padding: 16px; overflow-y: auto; background: #fafafa; display: flex; flex-direction: column; }
  .bot-msg, .user-msg { border-radius: 14px; margin-bottom: 12px; padding: 12px 15px; line-height: 1.6; font-size: 15px; word-break: break-word; white-space: pre-wrap; animation: fadeIn 0.3s ease; }
  .bot-msg { align-self: flex-start; background: #f2f5f7; color: #333; }
  .user-msg { align-self: flex-end; background: #d9f0ff; color: #111; }
  #chat-footer { border-top: 1px solid #ddd; display: flex; padding: 10px; background: white; }
  #chat-input { flex: 1; padding: 10px 12px; border: 1px solid #ccc; border-radius: 10px; outline: none; }
  #chat-send { background: #0099ff; color: white; border: none; margin-left: 8px; padding: 10px 18px; border-radius: 10px; cursor: pointer; }
  #chat-bar { position: fixed; bottom: 20px; right: 20px; background: linear-gradient(135deg, #0099ff, #00cc99); color: white; border-radius: 30px; padding: 12px 20px; cursor: pointer; font-weight: 600; z-index: 10000; font-family: 'Inter', sans-serif; }
  .chat-image { display: block; margin: 10px auto; max-width: 100%; border-radius: 8px; cursor: zoom-in; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .typing-dots span { display: inline-block; animation: blink 1.2s infinite; font-size: 20px; }
  @keyframes blink { 0%, 20% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
  `;
  document.head.appendChild(style);

  const chatBar = document.getElementById("chat-bar");
  const chatWidget = document.getElementById("chat-widget");
  const chatBody = document.getElementById("chat-body");
  const chatInput = document.getElementById("chat-input");

  // Xử lý Markdown/Link/Ảnh
  function cleanMarkdown(text) {
    text = text.replace(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$1" alt="Ảnh" class="chat-image">');
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" style="color:#007bff;">$1</a>');
    text = text.replace(/(?<!["'(>])\b(https?:\/\/[^\s<>"']+)\b/g, '<a href="$1" target="_blank" style="color:#007bff;">$1</a>');
    return text;
  }

  function enableImageZoom() {
    document.querySelectorAll(".chat-image").forEach(img => {
      img.onclick = () => {
        const overlay = document.createElement("div");
        overlay.style = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:999999;cursor:zoom-out;";
        overlay.innerHTML = `<img src="${img.src}" style="max-width:90%;max-height:90%;border-radius:12px;">`;
        overlay.onclick = () => overlay.remove();
        document.body.appendChild(overlay);
      };
    });
  }

  function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add(sender === "bot" ? "bot-msg" : "user-msg");
    msg.innerHTML = cleanMarkdown(text.replace(/\n/g, "<br>"));
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    enableImageZoom();
    tempChatHistory = chatBody.innerHTML; // Lưu vào biến tạm
    return msg;
  }

  function showWelcomeMessage() {
    appendMessage("Chào mừng Anh Chị đến với Nhiêu Tâm Online! 🌸", "bot");
    setTimeout(() => {
      appendMessage("Em là trợ lý AI Nhiêu Tâm — luôn sẵn lòng hỗ trợ Anh/Chị ạ!\n\nNếu cần tư vấn nhanh, vui lòng gọi 0947 317 887 gặp kỹ sư tư vấn công nghệ ạ 😊", "bot");
    }, 600);
  }

  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    chatInput.value = "";

    const indicator = document.createElement("div");
    indicator.classList.add("bot-msg");
    indicator.innerHTML = `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;

    fetch(CHAT_CONFIG.webhook.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: currentChatId,
        chatInput: message,
        route: CHAT_CONFIG.webhook.route
      })
    })
    .then(res => res.json().catch(() => res.text().then(t => ({output: t}))))
    .then(data => {
      indicator.remove();
      const out = data.output || data.answer || data.text || "Xin lỗi, em chưa hiểu yêu cầu của bạn.";
      appendMessage(out, "bot");
    })
    .catch(() => {
      indicator.remove();
      appendMessage("Lỗi kết nối máy chủ. Vui lòng thử lại sau.", "bot");
    });
  }

  chatBar.addEventListener("click", () => {
    chatWidget.style.display = "flex";
    chatBar.style.display = "none";
    if (!isWelcomeShown) {
      showWelcomeMessage();
      isWelcomeShown = true;
    } else {
      chatBody.innerHTML = tempChatHistory;
    }
  });

  document.getElementById("close-chat").addEventListener("click", () => {
    chatWidget.style.display = "none";
    chatBar.style.display = "flex";
  });

  document.getElementById("toggle-size").addEventListener("click", () => {
    chatWidget.classList.toggle("maximized");
  });

  document.getElementById("chat-send").addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });

})();
