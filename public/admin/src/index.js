import { New_m, New_u } from "../../connection.js";
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
  New_u(i1.value);
  i1.style.display = "none";
  s1.style.display = "none";
};
button.onclick = () => {
  New_m(i1.value, input.value);
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
