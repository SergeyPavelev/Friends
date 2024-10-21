const message_btns = document.querySelectorAll('.message-btns');
const activate_btns = document.querySelectorAll('.activate-btn');

// activate_btn.addEventListener('click', () => {
//     message_btns.classList.toggle('active');
// });

activate_btns.forEach((activate_btn, index) => {
    activate_btn.addEventListener('click', () => {
        message_btns[index].classList.toggle('active');
    });
});
