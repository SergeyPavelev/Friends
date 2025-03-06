async function addToFriends(user, userProfile) {
    try {
        var response = await ajaxWithAuth({
            url: `/api/users/${userProfile.id}/add_friend/`,
            type: 'POST',
        });
    } catch (error) {
        addNotification(error.responseJSON.text, true);
    };

    if (response.status == '200') {
        console.log('Пользователь добавлен в друзья');  
        
        if (user.theme == 'Light') {
            var deleteFromFriends = '/static/img/delete-from-friends-black.png';
        } else if (user.theme == 'Dark') {
            var deleteFromFriends = '/static/img/delete-from-friends-white.png';
        };
        
        var button = document.getElementById(`buttonUser${userProfile.id}`);
        button.querySelector('img').src = deleteFromFriends;

        document.getElementById('blockProfileButtons').innerHTML += `
            <div id="blockToMessengerButton" class="block-to-messenger-button">
                <a class="link-to-messenger" href="/messenger/im/${userProfile.id}/">
                    <button class="profile-button">Message</button>
                </a>
            </div>
        `;

        if (user.theme == 'Light') {
            var userProfileAvatar = '/static/img/user-avatar-black.png';
        } else if (user.theme == 'Dark') {
            var userProfileAvatar = '/static/img/user-avatar-white.png';
        };

        var navigationBlock = document.getElementById(`blockNavButtons`);
        var blockNavigationButton = `
            <a id="navLinkUser${userProfile.id}" class="nav-link" href="/messenger/im/${userProfile.id}/">
                <div class="block-nav-icon">
                    <img src="${userProfileAvatar}" alt="User-avatar">
                </div>
                <span class="link-name">${userProfile.username}</span>
            </a>
        `;
        
        navigationBlock.insertAdjacentHTML('beforeend', blockNavigationButton);
    } else {
        console.log('Ошибка при добавлении пользователя в друзья');
    };
};

async function deleteFromFriends(user, userProfile) {
    try {
        var response = await ajaxWithAuth({
            url: `/api/users/${userProfile.id}/delete_friend/`,
            type: 'POST',
        });
    } catch (error) {
        addNotification(error.responseJSON.text, true);
    };

    if (response.status == '200') {
        console.log('Пользователь удален из друзей');
        
        if (user.theme == 'Light') {
            var addToFriends = '/static/img/add-to-friends-black.png';
        } else if (user.theme == 'Dark') {
            var addToFriends = '/static/img/add-to-friends-white.png';
        };

        var button = document.getElementById(`buttonUser${userProfile.id}`);
        button.setAttribute('name', 'Add to friends');
        button.querySelector('img').src = addToFriends;

        document.getElementById('blockToMessengerButton').remove();
        document.getElementById(`navLinkUser${userProfile.id}`).remove();
    } else {
        console.log('Ошибка при удалении пользователя из друзей');
    };
};

const observerAddDeleteFriendsFromProfile = new MutationObserver(async () => {
    const buttonAddDelete = document.querySelector('.profile-button'); 
    
    var buttonId = buttonAddDelete.id;
    var user = await getUserData(localStorage.getItem('userId'));
    var userProfile = await getUserData(buttonAddDelete.value);

    if (buttonAddDelete.name == 'Add to friends') {
        if (!buttonAddDelete.dataset.listener) {
            buttonAddDelete.dataset.listener = "true";

            buttonAddDelete.addEventListener('click', async function handleAdd() {
                await addToFriends(user, userProfile);

                buttonAddDelete.removeEventListener('click', handleAdd);

                buttonAddDelete.addEventListener('click', async function handleDelete() {
                    await deleteFromFriends(user, userProfile);

                    buttonAddDelete.removeEventListener('click', handleDelete);
                    buttonAddDelete.addEventListener('click', handleAdd);
                });
            });
        };
    } else if (buttonAddDelete.name == 'Delete from friends') {
        if (!buttonAddDelete.dataset.listener) {
            buttonAddDelete.dataset.listener = "true";
        
            buttonAddDelete.addEventListener('click', async function handleDelete() {
                await deleteFromFriends(user, userProfile);

                buttonAddDelete.removeEventListener('click', handleDelete);

                buttonAddDelete.addEventListener('click', async function handleAdd() {
                    await addToFriends(user, userProfile);

                    buttonAddDelete.removeEventListener('click', handleAdd);
                    buttonAddDelete.addEventListener('click', handleDelete);
                });
            });
        };
    };
});

observerAddDeleteFriendsFromProfile.observe(document.getElementById('blockProfileButtons'), { childList: true, subtree: true });