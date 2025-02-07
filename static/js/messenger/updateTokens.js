function updateTokens() {
    $.ajax({
        url: '/api/token/refresh',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
            refresh: localStorage.getItem('refreshToken') // Отправляем refresh token
        }),
        success: function(response) {
            // Получаем новые токены из ответа
            const newAccessToken = response.access;
            const newRefreshToken = response.refresh;

            // Сохраняем новые токены в localStorage
            localStorage.setItem('accessToken', newAccessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            console.log('Токены успешно обновлены!');
        },
        error: function(error) {
            console.error('Ошибка при обновлении токена:', error);
        }
    });
}