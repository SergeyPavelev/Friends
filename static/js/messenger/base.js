document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".nav-link");
    buttons.forEach(button => {
        if (button.href == window.location.href || window.location.href.includes(button.href)) {
            button.classList.add("active");
        };
    });
});