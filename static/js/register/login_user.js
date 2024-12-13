$(document).ready(function() {
    $('#LoginForm').submit(function(e) {
        e.preventDefaul();

        var formData = {
            'username': $("#username-input"),
            'password': $('#password-input'),
            'csrfmiddlewaretoken': '{{ csrf_token }}'
        };

        $.ajax({
            url: 'http://127.0.0.1:8000/auth/login/',
            type: 'POST',
            data: formData,
            dataType: 'json',
            contentType: 'application/json',            

            success: function() {
                window.location.href = "http://127.0.0.1:8000/messenger/im/";
            },

            error: function(xhr, statuc, error) {
                console.log("Ошибка при входе в аккаунт: ", error);
            },
        })
    })
})
