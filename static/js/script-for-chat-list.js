const chat_list = document.querySelector('.chat-list');
const chat_with_my_friend = document.querySelector('.chat-with-my-friend');
const last_message = document.querySelector('.last-message');
const link_chat_list = document.querySelector('.link-chat-list');

// Animate In

chat_list.addEventListener(
    'mouseenter', (e) => {
        chat_list.style.transition = 'none';
        chat_with_my_friend.style.transform = 'translateZ(3px)';
        last_message.style.transform = 'translateZ(3px)';
        link_chat_list.style.transform = 'translateZ(3px) rotateZ(0deg)';
    }
);


// Animate Out

chat_list.addEventListener(
    'mouseleave', (e) => {
        chat_list.style.transition = 'all 0.5s ease';
        chat_list.style.transform = 'rotateY(0deg) rotateX(0deg)';
        chat_with_my_friend.style.transform = 'translateZ(0px)';
        last_message.style.transform = 'translateZ(0px)';
        link_chat_list.style.transform = 'translateZ(0px) rotateZ(0deg)';
    }
);
