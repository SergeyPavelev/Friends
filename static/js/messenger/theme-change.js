$(document).ready(function() {
    $('#theme-toggle').click(function(e) {
        e.preventDefault();

        var user = $(this).data('user');        

        var data = {
            'user': user,
            csrfmiddlewaretoken: '{{ csrf_token }}',
        };

        $.ajax({
            url: 'http://127.0.0.1:8000/api/theme/',
            type: 'POST',
            data: data,
            dataType: 'json',

            success: function() {
                alert('Тема обновлена')
                console.log('Тема обновлена');
            },

            error: function(xhr, status, error) {
                alert('Ошибка при смене темы: ', error)
                console.log('Ошибка при смене темы: ', error);
            },
        });
    });
});