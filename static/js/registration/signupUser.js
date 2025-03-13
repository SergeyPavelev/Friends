$(document).ready(function() {
    $('#RegisterForm').submit(function(e) {
        e.preventDefault();

        var formData = {
            'phone': $('#phone-input').val(),
            'username': $("#username-input").val(),
            'password': $('#password-input').val(),
            'password_repeat': $('#password-repeat-input').val(),
            'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val(),
        };

        $.ajax({
            type: 'POST',
            url: '/api/signup/',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',
            headers: {
                'Content-Type': 'application/json',
            },  

            success: function(response) {
                if (response.status != 201) return;
                localStorage.setItem('accessToken', response['access']);
                localStorage.setItem('refreshToken', response['refresh']);
                localStorage.setItem('userId', response['user_id']);                
                
                window.location.href = `/messenger/im/?notification=${formData['username']}`;
            },

            error: function(xhr, status, error) {
                var errorMessage = (xhr.responseJSON && xhr.responseJSON.error) ? xhr.responseJSON.error : 'Неизвестная ошибка';
                alert("Ошибка при регистрации пользователя: " + errorMessage);
                console.log("Ошибка при регистрации пользователя: ", errorMessage);
            },
        });
    });
});
