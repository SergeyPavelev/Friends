$(document).ready(function() {
    $('#LoginForm').on('submit', function(e) {
        e.preventDefault();

        var formData = {
            'username': $("#username-input").val(),
            'password': $('#password-input').val(),
            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
        };        
        
        $.ajax({
            type: 'POST',
            url: '/api/login/',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Content-Type': 'application/json',
            },          

            success: function(response) {
                localStorage.setItem('accessToken', response['access']);
                localStorage.setItem('refreshToken', response['refresh']);
                localStorage.setItem('userId', response['user_id']);

                window.location.href = `/messenger/im/?notification=${formData['username']}`;
            },

            error: function(xhr, status, error) {
                var errorMessage = (xhr.responseJSON && xhr.responseJSON.error) ? xhr.responseJSON.error : 'Неизвестная ошибка';
                alert("Ошибка при входе в аккаунт: " + errorMessage);
                console.log("Ошибка при входе в аккаунт: ", errorMessage);
            },
        });
    });
});
