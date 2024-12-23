from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),  # Django Admin Panel
    path('api-auth/', include('rest_framework.urls')),
    # # path('auth/', include('djoser.urls')),
    # path('auth/', include('djoser.urls.jwt')),
    
    path('', include("src.main.urls")),
    path('messenger/im/', include("src.messenger.urls")),
    path('posts/', include('src.posts.urls', namespace='posts'), name='posts'),
    path('profile/<int:user_id>/', include("src.user_profile.urls")),
    path('auth/', include("src.registration.urls", namespace='registration')),
    path('api/', include('src.api.urls', namespace='api'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
