import { user_get, ban_u, ban_get } from "../../connection.js";
const div_u = document.getElementById("users");
const ban = document.getElementById("ban");
const inpu = document.getElementById("username");
let banlist = [];
ban_get().then((json) => {
  for (let i = 0; i < json.message.length; i++) {
    if (banlist.includes(json.message[i].userid)) {
    } else {
      banlist.push(json.message[i].userid);
    }
  }
});
user_get().then((json) => {
  console.log(json);
  let template = `<li>%room:-->%username</li>`;
  let html = "";
  html += `<ul>`;
  for (let i = 0; i < json.message.length; i++) {
    if (banlist.includes(json.message[i].userid)) {
    } else {
      html += template
        .replace("%room", json.message[i].roomid)
        .replace("%username", json.message[i].userid);
    }
  }
  html += `</ul>`;
  console.log(html);
  div_u.innerHTML = html;
});

ban.onclick = () => {
  if (inpu.value) {
    console.log("ciao");
    ban_u(inpu.value).then((json) => {
      console.log(json);
    });
  }
};
