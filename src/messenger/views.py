from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.views.generic import View
from .forms import MessageForm


User = get_user_model()

class IndexMessagesView(View):
    def get(self, request):       
        data = {'title': "Messenger",}
        return render(request, "messenger/list_chats.html", context=data)


class Send_Messages_View(View):
    def get(self, request, receiver_id):
        form = MessageForm()
        receiver = User.objects.get(pk=receiver_id)
        data = {
            'title': f"Messenger with {receiver}",
            'form': form,
        }
        
        return render(request, 'messenger/send_messages.html', context=data)
    

class Show_My_Friends(View):    
    def get(self, request):       
        data = {'title': "My friends",}
        return render(request, "messenger/list_my_friends.html", context=data)
    

class Show_All_Users(View):
    def get(self, request):       
        data = {'title': "All users",}
        return render(request, "messenger/list_all_users.html", context=data)
