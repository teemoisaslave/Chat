import { New_m } from "../../connection.js";
const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const s1 = document.getElementById("s1");
const new_chat = document.getElementById("new_chat");
input.style.display = "none";
button.style.display = "none";
new_chat.style.display = "none";
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
  s1.style.display = "none";
  input.style.display = "block";
  button.style.display = "block";
  new_chat.style.display = "block";
};
button.onclick = () => {
  New_m("admin", input.value);
};
new_chat;
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
