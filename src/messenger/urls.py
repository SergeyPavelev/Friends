from django.urls import path
from . import views


app_name = 'messenger'

urlpatterns = [
    path('', views.IndexMessagesView.as_view(), name="messenger"),
    path('<int:receiver_id>/', views.Send_Messages_View.as_view(), name="send_message"),
    path('all_users/', views.Show_All_Users.as_view(), name="all_users"),
    path('my_friends/', views.Show_My_Friends.as_view(), name="my_friends"),
]
