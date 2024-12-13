document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".nav-link");
    buttons.forEach(button => {
        if (button.href == window.location.href) {            
            button.classList.add("active");
        };
    });
});