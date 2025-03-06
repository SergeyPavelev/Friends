async function getPosts() {
    return await ajaxWithAuth({
        url: '/api/posts/',
        type: 'GET',

        error: function(xhr, status, error) {
            addNotification(error.responseJSON.text, true);
        }
    });
};

async function deletePost(post) {
    var data = {
        'visibility': false,
    };

    return await ajaxWithAuth({
        url: `/api/posts/${post.id}/`,
        type: 'PATCH',
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',

        success: function(response) {
            console.log('Пост удален');
        },

        error: function(xhr, status, error) {
            addNotification(error.responseJSON.text, true);
        }
    });
};

async function editPost(post, newTitle, newText) {
    var formData = {
        'title': newTitle,
        'text': newText,
    }
    
    return await ajaxWithAuth({
        url: `/api/posts/${post.id}/`,
        type: 'PATCH',
        data: JSON.stringify(formData),
        dataType: 'json',
        contentType: 'application/json',

        success: function(response) {
            console.log('Пост отредактирован');
        },

        error: function(xhr, status, error) {
            addNotification(error.responseJSON.text, true);
        }
    });
};

const observerPostButtons = new MutationObserver(async () => {
    const deleteButtonsAll = document.querySelectorAll('.deletePostButton');
    const editButtons = document.querySelectorAll('.editPostButton');

    deleteButtonsAll.forEach(button => {
        button.addEventListener('click', async () => {
            var postId = parseInt(button.value, 10);
            var posts = await getPosts();
            var post = posts.find(post => post.id === postId);
            var blockMessage = document.getElementById(`postId${postId}`);            

            try {
                await deletePost(post);
            } catch (error) {
                addNotification(error.responseJSON.text, true);
            };
            blockMessage.remove();
        });
    });

    editButtons.forEach(button => {
        button.addEventListener('click', async () => {
            var postId = parseInt(button.value, 10);
            var posts = await getPosts();
            var post = posts.find(post => post.id === postId);
            var titlePostInput = $('#title-input');
            var textPostInput = $('#textarea-input');
            
            titlePostInput.val(`${post.title}`);
            textPostInput.val(`${post.text}`);
            titlePostInput.focus();

            $('#save-post').click(async function(e) {
                e.preventDefault();
                e.stopPropagation();

                var newTitle = $('#title-input').val();
                var newText = $('#textarea-input').val();
                $('#title-input').val('');
                $('#textarea-input').val('');
        
                try {
                    await editPost(post, newTitle, newText);
                } catch (error) {
                    addNotification(error.responseJSON.text, true);
                };
                var blockPost = document.getElementById(`postId${post.id}`);
                blockPost.querySelector('.post-title').textContent = newTitle;
                blockPost.querySelector('.post-text').textContent = newText;
            });
        });
    });
});

observerPostButtons.observe(document.getElementById('blockListPosts'), { childList: true, subtree: true });