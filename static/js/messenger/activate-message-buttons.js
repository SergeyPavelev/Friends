const blockMessageButtons = document.querySelectorAll('.block-message-buttons');
const blockMessage = document.querySelectorAll('.message-text');

blockMessage.forEach((message, index) => {
    message.addEventListener('click', () => {
        blockMessageButtons[index].classList.toggle('active');
    });
});
