$(document).ready(function() {
    $('#theme-toggle').click(async function(e) {
        e.preventDefault(); 

        var user = await getUserData(localStorage.getItem('userId'));
        
        if (user.theme == 'Light') {
            var newTheme = 'Dark';
        } else if (user.theme == 'Dark') {
            var newTheme = 'Light'
        };

        var data = {
            'theme': newTheme,
        };

        await ajaxWithAuth({
            url: `/api/users/${user.id}/`,
            type: 'PATCH',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',

            success: function(response) {
                var currentPath = window.location.pathname;
                
                if (response.theme == 'Light') {
                    document.querySelector('body').classList.remove('dark-theme');
                    document.querySelector('body').classList.add('light-theme');

                    $('#theme-toggle img').attr('src', '/static/img/sunshine-black.png');
                    $('img').each(function() {
                        var imgSrc = $(this).attr('src').replace('-white', '-black');
                        $(this).attr('src', imgSrc);
                    });
                      
                    if (/\d/.test(currentPath.split('/messenger/im/')[1])) {
                        $('link[href*="send-messages-dark-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/messenger/send-messages-light-theme.css">');
                    } else if (currentPath.includes('/posts/')) {
                        $('link[href*="posts-dark-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/posts/posts-light-theme.css">');
                    } else if (currentPath.includes('/all_users/') || currentPath.includes('/my_friends/')) {
                        $('link[href*="list-users-dark-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/messenger/list-users-light-theme.css">');
                    } else if (currentPath.includes('/messenger/im/')) {
                        $('link[href*="list-chats-dark-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/messenger/list-chats-light-theme.css">');  
                    } else if (currentPath.includes('/profile/')) {
                        $('link[href*="user-profile-dark-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/user_profile/user-profile-light-theme.css">');
                    };
                } else if (response.theme == 'Dark') {
                    document.querySelector('body').classList.remove('light-theme');
                    document.querySelector('body').classList.add('dark-theme');

                    $('#theme-toggle img').attr('src', '/static/img/moon-white.png');
                    $('img').each(function() {
                        var imgSrc = $(this).attr('src').replace('-black', '-white');
                        $(this).attr('src', imgSrc);
                    });

                    if (/\d/.test(currentPath.split('/messenger/im/')[1])) {
                        $('link[href*="send-messages-light-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/messenger/send-messages-dark-theme.css">');
                    } else if (currentPath.includes('/posts/')) {
                        $('link[href*="posts-light-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/posts/posts-dark-theme.css">');
                    } else if (currentPath.includes('/all_users/') || currentPath.includes('/my_friends/')) {
                        $('link[href*="list-users-light-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/messenger/list-users-dark-theme.css">');
                    } else if (currentPath.includes('/messenger/im/')) {
                        $('link[href*="list-chats-light-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/messenger/list-chats-dark-theme.css">');
                    } else if (currentPath.includes('/profile/')) {
                        $('link[href*="user-profile-light-theme.css"]').remove();
                        $('head').append('<link rel="stylesheet" href="/static/css/user_profile/user-profile-dark-theme.css">');
                    };
                };
                
                console.log('Тема обновлена на ', response.theme);
            },

            error: function(xhr, status, error) {
                var errorMessage = (xhr.responseJSON && xhr.responseJSON.error) ? xhr.responseJSON.error : 'Неизвестная ошибка';
                alert("Ошибка при изменении темы: " + errorMessage);
                console.log("Ошибка при изменении темы: ", errorMessage);
            },
        });
        // });
    });
});

