$(document).ready(function() {
    $('#logout-button').on('click', function() {
        $.ajax({
            url: "http://127.0.0.1:8000/api/logout/",
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                'refresh_token': localStorage.getItem('refreshToken'),
            }),
            
            success: function() {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = "http://127.0.0.1:8000/auth/login/";
            },

            error: function(xhr, status, error) {
                alert("Не удалось выйти из аккаунта")
                console.log("Ошибка при выходе: ", error);                
            },
        });
    });
});
