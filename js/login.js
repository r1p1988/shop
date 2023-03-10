import { urlUsers, controller, storageUsers } from "./controller.js";

let loginForm = document.querySelector("#loginForm"),
  registrationForm = document.querySelector("#registrationForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let email = e.target.querySelector(`input[data-name="email"]`),
    password = e.target.querySelector(`input[data-name="password"]`),
    error = e.target.querySelector(".error");

  let usersAlreadyExistEmail = storageUsers.find(
    (user) => user.email === email.value
  );

  if (!usersAlreadyExistEmail) {
    error.classList.add(`active`);
    error.innerHTML = `Invalid email`;
    return;
  } else if (usersAlreadyExistEmail.password !== password.value) {
    error.classList.add(`active`);
    error.innerHTML = `Invalid password`;
    return;
  } else {
    let changeUserStatus = {
      status: true,
    };

    let usersId = usersAlreadyExistEmail.id;
    let changeUser = await controller(
      urlUsers + "/users/" + usersId,
      `PUT`,
      changeUserStatus
    );

    localStorage.setItem(
      `email`,
      JSON.stringify(`${usersAlreadyExistEmail.email}`)
    );
    document.location.replace("index.html");
  }
});

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let name = e.target.querySelector(`input[data-name="name"]`),
    password = e.target.querySelector(`input[data-name="password"]`),
    email = e.target.querySelector(`input[data-name="email"]`),
    passwordVerify = e.target.querySelector(
      `input[data-name="passwordVerify"]`
    ),
    error = e.target.querySelector(`div[class="error"]`);

  let usersAlreadyExistEmail = storageUsers.find(
    (user) => user.email === email.value
  );

  if (usersAlreadyExistEmail) {
    error.innerHTML = `User with email ${email.value} already exist!`;
    error.classList.add(`active`);
    return;
  } else if (password.value !== passwordVerify.value) {
    error.innerHTML = `Password not matches!`;
    error.classList.add(`active`);
    return;
  } else {
    let NewUser = {
      name: name.value,
      email: email.value,
      password: password.value,
      status: true,
    };
    let changeUser = await controller(urlUsers + "/users", `POST`, NewUser);
    localStorage.setItem(`email`, JSON.stringify(`${email.value}`));
    document.location.replace("index.html");
  }
});
