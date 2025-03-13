function getIncludesUserFriends(user, friends) {
    return friends.find(friend => user.id == friend);
};

async function displayProfile() {
    const userId = localStorage.getItem('userId');
    const userProfileId = window.location.pathname.split('/').reverse()[1];

    if (userId && userProfileId) {
        var user = await getUserData(userId);             
        var userProfile = await getUserData(userProfileId);             
    } else {
        console.error('UserId и receiverId не найдены');
    };

    blockUsername = document.getElementById('username');
    blockUsername.innerHTML = userProfile.username;

    var blockUserAvatar = document.querySelector('#blockLoadPhoto img');

    if (userProfile.avatar) {
        var avatar = userProfile.avatar;
    } else {
        // if (user.theme == 'Light') {
        //     var avatar = '/static/img/user-avatar-black.png';
        // } else if (user.theme == 'Dark') {
        //     var avatar = '/static/img/user-avatar-white.png';
        // };

        var avatar = '/static/img/null-profile-photo.jpg';
    };

    blockUserAvatar.setAttribute('src', avatar)

    blockDataUser = document.getElementById('blockDataUser');
    
    if (userId == userProfileId) {
        document.getElementById('inputUsername').setAttribute('value', user.username);
        document.getElementById('inputPhone').setAttribute('value', user.phone);
        document.getElementById('inputEmail').setAttribute('value', user.email);
        document.getElementById('inputPassword').setAttribute('value', '******');
        document.getElementById('inputFirstName').setAttribute('value', user.first_name);
        document.getElementById('inputMiddleName').setAttribute('value', user.middle_name);
        document.getElementById('inputLastName').setAttribute('value', user.last_name);

        try {
            var profile = await ajaxWithAuth({
                url: `/api/profiles/${userId}/`,
                type: 'GET',
            });
            
            document.getElementById('inputBio').setAttribute('value', profile.bio);
            document.getElementById('inputBirthday').setAttribute('value',profile.birthday);
            
            if (profile.sex) {
                document.getElementById('inputSex').innerHTML += `
                    <option value="True">Man</option>
                    <option value="False">Woman</option>
                `;
            } else {
                document.getElementById('inputSex').innerHTML += `
                    <option value="False">Woman</option>
                    <option value="True">Man</option>
                `;
            }
        } catch (error) {
            console.log("Такого профиля нет - ", error);
        };

        document.querySelectorAll('.user-data').forEach(form => {            
            form.innerHTML += `
                <button id="button${form.id.split('form')[1]}" type="submit" class="profile-data-button" name="ChangeUserData" value="${userProfileId}">Change</button>
            `;
        });
    } else {
        document.getElementById('formUploadAvatar').remove();

        document.getElementById('inputUsername').setAttribute('value', userProfile.username);
        document.getElementById('inputPhone').setAttribute('value', userProfile.phone);
        document.getElementById('inputEmail').setAttribute('value', userProfile.email);
        document.getElementById('formPassword').remove();
        document.getElementById('inputFirstName').setAttribute('value', userProfile.first_name);
        document.getElementById('inputMiddleName').setAttribute('value', userProfile.middle_name);
        document.getElementById('inputLastName').setAttribute('value', userProfile.last_name);

        document.getElementById('inputSex').remove();       
        document.getElementById('formSex').innerHTML += `
            <input id='inputSex' class='input-profile-data' placeholder='Sex' type='text' name='sex'>
        `;

        try {
            var profile = await ajaxWithAuth({
                url: `/api/profiles/${userProfileId}/`,
                type: 'GET',
            });

            if (profile.sex) {
                var sex = 'Man';
            } else {
                var sex = 'Woman';
            };

            document.getElementById('inputBio').setAttribute('value', profile.bio);
            document.getElementById('inputBirthday').setAttribute('value',profile.birthday);
            document.getElementById('inputSex').setAttribute('value', sex);
        } catch (error) {
            console.log("Такого профиля нет");
        };

        document.querySelectorAll('.user-data').forEach(form => {
            form.querySelector('.input-profile-data').setAttribute('readonly','readonly');
        });

        var blockProfileButtons = document.getElementById('blockProfileButtons');

        if (user.theme == 'Light') {
            var addToFriends = '/static/img/add-to-friends-black.png';
            var deleteFromFriends = '/static/img/delete-from-friends-black.png';
        } else if (user.theme == 'Dark') {
            var addToFriends = '/static/img/add-to-friends-white.png';
            var deleteFromFriends = '/static/img/delete-from-friends-white.png';
        };

        if (getIncludesUserFriends(userProfile, user.friends)) {
            var blockButtons = `
                <button id="buttonUser${userProfileId}" class="profile-button" type="submit" name="Delete from friends" value="${userProfileId}">
                    <img src="${deleteFromFriends}" alt="delete from friends">
                </button>
    
                <div id="blockToMessengerButton" class="block-to-messenger-button">
                    <a class="link-to-messenger" href="/messenger/im/${userProfileId}/">
                        <button class="profile-button">Message</button>
                    </a>
                </div>
            `;
        } else {
            var blockButtons = `
                <button id="buttonUser${userProfileId}" class="profile-button" type="submit" name="Add to friends" value="${userProfileId}">
                    <img src="${addToFriends}" alt="add to friends">
                </button>
            `;
        };

        blockProfileButtons.insertAdjacentHTML('beforeend', blockButtons);
    };
    
};

document.addEventListener('DOMContentLoaded', async function() {
    await displayProfile();
});