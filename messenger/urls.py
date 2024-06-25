from django.urls import path
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
    path('delete_message/<int:message_id>/', views.Send_Messages_View.delete_message, name="delete_message"),
    path('<int:receiver_id>/edit_message/<int:message_id>/', views.Send_Messages_View.edit_message, name="edit_message"),
]
