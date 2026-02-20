const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chat = document.getElementById("chat");

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  userInput.value = "";

  addMessage("Thinking...", "ai");

  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  // Remove "Thinking..."
  chat.lastChild.remove();

  addMessage(formatResponse(data.reply), "ai", true);
}

function addMessage(content, type, isHTML = false) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  if (isHTML) div.innerHTML = content;
  else div.textContent = content;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function formatResponse(text) {
  return text
    .replace(/^## (.*$)/gim, "<h3>$1</h3>")
    .replace(/^### (.*$)/gim, "<strong>$1</strong><br>")
    .replace(/^\- (.*$)/gim, "• $1<br>")
    .replace(/\n\n/g, "<br><br>");
}
