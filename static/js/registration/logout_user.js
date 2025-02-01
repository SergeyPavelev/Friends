$(document).ready(function() {
    $('#logout-button').on('click', function() {
        $.ajax({
            url: "/api/logout/",
            type: "POST",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                'refresh_token': localStorage.getItem('refreshToken'),
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            
            success: function() {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = "/auth/login/";
            },

            error: function(xhr, status, error) {
                alert("Не удалось выйти из аккаунта")
                console.log("Ошибка при выходе: ", error);                
            },
        });
    });
});
