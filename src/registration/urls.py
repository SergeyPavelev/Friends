from django.urls import path
from . import views


app_name = 'auth'

urlpatterns = [
    path('login/', views.LoginUser.as_view(), name="login"),
    path('signup/', views.SignupUser.as_view(), name="signup"),
]