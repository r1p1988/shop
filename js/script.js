import {
  urlProducts,
  urlUsers,
  controller,
  storageUsers,
  logOut,
  logIn,
  shoppingCartValue,
  percent,
} from "./controller.js";

let headerShoppingCart = document.querySelector("#headerShoppingCart"),
  headerShoppingCartCount = document.querySelector(`#headerShoppingCartCount`),
  headerLogoutBtn = document.querySelector("#headerLogout"),
  mainDiv = document.querySelector("#categoriesContainer");

const productImgUrl = `images/products`;

const CATEGORY = [`Boat`, `Bus`, `Car`, `Helicopter`, `Bike`, `Aircraft`];

const renderSection = (item) => {
  let section = document.createElement("section");
  section.className = `category`;
  section.setAttribute(`data-name`, `${item}`);

  let h2Category = document.createElement("h2");
  h2Category.innerHTML = `${item}`;

  let div = document.createElement("div");
  div.className = `category__container`;

  section.append(h2Category, div);
  mainDiv.append(section);
};

CATEGORY.forEach((item) => renderSection(item));

const renderProductsBlock = (item) => {
  let dataDiv = document.createElement("div");
  dataDiv.className = `product`;
  dataDiv.setAttribute("data-id", `${item.id}`);

  let productImg = document.createElement("img");
  productImg.src = productImgUrl + `/${item.img}.png`;
  productImg.className = `product__img`;
  productImg.alt = item.title;
  productImg.style.height = `80px`;

  let productTitle = document.createElement("p");
  productTitle.className = `product__title`;
  productTitle.innerHTML = item.title;

  let productSale = document.createElement("div");
  productSale.className = `product__sale`;

  let productSaleOld = document.createElement("span");
  productSaleOld.className = `product__sale--old`;
  productSaleOld.innerHTML = item.price;

  let productSalePercent = document.createElement("span");
  productSalePercent.className = `product__sale--percent`;
  productSalePercent.innerHTML = `-${item.salePercent}%`;

  productSale.append(productSaleOld, productSalePercent);

  let productInfo = document.createElement("div");
  productInfo.className = `product__info`;

  let productPrice = document.createElement("span");
  productPrice.className = `product__price`;
  productPrice.innerHTML = item.sale ? `$${percent(item)}` : `$${item.price}`;

  let productCart = document.createElement("button");
  productCart.className = `product__cart`;

  let imgCart = document.createElement("img");
  imgCart.src = `images/shopping-cart.png`;
  imgCart.alt = `shopping cart`;
  imgCart.style.height = `20px`;

  productCart.append(imgCart);
  productInfo.append(productPrice, productCart);

  dataDiv.append(
    productImg,
    productTitle,
    item.sale ? productSale : ``,
    productInfo
  );

  let section = document.querySelector(
    `section[data-name="${item.category}"] > div`
  );
  section.append(dataDiv);

  if (localStorage.getItem(`email`)) {
    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );

    if (user) {
      if (user.shoppingCart.find((items) => items.id === item.id)) {
        productCart.classList.add(`product__cart--in`);
      }
    }
  }

  productCart.addEventListener(`click`, async () => {
    if (localStorage.getItem(`email`)) {
      let user = storageUsers.find(
        (user) => user.email === JSON.parse(localStorage.getItem(`email`))
      );

      if (user) {
        if (user.shoppingCart.find((items) => items.id === item.id)) {
          let index = user.shoppingCart.findIndex(
            (items) => items.id === item.id
          );
          user.shoppingCart.splice(index, 1);
          productCart.classList.remove(`product__cart--in`);
          headerShoppingCartCount.innerHTML = user.shoppingCart.length;
        } else {
          user.shoppingCart.push({ id: item.id, count: 1 });
          productCart.classList.add(`product__cart--in`);
          headerShoppingCartCount.innerHTML = user.shoppingCart.length;
        }
        let changeShoppingCart = {
          shoppingCart: user.shoppingCart,
        };

        let changeUser = await controller(
          urlUsers + "/users/" + user.id,
          `PUT`,
          changeShoppingCart
        );
      }
    } else {
      document.location.replace("login.html");
    }
  });
};

const renderProducts = (data) =>
  data
    .filter((item) => CATEGORY.includes(item.category))
    .forEach((data) => renderProductsBlock(data));

const renderStrorageProducts = async () => {
  let products = await controller(urlProducts + "/products");
  if (products.length > 0) {
    renderProducts(products);
  }
};

renderStrorageProducts();
logIn();
shoppingCartValue();

headerLogoutBtn.addEventListener(`click`, async (e) => {
  logOut();
  headerShoppingCartCount.innerHTML = 0;
  let product__cart = [...document.querySelectorAll(".product__cart")];
  product__cart.map((item) => item.classList.remove(`product__cart--in`));
  localStorage.clear();
});

headerShoppingCart.addEventListener(`click`, async (e) => {
  if (localStorage.getItem(`email`)) {
    let user = storageUsers.find(
      (user) => user.email === JSON.parse(localStorage.getItem(`email`))
    );

    if (user) {
      headerShoppingCart.href = `shoppingCart.html`;
      document.location.replace("shoppingCart.html");
    }
  } else {
    headerShoppingCart.href = `login.html`;
    document.location.replace("login.html");
  }
});
