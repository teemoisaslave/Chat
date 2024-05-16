import { room_up, room_get } from "../../connection.js";
const socket = io();
const invia = document.getElementById("invia");
const immagine = document.getElementById("img");
const form = document.getElementById("form");
const input = document.getElementById("input");
const register = document.getElementById("register");
const roomInput = document.getElementById("room");
const usernameInput = document.getElementById("username");
const messages = document.getElementById("messages");
const myModal = new bootstrap.Modal("#modalAccedi");
const roo = document.getElementById("rooms");
let rooms = [];
myModal.show();
room_get().then((json) => {
  console.log(json.rooms[0]);
  console.log(json.rooms.length);
  let template = `<li>%room</li>`;
  let html = "";
  html += `<ul>`;
  for (let i = 0; i < json.rooms.length; i++) {
    html += template.replace("%room", json.rooms[i].room);
    rooms.push(json.rooms[i].room);
  }
  html += `</ul>`;
  roo.innerHTML = html;
  console.log(rooms, "ciao");
});
let room = "";
let username = "";
register.addEventListener("submit", (e) => {
  e.preventDefault();
  if (usernameInput.value && roomInput.value) {
    room = roomInput.value;
    username = usernameInput.value;
    myModal.hide();
    let flag = 0;
    for (let i = 0; i < rooms.length; i++) {
      console.log(room, rooms[i]);
      if (room === rooms[i]) {
        flag = 1;
      }
    }
    if (flag === 0) {
      room_up(room).then((json) => {});
    }
  }
});

invia.onclick = () => {
  uploadFile(immagine).then((jason) => {
    console.log(jason);
  });
};

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

const uploadFile = async (img) => {
  const fileInput = img;
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("file", file);
  return new Promise((resolve, reject) => {
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("File caricato con successo. Path:", data.Result);
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
const downloadFile = async (fileName) => {
  let body = { mega: fileName, name: "test.txt" };
  try {
    const response = await fetch("/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlN0ZWZhbm8iLCJpYXQiOjE3MTUwMTIyMTIsImV4cCI6MTcxNTAxOTQxMn0.ZZSIlqewPKhG-qJ6a9VA9NjGTeSNpdwiHZ2tIx-aoa4",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const buffer = await response.arrayBuffer();
    const file = new File(
      [buffer],
      response.headers.get("Content-Disposition").split("filename=")[1],
    );
    // Create a new URL object for the file
    const url = window.URL.createObjectURL(file);
    return url;
  } catch (e) {
    console.error("Error during file download:", e);
  }
};
