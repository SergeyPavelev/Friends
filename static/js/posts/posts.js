$(document).ready(function() {
    $('#save-post').click(function(e){
        e.preventDefault();
        e.stopPropagation();        

        var formData = {
            'title': $('#title-input').val(),
            'text': $('#textarea-input').val(),
            'author': localStorage.getItem('userId'),
        };        
                
        $.ajax({
            method: "POST",
            url: "/api/posts/",
            data: JSON.stringify(formData),
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },

            success: function(data) {
                console.log('Пост создан!');
                
                $('#PostForm textarea').val('');

                var { author, title, text, date_created, user_avatar } = data['success'];
                var lists_posts = document.querySelector('.list-posts');
                var defaultAvatar = "/static/img/user-profile.png";
                var postAvatar = user_avatar || defaultAvatar;

                if(data['success']['user'] == data['success']['author']){
                    var post = `
                        <div class="block-post">
                            <a href="/profile/${post.author.id}" class="author-profile-link">
                                <div class="block-user-img">
                                    <img src="${postAvatar}" alt="User-avatar">
                                </div>
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
                                                    <img src="/static/img/button-edit.png" alt="Edit">
                                                </button>
                                            </form>
                                        </div>
                                        <div class="block-post-button">
                                            <form id="delete-post-form" action="{% url 'posts:delete_post' post_id=post.id %}" method="post">
                                                <button class="button-post" id="button-delete-post" type="submit" title="Delete post">
                                                    <img src="/static/img/button-trash.png}" alt="Delete all">
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
                            <a href="/profile/${post.author.id}/profile/${post.author.id}" class="author-profile-link">
                                <div class="block-user-img">
                                    <img src="${postAvatar}" alt="User-avatar">
                                </div>
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

                // window.location.href = 'http://127.0.0.1:8000/posts/';
            },

            error: function(xhr, status, error) {
                var errorMessage = (xhr.responseJSON && xhr.responseJSON.error) ? xhr.responseJSON.error : 'Неизвестная ошибка';
                alert("Ошибка при создании поста: " + errorMessage);
                console.log("Ошибка при создании поста: ", errorMessage);
                if (xhr.status == 401) {
                    updateTokens();
                    console.log('Tokens update');
                };
            },
        });
    });    
});
