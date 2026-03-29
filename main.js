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
    el.style.transitionDelay = `${index * 0.08}s`;
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

  const statsSection = document.querySelector(".stats");

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
    { threshold: 0.4 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  const form = document.querySelector(".contact-form");

  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("Thank you! Your message has been sent.");
      form.reset();
    });
  }
});