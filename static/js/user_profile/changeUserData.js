const observerChangeUserData = new MutationObserver(async () => {
    const formsChangeUserData = document.querySelectorAll('.user-data');   
    
    formsChangeUserData.forEach(form => {        
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            var button = form.querySelector('button');
            var user = await getUserData(button.value);
            var buttonId = button.id;
            var newData = form.querySelector('.input-profile-data').value;

            if (buttonId == 'buttonUsername') {
                var formData = {
                    'username': newData,
                };
            } else if (buttonId == 'buttonPhone') {
                var formData = {
                    'phone': newData,
                };
            } else if (buttonId == 'buttonEmail') {
                var formData = {
                    'email': newData,
                };
            } else if (buttonId == 'buttonPassword') {
                var formData = {
                    'password': newData,
                };
            } else if (buttonId == 'buttonFirstname') {
                var formData = {
                    'first_name': newData,
                };
            } else if (buttonId == 'buttonMiddlename') {
                var formData = {
                    'middle_name': newData,
                };
            } else if (buttonId == 'buttonLastname') {
                var formData = {
                    'last_name': newData,
                };
            } else if (buttonId == 'buttonBirthday') {
                var formData = {
                    'birthday': newData,
                };
            } else if (buttonId == 'buttonBio') {
                var formData = {
                    'bio': newData,
                };
            } else if (buttonId == 'buttonSex') {
                var formData = {
                    'sex': newData,
                };
            }
            
            try {
                var responseUser = await ajaxWithAuth({
                    url: `/api/users/${user.id}/`,
                    type: 'PATCH',
                    data: JSON.stringify(formData),
                    dataType: 'json',
                    contentType: 'application/json',
                });

                var responseProfile = await ajaxWithAuth({
                    url: `/api/profiles/${user.id}/`,
                    type: 'PATCH',
                    data: JSON.stringify(formData),
                    dataType: 'json',
                    contentType: 'application/json',
                });

                console.log('Данные профиля обновлены');
            } catch (error) {
                console.log('Не удалось обновить данные пользователя ', error);
                addNotification(error.responseJSON.text, true);
            }            
        });
    });
});

observerChangeUserData.observe(document.getElementById('blockDataUser'), { childList: true, subtree: true });
