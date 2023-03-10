import {
  urlProducts,
  urlUsers,
  controller,
  storageUsers,
  logIn,
  logOut,
  percent,
} from "./controller.js";

let headerLogoutBtn = document.querySelector("#headerLogout"),
  deleteAcc = document.querySelector("#deleteAcc");

logIn();

headerLogoutBtn.addEventListener(`click`, async (e) => {
  let changeUserStatus = {
    status: false,
  };

  let user = storageUsers.find(
    (user) => user.email === JSON.parse(localStorage.getItem(`email`))
  );
  let changeUser = await controller(
    urlUsers + "/users/" + user.id,
    `PUT`,
    changeUserStatus
  );

  logOut();

  localStorage.clear();
  document.location.replace("index.html");
});

const profileInfo = () => {
  let userInfoName = document.querySelector("#userInfoName"),
    userInfoEmail = document.querySelector("#userInfoEmail");

  if (localStorage.getItem(`email`)) {
    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );

    if (user) {
      userInfoName.innerHTML = user.name;
      userInfoEmail.innerHTML = user.email;
    }
  }
};

profileInfo();


deleteAcc.addEventListener(`click`, async () => {
  let changeUserStatus = {
    status: false,
  };

  if (localStorage.getItem(`email`)) {
    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );

    if (user) {
      let changeUser = await controller(
        urlUsers + "/users/" + user.id,
        `PUT`,
        changeUserStatus
      );
      document.location.replace("index.html");
    }
  }
});

const renderOrdeTr = (item, count) => {
  let row = document.createElement("tr");
  row.innerHTML = `
    <td>
                  <div class="item__info">
                    <img
                      src="images/products/${item.img}.png"
                      alt="${item.title}"
                      height="100"
                    />
                    <div>
                      <p class="item__info--title">${item.title}</p>
                    </div>
                  </div>
                </td>
                <td>${item.price}</td>
                <td>${
                  item.sale
                    ? `<span class="item__sale">-${item.salePercent}%</span>`
                    : "-"
                }</td>
                <td>${count}</td>
                <td>${
                  item.sale ? percent(item) * count : item.price * count
                }</td>`;
  let tbody = document.querySelector(`#orderTable tbody`);
  !tbody && renderTable();
  tbody.append(row);
};

const renderTable = () => {
  let tableContainer = document.createElement("div");
  tableContainer.className = `table__container`;

  let table = document.createElement("table");
  table.id = `orderTable`;
  table.className = `order__table`;

  table.innerHTML = `<caption>
              Ordered Items
            </caption>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Price</th>
                <th>Sale</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
    <tbody></tbody>`;

  tableContainer.append(table);
  document.querySelector(".shoppingCart__container").prepend(tableContainer);
};

const renderOrders = (data) =>
  data.forEach(async (item) => {
    let products = await controller(urlProducts + `/products/${item.id}`);
    renderOrdeTr(products, item.count);
  });

const renderStrorageOrders = () => {
  if (localStorage.getItem(`email`)) {
    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );

    if (user) {
      if (user.orders.length > 0) {
        renderTable();
        renderOrders(user.orders);
      }
    }
  }
};

renderStrorageOrders();
