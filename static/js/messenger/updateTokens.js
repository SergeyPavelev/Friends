function getRefreshToken() {
    return localStorage.getItem('refreshToken');
};

function getAccessToken() {
    return localStorage.getItem('accessToken');
};

function saveTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem('accessToken', accessToken);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};

async function refreshAccessToken() {
    return await $.ajax({
        url: `/api/token/refresh/`,
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            refresh: getRefreshToken(),
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },

        success: function (response) {
            saveTokens(response.access, response.refresh);
        },

        error: function(xhr, status, error) {
            console.error('Не удалось обновить токен. Возможно, refresh токен недействителен.' + xhr);
            addNotification('Ошибка при обновлении токена, обновите страницу', true);
        }, 
    });
};

async function updateStatus(status) {
    return await $.ajax({
        url: `/api/users/${localStorage.getItem('userId')}/`,
        type: 'PATCH',
        data: JSON.stringify({
            'is_online': status,
        }),
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessToken()}`
        },

        error: function(xhr, status, error) {
            console.log('Error in status update');
        },
    });
};

async function ajaxWithAuth(options) {
    const accessToken = getAccessToken();

    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${accessToken}`;

    try {
        var response = await $.ajax(options);
    } catch (jqXHR) {
        if (jqXHR.status == 401) {
            try {
                await refreshAccessToken();
                console.log('Token updated');
                options.headers.Authorization = `Bearer ${getAccessToken()}`;
                return await $.ajax(options);
            } catch (error) {
                console.error('Ошибка при повторном запросе после обновления токена.' + xhr);
                window.location.href = '/auth/login/';
                throw new Error('Ошибка авторизации');
            };
        } else {
            throw jqXHR;
        };
    };

    try {
        // if (!user.is_online) {
        await updateStatus(true);
        // };
    } catch (error) {
        console.log('Error in change the user status');
    };

    return response;
};
