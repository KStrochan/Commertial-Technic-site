document.addEventListener("DOMContentLoaded", () => {
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

  const form = document.querySelector(".contact-form");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("Thank you! Your request has been sent.");
      form.reset();
    });
  }
});