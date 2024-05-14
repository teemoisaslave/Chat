import { New_m, New_u } from "../../connection.js";
const input = document.getElementById("input");
const button = document.getElementById("sendButton");
const chat = document.getElementById("chat");
const i1 = document.getElementById("i1");
const s1 = document.getElementById("s1");
const messa = document.getElementById("messaggio");
const new_chat = document.getElementById("new_chat");
const rooms = document.getElementById("rooms");
input.style.display = "none";
button.style.display = "none";
new_chat.style.display = "none";
const template = '<li class="list-group-item">%MESSAGE</li>';
const temp1 = '<li class="list-group-item">%ROOM</li>';
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
  messa.style.display = "none";
  input.style.display = "block";
  button.style.display = "block";
  new_chat.style.display = "block";
};
button.onclick = () => {
  New_m(i1.value, input.value);
};
new_chat;
socket.on("chat", (message) => {
  console.log(message);
  messages.push(message);
  render();
});
new_chat.onclick = () => {};
const render = () => {
  let html = "";
  messages.forEach((message) => {
    const row = template.replace("%MESSAGE", message);
    html += row;
  });
  chat.innerHTML = html;
  window.scrollTo(0, document.body.scrollHeight);
};
