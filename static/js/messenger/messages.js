async function getConversation(userId, recipientId) {
    try {
        var conversation = await ajaxWithAuth({
            url: `/api/conversations/get_by_participants/?user1=${userId}&user2=${recipientId}`,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
        });
    } catch (error) {
        var conversation = await ajaxWithAuth({
            url: '/api/conversations/',
            type: 'POST',
            data: JSON.stringify({
                'recipient': recipientId,
            }),
            dataType: 'json',
            contentType: 'application/json',
        });
        console.log('Беседа создана');
    };
    
    return conversation;
}

function formatTime(inputTime) {
    // Разделяем строку по символу ":"
    const [hours, minutes] = inputTime.split('T')[1].split(':');
    // Возвращаем только часы и минуты
    return `${hours}:${minutes}`;
};

async function createMessageBlock(user, message) {
    var senderMessage = await getUserData(message.sender);
    var textMessage = message.text;
    var timestampMessage = formatTime(message.timestamp);
    
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

    if (user.id == message.sender && message.read) {
        var checkMark = "/static/img/double-check-mark.png";
    } else if (user.id == message.sender && !message.read) {
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
                                <span class="message-time-created">${timestampMessage}</span>
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
                                <span class="message-time-created">${timestampMessage}</span>
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
            'read': true,
        }),
        dataType: 'json',
        contentType: 'application/json',

        error: function(xhr, status, error) {
            console.log('Ошибка при прочтении сообщения');
        },
    });  
};

let currentPage = 1;
let loading = false;

async function loadMessages(user, receiver, methodInsert) {
    if (loading) return;
    loading = true;

    try {
        var conversation = await getConversation(parseInt(user.id, 10), parseInt(receiver.id, 10));        
        
        var messagesResponse = await ajaxWithAuth({
            url: `/api/messages?conversation=${conversation.id}&page=${currentPage}`,
            type: 'GET',
        });

        var messages = messagesResponse.results;
    } catch (error) {
        console.log('Error in load messages');
        console.log(error);        
    };

    if (!messagesResponse) return;

    messages.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
    var blockMessages = document.getElementById('listMessages');

    let lastDate = null;
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    messages.forEach(message => {
        if ((message.sender == user.id && message.sender_visibility) || (message.sender == receiver.id && message.receiver_visibility)) {
            if (message.sender == receiver.id && !message.is_readed) {
                messageRead(message);
            };
            
            var messageBlockPromise = createMessageBlock(user, message);
            messageBlockPromise.then(messageBlock => {
                blockMessages.insertAdjacentHTML(methodInsert, messageBlock);
            });

            if (message.edit) {
                var blockEdited = `
                    <span class="edit-label">Edited</span>
                `;
                
                document.querySelector(`#messageId${message.id} .data-message`).insertAdjacentHTML('afterbegin', blockEdited);
            };

            const messageDate = new Date(message.timestamp);            
            const messageDateString = messageDate.toDateString();
            const todayDate = new Date();
            
            if (lastDate != messageDateString) {
                const month = monthNames[messageDate.getMonth()];
                const day = messageDate.getDate();
                const year = messageDate.getFullYear();

                // Форматируем строку
                let formattedDate = `${month} ${day}`;                
                
                // Проверяем, отличается ли год от текущего
                if (year !== todayDate.getFullYear()) {
                    formattedDate += ` ${year}`;
                };

                var dataLabel = `
                    <span class="block-messages-date">${formattedDate}</span>
                `;
                
                document.querySelector(`#messageId${message.id}`).insertAdjacentHTML('afterend', dataLabel);
                lastDate = messageDateString;
                
            }
        };
    });

    if (methodInsert == 'afterbegin') {
        blockMessages.scrollTop = blockMessages.scrollHeight;
    };
    currentPage++;
    loading = false;
};

async function displayMessages(user, receiver) {
    document.getElementById('receiverName').textContent = receiver.username;
    document.getElementById('receiverLink').setAttribute('href', `/profile/${receiver.id}/`);
    if (receiver.is_online) {
        document.getElementById('userStatus').textContent = 'Online';
    } else {
        document.getElementById('userStatus').textContent = 'Offline';
    };

    await loadMessages(user, receiver, 'afterbegin');
};

async function sendMessage(user, receiver) {
    var conversation = await getConversation(user.id, receiver.id);
    var textMessage = $('#message-input').val();

    var formData = {
        'text': textMessage,
        'sender': user.id,
        'conversation': conversation.id,
    };
    
    if(!formData.text) {
        // addNotification('Поле должно быть заполнено', true);
        return;
    };
    
    try {
        var message = await ajaxWithAuth({
            url: `/api/messages/`,
            type: 'POST',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',
        });
    } catch (error) {
        console.error('Ошибка при отправки сообщения:', error);
        addNotification('Ошибка при отправки сообщения', true);
        return;
    };

    // try{
    //     chatSocket.send(JSON.stringify(formData));
    // } catch (error) {
    //     console.log(error);
    // };

    $('#message-input').val('');
    var blockMessages = document.getElementById('listMessages');
    var messageBlock = createMessageBlock(user, message);
    
    blockMessages.insertAdjacentHTML('afterbegin', messageBlock);
    blockMessages.scrollTop = blockMessages.scrollHeight;
};

document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userId');
    const receiverId = window.location.pathname.split('/').reverse()[1];

    if (userId && receiverId) {
        var user = await getUserData(userId);
        var receiver = await getUserData(receiverId);             
    } else {
        console.error('UserId и receiverId не найдены');
    };

    // const url = 'ws://' + window.location.host + '/ws/chat/' + userId + '/' + receiverId + '/';
    // const chatSocket = new WebSocket(url);

    // chatSocket.onmessage = function(e) {
    //     const data = JSON.parse(e.data);
    //     console.log('Ooooh');
        
    await displayMessages(user, receiver);
    // };

    // chatSocket.onclose = function(e) {
    //     console.error('Chat socket closed unexpectedly');
    // };

    var listMessages = document.getElementById('listMessages');

    listMessages.addEventListener('scroll', async function () {
        if (listMessages.clientHeight + Math.ceil(Math.abs(listMessages.scrollTop)) >= listMessages.scrollHeight) {
            await loadMessages(user, receiver, 'beforeend');
        };
    });

    $('#input-message-form').click(async function(e) {
        e.preventDefault();
        e.stopPropagation();

        await sendMessage(user, receiver);        
    });
});
