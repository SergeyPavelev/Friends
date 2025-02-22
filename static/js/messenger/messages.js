async function getRoom(rooms, userId, receiverId) {
    var room = rooms.find(room =>
        (room.users[0].id == userId && room.users[1].id == receiverId) || 
        (room.users[0].id == receiverId && room.users[1].id == userId)
    );

    if (room) {
        return room;
    } else {
        console.log('Чата с такими пользователями не существует');
    };
}

async function getMessagesRoom(roomId, messages) {
    return messages.filter(message => message.room == roomId);
}

function formatTime(inputTime) {
    // Разделяем строку по символу ":"
    const [hours, minutes] = inputTime.split(':');
    // Возвращаем только часы и минуты
    return `${hours}:${minutes}`;
}

function createMessageBlock (user, message) {
    var senderMessage = message.sender;
    var textMessage = message.text_message;
    var timeSendMessage = formatTime(message.time_created);
    
    if (senderMessage.avatar) {
        var avatarSender = senderMessage.avatar;
    } else {
        if (user.theme == 'Light') {
            var avatarSender = '/static/img/user-avatar-black.png';
        } else if (user.theme == 'Dark') {
            var avatarSender = '/static/img/user-avatar-white.png';
        }
    }

    if (user.theme == 'Light') {
        var editIkon = '/static/img/edit-black.png';
        var trashIkon = '/static/img/trash-black.png';
    } else if (user.theme == 'Dark') {
        var editIkon = '/static/img/edit-white.png';
        var trashIkon = '/static/img/trash-white.png';
    }

    if (senderMessage.id == user.id) {
        messageBlock = `
            <div id="messageId${message.id}" class="block-message-me">
                <div class="block-message-buttons">
                    <div class="block-message-button">
                        <button class="editButton" type="submit" title="Edit" value=${message.id}>
                            <img src="${editIkon}" alt="Edit">
                        </button>
                    </div>

                    <div class="block-message-button">
                        <button class="deleteButtonAll" type="submit" title="Delete all" value=${message.id}>
                            <img src="${trashIkon}" alt="Delete all">
                        </button>
                    </div>

                    <div class="block-message-button">
                        <button class="DeleteButtonMe" type="submit" title="Delete me" value=${message.id}>
                            <img src="${trashIkon}" alt="Delete me">
                        </button>
                    </div>
                </div>

                <div class="block-info-message">
                    <div class="block-message-text">
                        <span class="message-sender">${senderMessage.username}</span>
                        <div class="message-text">
                            <p>${textMessage}</p>
                            <span class="message-time-created">${timeSendMessage}</span>
                        </div>
                    </div>

                    <div class="block-message-img">
                        <img src="${avatarSender}">
                    </div>
                </div>
            </div>
        `;
    } else {
        var messageBlock = `
            <div id="messageId${message.id}" class="block-message-receiver">
                <div class="block-info-message">
                    <div class="block-message-img">
                        <img src="${avatarSender}">
                    </div>

                    <div class="block-message-text">
                        <span class="message-sender">${senderMessage.username}</span>
                        <div class="message-text">
                            <p>${textMessage}</p>
                            <span class="message-time-created">${timeSendMessage}</span>
                        </div>
                    </в>
                </div>

                <div class="block-message-buttons">
                    <div class="block-message-button">
                        <buttonclass="deleteButtonAll" type="submit" title="Delete all" value=${message.id}>
                            <img src="${trashIkon}" alt="Delete all">
                        </buttonclass=>
                    </div>

                    <div class="block-message-button">
                        <button class="DeleteButtonMe" type="submit" title="Delete me" value=${message.id}>
                            <img src="${trashIkon}" alt="Delete me">
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    return messageBlock;
};

async function displayMessages() {
    const userId = localStorage.getItem('userId');

    if (userId) {
        var user = await getUserData(userId);             
    } else {
        console.error('userId отсутствует в localStorage');
    };

    const receiverId = window.location.pathname.split('/').reverse()[1];

    if (receiverId) {
        var receiver = await getUserData(receiverId);             
    } else {
        console.error('receiverId отсутствует');
    };

    document.getElementById('receiverName').textContent = receiver.username;
    document.getElementById('receiverLink').setAttribute('href', `/profile/${receiver.id}/`);

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

    var room = await getRoom(rooms, userId, receiverId);
    var messagesRoom = await getMessagesRoom(room.id, messages);
    messagesRoom.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
    var blockMessages = document.querySelector('#listMessages');
    
    messagesRoom.forEach(message => {
        if ((message.sender.id == userId && message.sender_visibility) || (message.receiver.id == userId && message.receiver_visibility)) {
            var messageBlock = createMessageBlock(user, message);
            blockMessages.insertAdjacentHTML('afterbegin', messageBlock);
        };
    });

    blockMessages.scrollTop = blockMessages.scrollHeight;
};

async function sendMessage() {
    var user = await getUserData(localStorage.getItem('userId'));
    var receiver = await getUserData(window.location.pathname.split('/').reverse()[1]);
    var rooms = await ajaxWithAuth({
        url: '/api/rooms/',
        type: 'GET',
    });
    var room = await getRoom(rooms, user.id, receiver.id);
    if (!room) {
        console.error('Комната не найдена');
        return;
    }
    var textMessage = $('#message-input').val();

    var formData = {
        'text_message': textMessage,
        'sender': user.id,
        'receiver': receiver.id,
        'room': room.id,
    };    

    if(!formData.text_message) return;
    
    try {
        var message = await ajaxWithAuth({
            url: '/api/messages/',
            type: 'POST',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',
        });
    } catch (error) {
        console.error('Ошибка при создании сообщения:', error);
        return;
    };    

    $('#message-input').val('');
    var blockMessages = document.getElementById('listMessages');
    var messageBlock = createMessageBlock(user, message);
    
    blockMessages.insertAdjacentHTML('afterbegin', messageBlock);
    blockMessages.scrollTop = blockMessages.scrollHeight;
};

document.addEventListener('DOMContentLoaded', function() {
    displayMessages();

    $('#input-message-form').click(async function(e) {
        e.preventDefault();
        e.stopPropagation();

        await sendMessage();        
    });
});



