import { Login } from "../../connection.js";

const username = document.getElementById("username");
const password = document.getElementById("password");
const login = document.getElementById("loginB");
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

login.onclick = () => {
  console.log(username.value, password.value);
  Login_u(username.value, password.value).then((response) => {
    console.log(response);
    if (response.result === "ok") {
      localStorage.setItem("acesso", true);
      window.location = "./utente.html";
    } else {
      window.alert("Errore nel Login");
    }
  });
};
