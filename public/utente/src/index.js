//import { setgid } from "process";
import {
  room_up,
  room_get,
  msng_get,
  msng_up,
  user_get,
  user_up,
  user_update,
  ban_get,
} from "../../connection.js";
const socket = io();
let onlines = [];
let flag = 0;
const imageElement = document.getElementById("image");
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
const users = document.getElementById("users");
let rooms = [];
myModal.show();
let banlist = [];
let room = "";
room_get().then((json) => {
  //let templateimg = `<img id="image" src="" />`;
  let template = `<li>%room</li>`;
  let html = "";
  html += `<ul>`;
  for (let i = 0; i < json.rooms.length; i++) {
    html += template.replace("%room", json.rooms[i].room);
    rooms.push(json.rooms[i].room);
  }
  html += `</ul>`;
  roo.innerHTML = html;
});
let rooms2 = [];
let flag69 = 0;
let username = "";
let messageData = [];
let onlines3 = [];
onlines = [];
register.addEventListener("submit", (e) => {
  rooms2.push[roomInput.value];
  ban_get().then((json) => {
    for (let i = 0; i < json.message.length; i++) {
      if (banlist.includes(json.message[i].userid)) {
      } else {
        banlist.push(json.message[i].userid);
      }
    }
  });
  user_get().then((json) => {
    let prova = [];
    for (let v = 0; v < json.message.length; v++) {
      prova.push(json.message[v].userid, json.message[v].roomid);
    }
    if (banlist.includes(usernameInput.value)) {
      window.alert("Sei stato bannato");
      window.location = "../pagina_principale.html";
    }
    if (
      prova.includes(usernameInput.value) &&
      prova.includes(roomInput.value)
    ) {
      alert("username già esistente");
      window.location = "../pagina_principale.html";
    }
  });
  e.preventDefault();
  users.innerHTML = "";
  if (usernameInput.value && roomInput.value) {
    room = roomInput.value;
    rooms2.push(room);
    username = usernameInput.value;
    if (onlines.includes(username)) {
    } else {
      onlines.push(username);
      onlines3.push({ roomid: room, userid: username, sid: socket.id });
    }
    myModal.hide();
    let flag = 0;
    for (let i = 0; i < rooms.length; i++) {
      if (room === rooms[i]) {
        flag = 1;
      }
    }
    if (flag === 0) {
      room_up(room).then((json) => {});
    }
    user_get().then((json) => {
      if (json.message.length === 0) {
        json.message.push({
          roomid: rooms2[flag69],
          userid: username,
          sid: socket.id,
        });
      }

      if (flag69 > 0) {
        let old = onlines3.splice(-1, 1);
        onlines3.push({
          roomid: rooms2[flag69 - 1],
          userid: username,
          sid: socket.id,
        });
      }
      for (let i = 0; i < json.message.length; i++) {
        for (let j = 0; j < onlines3.length; j++) {
          if (json.message[i].userid === onlines3[j].userid) {
            if (json.message[i].sid !== onlines3[j].sid) {
              json.message[i].sid = onlines3[j].sid;
            } else if (json.message[i].roomid !== onlines3[j].roomid) {
              json.message[i].roomid = onlines3[j].roomid;
            }
          }
        }
      }

      let flag = 0;
      let onlines2 = [];

      for (let i = 0; i < onlines3.length; i++) {
        for (let z = 0; z < json.message.length; z++) {
          if (
            onlines3[i].userid === onlines3[i].userid &&
            json.message[z].sid === socket.id &&
            json.message[z].roomid === onlines3[i].roomid
          ) {
            user_update(room, username, socket.id).then((json1) => {});
          } else if (
            onlines3[i].userid === json.message[z].userid &&
            json.message[z].sid === socket.id &&
            json.message[z].roomid !== onlines3[i].roomid
          ) {
            user_update(room, username, socket.id).then((json1) => {});
          } else if (
            onlines3[i].userid === json.message[z].userid &&
            json.message[z].sid !== socket.id
          ) {
            user_update(room, username, socket.id).then((json1) => {});
          } else if (
            onlines.includes(json.message[z].userid) === false &&
            onlines2.includes(json.message[z].userid) === false
          ) {
            onlines2.push(json.message[z].userid);
            if (flag === 0) {
              flag = 1;
            }
          }
        }
      }
    });
  }
  displayMessages();
  setInterval(() => {
    if (banlist.includes(usernameInput.value)) {
      window.alert("Sei stato bannato");
      window.location = "../pagina_principale.html";
    }
    messageData = [];
    msng_get(room).then((json) => {
      for (let i = 0; i < json.message.length; i++) {
        messageData.push({
          username: json.message[i].userid,
          message: json.message[i].message,
          timestamp: json.message[i].timestamp,
        });
      } // Aggiungi il messaggio all'array
      messages.innerHTML = messageData
        .map(({ username, message, timestamp }) => {
          const align = username === usernameInput.value ? "me" : "others";
          return `<li class="${align}">[${timestamp}] ${username}: ${message}</li>`;
        })
        .join("");

      // Scorri fino all'ultimo messaggio
      window.scrollTo(0, document.body.scrollHeight);
    });
    user_get().then((json) => {
      if (onlines.length === 1 && flag == 0) {
        json.message.push({
          roomid: room,
          userid: username,
          sid: socket.id,
        });
        onlines.push(usernameInput.value);
        user_up(room, username, socket.id).then((json1) => {});
      }
      for (let i = 0; i < json.message.length; i++) {
        if (onlines.includes(json.message[i].userid)) {
          flag += 1;
        }
      }

      let template = `<li>%room:-->%username</li>`;
      let html = "";
      html += `<ul>`;
      for (let i = 0; i < json.message.length; i++) {
        html += template
          .replace("%room", json.message[i].roomid)
          .replace("%username", json.message[i].userid);
      }
      html += `</ul>`;
      if (html === `<ul></ul>`) {
      } else {
        users.innerHTML = html;
      }
    });
  }, 3000);
  flag69 += 1;
});

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
    });
    msng_up(input.value, room, username, timestamp).then((json) => {});
    input.value = "";
  }
});

