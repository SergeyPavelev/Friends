$(document).ready(function() {
    $('#input-message-form').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
    
        var element = document.getElementById('SendMessageForm');
        var textarea = element.textarea.value; 
                    
        if (textarea != "") {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    textarea: textarea,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                },
    
                success: function(data) {
                    $('#SendMessageForm textarea').val('');
                    
                    user = data['success']['user'];
                    sender_message = data['success']['sender_message'];
                    text_message = data['success']['textarea'];
                    time_created_message = data['success']['time_created'];

                    var list_messages = document.querySelector('.lists-messages');
                    
                    if (user == sender_message) {
                        var message = `
                            <div class="message">
                                <div class="div-message-sender">
                                    <li class="message-sender">${sender_message}: ${text_message}</li>
                                    <p class="message-time-created">${time_created_message}</p>
                                </div>

                                <div class="list-message-btns">
                                    <div class="activate-btn">
                                        <i class='bx bx-chevron-right'></i>
                                    </div>

                                    <div class="message-btns">
                                        <div class="message-btn">
                                            <form action="{% url 'messenger:edit_message' receiver_id=receiver_id message_id=message.id %}">
                                                {% csrf_token %}
                                                <button type="submit">
                                                    <i class='bx bxs-edit'></i>
                                                </button>
                                            </form>
                                        </div>
                
                                        <div class="message-btn">
                                            <form action="{% url 'messenger:delete_message_from_everyone' message_id=message.id %}" method="post">
                                                {% csrf_token %}
                                                <button type="submit">
                                                    <i class='bx bx-trash'></i>
                                                </button>
                                            </form>
                                        </div>
                
                                        <div class="message-btn">
                                            <form action="{% url 'messenger:delete_message_from_me' message_id=message.id %}" method="post">
                                                {% csrf_token %}
                                                <button type="submit">
                                                    <i class='bx bx-trash'></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    } else {
                        var message = `
                            <div class="message">
                                <div class="div-message-sender">
                                    <li class="message-sender">${sender_message}: ${text_message}</li>
                                    <p class="message-time-created">${time_created_message}</p>
                                </div>

                                <div class="list-message-btns">
                                    <div class="activate-btn">
                                        <i class='bx bx-chevron-right'></i>
                                    </div>
                
                                        <div class="message-btn">
                                            <form action="{% url 'messenger:delete_message_from_everyone' message_id=message.id %}" method="post">
                                                {% csrf_token %}
                                                <button type="submit">
                                                    <i class='bx bx-trash'></i>
                                                </button>
                                            </form>
                                        </div>
                
                                        <div class="message-btn">
                                            <form action="{% url 'messenger:delete_message_from_me' message_id=message.id %}" method="post">
                                                {% csrf_token %}
                                                <button type="submit">
                                                    <i class='bx bx-trash'></i>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `
                    };
                    
                    list_messages.insertAdjacentHTML('beforeend', message);
                },
    
                errors: function (data) {
                    alert(data['errors']);
                },
            });
        };
    });
});
