const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const i1 = document.getElementById("i1");
const s1 = document.getElementById("s1");

const template = '<li class="list-group-item">%MESSAGE</li>';
const messages = [];

const socket = io();

input.onkeydown = (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    button.click();
  }
};

s1.onclick = () => {
  fetch("/new_c", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: i1.value,
    }),
  });
  i1.style.display = "none";
  s1.style.display = "none";
};
button.onclick = () => {
  fetch("/new_m", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: i1.value,
      message: input.value,
    }),
  });
  i1.style.display = "none";
  s1.style.display = "none";
};

socket.on("chat", (message) => {
  console.log(message);
  messages.push(message);
  render();
});

const render = () => {
  let html = "";
  messages.forEach((message) => {
    const row = template.replace("%MESSAGE", message);
    html += row;
  });
  chat.innerHTML = html;
  window.scrollTo(0, document.body.scrollHeight);
};