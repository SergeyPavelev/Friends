from django.urls import path
from . import views


app_name = 'messenger'

urlpatterns = [
    path('', views.Index_Messages_View.as_view(), name="messenger"),
    path('<int:reciever_id>/', views.Send_Messages_View.as_view(), name="send_message"),
]
