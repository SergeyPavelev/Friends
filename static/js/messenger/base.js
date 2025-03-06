async function getUserData(userId) {
    return await ajaxWithAuth({
        url: `/api/users/${userId}/`,
        type: 'GET',
        dataType: 'json',

        error: function (xhr, status, error) {
            console.log('Не удалось получить пользователя');
            addNotification(error.responseJSON.text, true);
        },
    });
};

document.addEventListener("DOMContentLoaded", async function() {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
         var user = await getUserData(userId);
    } else {
        console.error('userId отсутствует в localStorage');
    };
    
    var body = document.querySelector('body');
    var userAvatar = document.getElementById('userAvatar');
    var userAvatarHref = document.getElementById('userAvatarHref');
    userAvatarHref.setAttribute('href', `/profile/${user.id}/`)
    var themeButton = document.getElementById('themeButton');
    var notificationButton = document.getElementById('notificationButton');
    var messengerIkon = document.getElementById('messengerIkon');
    var postsIkon = document.getElementById('postsIkon');
    var listFriendsIkon = document.getElementById('listFriendsIkon');
    var listUsersIkon = document.getElementById('listUsersIkon');

    if (user.theme == 'Dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        if (user.avatar) {
            userAvatar.src = `${user.avatar}`;
        } else {
            userAvatar.src = '/static/img/user-avatar-white.png';
        };
        themeButton.src = '/static/img/moon-white.png';
        notificationButton.src = '/static/img/notification-white.png';
        messengerIkon.src = '/static/img/messenger-white.png';
        postsIkon.src = '/static/img/posts-white.png';
        listFriendsIkon.src = '/static/img/list-users-white.png';
        listUsersIkon.src = '/static/img/list-users-white.png';

    } else if (user.theme == 'Light') {
        if (user.avatar) {
            userAvatar.src = `${user.avatar}`;
        } else {
            userAvatar.src = '/static/img/user-avatar-black.png';
        };
        themeButton.src = '/static/img/sunshine-black.png';
        notificationButton.src = '/static/img/notification-black.png';
        messengerIkon.src = '/static/img/messenger-black.png';
        postsIkon.src = '/static/img/posts-black.png';
        listFriendsIkon.src = '/static/img/list-users-black.png';
        listUsersIkon.src = '/static/img/list-users-black.png';
    };

    navigationBlock = document.querySelector('.block-nav-buttons');

    user.friends.forEach(async friendId => {
        var friendData = await getUserData(friendId);

        if (friendData.avatar) {
            var friendAvatar = `/static/img/${friendData.avatar}`;
        } else {
            if (user.theme == 'Dark') {
                var friendAvatar = '/static/img/user-avatar-white.png';
            } else {                        
                var friendAvatar = '/static/img/user-avatar-black.png';
            };
        };

        var friendLink = `
            <a id="navLinkUser${friendData.id}" class='nav-link' href='/messenger/im/${friendData.id}/'>
                <div class='block-nav-icon'>
                    <img src="${friendAvatar}" alt="User-avatar">
                </div>
                <span class="link-name">${friendData.username}</span>
            </a>
        `;
        navigationBlock.innerHTML += friendLink                
    });
});

const observerNavButtons = new MutationObserver(async () => {
    const buttons = document.querySelectorAll(".nav-link");
    buttons.forEach(button => {        
        if (button.href == window.location.href) {
            button.classList.add("active");
        };
    });
});

observerNavButtons.observe(document.getElementById('blockNavButtons'), { childList: true, subtree: true });
