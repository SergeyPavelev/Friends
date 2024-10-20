const message_btn = document.querySelector('.message-btn');
const activate_btn = document.querySelector('.activate-btn');

activate_btn.addEventListener('click', () => {
    message_btn.classList.add('active');
});
