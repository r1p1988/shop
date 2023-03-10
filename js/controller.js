export const urlUsers = `https://634e9f834af5fdff3a625f84.mockapi.io`;
export const urlProducts = `https://634e9f834af5fdff3a625f84.mockapi.io`;

export const controller = async (url, method = `GET`, obj) => {
  let options = {
    method: method,
    headers: {
      "content-type": "application/json",
    },
  };

  if (obj) options.body = JSON.stringify(obj);

  let request = await fetch(url, options),
    response = request.ok ? request.json() : Promise.catch(request.statusText);
  return response;
};

export const storageUsers = await controller(urlUsers + "/users");

export const logOut = async () => {
  if (localStorage.getItem(`email`)) {
    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );

    if (user) {
      headerUser.href = `login.html`;
      headerUser.innerHTML = `Log in`;
      headerLogout.classList.remove(`active`);

      let changeUserStatus = {
        status: false,
      };
      let changeUser = await controller(
        urlUsers + "/users/" + user.id,
        `PUT`,
        changeUserStatus
      );
      document.location.replace("index.html");
    }
  }
};

export const logIn = () => {
  if (localStorage.getItem(`email`)) {
    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );

    if (user) {
      headerUser.href = `account.html`;
      headerUser.innerHTML = user.name;
      headerLogout.classList.add(`active`);
    }
  }
};

export const shoppingCartValue = () => {
  if (localStorage.getItem(`email`)) {
    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );

    if (user) {
      headerShoppingCartCount.innerHTML =
        user.shoppingCart.length > 0 ? user.shoppingCart.length : 0;
    }
  } else {
    headerShoppingCartCount.innerHTML = 0;
  }
};

export const percent = (item) => {
  let percent = (item.price * item.salePercent) / 100;
  return item.price - Math.round(percent);
};
