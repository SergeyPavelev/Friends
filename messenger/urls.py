from django.urls import path
from . import views


app_name = 'messenger'

urlpatterns = [
    path('', views.Index_Messages_View.as_view(), name="messenger"),
    path('<int:reciever_id>/', views.Send_Messages_View.as_view(), name="send_message"),
    path('all_people/', views.Show_All_People.as_view(), name="all_people"),
    path('my_friends/', views.Show_My_Friends.as_view(), name="my_friends"),
    path('add_to_friends/<int:friend_id>/', views.Show_All_People.add_to_friends, name="add_to_friends"),
    path('delete_from_friends/<int:friend_id>/', views.Show_All_People.delete_from_friends, name="delete_from_friends"),
]
