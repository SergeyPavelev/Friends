from django.contrib import admin
from django.urls import path, include

from config import settings

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),  # Django Admin Panel
    path('', include("main.urls")),
    path('messenger/im/', include("messenger.urls")),
    path('auth/', include("register.urls", namespace='auth')),
]

if settings.DEBUG:
    # urlpatterns = [
    #     path(f'^__debug__/', include('django.views.debuginfo.urls'))
    # ] +  urlpatterns
    pass
else:
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    urlpatterns += staticfiles_urlpatterns()
