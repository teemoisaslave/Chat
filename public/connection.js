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

export const New_m = (u, m) => {
  return new Promise((resolve, reject) => {
    fetch("/new_m", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: u,
        message: m,
      }),
    });
  });
};
export const New_u = (u, m) => {
  return new Promise((resolve, reject) => {
    fetch("/new_c", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: u,
      }),
    });
  });
};
