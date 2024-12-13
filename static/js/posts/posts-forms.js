$(document).ready(function() {
    $('#save-post').click(function(e){
        e.preventDefault();
        e.stopPropagation();
    
        var element = document.getElementById('PostForm');
        var title = element.title.value;
        var textarea = element.textarea.value;
    
        if (title != "" & textarea != "") {
            $.ajax({
                type: "POST",
                url: "http://127.0.0.1:8000/posts/",
                dataType: 'json',
                data: {
                    title: title,
                    textarea: textarea,
                    csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
                },
    
                success: function(data) {
                    $('#PostForm textarea').val('');
    
                    alert('Пост сохранен');
    
                    var author = data['success']['author'];
                    var title = data['success']['title'];
                    var text = data['success']['text'];
                    var date_created = data['success']['date_created'];
                    
    
                    var lists_posts = document.querySelector('.list-posts');
    
                    if(data['success']['user'] == data['success']['author']){
                        var post = `
                            <div class="block-post">
                                <a href="{% url 'user_profile:profile' user_id=post.author.id %}" class="author-profile-link">
                                    {% if post.author.profile_photo %}
                                        <div class="block-user-img">
                                            <img src="{{ post.author.profile_photo.url }}" alt="User-avatar">
                                        </div>
                                    {% else %}
                                        <div class="block-user-img">
                                            <img src="{% static 'img/user-profile.png' %}" alt="User-avatar">
                                        </div>
                                    {% endif %}
                                </a>
                                <div class="info-post">
                                    <div class="block-post-author">
                                        <span class='post-author'>${author}</span>
                                    </div>
                                    <div class="block-post-title">
                                        <p class='post-title'>${title}</p>
                                    </div>
                                    <div class="block-post-text">
                                        <p class='post-text'>${text}</p>
                                    </div>
                                </div>
                                <div class="additional-interaction-post">
                                        <div class="block-post-buttons">
                                            <div class="block-post-button">
                                                <form id="edit-post-form" action="{% url 'posts:edit_post' post_id=post.id %}" method="post">
                                                    <button class="button-post" id="button-edit-post" type="submit" title="Edit post">
                                                        <img src="{% static './img/button-edit.png' %}" alt="Edit">
                                                    </button>
                                                </form>
                                            </div>
                                            <div class="block-post-button">
                                                <form id="delete-post-form" action="{% url 'posts:delete_post' post_id=post.id %}" method="post">
                                                    <button class="button-post" id="button-delete-post" type="submit" title="Delete post">
                                                        <img src="{% static './img/button-trash.png' %}" alt="Delete all">
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    <div class="block-post-date-created">
                                        <span class='post-date-created'>${date_created}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        var post = `
                            <div class="block-post">
                                <a href="{% url 'user_profile:profile' user_id=post.author.id %}" class="author-profile-link">
                                    {% if post.author.profile_photo %}
                                        <div class="block-user-img">
                                            <img src="{{ post.author.profile_photo.url }}" alt="User-avatar">
                                        </div>
                                    {% else %}
                                        <div class="block-user-img">
                                            <img src="{% static 'img/user-profile.png' %}" alt="User-avatar">
                                        </div>
                                    {% endif %}
                                </a>
                                <div class="info-post">
                                    <div class="block-post-author">
                                        <span class='post-author'>${author}</span>
                                    </div>
                                    <div class="block-post-title">
                                        <p class='post-title'>${title}</p>
                                    </div>
                                    <div class="block-post-text">
                                        <p class='post-text'>${text}</p>
                                    </div>
                                </div>
                                <div class="additional-interaction-post">
                                    <div class="block-post-date-created">
                                        <span class='post-date-created'>${date_created}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    };
    
                    lists_posts.insertAdjacentHTML('afterbegin', post);
                },
    
                error: function (data) {
                    alert(data['errors'])
                },
            });
            
        };
    });    
});