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
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            console.log('Вы вышли из аккаунта');
            
            window.location.href = "/auth/login/";
        } else {
            console.log('Не удалось выйти из аккаунта: ', response.error);
            
        }
    });
});
