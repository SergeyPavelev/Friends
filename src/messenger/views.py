from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.views.generic import View, ListView
from django.urls import reverse
from django.utils import timezone
from django.middleware.csrf import get_token
from rest_framework import status, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Message, Room
from .forms import MessageForm


User = get_user_model()

class IndexMessagesView(View):
    def get(self, request):       
        data = {'title': "Messenger",}
        return render(request, "messenger/list_chats.html", context=data)


class Send_Messages_View(View):
    def get(self, request, receiver_id):
        form = MessageForm()
        
        # my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends')]
        # room = Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=receiver_id))
        receiver = User.objects.get(pk=receiver_id)
        # messages_in_room = Message.objects.filter(room=str(room.pk))
        
        # messages_to_show = []
        # for message in messages_in_room:
        #     if message.sender == request.user and message.sender_visibility == 1:
        #         messages_to_show.append(message)
        #     elif message.receiver == request.user and message.receiver_visibility == 1:
        #         messages_to_show.append(message)
        
        data = {
            'title': f"Messenger with {receiver}",
            # 'request': request,
            # 'username': request.user.username,
            # 'room_id': room,
            # 'receiver': receiver,
            # 'receiver_id': receiver_id,
            # 'my_friends': my_friends,
            # 'messages_in_room': messages_to_show,
            'form': form,
        }
        
        return render(request, 'messenger/send_messages.html', context=data)
    

class Show_My_Friends(ListView):    
    model = User
    template_name = 'messenger/list_my_friends.html'
    
    def get_context_data(self, *, object_list=None, **kwargs):
        if not self.request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=self.request.user.id).values_list('friends') if friend[0]]
        
        context = super().get_context_data(**kwargs)
        context['title'] = 'My friends'
        context['username'] = self.request.user.username
        context['my_friends'] = my_friends
        
        return context
    

class Show_All_Users(ListView):
    model = User
    template_name = 'messenger/list_all_users.html'
    
    def get_context_data(self, *, object_list=None, **kwargs):
        if not self.request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        users = User.objects.exclude(pk=self.request.user.id)
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=self.request.user.id).values_list('friends') if friend[0]]
        
        context = super().get_context_data(**kwargs)
        context['User'] = User
        context['users'] = users
        context['username'] = self.request.user.username
        context['my_friends'] = my_friends
        context['request'] = self.request
        
        return context
