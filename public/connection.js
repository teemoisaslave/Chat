export const Login = (user, pass) => {
  return new Promise((resolve, reject) => {
    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
export const Login_u = (user, pass) => {
  return new Promise((resolve, reject) => {
    fetch("/login_u", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
export const Regis_u = (user, pass) => {
  return new Promise((resolve, reject) => {
    fetch("/Regis_u", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
export const room_up = (room) => {
  return new Promise((resolve, reject) => {
    fetch("/room_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: room,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
export const room_get = async () => {
  let dati = await fetch("/room_get", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  dati = await dati.json();
  return dati;
};
