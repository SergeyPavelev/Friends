$(document).ready(function() {
    $('#LoginForm').submit(function(e) {
        e.preventDefault();

        var formData = {
            'username': $("#username-input").val(),
            'password': $('#password-input').val(),
            'csrfmiddlewaretoken': '{{ csrf_token }}',
        };        

        $.ajax({
            url: 'http://127.0.0.1:8000/auth/login/',
            type: 'POST',
            data: JSON.stringify(formData),
            dataType: 'json',
            contentType: 'application/json',            

            success: function() {
                console.log(formData['username']);
                
                window.location.href = `http://127.0.0.1:8000/messenger/im/?notification=${formData['username']}`;
            },

            error: function(xhr, status, error) {
                alert("Ошибка при входе в аккаунт: ", error)
                console.log("Ошибка при входе в аккаунт: ", error);
            },
        });
    });
});
