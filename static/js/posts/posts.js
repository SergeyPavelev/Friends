function friendsIncludesPostAuthor(user, postAuthor) {
    for (let i = 0; i < user.friends.length; i++) {
        const friend = user.friends[i];
        if (friend == postAuthor.id) return true;
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
  
    // Форматируем дату и время
    return `${day}.${month}.${year} ${hours}:${minutes}`;
};

let currentPage = 1;
let loading = false;

async function displayPosts(user, methodInsert) {
    if (loading) return;
    loading = true;

    try {
        var postsResponse = await ajaxWithAuth({
            url: `/api/posts/?page=${currentPage}`,
            type: 'GET',
            dataType: 'json',
        });

        var posts = postsResponse.results;       
        
    } catch (error) {
        console.log('Error in load posts');
    };

    if (!postsResponse) return;

    var blockPosts = document.getElementById('blockListPosts');

    posts.forEach(post => {
        console.log(post);
        
        if ((post.author.id == user.id || friendsIncludesPostAuthor(user, post.author)) && post.visibility) {
            var postBlock = createPostBlock(user, post);
            blockPosts.insertAdjacentHTML(methodInsert, postBlock);
        };
    });

    currentPage++;
    loading = false;  
};

async function sendPost(user) {
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

        addNotification('Post created', false);
        
    } catch (error) {
        console.error('Ошибка при создании поста:', error);
        addNotification(error.responseJSON.text, true);
        return;
    };    

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
            <div id="postId${post.id}" class="block-post">
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
                                <button class="editPostButton" type="submit" title="Edit post" value="${post.id}">
                                    <img src="${editIkon}" alt="Edit">
                                </button>
                            </div>
                            <div class="block-post-button">
                                <button class="deletePostButton" type="submit" title="Delete post" value="${post.id}">
                                    <img src="${trashIkon}" alt="Delete all">
                                </button>
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
            <div id="postId${post.id}" class="block-post">
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

document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userId');

    if (userId) {
        var user = await getUserData(userId);            
    } else {
        console.error('UserId не найден');
    };

    await displayPosts(user, 'beforeend');

    var listPosts = document.getElementById('blockListPosts');

    listPosts.addEventListener('scroll', async function () {        
        if (listPosts.clientHeight + Math.ceil(Math.abs(listPosts.scrollTop)) >= listPosts.scrollHeight) {
            await displayPosts(user, 'beforeend');
        };
    });

    $('#save-post').click(async function(e){
        e.preventDefault();
        e.stopPropagation();

        await sendPost(user);
    });    
});