socket.on("chat message", function (message) {
  console.log(message);
  messageData.push(message); // Aggiungi il messaggio all'array
  displayMessages(); // Visualizza i messaggi
});
socket.on("disconnect", () => {});

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
//Questa è la funzione che, non appena viene cliccato il tasto 'invia', gestisce gli eventi per l'upload del file.
//github.com/FapaKslapa/megajs_Example/blob/main/server/mega.js
invia.onclick = () => {
  uploadFile(immagine).then((data) => {
    console.log("data ", data);
    downloadFile(data.link).then((src) => {
      console.log(src);
      render(src);
    });
  });
};
//questa funzione prende la src per caricare l'immagine nell'html quando viene richiamata dalla funzione renderImageAsync
const render = (src) => {
  imageElement.src = src;
};

// Funzione per il caricamento del file che prende in input il file selezionato dall'utente e anche qui viene messo tutto all'interno di un'oggetto file per poi fare una fetch per caricare il file, se andata bene i dati all'interno dell'oggeto vengono trasformati in un file json per poi fare la render e restituire i dati del file
const uploadFile = async (img) => {
  const fileInput = img;
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }

    const data = await response.json();
    console.log("File caricato con successo. Path:", data.Result);
    return data;
  } catch (error) {
    console.error("Errore durante il caricamento del file:", error);
    throw error;
  }
};

// Funzione per il download del file che prende il parametro filename per capire quale file scaricare per poi fare una fetch per ottenere i dati da scaricare per poi metterli nell'oggetto file e viene generato la URL per scaricare il file
const downloadFile = async (fileName) => {
  console.log(fileName);

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
    const url = window.URL.createObjectURL(file);
    console.log(url);
    return url;
  } catch (error) {
    console.error("Errore durante il download del file:", error);
    throw error;
  }
};
