from django.urls import path
from .views import ThemeChange


app_name = 'api'

urlpatterns = [
    path('theme/', ThemeChange.as_view(), name='theme')
]