from django.shortcuts import render, get_object_or_404
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.views.generic import View
from django.urls import reverse
from .models import Message, Room
from .forms import MessageForm


User = get_user_model()

class Index_Messages_View(View):
    def get(self, request):
        if request.user.is_authenticated:
            users = User.objects.exclude(pk=request.user.id).values('id', 'username')
            
            data = {
                'title': "Messenger",
                'request': request,
                'username': request.user.username,
                'users': users,
                'form': MessageForm(),
            }
            
            return render(request, "messenger/messages.html", context=data)
        else:
            return render(request,'registration/login.html')
    
    def post(self, request):
        pass


class Send_Messages_View(View):
    def get(self, request, reciever_id):
        form = MessageForm()
        
        users = User.objects.exclude(pk=request.user.id).values('id', 'username')
        reciever = User.objects.get(pk=reciever_id)
        room = Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=reciever_id))
        room_users = [User.objects.get(pk=int(user[0])) for user in Room.objects.filter(pk=room.pk).values_list('users')]
        messages_in_room = Message.objects.filter(room=str(room.pk))
        
        data = {
            'title': f"Messenger with {reciever}",
            'request': request,
            'username': request.user.username,
            'room_id': room,
            'reciever': reciever,
            'reciever_id': reciever_id,
            'users': users,
            'messages_in_room': messages_in_room,
            'form': form,
        }
        
        return render(request, 'messenger/send_messages.html', context=data)
    
    def post(self, request, reciever_id):
        form = MessageForm(request.POST)
        
        if form.is_valid():
            reciever = User.objects.get(pk=reciever_id)
            room = Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=reciever_id))
            room_users = [User.objects.get(pk=int(user[0])) for user in Room.objects.filter(pk=room.pk).values_list('users')]
            message = str(request.POST['textarea']).strip()
            Message(text_message=message, sender=request.user, reciever=reciever, room=room).save()
            
            return HttpResponseRedirect(reverse(f'messenger:send_message', kwargs={'reciever_id': reciever_id}))            
        else:
            form = MessageForm()
            
            data = {
                'title': f"Messenger",
                'request': request,
                'username': request.user.username,
                'form': form,
                'reciever_id': reciever_id,
                'room_id': Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=reciever_id)),
            }
            
            return render(request, 'messenger/send_messages.html', context=data)
