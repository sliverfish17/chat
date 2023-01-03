const chatElement = document.getElementById("chat");
const formElement = document.getElementById("formMessage");
const ws = new WebSocket("ws://127.0.0.1:8000");

ws.onmessage = ({ data }) => {
  const messages = JSON.parse(data);
  messages.forEach((value) => {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.appendChild(
      document.createTextNode(`user ${value.name} : ${value.message}`)
    );
    chat.appendChild(messageElement);
  });
};

const send = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  ws.send(JSON.stringify({ name, message }));
  return false;
};

formElement.addEventListener("submit", send);
