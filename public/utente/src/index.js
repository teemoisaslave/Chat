const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const register = document.getElementById("register");
const roomInput = document.getElementById("room");
const usernameInput = document.getElementById("username"); // Aggiungi un campo di input per l'username
const messages = document.getElementById("messages");
const myModal = new bootstrap.Modal("#modalAccedi");
const roo = document.getElementById("rooms");
myModal.show();
let room = "";
let rooms = ["main", "general", "fouie chat"];
let template = `<li>%room</li>`;
let html = "";
html += `<ul>`;
for (let i = 0; i < rooms.length; i++) {
  html += template.replace("%room", rooms[i]);
  console.log(html);
}
html += `</ul>`;
console.log(html);
roo.innerHTML = html;
let username = "";
register.addEventListener("submit", (e) => {
  e.preventDefault();
  if (usernameInput.value && roomInput.value) {
    room = roomInput.value;
    username = usernameInput.value;
    myModal.hide();
  }
});

//input_img.onclick = () => {
//uploadFile(img).then((jason) => {
// console.log(jason);
// });
//};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    const timestamp = new Date().toLocaleString("it-IT", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    socket.emit("join room", room);
    socket.emit("chat message", room, {
      username,
      message: input.value,
      timestamp,
    }); // Invia l'username e il messaggio
    input.value = "";
  }
});

let messageData = []; // Array per salvare i dati dei messaggi

socket.on("chat message", function (message) {
  messageData.push(message); // Aggiungi il messaggio all'array
  displayMessages(); // Visualizza i messaggi
});

function displayMessages() {
  messages.innerHTML = messageData
    .map(({ username, message, timestamp }) => {
      const align = username === usernameInput.value ? "me" : "others";
      return `<li class="${align}">[${timestamp}] ${username}: ${message}</li>`;
    })
    .join("");

  // Scorri fino all'ultimo messaggio
  window.scrollTo(0, document.body.scrollHeight);
}
