$(document).on('submit', '#PostForm', function(e){
    e.preventDefault();
    var element = document.getElementById('PostForm');

    var title = element.title.value;
    var textarea = element.textarea.value;

    if (title != "" & textarea != "") {
        $.ajax({
            type: "POST",
            url: "",
            data: {
                title: title,
                textarea: textarea,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
            },

            // success: function (response) {
            //     alert("Пост сохранен");
            // },

            success: function (data) {
                const postsList = $('.lists-posts');
                postsList.append(context.querySelectorAll('.posts-container:last-child'));
                
            },

            error: function (response) {
                alert(response.responseJSON.errors);
                console.log(response.responseJSON.errors);
            },
        });
        
    };
});
