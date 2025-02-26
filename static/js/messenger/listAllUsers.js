function listFriendsIncludesUser(user, friends) {
    var friend = friends.find(friend => friend == user.id);
    return friend;
};

function createBlockUser(user, userList) {
    var userName = userList.username;

    if (userList.avatar) {
        var userAvatar = userList.avatar;
    } else {
        if (user.theme == 'Light') {
            var userAvatar = '/static/img/user-avatar-black.png';
        } else if (user.theme == 'Dark') {
            var userAvatar = '/static/img/user-avatar-white.png';
        }
    };

    if (user.theme == 'Light') {
        var addFriend = '/static/img/add-to-friends-black.png';
        var deleteFriend = '/static/img/delete-from-friends-black.png';
    } else if (user.theme == 'Dark') {
        var addFriend = '/static/img/add-to-friends-white.png';
        var deleteFriend = '/static/img/delete-from-friends-white.png';
    };
    
    if (listFriendsIncludesUser(userList, user.friends)) {
        var blockUser = `
            <div class="list-item">
                <div class="block-user-img">
                    <img src="${userAvatar}" alt="User-avatar">
                </div>

                <a class="link-user-profile" href="/profile/${userList.id}/">
                    <span class="link-name">${userName}</span>
                </a>

                <div class="form-button-user">
                    <button id="buttonUser${userList.id}" class="button-user delete" type="submit" value="${userList.id}">
                        <img src="${deleteFriend}" alt="Delete friend">
                    </button>
                </div>
            </div>
        `;   
    } else {
        var blockUser = `
            <div class="list-item">
                <div class="block-user-img">
                    <img src="${userAvatar}" alt="User-avatar">
                </div>

                <a class="link-user-profile" href="/profile/${userList.id}/">
                    <span class="link-name">${userName}</span>
                </a>

                <div class="form-button-user">
                    <button id="buttonUser${userList.id}" class="button-user add" type="submit" value="${userList.id}">
                        <img src="${addFriend}" alt="Add friend">
                    </button>
                </div>
            </div>
        `;
    };

    return blockUser;
};

async function listAllUsers() {
    const userId = localStorage.getItem('userId');

    if (userId) {
        var user = await getUserData(userId);             
    } else {
        console.error('userId отсутствует в localStorage');
    };

    var users = await ajaxWithAuth({
        url: '/api/users/',
        type: 'GET',
    });

    var blockUsers = document.getElementById('listUsers');

    users.forEach(userList => {
        if (user.id != userList.id) {
            var blockUser = createBlockUser(user, userList);
            blockUsers.insertAdjacentHTML('beforeend', blockUser);
        };
    });
};

document.addEventListener('DOMContentLoaded', async function () {
    await listAllUsers();
});