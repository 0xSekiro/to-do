const email = document.getElementById("email");
const password = document.getElementById("password");
const username = document.getElementById("username");
const logoutBtn = document.getElementById("logout");
const chPassBtn = document.getElementById("chPass");
const newPass = document.getElementById("newPass");
const confNewPass = document.getElementById("newPassCon");
const updateBtn = document.getElementById("update");

let valPassB;

// get user info
async function getUser() {
  const res = JSON.parse(
    await (
      await fetch("/api/v1/users", {
        method: "GET",
      })
    ).text()
  );
  email.innerText = res.user.email;
  username.innerText = res.user.username;
  password.value = res.user.password;

  valUserB = username.value;
  valPassB = password.value;
}
window.onload = getUser();

// update username and password
chPassBtn.onclick = () => {
  password.disabled = false;
  password.value = "";
  password.style = "outline: 5px solid green;";
  newPass.style.visibility = "visible";
  confNewPass.style.visibility = "visible";
};

updateBtn.onclick = async () => {
  // if password donesn't change
  if (valPassB == password.value) {
    return (document.getElementById("mess").innerText =
      "Please change password before update");
  }

  // if password changed make sure that user enter and confirm new one
  if (valPassB != password.value) {
    if (newPass.value == "" || confNewPass.value == "") {
      return (document.getElementById("mess").innerText =
        "Please enter new password and confirm it");
    } else {
      if (newPass.value != confNewPass.value) {
        return (document.getElementById("mess").innerText =
          "Passwords are not the same !");
      }
    }
  }

  // send request to update
  const res = await fetch("/api/v1/users", {
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    method: "PATCH",
    body: JSON.stringify({
      password: password.value,
      newPass: newPass.value,
    }),
  });

  if (res.status != 200) {
    const message = JSON.parse(await res.text()).message;
    document.getElementById("mess").innerText = message;
  } else {
    document.getElementById("mess").innerText = "Profile updated ...";
  }
};

// logout
logoutBtn.onclick = async () => {
  await fetch("/logout");
  location.assign("/login");
};
