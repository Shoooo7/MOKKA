
document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTS

  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".menu-card");
  const navLinks = document.querySelectorAll(".navigation a");

  // NOTIFICATIONS

  function showToast(message) {
    const oldToast = document.querySelector(".mokka-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.className = "mokka-toast";
    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // THEME

  function setTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");

    themeToggle.textContent = theme === "dark" ? "☀" : "◐";

    localStorage.setItem("mokka-theme", theme);
  }

  const savedTheme = localStorage.getItem("mokka-theme") || "light";
  setTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");

    setTheme(isDark ? "light" : "dark");
  });

  // MOBILE NAVIGATION

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.textContent = isOpen ? "✕" : "☰";
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", event => {
    if (
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      navigation.classList.remove("open");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  // MENU FILTERS

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {

      const category = button.dataset.category;

      filterButtons.forEach(item => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      menuCards.forEach(card => {
        const matches =
          category === "all" ||
          card.dataset.category === category;

        card.classList.toggle("hidden", !matches);
      });
    });
  });

  // HEADER SCROLL EFFECT

  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });

  // SMOOTH SCROLL

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // REVEAL ANIMATIONS

  const revealElements = document.querySelectorAll(
    ".intro-grid, .menu-card, .about-content, .about-image, .gallery-item, .review-card, .contacts-grid"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(element => {
      element.classList.add("reveal");
      observer.observe(element);
    });
  }

  // BUTTON FEEDBACK

  document.querySelectorAll(".button").forEach(button => {
    const href = button.getAttribute("href");

    if (href && href.startsWith("#")) return;

    button.addEventListener("click", () => {
      showToast("Спасибо за интерес к MOKKA!");
    });
  });

  // CONTACT INTERACTION

  const emailLink = document.querySelector(
    '.contacts-info p:last-child'
  );

  if (emailLink) {
    emailLink.style.cursor = "pointer";
    emailLink.title = "Нажмите, чтобы скопировать адрес";

    emailLink.addEventListener("click", async () => {
      const email = emailLink.textContent.trim();

      try {
        await navigator.clipboard.writeText(email);
        showToast("Адрес скопирован");
      } catch {
        showToast("hello@mokka.example");
      }
    });
  }

  // CURRENT YEAR

  const footerYear = document.querySelector(".footer-content > span");

  if (footerYear) {
    footerYear.textContent =
      `© ${new Date().getFullYear()} MOKKA. DEMO PROJECT.`;
  }

  // CONSOLE

  console.log("MOKKA website successfully initialized.");

  // BOOKING SYSTEM

  const bookingOpen = document.getElementById("bookingOpen");
  const bookingClose = document.getElementById("bookingClose");
  const bookingOverlay = document.getElementById("bookingOverlay");
  const bookingForm = document.getElementById("bookingForm");
  const bookingDate = document.getElementById("bookingDate");

  function closeBooking() {
    bookingOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  bookingOpen.addEventListener("click", () => {
    bookingOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  bookingClose.addEventListener("click", closeBooking);

  bookingOverlay.addEventListener("click", event => {
    if (event.target === bookingOverlay) {
      closeBooking();
    }
  });

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      bookingOverlay.classList.contains("open")
    ) {
      closeBooking();
    }
  });

  const today = new Date();
  const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  ).toISOString().split("T")[0];

  bookingDate.min = localToday;

  bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) return;

    const name = document.getElementById("bookingName").value.trim();
    const date = bookingDate.value;
    const time = document.getElementById("bookingTime").value;

    if (!name || date < localToday) {
      showToast("Проверьте введённые данные");
      return;
    }

    closeBooking();
    bookingForm.reset();
    showToast("Спасибо, " + name + "! Демо-заявка оформлена.");
  });

  // SHOPPING CART SYSTEM

  const cart = [];

  // Create cart button

  const cartButton = document.createElement("button");
  cartButton.className = "cart-header-button";
  cartButton.innerHTML = 'Корзина <span class="cart-count">0</span>';
  cartButton.setAttribute("aria-label", "Открыть корзину");

  const navActions = document.querySelector(".nav-actions");
  navActions.insertBefore(cartButton, menuToggle);

  // Create cart window

  const cartOverlay = document.createElement("div");
  cartOverlay.className = "cart-overlay";

  cartOverlay.innerHTML = `
    <div class="cart-panel">
      <div class="cart-top">
        <h2>Корзина<span style="color:var(--accent)">.</span></h2>
        <button class="cart-close" aria-label="Закрыть">×</button>
      </div>

      <div class="cart-items"></div>

      <div class="cart-summary">
        <div class="cart-total">
          <span>Итого:</span>
          <strong class="cart-total-price">0 ₽</strong>
        </div>

        <button class="button button-primary cart-checkout">
          Оформить заказ ↗
        </button>

        <p class="cart-note">
          Демонстрационный заказ. Реальная отправка не подключена.
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(cartOverlay);

  const cartItems = cartOverlay.querySelector(".cart-items");
  const cartCount = cartButton.querySelector(".cart-count");
  const cartTotal = cartOverlay.querySelector(".cart-total-price");

  const cartClose = cartOverlay.querySelector(".cart-close");
  const checkoutButton = cartOverlay.querySelector(".cart-checkout");
  const cartSummary = cartOverlay.querySelector(".cart-summary");

  // Add buttons to products

  menuCards.forEach((card, index) => {
    const name = card.querySelector("h3").textContent.trim();

    const priceText = card.querySelector(".menu-info strong")
      .textContent.replace(/[^\d]/g, "");

    const price = Number(priceText);

    const addButton = document.createElement("button");

    addButton.className = "add-to-cart";
    addButton.textContent = "Добавить в корзину +";

    addButton.addEventListener("click", () => {
      const existing = cart.find(item => item.id === index);

      if (existing) {
        existing.quantity++;
      } else {
        cart.push({
          id: index,
          name,
          price,
          quantity: 1
        });
      }

      renderCart();
      showToast(name + " добавлен в корзину");
    });

    card.querySelector(".menu-info").appendChild(addButton);
  });

  // Render cart

  function renderCart() {
    const totalQuantity = cart.reduce(
      (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = totalPrice.toLocaleString("ru-RU") + " ₽";

    cartItems.innerHTML = "";

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div style="font-size:40px;margin-bottom:15px">☕</div>
          <h3>Корзина пока пуста</h3>
          <p>Выберите что-нибудь вкусное из нашего меню.</p>
        </div>
      `;

      cartSummary.style.display = "none";
      return;
    }

    cartSummary.style.display = "block";

    cart.forEach(item => {
      const element = document.createElement("div");
      element.className = "cart-item";

      const info = document.createElement("div");

      const name = document.createElement("h3");
      name.textContent = item.name;

      const price = document.createElement("p");
      price.className = "cart-item-price";
      price.textContent =
        (item.price * item.quantity).toLocaleString("ru-RU") + " ₽";

      info.append(name, price);

      const controls = document.createElement("div");
      controls.className = "cart-controls";

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Уменьшить количество");

      const quantity = document.createElement("span");
      quantity.textContent = item.quantity;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.setAttribute("aria-label", "Увеличить количество");

      const remove = document.createElement("button");
      remove.className = "cart-remove";
      remove.textContent = "Удалить";

      minus.addEventListener("click", () => {
        item.quantity--;

        if (item.quantity <= 0) {
          cart.splice(cart.indexOf(item), 1);
        }

        renderCart();
      });

      plus.addEventListener("click", () => {
        item.quantity++;
        renderCart();
      });

      remove.addEventListener("click", () => {
        cart.splice(cart.indexOf(item), 1);
        renderCart();
      });

      controls.append(minus, quantity, plus);

      const right = document.createElement("div");
      right.append(controls, remove);

      element.append(info, right);
      cartItems.appendChild(element);
    });
  }

  // Open and close cart

  function closeCart() {
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  cartButton.addEventListener("click", () => {
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  cartClose.addEventListener("click", closeCart);

  cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
      closeCart();
    }
  });

  // Checkout

  checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) return;

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    closeCart();

    showToast(
      "Демо-заказ оформлен! Сумма: " +
      total.toLocaleString("ru-RU") + " ₽"
    );

    cart.length = 0;
    renderCart();
  });

  renderCart();


});
