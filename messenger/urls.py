from django.urls import path, include
from . import views


app_name = 'messenger'

urlpatterns = [
    path('', views.Index_Messages_View.as_view(), name="messenger"),
    path('<int:receiver_id>/', views.Send_Messages_View.as_view(), name="send_message"),
    path('favorites/', views.Send_Messages_Favorites_View.as_view(), name="send_message_favorites"),
    path('all_people/', views.Show_All_People.as_view(), name="all_people"),
    path('my_friends/', views.Show_My_Friends.as_view(), name="my_friends"),
    path('add_to_friends/<int:friend_id>/', views.Show_All_People.add_to_friends, name="add_to_friends"),
    path('delete_from_friends/<int:friend_id>/', views.Show_All_People.delete_from_friends, name="delete_from_friends"),
    path('delete_message_from_everyone/<int:message_id>/', views.Send_Messages_View.delete_message_from_everyone, name="delete_message_from_everyone"),
    path('delete_message_from_me/<int:message_id>/', views.Send_Messages_View.delete_message_from_me, name="delete_message_from_me"),
    path('<int:receiver_id>/edit_message/<int:message_id>/', views.Send_Messages_View.edit_message, name="edit_message"),
    path('chat-gpt/', views.Chat_Gpt_View.as_view(), name="chat_gpt"),
    path('posts/', include('posts.urls', namespace='posts'), name='posts'),
]
