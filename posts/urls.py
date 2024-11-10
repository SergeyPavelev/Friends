from django.urls import path
from . import views


app_name = 'posts'

urlpatterns = [
    path('', views.View_Posts.as_view(), name='posts'),
    path('delete_post/<int:post_id>/', views.View_Posts.delete_post, name="delete_post"),
    path('edit_post/<int:post_id>/', views.View_Posts.edit_post, name="edit_post"),
]