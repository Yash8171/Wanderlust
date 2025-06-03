
  document.addEventListener("DOMContentLoaded", () => {
    // ====== Bootstrap Validation ======
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach(form => {
      form.addEventListener("submit", event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      });
    });

    // ====== Dark Mode Toggle ======
    const toggleBtn = document.getElementById("darkModeToggle");
    const icon = toggleBtn?.querySelector("i");
    const body = document.body;

    const savedMode = localStorage.getItem("darkMode");
    const isDark = savedMode === "enabled";

    if (isDark) {
      body.classList.add("dark-mode");
      icon?.classList.replace("fa-moon", "fa-sun");
    }

    toggleBtn?.addEventListener("click", () => {
      const currentlyDark = body.classList.toggle("dark-mode");
      localStorage.setItem("darkMode", currentlyDark ? "enabled" : "disabled");
      if (icon) {
        icon.classList.replace(currentlyDark ? "fa-moon" : "fa-sun", currentlyDark ? "fa-sun" : "fa-moon");
      }

      if (typeof map !== "undefined") {
        map.setStyle(currentlyDark ? darkMapStyle : lightMapStyle);
      }
    });

    // ====== Navbar Collapse Styling ======
    const nav = document.querySelector(".navbar");
    const toggler = document.querySelector(".navbar-toggler");

    toggler?.addEventListener("click", () => {
  const isExpanded = toggler.getAttribute("aria-expanded") === "true";
  const isDarkMode = body.classList.contains("dark-mode");

  // Only apply bg-white and shadow if NOT dark mode
  if (!isDarkMode) {
    nav.classList.toggle("bg-white", !isExpanded);
    nav.classList.toggle("shadow-sm", !isExpanded);
  }
});


    // ====== Live Search ======
    const searchInput = document.getElementById("liveSearchInput");
    const suggestionsBox = document.getElementById("searchSuggestions");
    let timeout;

    if (searchInput && suggestionsBox) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim();
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          if (query.length === 0) {
            suggestionsBox.innerHTML = "";
            return;
          }

          fetch(`/listings/search-live?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(data => {
              suggestionsBox.innerHTML = "";
              if (data.length === 0) {
                suggestionsBox.innerHTML = `<div class="list-group-item disabled">No results found</div>`;
              } else {
                data.forEach(listing => {
                  const item = document.createElement("a");
                  item.href = `/listings/${listing._id}`;
                  item.className = "list-group-item list-group-item-action";
                  item.textContent = `${listing.title} - ₹${listing.price}`;
                  suggestionsBox.appendChild(item);
                });
              }
            });
        }, 300);
      });

      document.addEventListener("click", (e) => {
        if (!document.getElementById("liveSearchForm").contains(e.target)) {
          suggestionsBox.innerHTML = "";
        }
      });
    }
    let lastScrollTop = 0;
const navbar = document.querySelector('.animated-navbar');

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop && currentScroll > 80) {
    // Scrolling down
    navbar.classList.add("hidden");
  } else {
    // Scrolling up
    navbar.classList.remove("hidden");
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

const scrollBtn = document.getElementById("scrollUpBtn");
  const progressCircle = document.querySelector("#progressCircle circle:nth-child(2)");
  const radius = progressCircle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = circumference;

  function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
  }

  function updateScrollButton() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    setProgress(scrollPercent);

    if (scrollPercent >= 40) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  }

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  window.addEventListener("scroll", updateScrollButton);
  updateScrollButton(); // Run on load

  });

