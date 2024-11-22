from django.urls import path, include
from . import views


app_name = 'messenger'

urlpatterns = [
    path('', views.Index_Messages_View.as_view(), name="messenger"),
    path('<int:receiver_id>/', views.Send_Messages_View.as_view(), name="send_message"),
    path('all_users/', views.Show_All_Users.as_view(), name="all_users"),
    path('my_friends/', views.Show_My_Friends.as_view(), name="my_friends"),
    path('add_to_friends/<int:friend_id>/', views.Show_All_Users.add_to_friends, name="add_to_friends"),
    path('delete_from_friends/<int:friend_id>/', views.Show_All_Users.delete_from_friends, name="delete_from_friends"),
    path('delete_message_from_everyone/<int:message_id>/', views.Send_Messages_View.delete_message_from_everyone, name="delete_message_from_everyone"),
    path('delete_message_from_me/<int:message_id>/', views.Send_Messages_View.delete_message_from_me, name="delete_message_from_me"),
    path('<int:receiver_id>/edit_message/<int:message_id>/', views.Send_Messages_View.edit_message, name="edit_message"),
]
