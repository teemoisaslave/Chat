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
