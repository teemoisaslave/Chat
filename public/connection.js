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
export const Utenti_get = () => {
  return new Promise((resolve, reject) => {
    fetch("/Utenti_get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
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
export const msng_get = async (room) => {
  let dati = await fetch("/msng_get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      room: room,
    }),
  });
  dati = await dati.json();
  return dati;
};
export const msng_up = (message, room, username, timestamp, type) => {
  return new Promise((resolve, reject) => {
    fetch("/msng_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        room: room,
        username: username,
        timestamp: timestamp,
        type: type,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
export const user_get = async () => {
  let dati = await fetch("/user_get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  dati = await dati.json();
  return dati;
};
export const user_up = (room, username, sid) => {
  return new Promise((resolve, reject) => {
    fetch("/user_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: room,
        username: username,
        sid: sid,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
export const user_update = (room, username, sid) => {
  return new Promise((resolve, reject) => {
    fetch("/user_update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: room,
        username: username,
        sid: sid,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
export const ban_u = (username) => {
  return new Promise((resolve, reject) => {
    fetch("/ban_u", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
      }),
    })
      .then((resp) => resp.json())
      .then((response) => resolve(response))
      .catch((err) => reject(err));
  });
};
export const ban_get = async () => {
  let dati = await fetch("/ban_get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  dati = await dati.json();
  return dati;
};
