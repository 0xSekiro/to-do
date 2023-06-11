const button = document.querySelector("button");
button.onclick = async () => {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;
  const body = { username, email, password, passwordConfirm };

  for (i in body) {
    if (body[i] == "") {
      if (i == "passwordConfirm")
        return (document.getElementById(
          "error"
        ).innerText = `Please confirm password `);
      return (document.getElementById("error").innerText = `Please enter ${i}`);
    }
  }
  if (password != passwordConfirm) {
    return (document.getElementById("error").innerText =
      "Passwords are not the same");
  }

  const res = await fetch("/api/v1/usersAuth/sign-up", {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(body),
  });
  if (res.status == 400) {
    document.getElementById("error").innerText =
      JSON.parse(await res.text()).err.message || "Username already exist";
  } else if (res.status == 201) {
    location.assign("/to-do");
  }
};
