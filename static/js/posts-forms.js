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
                    
    
                    var lists_posts = document.querySelector('.list-posts');
    
                    if(data['success']['user'] == data['success']['author']){
                        var post = `
                            <div class="block-post">
                                <div class="block-post-author">
                                    <p class='post-author'>${author}</p>
                                </div>
                                <div class="block-post-title">
                                    <p class='post-title'>${title}</p>
                                </div>
                                <div class="block-post-text">
                                    <p class='post-text'>${text}</p>
                                </div>
                                <div class="block-post-date-created">
                                    <p class='post-date-created'>${date_created}</p>
                                </div>
                                
                                <div class="block-post-buttons">
                                    <div class="block-post-button">
                                        <form action="" method="post">
                                            <button>
                                                <i class='bx bxs-edit'></i>
                                            </button>
                                        </form>
                                    </div>
                                    <div class="div-post-btn">
                                        <form action="" method="post">
                                            <button>
                                                <i class='bx bx-trash'></i>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        `;
                    } else {
                        var post = `
                            <div class="block-post">
                                <div class="block-post-author">
                                    <p class='post-author'>${author}</p>
                                </div>
                                <div class="block-post-title">
                                    <p class='post-title'>${title}</p>
                                </div>
                                <div class="block-post-text">
                                    <p class='post-text'>${text}</p>
                                </div>
                                <div class="block-post-date-created">
                                    <p class='post-date-created'>${date_created}</p>
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