$(document).ready(function() {
    $('#LoginForm').on('submit', function(e) {
        e.preventDefault();

        var formData = {
            'username': $("#username-input").val(),
            'password': $('#password-input').val(),
            // 'csrfmiddlewaretoken': '{{ csrf_token }}',
        };        

        $.ajax({
            url: 'http://127.0.0.1:8000/api/login/',
            type: 'POST',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',            

            success: function(response) {
                // localStorage.setItem('accessToken', response.data.access);
                // localStorage.setItem('refreshToken', response.data.refresh);
                window.location.href = `http://127.0.0.1:8000/messenger/im/?notification=${formData['username']}`;
            },

            error: function(xhr, status, error) {
                var errorMessage = (xhr.responseJSON && xhr.responseJSON.error) ? xhr.responseJSON.error : 'Неизвестная ошибка';
                alert("Ошибка при входе в аккаунт: " + errorMessage);
                console.log("Ошибка при входе в аккаунт: ", errorMessage);
            },
        });
    });
});
