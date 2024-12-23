function addNotification(text) {
    const notificationsBlock = document.getElementById('block-notifications');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = text;
    notificationsBlock.append(notification);

    console.log('333');
    
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 10000);
};

$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const notification = urlParams.get('notification');
    if (notification) {
        addNotification(notification);
    }
});
