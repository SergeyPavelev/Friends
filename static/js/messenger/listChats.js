async function getUserChat(userId, users) {
    const user = users.find(user => userId != user.id);
    return user;
};

async function timeSubmitAgo (timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMs = now - messageTime;

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else if (diffInDays < 30) {
        return `${diffInDays} days ago`;
    } else if (diffInMonths < 12) {
        return `${diffInMonths} months ago`;
    } else {
        return `${diffInYears} years ago`;
    }
};

async function listUserChats () {
    const userId = localStorage.getItem('userId');

    if (userId) {
        var user = await getUserData(userId);             
    } else {
        console.error('userId отсутствует в localStorage');
    };

    var rooms = await ajaxWithAuth({
        url: '/api/rooms/',
        type: 'GET',
        dataType: 'json',
    });

    var messages = await ajaxWithAuth({
        url: '/api/messages/',
        type: 'GET',
        dataType: 'json',
    });

    var myRooms = [];
    var myRoomsDict = {};
    
    rooms.forEach(room => {
        for (let i = 0; i < room.users.length; i++) {
            if (room.users[i].id == user.id) {
                myRooms.push(room.id);
                myRoomsDict[room.id] = room.users;
            };
        };
    });
    
    var messagesMyRooms = messages
        .filter(message => myRooms.includes(message.room))
        .sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
    

    var lastMessageMyRooms = messagesMyRooms.reduce((acc, message) => {
        if (!acc[message.room]) {
            if ((message.sender.id == userId && message.sender_visibility) || (message.receiver.id == userId && message.receiver_visibility)) {
                acc[message.room] = message;
            };
        };

        return acc
    }, {});
    
    blockChats = document.getElementById('blockChats');
    
    myRooms.forEach(async (room) => {
        let userAvatar;
        if (user.avatar) {
            userAvatar = `${user.avatar}`;
        } else {
            if (user.theme == 'Light') {
                userAvatar = '/static/img/user-avatar-black.png';
            } else if (user.theme == 'Dark') {
                userAvatar = '/static/img/user-avatar-white.png';
            }
        }

        if (lastMessageMyRooms[room]) {
            var textMessage = lastMessageMyRooms[room].text_message;
            var sender = lastMessageMyRooms[room].sender;
            var timeSubmit = lastMessageMyRooms[room].date_created;
            var userChat = (await getUserChat(userId, myRoomsDict[room])) || 'Unknown user';
            
            var chatBlock = `
            <div class='chat'>
                <a class='link-chat' href='/messenger/im/${userChat.id}/'>
                    <div class="user-img">
                        <img src="${userAvatar}" alt="User-avatar">
                    </div>
                    <div class="info-chat">
                        <div class="user-name">
                            <span>${userChat.username}</span>
                        </div>
                        <div class="last-message">
                            <p>${sender.username}: ${textMessage}</p>
                        </div>
                    </div>
                    <div class="time-submit">
                        <p class="time-submit">${await timeSubmitAgo(timeSubmit)}</p>
                    </div>
                </a>
            </div>
        `;
        } else {
            lastMessageMyRooms[room] = {
                'text_message': 'Сообщений нет',
            };            

            var textMessage = lastMessageMyRooms[room].text_message;
            var userChat = (await getUserChat(userId, myRoomsDict[room])) || 'Unknown user';

            var chatBlock = `
                <div class='chat'>
                    <a class='link-chat' href='/messenger/im/${userChat.id}/'>
                        <div class="user-img">
                            <img src="${userAvatar}" alt="User-avatar">
                        </div>
                        <div class="info-chat">
                            <div class="user-name">
                                <span>${userChat.username}</span>
                            </div>
                            <div class="last-message">
                                <p>${textMessage}</p>
                            </div>
                        </div>
                        <div class='time-submit'></div>
                    </a>
                </div>
            `;
        };

        blockChats.insertAdjacentHTML('afterbegin', chatBlock);
    });
        
};

document.addEventListener('DOMContentLoaded', async function () {
    if (window.location.pathname === '/messenger/im/') {
        await listUserChats();
    };
});