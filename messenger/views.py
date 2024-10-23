from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect, JsonResponse
from django.views.generic import View, ListView
from django.urls import reverse
from.models import Message, Room
from.forms import MessageForm


User = get_user_model()

class Index_Messages_View(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends') if friend[0]]
        chats_id = Room.objects.filter(users=request.user.id)
        
        chats_data = {}
        
        for chat_id in chats_id:
            last_message = Message.objects.filter(room=chat_id.pk, sender_visibility=1, receiver_visibility=1).order_by('-id').first()
            
            for user in chat_id.users.all():
                if user != request.user:
                    my_friend = user
                
            if last_message:
                chats_data[my_friend] = f'{last_message.sender}: {last_message.text_message}'
            else:
                chats_data[my_friend] = 'No messages'
        
        data = {
            'title': "Messenger",
            'request': request,
            'username': request.user.username,
            'my_friends': my_friends,
            'form': MessageForm(),
            'chats_data': chats_data,
        }
        
        return render(request, "messenger/messages.html", context=data)


class Send_Messages_View(View):
    def get(self, request, receiver_id):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        elif request.user.id == receiver_id:
            return HttpResponseRedirect(reverse('messenger:messenger'))
        
        form = MessageForm()
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends')]
        room = Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=receiver_id))
        receiver = User.objects.get(pk=receiver_id)
        messages_in_room = Message.objects.filter(room=str(room.pk))
        
        messages_to_show = []
        for message in messages_in_room:
            if message.sender == request.user and message.sender_visibility == 1:
                messages_to_show.append(message)
            elif message.receiver == request.user and message.receiver_visibility == 1:
                messages_to_show.append(message)
        
        data = {
            'title': f"Messenger with {receiver}",
            'request': request,
            'username': request.user.username,
            'room_id': room,
            'receiver': receiver,
            'receiver_id': receiver_id,
            'my_friends': my_friends,
            'messages_in_room': messages_to_show,
            'form': form,
        }
        
        return render(request, 'messenger/send_messages.html', context=data)
    
    def post(self, request, receiver_id):
        form = MessageForm(request.POST)
        
        if form.is_valid():
            receiver = User.objects.get(pk=receiver_id)
            room = Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=receiver_id))
            message = str(request.POST['textarea']).strip()
            new_message = Message(text_message=message, sender=request.user, receiver=receiver, room=room.pk)
            new_message.save()
            
            data = {
                'user': request.user.username,
                'sender_message': new_message.sender.username,
                'textarea': message,
                'time_created': new_message.time_created.strftime("%H:%M"),
            }
            
            return JsonResponse({
                'success': data,
                'status': 'success'
            })           
        else:
            return JsonResponse({
                'errors': form.errors,
                'status': 'errors'
            })
    
    @staticmethod
    def delete_message_from_everyone(request, message_id):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        if request.method == "POST":        
            message = Message.objects.get(id=message_id)
            message.sender_visibility = 0
            message.receiver_visibility = 0
            message.save()
        
        return redirect(request.META.get('HTTP_REFERER'))
    
    @staticmethod
    def delete_message_from_me(request, message_id):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        if request.method == "POST":        
            message = Message.objects.get(id=message_id)
            if message.sender_id == request.user.id:
                message.sender_visibility = 0
            else:
                message.receiver_visibility = 0
                message.save()
        
        return redirect(request.META.get('HTTP_REFERER'))
    
    @staticmethod
    def edit_message(request, receiver_id, message_id):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        message = Message.objects.get(id=message_id)
        room = Room.create_or_get_room(user1=request.user, user2=User.objects.get(pk=receiver_id))
        messages_in_room = Message.objects.filter(room=str(room.pk))
        messages_to_show = []
        
        for mess in messages_in_room:
            if mess.sender == request.user and mess.sender_visibility == 1:
                messages_to_show.append(mess)
            elif mess.receiver == request.user and mess.receiver_visibility == 1:
                messages_to_show.append(mess)
                
        if message.sender_id != request.user.id:
            return redirect(request.META.get('HTTP_REFERER'))
        
        if request.method == "POST":
            form = MessageForm(request.POST)
            if form.is_valid():
                new_text = form.cleaned_data['textarea']
                message.text_message = new_text
                message.save()
                return HttpResponseRedirect(reverse('messenger:send_message', kwargs={'receiver_id': message.receiver_id}))
        else:
            form = MessageForm(initial={'textarea': message.text_message})
        
        print(request.path)

        data = {
            'title': f"Messenger with {message.receiver}",
            'request': request,
            'username': request.user.username,
            'room_id': message.room,
            'receiver': message.receiver,
            'receiver_id': receiver_id,
            'my_friends': [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends')],
            'message': message,
            'messages_in_room': messages_to_show,
            'form': form,
        }

        return render(request, 'messenger/send_messages.html', context=data)


class Send_Messages_Favorites_View(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        form = MessageForm()
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends')]
        room = Room.create_or_get_room(user1=request.user, user2=request.user) #!!! Исправить баг в этой функции
        messages_in_room = Message.objects.filter(room=str(room.pk))
        
        data = {
            'title': f"Favorites",
            'request': request,
            'username': request.user.username,
            'room_id': room,
            'my_friends': my_friends,
            'messages_in_room': messages_in_room,
            'form': form,
        }
        
        return render(request, 'messenger/send_messages_favorites.html', context=data)
    
    def post(self, request):
        form = MessageForm(request.POST)
        
        if form.is_valid():
            message = str(request.POST['textarea']).strip()
            room = Room.create_or_get_room(user1=request.user, user2=request.user)
            Message(text_message=message, sender=request.user, receiver=request.user, room=room.pk).save()
            
            return HttpResponseRedirect(reverse('messenger:send_message_favorites'))            
        else:
            form = MessageForm()
            
            data ={
                'title': f"Messenger",
                'equest': request,
                'username': request.user.username,
                'form': form,
                'room_id': Room.create_or_get_room(user1=request.user, user2=request.user),
            }
            
            return render(request, 'essenger/send_messages_favorites.html', context=data)


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
    

class Show_All_People(ListView):
    model = User
    template_name = 'messenger/list_all_people.html'
    
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

    @staticmethod
    def add_to_friends(request, friend_id):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        if request.method == "POST":
            new_friend = User.objects.get(pk=friend_id)
            user = User.objects.get(pk=request.user.id)
            
            user.friends.add(new_friend)
            new_friend.friends.add(user)
        return redirect(request.META.get('HTTP_REFERER'))
    
    @staticmethod
    def delete_from_friends(request, friend_id):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        if request.method == "POST":
            friend = User.objects.get(pk=friend_id)
            user = User.objects.get(pk=request.user.id)
            
            user.friends.remove(friend)
            friend.friends.remove(user)
            
        return redirect(request.META.get('HTTP_REFERER'))
    

class Chat_Gpt_View(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        form = MessageForm()
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends')]
        room = Room.create_or_get_room(user1=request.user, user2=request.user) #!!! Исправить баг в этой функции
        messages_in_room = Message.objects.filter(room=str(room.pk))
        
        data = {
            'title': f"Favorites",
            'request': request,
            'username': request.user.username,
            'room_id': room,
            'my_friends': my_friends,
            'messages_in_room': messages_in_room,
            'form': form,
        }
        
        return render(request, 'messenger/chat-gpt.html', context=data)
    
    def post(self, request):
        pass
