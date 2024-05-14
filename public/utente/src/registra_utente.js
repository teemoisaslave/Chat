import { Regis_u } from "../../connection.js";

const username = document.getElementById("username");
const password = document.getElementById("password");
const Regis = document.getElementById("RegisB");
const ShowPassword = document.getElementById("ShowPassword");

ShowPassword.onclick = () => {
  //console.log(password.getAttribute("type"));
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

Regis.onclick = () => {
  console.log(username.value, password.value);
  Regis_u(username.value, password.value).then((response) => {
    console.log(response);
    if (response.result === "ok") {
      localStorage.setItem("acesso", true);
      window.location = "./utente.html";
    } else {
      window.alert("Errore nel Login");
    }
  });
};
