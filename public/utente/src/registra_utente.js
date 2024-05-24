import { Regis_u, Utenti_get } from "../../connection.js";

const username = document.getElementById("username");
const password = document.getElementById("password");
const Regis = document.getElementById("regisB");
const ShowPassword = document.getElementById("ShowPassword");
Utenti_get().then((response1) => {
  console.log(response1);
  let users = [];
  for (let i = 0; i < response1.users.length; i++) {
    users.push(response1.users[i].username);
  }
  Regis.onclick = () => {
    console.log(username.value, password.value, users);
    if (users.includes(username.value + "@itis-molinari.eu")) {
      window.alert("esiste già un utente con questo nome");
    } else if (username.value && password.value) {
      Regis_u(username.value + "@itis-molinari.eu", password.value).then(
        (response) => {
          console.log(response);
          if (response.result === "ok") {
            localStorage.setItem("acesso", true);
            window.location = "./utente.html";
          } else {
            window.alert("Errore nel Login");
          }
        },
      );
    } else {
      window.alert("inserisci uno username e una password");
    }
  };
});
ShowPassword.onclick = () => {
  if (password.getAttribute("type") === "password") {
    ShowPassword.innerHTML = `<span class="material-symbols-outlined">
visibility
</span>`;
    password.setAttribute("type", "text");
  } else {
    password.setAttribute("type", "password");
    ShowPassword.innerHTML = `<span class="material-symbols-outlined">
visibility_off
</span>`;
  }
};
