$(document).ready(function() {
    $('#RegisterForm').submit(function(e) {
        e.preventDefault();

        var formData = {
            'phone': $('#phone-input').val(),
            'username': $("#username-input").val(),
            'password': $('#password-input').val(),
            'password_repeat': $('#password-repeat-input').val(),
            'csrfmiddlewaretoken': '{{ csrf_token }}',
        };

        $.ajax({
            url: '/api/signup/',
            type: 'POST',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',            

            success: function(response) {
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
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
