from django.urls import path
from . import views


app_name = 'auth'

urlpatterns = [
    path('login/', views.LoginUser.as_view(), name="login"),
    path('signup/', views.RegisterUser.as_view(), name="signup"),
    path('logout/', views.LogoutUser.as_view(), name="logout"),
]