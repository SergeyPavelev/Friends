from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register(r'posts', PostViewSet)

app_name = 'api'

urlpatterns = [
    path('theme/', ThemeChange.as_view(), name='theme'),
    
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    
    path('posts/', include('router.urls')),
    # path('create_post/', CreatePostView.as_view(), name='create_post'),
    # path('delete_post/<int:post_id>/', DeletePostView.as_view(), name="delete_post"),
    # path('edit_post/<int:post_id>/', EditPostView.as_view(), name="edit_post"),
]
