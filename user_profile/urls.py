from django.urls import path
from . import views


app_name = 'user_profile'

urlpatterns = [
    path('', views.User_Profile.as_view(), name="profile"),
]