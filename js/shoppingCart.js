import {
  urlProducts,
  urlUsers,
  controller,
  logOut,
  logIn,
  storageUsers,
  shoppingCartValue,
  percent,
} from "./controller.js";

let headerLogoutBtn = document.querySelector("#headerLogout"),
  headerShoppingCartCount = document.querySelector(`#headerShoppingCartCount`),
  orderSummary = document.querySelector("#orderSummary"),
  orderSummaryTotal = document.querySelector("#orderSummaryTotal");

const renderOrdeTr = (item) => {
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
                }</td>`;

  let QuantityTd = document.createElement("td"),
    input = document.createElement("input");

  input.type = "number";
  input.min = 1;
  input.value = 1;

  QuantityTd.append(input);

  let TotalTd = document.createElement("td");
  TotalTd.innerHTML = item.sale
    ? percent(item) * input.value
    : item.price * input.value;

  let ButtonTd = document.createElement("td"),
    button = document.createElement("button");
  button.className = `item__remove`;

  let img = document.createElement("img");
  img.src = `images/delete.png`;
  img.alt = `delete`;
  img.height = `20`;

  button.append(img);
  ButtonTd.append(button);
  row.append(QuantityTd, TotalTd, ButtonTd);

  let tbody = document.querySelector(`#shoppingCartTable tbody`);
  !tbody && renderTable();
  tbody.append(row);

  let shoppingCartTable = document.querySelector("#shoppingCartTable");
  orderSummaryTotal.innerHTML = `$${col_sum(shoppingCartTable, 4)}`;

  input.addEventListener("change", async () => {
    TotalTd.innerHTML = item.sale
      ? percent(item) * input.value
      : item.price * input.value;
    let shoppingCartTable = document.querySelector("#shoppingCartTable");
    orderSummaryTotal.innerHTML = `$${col_sum(shoppingCartTable, 4)}`;

    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );
    const index = user.shoppingCart.findIndex((n) => n.id === item.id);
    user.shoppingCart[index].count = input.value;

    let changeShoppingCart = {
      shoppingCart: user.shoppingCart,
    };

    let changeUser = await controller(
      urlUsers + "/users/" + user.id,
      `PUT`,
      changeShoppingCart
    );
  });

  button.addEventListener("click", async () => {
    if (localStorage.getItem(`email`)) {
      let user = storageUsers.find(
        (user) => user.email === JSON.parse(localStorage.getItem(`email`))
      );

      if (user) {
        const index = user.shoppingCart.findIndex((n) => n.id === item.id);
        if (index !== -1) {
          user.shoppingCart.splice(index, 1);
        }
        headerShoppingCartCount.innerHTML = user.shoppingCart.length;
        let changeShoppingCart = {
          shoppingCart: user.shoppingCart,
        };

        let changeUser = await controller(
          urlUsers + "/users/" + user.id,
          `PUT`,
          changeShoppingCart
        );
      }
    }
    row.remove();
    orderSummaryTotal.innerHTML = `$${col_sum(shoppingCartTable, 4)}`;
  });
};

const col_sum = (table, col) => {
  let sum = 0,
    tr = table.querySelectorAll("tr");

  for (let i = 1; i < tr.length; i++) {
    let td = tr[i].querySelectorAll("td");

    if (!td.length || !td[col]) continue;

    sum += Number(td[col].textContent) || 0;
  }

  return sum;
};

const renderTable = () => {
  let tableContainer = document.createElement("div");
  tableContainer.className = `table__container`;

  let table = document.createElement("table");
  table.id = `shoppingCartTable`;
  table.className = `order__table`;

  table.innerHTML = `<caption>
              Items in Shopping Cart
            </caption>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Price</th>
                <th>Sale</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
    <tbody></tbody>`;

  tableContainer.append(table);
  document.querySelector(".shoppingCart__container").prepend(tableContainer);
};

const renderOrders = (data) =>
  data.forEach(async (item) => {
    let products = await controller(urlProducts + `/products/${item.id}`);
    renderOrdeTr(products);
  });

const renderStrorageOrders = () => {
  let user = storageUsers.find(
    (user) => user.email === JSON.parse(localStorage.getItem(`email`))
  );

  if (user.shoppingCart.length > 0) {
    renderTable();
    renderOrders(user.shoppingCart);
  }
};

renderStrorageOrders();
logIn();
shoppingCartValue();

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

  headerShoppingCartCount.innerHTML = 0;
  logOut();

  localStorage.clear();
});

orderSummary.addEventListener(`submit`, async (e) => {
  e.preventDefault();

  let user = storageUsers.find(
    (user) => user.email === JSON.parse(localStorage.getItem(`email`))
  );
  let newUserOrder = user.orders.concat(user.shoppingCart);
  let orders = {
    orders: newUserOrder,
    shoppingCart: [],
  };

  let changeOrders = await controller(
    urlUsers + "/users/" + user.id,
    `PUT`,
    orders
  );
  document.location.replace("account.html");
});
