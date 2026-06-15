// Toggle class active navbar
const navbarNav = document.querySelector(".navbar-nav");
const menuToggle = document.querySelector("#hamburger-menu");

menuToggle.onclick = () => {
  navbarNav.classList.toggle("active");
};

// Search form
const searchForm = document.querySelector(".search-form");
const searchIcon = document.querySelector("#search");
const searchInput = document.querySelector("#search-box");

if (searchIcon) {
  searchIcon.addEventListener("click", function (e) {
    e.preventDefault();
    searchForm.classList.toggle("active");

    if (searchForm.classList.contains("active")) {
      searchInput.focus();
    }
  });
}

// Shopping cart
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingIcon = document.querySelector("#shopping");

if (shoppingIcon) {
  shoppingIcon.addEventListener("click", function (e) {
    e.preventDefault();
    shoppingCart.classList.toggle("active");
  });
}

// Klik di luar elemen
document.addEventListener("click", function (e) {
  // navbar
  if (!menuToggle.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  // search
  if (!searchForm.contains(e.target) && !searchIcon.contains(e.target)) {
    searchForm.classList.remove("active");
  }

  // cart
  if (
    shoppingCart &&
    shoppingIcon &&
    !e.target.closest(".shopping-cart") &&
    !e.target.closest("#shopping")
  ) {
    shoppingCart.classList.remove("active");
  }
});

// Shopping cart array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// tambahkan qty=1 jika data lama belum punya qty
cart = cart.map((item) => ({
  ...item,
  qty: item.qty || 1,
}));

// Update cart
function updateCart() {
  const cartItems = document.querySelector(".cart-items");
  const totalHarga = document.querySelector("#total-harga");
  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="cart-empty">
      Cart masih kosong
      </p>
    `;
    totalHarga.innerText = "Rp 0";
    return;
  }

  cart.forEach((product, index) => {
    let angka = Number(product.price.replace(/[^0-9]/g, ""));
    total += angka * product.qty;

    cartItems.innerHTML += `

<div class="cart-item">
  <img src="${product.image}">

  <div class="item-detail">
    <h3>${product.title}</h3>

    <div class="item-price">
      ${product.price}
    </div>

    <div class="qty-row">
      <div class="qty-control">

        <button type="button"
        onclick="event.stopPropagation(); kurangQty(${index})">
        -
        </button>

        <span>${product.qty}</span>

        <button type="button"
        onclick="event.stopPropagation(); tambahQty(${index})">
        +
        </button>

      </div>

      <i data-feather="trash-2"
      class="hapus-btn"
      onclick="event.stopPropagation(); removeCart(${index})">
      </i>
    </div>
  </div>
</div>
`;
  });

  totalHarga.innerText = "Rp " + total.toLocaleString("id-ID");
  feather.replace();
  shoppingCart.classList.add("active");
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart
document.querySelectorAll(".cart-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const item = this.closest(".item");

    const title = item.querySelector(".item-title").innerText;

    const price = item.querySelector(".item-harga").innerText;

    const image = item.querySelector(".item-img").src;

    const existingProduct = cart.find((product) => product.title === title);

    if (existingProduct) {
      existingProduct.qty++;
    } else {
      cart.push({
        title,
        price,
        image,
        qty: 1,
      });
    }

    updateCart();
    alert(title + " berhasil ditambahkan ke keranjang!");
  });
});

// Remove from cart
function tambahQty(index) {
  shoppingCart.classList.add("active");
  cart[index].qty++;

  updateCart();
}

function kurangQty(index) {
  shoppingCart.classList.add("active");

  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }

  updateCart();
}

function removeCart(index) {
  shoppingCart.classList.add("active");
  cart.splice(index, 1);

  updateCart();
}

// tampilkan cart saat halaman dibuka
updateCart();

/// Search filter
const items = document.querySelectorAll(".item");

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    items.forEach((item) => {
      const title = item.querySelector(".item-title").innerText.toLowerCase();

      const desc = item.querySelector("p").innerText.toLowerCase();

      item.style.display =
        title.includes(keyword) || desc.includes(keyword) ? "" : "none";
    });
  });
}
