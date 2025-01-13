from django.urls import path
from .views import ThemeChange, LoginView, LogoutView, SignupView, CreatePostView, DeletePostView, EditPostView


app_name = 'api'

urlpatterns = [
    path('theme/', ThemeChange.as_view(), name='theme'),
    
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name="logout"),
    
    path('create_post/', CreatePostView.as_view(), name='create_post'),
    path('delete_post/<int:post_id>/', DeletePostView.as_view(), name="delete_post"),
    path('edit_post/<int:post_id>/', EditPostView.as_view(), name="edit_post"),
]