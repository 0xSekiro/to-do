const button = document.querySelector("button");
button.onclick = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const body = { username, password };
  for (i in body) {
    if (body[i] == "")
      return (document.getElementById("error").innerText =
        "Please enter username and password");
  }

  const res = await fetch("/api/v1/usersAuth/sign-in", {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(body),
  });
  if (res.status == 200) {
    location.assign("/to-do");
  } else {
    document.getElementById("error").innerText = JSON.parse(
      await res.text()
    ).message;
  }
};
