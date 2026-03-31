document.addEventListener("DOMContentLoaded", () => {
  // Loader
  const siteLoader = document.getElementById("site-loader");
  document.body.classList.add("loading");

  const hideLoader = () => {
    if (!siteLoader) return;

    siteLoader.classList.add("hidden");
    siteLoader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("loading");
  };

  window.addEventListener("load", () => {
    setTimeout(hideLoader, 500);
  });

  setTimeout(hideLoader, 1800);

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.06}s`;
    revealObserver.observe(el);
  });

  const statNumbers = document.querySelectorAll(".stat-number");

  const animateValue = (element, target) => {
    let current = 0;
    const increment = Math.ceil(target / 40);

    const update = () => {
      current += increment;

      if (current >= target) {
        element.textContent = target;
        return;
      }

      element.textContent = current;
      requestAnimationFrame(update);
    };

    update();
  };

  const heroSection = document.querySelector(".hero");

  const statsObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(num => {
            if (!num.dataset.animated) {
              animateValue(num, Number(num.dataset.target));
              num.dataset.animated = "true";
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  if (heroSection) {
    statsObserver.observe(heroSection);
  }

  const filterButtons = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");
  const searchInput = document.getElementById("product-search");
  const loadMoreBtn = document.getElementById("load-more-btn");

  let currentFilter = "all";
  let currentSearch = "";

  const filterProducts = () => {
    productCards.forEach(card => {
      const category = card.dataset.category.toLowerCase();
      const name = card.dataset.name.toLowerCase();

      const matchesFilter = currentFilter === "all" || category === currentFilter;
      const matchesSearch = name.includes(currentSearch);

      if (matchesFilter && matchesSearch) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  };

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter.toLowerCase();
      filterProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      currentSearch = e.target.value.trim().toLowerCase();
      filterProducts();
    });
  }

  // Success popup
  const successPopup = document.getElementById("success-popup");
  const successPopupTitle = document.getElementById("success-popup-title");
  const successPopupText = document.getElementById("success-popup-text");

  let popupTimer;

  const showSuccessPopup = (
    title = "Success",
    text = "Action completed successfully."
  ) => {
    if (!successPopup || !successPopupTitle || !successPopupText) return;

    successPopupTitle.textContent = title;
    successPopupText.textContent = text;
    successPopup.classList.add("active");
    successPopup.setAttribute("aria-hidden", "false");

    clearTimeout(popupTimer);

    popupTimer = setTimeout(() => {
      successPopup.classList.remove("active");
      successPopup.setAttribute("aria-hidden", "true");
    }, 2600);
  };

  const form = document.querySelector(".contact-form");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      showSuccessPopup("Request sent", "Thank you! Your request has been sent.");
      form.reset();
    });
  }

  // Cart sidebar logic
  const cartButton = document.querySelector(".cart-btn");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartCloseBtn = document.getElementById("cart-close-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const cartCount = document.querySelector(".cart-count");
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  const wishlistButtons = document.querySelectorAll(".wishlist-btn");

  let cart = [];

const WISHLIST_STORAGE_KEY = "techstore_wishlist";
let wishlist = [];

const saveWishlist = () => {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
};

const loadWishlist = () => {
  const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);

  if (!storedWishlist) {
    wishlist = [];
    return;
  }

  try {
    wishlist = JSON.parse(storedWishlist) || [];
  } catch (error) {
    wishlist = [];
  }
};
const saveCart = () => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const loadCart = () => {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) {
    cart = [];
    return;
  }

  try {
    cart = JSON.parse(storedCart) || [];
  } catch (error) {
    cart = [];
  }
};

  const formatPrice = value => `$${value.toFixed(2)}`;
  const isWishlisted = id => wishlist.includes(id);

const renderWishlist = () => {
  wishlistButtons.forEach(button => {
    const isActive = isWishlisted(button.dataset.id);
    button.classList.toggle("active", isActive);
    button.textContent = isActive ? "♥" : "♡";
    button.setAttribute(
      "aria-label",
      isActive ? "Remove from favorites" : "Add to favorites"
    );
  });
};

  const openCart = () => {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.classList.add("cart-open");
    cartSidebar.setAttribute("aria-hidden", "false");
  };

  const closeCart = () => {
    if (!cartSidebar || !cartOverlay) return;
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.classList.remove("cart-open");
    cartSidebar.setAttribute("aria-hidden", "true");
  };

  const updateCartCount = () => {
    if (!cartCount) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  };

  const updateSubtotal = () => {
    if (!cartSubtotal) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartSubtotal.textContent = formatPrice(total);
    if (checkoutTotal) {
      checkoutTotal.textContent = formatPrice(total);
    }
  };

  const renderCart = () => {
    if (!cartItemsContainer) return;

    if (!cart.length) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <p>Your cart is empty.</p>
        </div>
      `;
      updateCartCount();
      updateSubtotal();
      return;
    }

    cartItemsContainer.innerHTML = `
      <div class="cart-items-list">
        ${cart
          .map(
            item => `
              <article class="cart-item">
                <div class="cart-item-image">
                  <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                  <h4>${item.name}</h4>
                  <p class="cart-item-price">${formatPrice(item.price)}</p>

                  <div class="cart-item-actions">
                    <div class="cart-qty">
                      <button type="button" class="qty-decrease" data-id="${item.id}">−</button>
                      <span>${item.quantity}</span>
                      <button type="button" class="qty-increase" data-id="${item.id}">+</button>
                    </div>

                    <button type="button" class="cart-remove-btn" data-id="${item.id}">
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
    `;

    updateCartCount();
    updateSubtotal();
  };

  const addToCart = product => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

saveCart();
renderCart();
openCart();
showSuccessPopup("Added to cart", `${product.name} was added to your cart.`);
  };

  const increaseQuantity = id => {
    const item = cart.find(product => product.id === id);
    if (!item) return;
    item.quantity += 1;
    saveCart();
    renderCart();
  };

  const decreaseQuantity = id => {
    const item = cart.find(product => product.id === id);
    if (!item) return;

    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart = cart.filter(product => product.id !== id);
    }

    saveCart();
    renderCart();
  };

  const removeFromCart = id => {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
  };
  const toggleWishlist = id => {
  if (isWishlisted(id)) {
    wishlist = wishlist.filter(itemId => itemId !== id);
    showSuccessPopup("Removed", "Product removed from favorites.");
  } else {
    wishlist.push(id);
    showSuccessPopup("Added to favorites", "Product saved to favorites.");
  }

  saveWishlist();
  renderWishlist();
};

  if (cartButton) {
    cartButton.addEventListener("click", openCart);
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener("click", closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener("click", closeCart);
  }

  addToCartButtons.forEach(button => {
    button.addEventListener("click", e => {
      e.stopPropagation();

      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: Number(button.dataset.price),
        image: button.dataset.image
      };

      addToCart(product);
    });
  });
  wishlistButtons.forEach(button => {
  button.addEventListener("click", e => {
    e.stopPropagation();
    toggleWishlist(button.dataset.id);
  });
});

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", e => {
      const increaseBtn = e.target.closest(".qty-increase");
      const decreaseBtn = e.target.closest(".qty-decrease");
      const removeBtn = e.target.closest(".cart-remove-btn");

      if (increaseBtn) {
        increaseQuantity(increaseBtn.dataset.id);
      }

      if (decreaseBtn) {
        decreaseQuantity(decreaseBtn.dataset.id);
      }

      if (removeBtn) {
        removeFromCart(removeBtn.dataset.id);
      }
    });
  }

  // Product modal logic
  const productModal = document.getElementById("product-modal");
  const productModalOverlay = document.getElementById("product-modal-overlay");
  const productModalClose = document.getElementById("product-modal-close");
  const productModalImage = document.getElementById("product-modal-image");
  const productModalCategory = document.getElementById("product-modal-category");
  const productModalTitle = document.getElementById("product-modal-title");
  const productModalDescription = document.getElementById("product-modal-description");
  const productModalPrice = document.getElementById("product-modal-price");
  const productModalAddBtn = document.getElementById("product-modal-add-btn");

  let activeModalProduct = null;

  const openProductModal = product => {
    if (
      !productModal ||
      !productModalOverlay ||
      !productModalImage ||
      !productModalCategory ||
      !productModalTitle ||
      !productModalDescription ||
      !productModalPrice
    ) {
      return;
    }

    activeModalProduct = product;

    productModalImage.src = product.image;
    productModalImage.alt = product.name;
    productModalCategory.textContent = product.category;
    productModalTitle.textContent = product.name;
    productModalDescription.textContent = product.description;
    productModalPrice.textContent = formatPrice(product.price);

    productModal.classList.add("active");
    productModalOverlay.classList.add("active");
    productModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeProductModal = () => {
    if (!productModal || !productModalOverlay) return;

    productModal.classList.remove("active");
    productModalOverlay.classList.remove("active");
    productModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    activeModalProduct = null;
  };

  productCards.forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".add-to-cart-btn")) return;

      const image = card.querySelector(".product-image-wrap img")?.src || "";
      const name = card.dataset.name || "";
      const category = card.dataset.category || "";
      const description = card.dataset.description || "";
      const addBtn = card.querySelector(".add-to-cart-btn");
      const price = Number(addBtn?.dataset.price || 0);
      const id = addBtn?.dataset.id || name.toLowerCase().replace(/\s+/g, "-");

      openProductModal({
        id,
        name,
        category,
        description,
        price,
        image
      });
    });
  });

  if (productModalClose) {
    productModalClose.addEventListener("click", closeProductModal);
  }

  if (productModalOverlay) {
    productModalOverlay.addEventListener("click", closeProductModal);
  }

  if (productModalAddBtn) {
    productModalAddBtn.addEventListener("click", () => {
      if (!activeModalProduct) return;
      addToCart(activeModalProduct);
      closeProductModal();
      openCart();
    });
  }

  // Fake checkout logic
  const checkoutBtn = document.getElementById("checkout-btn");
  const checkoutOverlay = document.getElementById("checkout-overlay");
  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutCloseBtn = document.getElementById("checkout-close-btn");
  const checkoutForm = document.getElementById("checkout-form");
  const checkoutTotal = document.getElementById("checkout-total");
  const checkoutCardInput = document.getElementById("checkout-card");
  const checkoutExpiryInput = document.getElementById("checkout-expiry");
  const checkoutCvvInput = document.getElementById("checkout-cvv");

  const openCheckout = () => {
    if (!cart.length) {
      showSuccessPopup("Cart is empty", "Add products before checkout.");
      return;
    }

    if (!checkoutModal || !checkoutOverlay) return;

    updateSubtotal();
    checkoutModal.classList.add("active");
    checkoutOverlay.classList.add("active");
    checkoutModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("checkout-open");
  };

  const closeCheckout = () => {
    if (!checkoutModal || !checkoutOverlay) return;

    checkoutModal.classList.remove("active");
    checkoutOverlay.classList.remove("active");
    checkoutModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("checkout-open");
  };

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", openCheckout);
  }

  if (checkoutCloseBtn) {
    checkoutCloseBtn.addEventListener("click", closeCheckout);
  }

  if (checkoutOverlay) {
    checkoutOverlay.addEventListener("click", closeCheckout);
  }

  if (checkoutCardInput) {
    checkoutCardInput.addEventListener("input", e => {
      let value = e.target.value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
      e.target.value = value;
    });
  }

  if (checkoutExpiryInput) {
    checkoutExpiryInput.addEventListener("input", e => {
      let value = e.target.value.replace(/\D/g, "").slice(0, 4);

      if (value.length >= 3) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      }

      e.target.value = value;
    });
  }

  if (checkoutCvvInput) {
    checkoutCvvInput.addEventListener("input", e => {
      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4);
    });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", e => {
      e.preventDefault();

      showSuccessPopup("Payment successful", "Demo order placed successfully.");
      cart = [];
      saveCart();
      renderCart();
      checkoutForm.reset();
      closeCheckout();
      closeCart();
    });
  }

  


// Product modal logic
// Fake checkout logic

// 👉 ВСТАВИТИ СЮДИ ↓↓↓

// AUTH
const AUTH_KEY = "techstore_user";

const accountBtn = document.getElementById("account-btn");
const authModal = document.getElementById("auth-modal");
const authOverlay = document.getElementById("auth-overlay");
const authCloseBtn = document.getElementById("auth-close-btn");
const authForm = document.getElementById("auth-form");
const authLogoutBtn = document.getElementById("auth-logout-btn");
const authTitle = document.getElementById("auth-title");

let currentUser = null;

const saveUser = user => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

const loadUser = () => {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return;
  try {
    currentUser = JSON.parse(stored);
  } catch {
    currentUser = null;
  }
};

const updateAuthUI = () => {
  if (currentUser) {
    accountBtn.textContent = currentUser.name;
    authForm.classList.add("hidden");
    authLogoutBtn.classList.remove("hidden");
    authTitle.textContent = "Account";
  } else {
    accountBtn.textContent = "👤";
    authForm.classList.remove("hidden");
    authLogoutBtn.classList.add("hidden");
    authTitle.textContent = "Login";
  }
};

const openAuth = () => {
  authModal.classList.add("active");
  authOverlay.classList.add("active");
};

const closeAuth = () => {
  authModal.classList.remove("active");
  authOverlay.classList.remove("active");
};

if (accountBtn) {
  accountBtn.addEventListener("click", openAuth);
}

if (authCloseBtn) {
  authCloseBtn.addEventListener("click", closeAuth);
}

if (authOverlay) {
  authOverlay.addEventListener("click", closeAuth);
}

if (authForm) {
  authForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("auth-name").value;
    const email = document.getElementById("auth-email").value;

    currentUser = { name, email };
    saveUser(currentUser);

    showSuccessPopup("Welcome", `Hello, ${name}!`);
    updateAuthUI();
    authForm.reset();
    closeAuth();
  });
}

if (authLogoutBtn) {
  authLogoutBtn.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem(AUTH_KEY);
    updateAuthUI();
    showSuccessPopup("Logged out", "You have been logged out.");
    closeAuth();
  });
}

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeCart();
      closeProductModal();
      closeCheckout();

      if (successPopup) {
        successPopup.classList.remove("active");
        successPopup.setAttribute("aria-hidden", "true");
      }
    }
  });
loadCart();
loadWishlist();
renderCart();
renderWishlist();
loadUser();
updateAuthUI();
});