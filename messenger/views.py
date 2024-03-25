from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.views.generic import View, ListView
from django.urls import reverse
from .models import Message, Room
from .forms import MessageForm


User = get_user_model()

class Index_Messages_View(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends') if friend[0]]
        
        data = {
            'title': "Messenger",
            'request': request,
            'username': request.user.username,
            'my_friends': my_friends,
            'form': MessageForm(),
        }
        
        return render(request, "messenger/messages.html", context=data)
    
    def post(self, request):
        pass


class Send_Messages_View(View):
    def get(self, request, reciever_id):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        form = MessageForm()
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends')]
        reciever = User.objects.get(pk=reciever_id)
        room = Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=reciever_id))
        messages_in_room = Message.objects.filter(room=str(room.pk))
        
        data = {
            'title': f"Messenger with {reciever}",
            'request': request,
            'username': request.user.username,
            'room_id': room,
            'reciever': reciever,
            'reciever_id': reciever_id,
            'my_friends': my_friends,
            'messages_in_room': messages_in_room,
            'form': form,
        }
        
        return render(request, 'messenger/send_messages.html', context=data)
    
    def post(self, request, reciever_id):
        form = MessageForm(request.POST)
        
        if form.is_valid():
            reciever = User.objects.get(pk=reciever_id)
            room = Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=reciever_id))
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
        

class Show_My_Friends(ListView):    
    model = User
    template_name = 'messenger/list_my_friends.html'
    
    def get_context_data(self, *, object_list=None, **kwargs):
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=self.request.user.id).values_list('friends') if friend[0]]
        
        context = super().get_context_data(**kwargs)
        context['title'] = 'My friends'
        context['username'] = self.request.user.username
        context['my_friends'] = my_friends
        
        return context
    

class Show_All_People(ListView):
    model = User
    template_name = 'messenger/list_all_people.html'
    
    def get_context_data(self, *, object_list=None, **kwargs):
        users = User.objects.exclude(pk=self.request.user.id)
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=self.request.user.id).values_list('friends') if friend[0]]
        
        context = super().get_context_data(**kwargs)
        context['User'] = User
        context['users'] = users
        context['username'] = self.request.user.username
        context['my_friends'] = my_friends
        context['request'] = self.request
        
        return context

    @staticmethod
    def add_to_friends(request, friend_id):
        if  request.method == "POST":
            new_friend = User.objects.get(pk=friend_id)
            user = User.objects.get(pk=request.user.id)
            
            user.friends.add(new_friend)
            new_friend.friends.add(user)
        return redirect(request.META.get('HTTP_REFERER'))
    
    @staticmethod
    def delete_from_friends(request, friend_id):
        if  request.method == "POST":
            friend = User.objects.get(pk=friend_id)
            user = User.objects.get(pk=request.user.id)
            
            user.friends.remove(friend)
            friend.friends.remove(user)
            
        return redirect(request.META.get('HTTP_REFERER'))
