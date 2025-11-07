(function () {
  // === CẤU HÌNH WEBHOOK ===
  const CHAT_CONFIG = {
    webhook: {
      url: "https://nhieutam.com/webhook/0d68a9fa-06b2-4479-aefb-97478f1dbc83/chat",
      route: "general"
    }
  };

  // === HTML KHUNG CHAT (GIỮ NGUYÊN) ===
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

  // === CHÈN HTML VÀO TRANG ===
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // === CSS NGUỒN GỐC (GIỮ NGUYÊN PHẦN LỚN) ===
  const style = document.createElement('style');
  style.innerHTML = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  body {
    font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 0;
    background: transparent;
    font-size: 15px;
    color: #222;
  }

  #chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 360px;
    height: 500px;
    border-radius: 16px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
    display: none;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
    z-index: 9999;
    transition: all 0.3s ease;
  }

  #chat-widget.maximized {
    width: 80vw;
    height: 80vh;
    bottom: 10vh;
    right: 10vw;
  }

  #chat-header {
    background: linear-gradient(135deg, #0099ff, #00cc99);
    color: white;
    padding: 14px 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 0.3px;
  }

  #chat-header button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    transition: 0.2s;
  }

  #chat-header button:hover {
    transform: scale(1.2);
  }

  #chat-body {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background: #fafafa;
    display: flex;
    flex-direction: column;
  }

  .bot-msg, .user-msg {
    border-radius: 14px;
    margin-bottom: 12px;
    padding: 12px 15px;
    line-height: 1.6;
    font-size: 15px;
    word-break: break-word;
    white-space: pre-wrap;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .bot-msg {
    align-self: flex-start;
    background: #f2f5f7;
    color: #333;
  }

  .user-msg {
    align-self: flex-end;
    background: #d9f0ff;
    color: #111;
  }

  .bot-msg p, .user-msg p {
    margin: 6px 0;
  }

  #chat-footer {
    border-top: 1px solid #ddd;
    display: flex;
    padding: 10px;
    background: white;
    align-items: center;
  }

  #chat-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #ccc; /* 🩶 viền xám nhẹ khi bình thường */
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    transition: all 0.25s ease; /* 🌀 hiệu ứng mượt */
    outline: none;
    background: white;
  }

  /* 🌈 Khi người dùng nhấp vào ô nhập tin nhắn */
  #chat-input:focus {
    border: 1px solid transparent; /* ẩn viền xám */
    background-clip: padding-box;  /* giữ nền trắng bên trong */
    border-radius: 10px;
    outline: none;

    /* 💫 Viền gradient xanh dương → xanh ngọc */
    background-image: 
      linear-gradient(white, white),
      linear-gradient(135deg, #0099ff, #00cc99);
    background-origin: border-box;
    background-clip: padding-box, border-box;

    /* 👇 Hiệu ứng sáng nhẹ */
    box-shadow: 0 0 6px rgba(0,153,255,0.4);
  }

  #chat-send {
    background: #0099ff;
    color: white;
    border: none;
    margin-left: 8px;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    transition: background 0.25s;
  }

  #chat-send:hover {
    background: #007acc;
  }

  #chat-bar {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #0099ff, #00cc99);
    color: white;
    border-radius: 30px;
    box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    padding: 12px 20px;
    cursor: pointer;
    font-weight: 600;
    font-size: 15px;
    z-index: 10000;
    font-family: 'Inter', sans-serif;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  #chat-bar:hover {
    transform: scale(1.05);
  }

  .typing-dots span {
    display: inline-block;
    animation: blink 1.2s infinite;
    font-size: 20px;
    line-height: 1;
  }

  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0%, 20% { opacity: 0.2; }
    50% { opacity: 1; }
    100% { opacity: 0.2; }
  }

  .product-card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    padding: 10px;
    margin: 6px 0;
    text-align: center;
    max-width: 240px;
  }

  .product-card img {
    width: 100%;
    border-radius: 8px;
  }

  .product-card p {
    font-size: 14px;
    font-weight: 600;
    margin: 8px 0;
    color: #333;
  }

  .product-card a {
    display: inline-block;
    background: #0099ff;
    color: #fff;
    padding: 6px 12px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 13px;
    transition: background 0.2s;
  }

  .product-card a:hover {
    background: #007acc;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  `;
  document.head.appendChild(style);

  // === THÊM NÚT REFRESH VÀO HEADER (GIỐNG GỐC) ===
  (function addRefreshButton(){
    const headerDiv = document.querySelector("#chat-header div");
    if (!headerDiv) return;
    const refreshBtn = document.createElement("button");
    refreshBtn.textContent = "🔄";
    refreshBtn.title = "Làm mới cuộc trò chuyện";
    refreshBtn.style.background = "transparent";
    refreshBtn.style.border = "none";
    refreshBtn.style.color = "white";
    refreshBtn.style.cursor = "pointer";
    refreshBtn.style.fontSize = "18px";
    refreshBtn.style.marginRight = "6px";
    headerDiv.prepend(refreshBtn);

    refreshBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn làm mới cuộc trò chuyện không?")) {
        localStorage.removeItem("chatHistory");
        showWelcomeMessage();
      }
    });
  })();

  // === SELECTORS ===
  const chatBar = document.getElementById("chat-bar");
  const chatWidget = document.getElementById("chat-widget");
  const chatBody = document.getElementById("chat-body");

  // --- Giữ lịch sử bằng localStorage ---
  function getChatId() {
    let chatId = localStorage.getItem("chatId");
    if (!chatId) {
      chatId = "chat_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chatId", chatId);
    }
    return chatId;
  }

  window.addEventListener("load", () => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) chatBody.innerHTML = saved;
  });

  chatBar.addEventListener("click", () => {
    chatWidget.style.display = "flex";
    chatBar.style.display = "none";
    if (localStorage.getItem("chatHistory")) loadChatHistory();
    else showWelcomeMessage();
  });

  document.getElementById("close-chat").addEventListener("click", () => {
    chatWidget.style.display = "none";
    chatBar.style.display = "flex";
  });

  document.getElementById("toggle-size").addEventListener("click", () => {
    chatWidget.classList.toggle("maximized");
  });

  // 🔄 Nút làm mới (đã thêm ở trên), giữ tham chiếu nếu cần
  const refreshBtnRef = document.querySelector("#chat-header button[title='Làm mới']");

  // Send event handlers
  document.getElementById("chat-send").addEventListener("click", sendMessage);
  document.getElementById("chat-input").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  // 🧹 Hàm xử lý Markdown + link + ảnh (giữ nguyên logic gốc)
  function cleanMarkdown(text) {
    // 1️⃣ Xử lý ảnh trước — thay Markdown ảnh ![mô tả](link)
    text = text.replace(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/g, '<img src="$1" alt="Ảnh" class="chat-image">');

    // 2️⃣ Sau đó xử lý Markdown link [Tên](URL)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" style="color:#007bff;text-decoration:none;">$1</a>'
    );

    // 3️⃣ Sau cùng: xử lý link trần (http... không bọc gì)
    text = text.replace(
      /(?<!["'(>])\b(https?:\/\/[^\s<>"']+)\b/g,
      '<a href="$1" target="_blank" style="color:#007bff;text-decoration:none;">$1</a>'
    );

    // 4️⃣ Ảnh trần (link .jpg, .png...) — thêm sau nếu chưa có thẻ <img>
    text = text.replace(
      /(?<!src=")(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif))/gi,
      '<img src="$1" alt="Ảnh" class="chat-image">'
    );

    return text;
  }

  // Ảnh phóng to (giữ nguyên)
  function enableImageZoom() {
    document.querySelectorAll(".chat-image").forEach(img => {
      img.style.display = "block";
      img.style.margin = "10px auto";
      img.style.maxWidth = "100%";
      img.style.borderRadius = "8px";
      img.style.cursor = "zoom-in";
      img.onclick = () => openImagePopup(img.src);
    });
  }

  function openImagePopup(src) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.85)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "999999";
    overlay.style.cursor = "zoom-out";
    overlay.style.animation = "fadeIn 0.3s ease";
    overlay.innerHTML = `<img src="${src}" style="max-width:90%;max-height:90%;border-radius:12px;">`;
    overlay.onclick = () => overlay.remove();
    document.body.appendChild(overlay);
  }

  // Ngắt đoạn + hiển thị gọn gàng
  function formatText(text) {
    return text
      .replace(/\n{2,}/g, "</p><p>")
      .replace(/\n/g, "<br>")
      .replace(/^/, "<p>")
      .replace(/$/, "</p>");
  }

  function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add(sender === "bot" ? "bot-msg" : "user-msg");

    let formatted = formatText(text);
    formatted = cleanMarkdown(formatted);

    msg.innerHTML = formatted;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    enableImageZoom();
    saveChatHistory();
    return msg;
  }

  function typeMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add(sender === "bot" ? "bot-msg" : "user-msg");
    chatBody.appendChild(msg);

    let formatted = formatText(text);
    formatted = cleanMarkdown(formatted);

    msg.innerHTML = formatted;
    enableImageZoom();
    saveChatHistory();
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function createTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.classList.add("bot-msg");
    indicator.innerHTML = `<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`;
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
    return indicator;
  }

  function showWelcomeMessage() {
    chatBody.innerHTML = "";
    appendMessage("Chào mừng Anh Chị đến với Nhiêu Tâm Online! 🌸", "bot");
    setTimeout(() => {
      typeMessage("Em là trợ lý AI Nhiêu Tâm — luôn sẵn lòng hỗ trợ Anh/Chị ạ!\n\nNếu cần tư vấn nhanh, vui lòng gọi 0947 317 887 gặp kỹ sư tư vấn công nghệ ạ 😊", "bot");
    }, 600);
  }

  function saveChatHistory() {
    try {
      localStorage.setItem("chatHistory", chatBody.innerHTML);
    } catch (e) {
      // nếu private mode hoặc đầy, bỏ qua
      console.warn('Không lưu được lịch sử chat:', e);
    }
  }

  function loadChatHistory() {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      chatBody.innerHTML = saved;
      enableImageZoom();
    }
  }

  function sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();
    if (!message) return;

    appendMessage(message, "user");
    input.value = "";

    const chatId = getChatId();
    const typingIndicator = createTypingIndicator();

    fetch(CHAT_CONFIG.webhook.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: chatId,
        chatInput: message,
        route: CHAT_CONFIG.webhook.route
      })
    })
    .then(res => {
      // nếu server trả text hoặc json, cố gắng parse json
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) return res.json();
      return res.text().then(t => ({ output: t }));
    })
    .then(data => {
      typingIndicator.remove();
      // nếu data là object và có output
      const out = (data && (data.output || data.answer || data.text)) || "Xin lỗi, em chưa hiểu yêu cầu của Anh/Chị ạ.";
      typeMessage(out, "bot");
    })
    .catch((err) => {
      typingIndicator.remove();
      appendMessage("Lỗi kết nối máy chủ. Vui lòng thử lại sau.", "bot");
      console.error("Chat widget fetch error:", err);
    });
  }

  // === SỰ KIỆN GIAO DIỆN ===
  chatBar.addEventListener("click", () => {
    chatWidget.style.display = "flex";
    chatBar.style.display = "none";
    if (localStorage.getItem("chatHistory")) loadChatHistory();
    else showWelcomeMessage();
  });

  document.getElementById("close-chat").addEventListener("click", () => {
    chatWidget.style.display = "none";
    chatBar.style.display = "flex";
  });

  document.getElementById("toggle-size").addEventListener("click", () => {
    chatWidget.classList.toggle("maximized");
  });

  // refresh button đã gắn handler khi tạo
  if (refreshBtnRef) {
    refreshBtnRef.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn làm mới cuộc trò chuyện không?")) {
        localStorage.removeItem("chatHistory");
        showWelcomeMessage();
      }
    });
  }

  document.getElementById("chat-send").addEventListener("click", sendMessage);
  document.getElementById("chat-input").addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  // Nếu người dùng load trang đã lưu history, enable image zoom
  if (localStorage.getItem("chatHistory")) {
    loadChatHistory();
  }

})();
