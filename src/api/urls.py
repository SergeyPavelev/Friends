from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView, TokenVerifyView
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register(r'posts', PostViewSet)
router.register(r'messages', MessageViewSet, basename='messages')
router.register(r'conversations', ConversationViewSet, basename='conversation')
router.register(r'users', UserViewSet)
router.register(r'profiles', UserProfileViewSet)

app_name = 'api'

urlpatterns = [
    path('', include(router.urls)),
        
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('token/verify/', TokenVerifyView.as_view(), name="token_verify"),
    
    path('conversations/get_by_participants/', ConversationViewSet.as_view({'get': 'get_by_participants'}), name='get-conversation-by-participants'),
    path('conversations/get_messages/', ConversationViewSet.as_view({'get': 'messages'}), name='get-messages'),
]
