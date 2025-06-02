(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

  document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("darkModeToggle");
    const icon = toggleBtn?.querySelector("i");
    const body = document.body;

    // Light mode is default, only enable dark if saved
    const savedMode = localStorage.getItem("darkMode");
    const isDark = savedMode === "enabled";

    if (isDark) {
        body.classList.add("dark-mode");
        icon?.classList.replace("fa-moon", "fa-sun");
    }

    // Toggle button handler
    toggleBtn?.addEventListener("click", () => {
        const currentlyDark = body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", currentlyDark ? "enabled" : "disabled");

        if (icon) {
            icon.classList.replace(currentlyDark ? "fa-moon" : "fa-sun", currentlyDark ? "fa-sun" : "fa-moon");
        }

        // Update map style if map exists
        if (typeof map !== "undefined") {
            map.setStyle(currentlyDark ? darkMapStyle : lightMapStyle);
        }
    });
});
