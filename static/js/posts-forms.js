$(document).on('submit', '#PostForm', function(e){
    e.preventDefault();
    var element = document.getElementById('PostForm');

    var title = element.title.value;
    var textarea = element.textarea.value;

    if (title != "" & textarea != "") {
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8000/messenger/im/posts/",
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
                

                var lists_posts = document.querySelector('.lists-posts');

                if(data['success']['user'] == data['success']['author']){
                    var post = `
                        <div class="posts-container">
                            <div class="div-post-author">
                                <p class='post-author'>${author}</p>
                            </div>
                            <div class="div-post-title">
                                <p class='post-title'>${title}</p>
                            </div>
                            <div class="div-post-text">
                                <p class='post-text'>${text}</p>
                            </div>
                            <div class="div-post-date-created">
                                <p class='post-date-created'>${date_created}</p>
                            </div>
                            <div class="div-post-edit">
                                <form action="" method="post">
                                    <button>
                                        <i class='bx bxs-edit'></i>
                                    </button>
                                </form>
                            </div>
                            <div class="div-post-delete">
                                <form action="" method="post">
                                    <button>
                                        <i class='bx bx-trash'></i>
                                    </button>
                                </form>
                            </div>
                        </div>
                    `;
                } else {
                    var post = `
                        <div class="posts-container">
                            <div class="div-post-author">
                                <p class='post-author'>${author}</p>
                            </div>
                            <div class="div-post-title">
                                <p class='post-title'>${title}</p>
                            </div>
                            <div class="div-post-text">
                                <p class='post-text'>${text}</p>
                            </div>
                            <div class="div-post-date-created">
                                <p class='post-date-created'>${date_created}</p>
                            </div>
                        </div>
                `;
                };

                lists_posts.insertAdjacentHTML('afterbegin', post)
            },

            error: function (data) {
                alert(data['errors'])
            },
        });
        
    };
});
