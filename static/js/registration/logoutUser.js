$(document).ready(function() {
    $('#logout-button').on('click', async function() {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.error("Refresh токен отсутствует. Пользователь уже вышел из системы.");
            return;
        };

        var response = await ajaxWithAuth({
            url: "/api/logout/",
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                'refreshToken': localStorage.getItem('refreshToken'),
            }),
        });

        if (response.status == 200) {
            await $.ajax({
                url: `/api/users/${localStorage.getItem('userId')}/`,
                type: 'PATCH',
                data: JSON.stringify({
                    'is_online': false,
                }),
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
            });
            
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            console.log('Вы вышли из аккаунта');
            
            window.location.href = "/auth/login/";
        } else {
            console.log('Не удалось выйти из аккаунта: ', response.error);
        };
    });
});
