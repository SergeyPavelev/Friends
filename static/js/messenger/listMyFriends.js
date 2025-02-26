function createBlockFriend(user, friend) {
    var userName = friend.username;

    if (friend.avatar) {
        var friendAvatar = friend.avatar;
    } else {
        if (user.theme == 'Light') {
            var friendAvatar = '/static/img/user-avatar-black.png';
        } else if (user.theme == 'Dark') {
            var friendAvatar = '/static/img/user-avatar-white.png';
        }
    };

    if (user.theme == 'Light') {
        var addFriend = '/static/img/add-to-friends-black.png';
        var deleteFriend = '/static/img/delete-from-friends-black.png';
    } else if (user.theme == 'Dark') {
        var addFriend = '/static/img/add-to-friends-white.png';
        var deleteFriend = '/static/img/delete-from-friends-white.png';
    };

    var friendBlock = `
        <div class="list-item">
            <div class="block-user-img">
                <img src="${friendAvatar}" alt="User-avatar">
            </div>

            <a class="link-user-profile" href="/profile/${friend.id}/">
                <span class="link-name">${userName}</span>
            </a>

            <div class="form-button-user">
                <button id="buttonUser${friend.id}" class="button-user delete" type="submit" value="${friend.id}">
                    <img src="${deleteFriend}" alt="Delete friend">
                </button>
            </div>
        </div>
    `;

    return friendBlock
};

async function listMyFriends() {
    const userId = localStorage.getItem('userId');

    if (userId) {
        var user = await getUserData(userId);             
    } else {
        console.error('userId отсутствует в localStorage');
    };
    
    var friends = user.friends;
    var blockFriends = document.getElementById('listUsers');

    friends.forEach(async friendId => {
        var friend = await getUserData(friendId);        
        var friendBlock = createBlockFriend(user, friend);
        blockFriends.insertAdjacentHTML('beforeend', friendBlock);
    });
};

document.addEventListener('DOMContentLoaded', async function () {
    await listMyFriends();
});