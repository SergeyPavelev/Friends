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
            url: 'http://127.0.0.1:8000/auth/signup/',
            type: 'POST',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',            

            success: function() {
                window.location.href = "http://127.0.0.1:8000/messenger/im/?notification=Добро%20пожаловать%20в%20Friends";
            },

            error: function(xhr, status, error) {
                alert(error);
                console.log("Ошибка при регистрации пользователя: ", error);
            },
        });
    });
});
