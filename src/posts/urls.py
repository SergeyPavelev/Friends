from django.urls import path
from . import views


app_name = 'posts'

urlpatterns = [
    path('', views.View_Posts.as_view(), name='posts'),
]