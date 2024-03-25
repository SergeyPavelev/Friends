from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),  # Django Admin Panel
    path('', include("main.urls")),
    path('messenger/im/', include("messenger.urls")),
    path('profile/<int:user_id>/', include("user_profile.urls")),
    path('auth/', include("register.urls", namespace='auth')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
