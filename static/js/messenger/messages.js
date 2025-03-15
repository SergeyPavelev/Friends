async function getRoom(rooms, userId, receiverId) {
    var room = rooms.find(room =>
        (room.users[0].id == userId && room.users[1].id == receiverId) || 
        (room.users[0].id == receiverId && room.users[1].id == userId)
    );
    
    if (!room) {
        var room = await ajaxWithAuth({
            url: '/api/rooms/',
            type: 'POST',
            data: JSON.stringify({
                'users': [userId, receiverId],
            }),
            dataType: 'json',
            contentType: 'application/json',
        });
        console.log('Чат создан!');
    };
    
    return room;
}

async function getMessagesRoom(roomId, messages) {
    return messages.filter(message => message.room == roomId.id);
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
        };
    };

    if (user.theme == 'Light') {
        var editIkon = '/static/img/edit-black.png';
        var trashIkon = '/static/img/trash-black.png';
    } else if (user.theme == 'Dark') {
        var editIkon = '/static/img/edit-white.png';
        var trashIkon = '/static/img/trash-white.png';
    };

    if (user.id == message.sender.id && message.is_readed) {
        var checkMark = "/static/img/double-check-mark.png";
    } else if (user.id == message.sender.id && !message.is_readed) {
        var checkMark = "/static/img/check-mark.png";
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
                            <div class="data-message">
                                <span class="message-time-created">${timeSendMessage}</span>
                                <img class="check-mark" src=${checkMark}>
                            </div>
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
                            <div class="data-message">
                                <span class="message-time-created">${timeSendMessage}</span>
                            </div>
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

async function messageRead(message) {
    return await ajaxWithAuth({
        url: `/api/messages/${message.id}/`,
        type: 'PATCH',
        data: JSON.stringify({
            'is_readed': true,
        }),
        dataType: 'json',
        contentType: 'application/json',

        error: function(xhr, status, error) {
            console.log('Ошибка при прочтении сообщения');
        },
    });  
};

async function displayMessages() {
    const userId = localStorage.getItem('userId');
    const receiverId = window.location.pathname.split('/').reverse()[1];

    if (userId && receiverId) {
        var user = await getUserData(userId);             
        var receiver = await getUserData(receiverId);             
    } else {
        console.error('UserId и receiverId не найдены');
    };

    document.getElementById('receiverName').textContent = receiver.username;
    document.getElementById('receiverLink').setAttribute('href', `/profile/${receiver.id}/`);
    if (receiver.is_online) {
        document.getElementById('userStatus').textContent = 'Online';
    } else {
        document.getElementById('userStatus').textContent = 'Offline';
    };

    try {
        var rooms = await ajaxWithAuth({
            url: '/api/rooms/',
            type: 'GET',
        });
    
        var messages = await ajaxWithAuth({
            url: '/api/messages/',
            type: 'GET',
        });
    } catch (error) {
        addNotification(error.responseJSON.text, true);
    };

    var room = await getRoom(rooms, parseInt(userId, 10), parseInt(receiverId, 10));
    var messagesRoom = await getMessagesRoom(room, messages);
    messagesRoom.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
    var blockMessages = document.getElementById('listMessages');
    
    messagesRoom.forEach(message => {
        if ((message.sender.id == userId && message.sender_visibility) || (message.receiver.id == userId && message.receiver_visibility)) {
            if (user.id==message.receiver.id && !message.is_readed) {
                messageRead(message);
            };

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
    var textMessage = $('#message-input').val();

    var formData = {
        'text_message': textMessage,
        'sender': user.id,
        'receiver': receiver.id,
        'room': room.id,
    };    

    if(!formData.text_message) {
        addNotification('Поле должно быть заполнено', true);
        return;
    };
    
    try {
        var message = await ajaxWithAuth({
            url: '/api/messages/',
            type: 'POST',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',
        });
    } catch (error) {
        console.error('Ошибка при отправки сообщения:', error);
        addNotification(error.responseJSON.text, true);
        return;
    };    

    $('#message-input').val('');
    var blockMessages = document.getElementById('listMessages');
    var messageBlock = createMessageBlock(user, message);
    
    blockMessages.insertAdjacentHTML('afterbegin', messageBlock);
    blockMessages.scrollTop = blockMessages.scrollHeight;
};

document.addEventListener('DOMContentLoaded', async function() {
    await displayMessages();

    $('#input-message-form').click(async function(e) {
        e.preventDefault();
        e.stopPropagation();

        await sendMessage();        
    });
});



