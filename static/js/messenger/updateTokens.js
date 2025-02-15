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

function refreshAccessToken() {
    return $.ajax({
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
            console.error('Не удалось обновить токен. Возможно, refresh токен недействителен.');
            window.location.href = '/auth/login/';
        }, 
    });
};

async function ajaxWithAuth(options) {
    const accessToken = getAccessToken();

    options.headers = options.headers || {};
    options.headers.Authorization = `Bearer ${accessToken}`;

    try {return await $.ajax(options);
    } catch (jqXHR) {
        if (jqXHR.status === 401) {
            try {
                await refreshAccessToken();
                console.log('Token updated');
                options.headers.Authorization = `Bearer ${getAccessToken()}`;
                return await $.ajax(options);
            } catch (error) {
                console.error('Ошибка при повторном запросе после обновления токена.');
                throw new Error('Ошибка авторизации');
            };
        } else {
            throw jqXHR;
        };
    };
};
