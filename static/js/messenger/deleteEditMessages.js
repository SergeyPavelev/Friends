async function getMessages() {
    return await ajaxWithAuth({
        url: '/api/messages/',
        type: 'GET',
    });
};

async function deleteMessageAll(message, user) {
    var data = {
        'sender_visibility': false,
        'receiver_visibility': false,
    };

    try {
        return await ajaxWithAuth({
            url: `/api/messages/${message.id}/`,
            type: 'PATCH',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
    
            success: function(response) {
                console.log('Сообщение удалено');
            },
    
            error: function(xhr, status, error) {
                console.log('Не удалось удалить сообщение');
                
            }
        });
    } catch (error) {
        addNotification(error.responseJSON.text, true);
    };
};

async function deleteMessageMe(message, user) {
    if (message.sender.id == user.id) {
        var data = {
            'sender_visibility': false,
        };
    } else {
        var data = {
            'receiver_visibility': false,
        };
    };

    try {
        return await ajaxWithAuth({
            url: `/api/messages/${message.id}/`,
            type: 'PATCH',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
    
            success: function(response) {
                console.log('Сообщение удалено');
            },
    
            error: function(xhr, status, error) {
                console.log('Не удалось удалить сообщение');
                
            }
        });
    } catch (error) {
        addNotification(error.responseJSON.text, true);
    };
};

async function editMessage(message, newText) {
    var formData = {
        'text_message': newText,
    };

    try {
        return await ajaxWithAuth({
            url: `/api/messages/${message.id}/`,
            type: 'PATCH',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',
    
            success: function(response) {
                console.log('Текс сообщения изменен');
            },
    
            error: function(xhr, status, error) {
                console.log('Ошибка при редактировании текста сообщения');
            },
        });
    } catch (error) {
        addNotification(error.responseJSON.text, true);
    };
}

const observerMessageButtons = new MutationObserver(async () => {
    const deleteButtonsAll = document.querySelectorAll('.deleteButtonAll');
    const deleteButtonsMe = document.querySelectorAll('.DeleteButtonMe');
    const editButtons = document.querySelectorAll('.editButton');
    var user = await getUserData(localStorage.getItem('userId'));    

    deleteButtonsAll.forEach(button => {
        button.addEventListener('click', async () => {
            var messageId = parseInt(button.value, 10);
            var messages = await getMessages();
            var message = messages.find(message => message.id === messageId);
            var blockMessage = document.getElementById(`messageId${messageId}`);

            await deleteMessageAll(message, user);
            blockMessage.remove();
        });
    });

    deleteButtonsMe.forEach(button => {
        button.addEventListener('click', async () => {
            var messageId = parseInt(button.value, 10);
            var messages = await getMessages();
            var message = messages.find(message => message.id === messageId);
            var blockMessage = document.getElementById(`messageId${messageId}`);
            
            await deleteMessageMe(message, user);
            blockMessage.remove();
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', async () => {
            var messageId = parseInt(button.value, 10);
            var messages = await getMessages();
            var message = messages.find(message => message.id === messageId);
            var textMessageInput = $('#message-input');
            textMessageInput.val(`${message.text_message}`);
            textMessageInput.focus();

            $('#input-message-form').click(async function(e) {
                e.preventDefault();
                e.stopPropagation();

                var newText = $('#message-input').val();
                $('#message-input').val('');
        
                await editMessage(message, newText);
                var blockMessage = document.getElementById(`messageId${message.id}`);
                blockMessage.querySelector('.message-text p').textContent = newText;
            });
        });
    });
});

observerMessageButtons.observe(document.getElementById('listMessages'), { childList: true, subtree: true });