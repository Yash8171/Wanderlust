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
    const body = document.body;

    // Load saved mode
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "enabled") {
        body.classList.add("dark-mode");
    }

    // Toggle button
    toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = toggleBtn.querySelector("i");

    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    icon.classList.replace(isDark ? "fa-moon" : "fa-sun", isDark ? "fa-sun" : "fa-moon");

    // Update map style
    if (typeof map !== "undefined") {
        map.setStyle(isDark ? darkMapStyle : lightMapStyle);
    }
});
});
