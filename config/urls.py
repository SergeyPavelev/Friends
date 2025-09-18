from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import debug_toolbar

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),  # Django Admin Panel
    
    path('', include("src.main.urls")),
    path('messenger/', include("src.messenger.urls")),
    path('posts/', include('src.posts.urls', namespace='posts'), name='posts'),
    path('profile/<int:user_id>/', include("src.user_profile.urls")),
    path('auth/', include("src.registration.urls", namespace='registration')),
    path('api/', include('src.api.urls', namespace='api')),
    
    # debug toolbar URLS
    path('__debug__/', include(debug_toolbar.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
