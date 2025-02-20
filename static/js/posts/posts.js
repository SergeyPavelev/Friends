function friendsIncludesPostAuthor(user, postAuthor) {
    for (let i = 0; i < user.friends.length; i++) {
        const friend = user.friends[i];
            if (friend.id === postAuthor.id) return true;
    }
};

function formatDate(dateString) {
    // Создаем объект Date из строки
    const date = new Date(dateString);
  
    // Получаем компоненты даты
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year = date.getFullYear();
  
    // Получаем компоненты времени
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // Форматируем дату и время
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }

async function displayPosts() {
    const userId = localStorage.getItem('userId');

    if (userId) {
        var user = await getUserData(userId);             
    } else {
        console.error('userId отсутствует в localStorage');
    };

    var posts = await ajaxWithAuth({
        url: '/api/posts/',
        type: 'GET',
        dataType: 'json',
    });

    var blockPosts = document.getElementById('blockListPosts');

    posts.forEach(post => {
        if ((post.author.id == userId || friendsIncludesPostAuthor(user, post.author)) && post.visibility) {
            var postBlock = createPostBlock(user, post);
            blockPosts.insertAdjacentHTML('afterbegin', postBlock);
        };
    });
};

async function sendPost() {
    user = await getUserData(localStorage.getItem('userId'));

    titlePost = $('#title-input').val();
    textPost = $('#textarea-input').val();

    var formData = {
        'title': titlePost,
        'text': textPost,
        'author': user.id,
    };

    if (!titlePost && !textPost) return;

    try {
        var post = await ajaxWithAuth({
            url: '/api/posts/',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(formData),
            contentType: 'application/json',
        });
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        return;
    };

    console.log(post);
    

    $('#title-input').val('');
    $('#textarea-input').val('');

    var blockPosts = document.getElementById('blockListPosts');
    var postBlock = createPostBlock(user, post);
    
    blockPosts.insertAdjacentHTML('afterbegin', postBlock);
};

function createPostBlock(user, post) {
    var authorPost = post.author;
    var titlePost = post.title;
    var textPost = post.text;
    var dateCreatedPost = formatDate(post.date_created);

    if (authorPost.avatar) {
        var avatarAuthor = authorPost.avatar;
    } else {
        if (user.theme == 'Light') {
            var avatarAuthor = '/static/img/user-avatar-black.png';
        } else if (user.theme == 'Dark') {
            var avatarAuthor = '/static/img/user-avatar-white.png';
        }
    }

    if (user.theme == 'Light') {
        var editIkon = '/static/img/edit-black.png';
        var trashIkon = '/static/img/trash-black.png';
    } else if (user.theme == 'Dark') {
        var editIkon = '/static/img/edit-white.png';
        var trashIkon = '/static/img/trash-white.png';
    }

    if (user.id == authorPost.id) {
        var post = `
            <div class="block-post">
                <a href="/profile/${authorPost.id}" class="author-profile-link">
                    <div class="block-user-img">
                        <img src="${avatarAuthor}" alt="User-avatar">
                    </div>
                </a>
                <div class="info-post">
                    <div class="block-post-author">
                        <span class='post-author'>${authorPost.username}</span>
                    </div>
                    <div class="block-post-title">
                        <p class='post-title'>${titlePost}</p>
                    </div>
                    <div class="block-post-text">
                        <p class='post-text'>${textPost}</p>
                    </div>
                </div>
                <div class="additional-interaction-post">
                        <div class="block-post-buttons">
                            <div class="block-post-button">
                                <form id="edit-post-form" method="post">
                                    <button class="button-post" id="button-edit-post" type="submit" title="Edit post">
                                        <img src="${editIkon}" alt="Edit">
                                    </button>
                                </form>
                            </div>
                            <div class="block-post-button">
                                <form id="delete-post-form" method="post">
                                    <button class="button-post" id="button-delete-post" type="submit" title="Delete post">
                                        <img src="${trashIkon}" alt="Delete all">
                                    </button>
                                </form>
                            </div>
                        </div>
                    <div class="block-post-date-created">
                        <span class='post-date-created'>${dateCreatedPost}</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        var post = `
            <div class="block-post">
                <a href="/profile/${authorPost.id}" class="author-profile-link">
                    <div class="block-user-img">
                        <img src="${avatarAuthor}" alt="User-avatar">
                    </div>
                </a>
                <div class="info-post">
                    <div class="block-post-author">
                        <span class='post-author'>${authorPost.username}</span>
                    </div>
                    <div class="block-post-title">
                        <p class='post-title'>${titlePost}</p>
                    </div>
                    <div class="block-post-text">
                        <p class='post-text'>${textPost}</p>
                    </div>
                </div>
                <div class="additional-interaction-post">
                    <div class="block-post-date-created">
                        <span class='post-date-created'>${dateCreatedPost}</span>
                    </div>
                </div>
            </div>
        `;
    };

    return post;
};

document.addEventListener('DOMContentLoaded', function() {
    displayPosts();

    $('#save-post').click(function(e){
        e.preventDefault();
        e.stopPropagation();

        sendPost();
    });    
});
