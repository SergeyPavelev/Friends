async function addToFriends(user, friend) {
        var response = await ajaxWithAuth({
            url: `/api/users/${friend.id}/add_friend/`,
            type: 'POST',
        });

        if (response.status == '200') {
            console.log('Пользователь добавлен в друзья');                    
            var button = document.getElementById(`buttonUser${friend.id}`);
            button.setAttribute('class', 'button-user delete');

            if (user.theme == 'Light') {
                document.querySelector(`#buttonUser${friend.id} img`).setAttribute('src', '/static/img/delete-from-friends-black.png');
            } else if (user.theme == 'Dark') {
                document.querySelector(`#buttonUser${friend.id} img`).setAttribute('src', '/static/img/delete-from-friends-white.png');
            };

            var navigationBlock = document.getElementById('blockNavButtons');
            var blockNavigationButton = createBlockNavigationButton(user, friend);
            navigationBlock.insertAdjacentHTML('beforeend', blockNavigationButton);
        } else {
            console.log('Ошибка при добавлении пользователя в друзья');
        };
};

async function deleteFromFriends(user, friend) {
    var response = await ajaxWithAuth({
        url: `/api/users/${friend.id}/delete_friend/`,
        type: 'POST',
    });
    
    if (response.status == '200') {
        console.log('Пользователь удален из друзей');                   
        var button = document.getElementById(`buttonUser${friend.id}`);
        button.setAttribute('class', 'button-user add');

        if (user.theme == 'Light') {
            document.querySelector(`#buttonUser${friend.id} img`).setAttribute('src', '/static/img/add-to-friends-black.png');
        } else if (user.theme == 'Dark') {
            document.querySelector(`#buttonUser${friend.id} img`).setAttribute('src', '/static/img/add-to-friends-white.png');
        };

        var blockNavigationButton = document.getElementById(`navLinkUser${friend.id}`);
        blockNavigationButton.remove();
    } else {
        console.log('Ошибка при удалении пользователя из друзей');
    };
};

function createBlockNavigationButton(user, friend) {
    if (user.theme == 'Light') {
        var friendAvatar = '/static/img/user-avatar-black.png';
    } else if (user.theme == 'Dark') {
        var friendAvatar = '/static/img/user-avatar-white.png';
    };

    return `
        <a id="navLinkUser${friend.id}" class="nav-link" href="/messenger/im/${friend.id}/">
            <div class="block-nav-icon">
                <img src="${friendAvatar}" alt="User-avatar">
            </div>
            <span class="link-name">${friend.username}</span>
        </a>
    `;
};

const observerAddDeleteFriends = new MutationObserver(async () => {
    const buttonsAddToFriends = document.querySelectorAll('.button-user.add');
    const buttonsDeleteFromFriends = document.querySelectorAll('.button-user.delete');
    
    buttonsAddToFriends.forEach(button => {
        if (!button.dataset.listener) {
            button.dataset.listener = "true";

            button.addEventListener('click', async function handleAdd() {
                var user = await getUserData(localStorage.getItem('userId'));
                var friend = await getUserData(button.value);

                await addToFriends(user, friend);

                button.removeEventListener('click', handleAdd);

                button.addEventListener('click', async function handleDelete() {
                    var user = await getUserData(localStorage.getItem('userId'));
                    await deleteFromFriends(user, friend);

                    button.removeEventListener('click', handleDelete);
                    button.addEventListener('click', handleAdd);
                });
            });
        };
    });

    buttonsDeleteFromFriends.forEach(button => {
        if (!button.dataset.listener) {
            button.dataset.listener = "true";

            button.addEventListener('click', async function handleDelete() {
                var user = await getUserData(localStorage.getItem('userId'));
                var friend = await getUserData(button.value);

                await deleteFromFriends(user, friend);

                button.removeEventListener('click', handleDelete);

                button.addEventListener('click', async function handleAdd() {
                    var user = await getUserData(localStorage.getItem('userId'));   
                    await addToFriends(user, friend);

                    button.removeEventListener('click', handleAdd);
                    button.addEventListener('click', handleDelete);
                });
            });
        };
    }); 
});

observerAddDeleteFriends.observe(document.getElementById('listUsers'), { childList: true, subtree: true });
