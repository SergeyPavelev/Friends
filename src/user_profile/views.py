from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.views.generic import View
from django.contrib import auth
from django.urls import reverse
from .forms import ProfileImageForm
from django.contrib.auth.hashers import make_password


User = auth.get_user_model()


class User_Profile(View):
    def get(self, request, user_id):
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
            
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends') if friend[0]]
        user = User.objects.get(pk=user_id)
        
        data = {
            'title': f'{request.user}',
            'user': user,
            'request': request,
            'username': request.user.username,
            'my_friends': my_friends,
            'form_image': ProfileImageForm(),
        }
        
        return  render(request, 'user_profile/user_profile.html', context=data)
    
    def post(self, request, user_id):
        user = User.objects.get(pk=user_id)
        form_image = ProfileImageForm(request.POST, request.FILES)
        
        if 'Upload profile photo' in request.POST:
            if not form_image.is_valid():
                return HttpResponse(f'{form_image.errors}')
                
            image = request.FILES['photo']
            
            user.avatar = image
            user.save()
        
        elif 'Change username' in request.POST:
            new_username = request.POST['username']
            list_all_username = [i[0] for i in User.objects.values_list('username')]
            
            if new_username in list_all_username:
                return HttpResponse('This username is already used!')
            else:
                user.username = new_username
                user.save()
        
        elif 'Change phone' in request.POST:
            new_phone = request.POST['phone']
            list_all_phone = [i[0] for i in User.objects.values_list('phone')]
            
            if new_phone in list_all_phone:
                return HttpResponse('This phone number is already used!')
            else:
                user.phone = new_phone
                user.save()
        
        elif 'Change email' in request.POST:
            new_email = request.POST['email']
            list_all_email = [i[0] for i in User.objects.values_list('email')]
            
            if new_email in list_all_email:
                return HttpResponse('This email is already used!')
            else:
                user.email = new_email
                user.save()
        
        elif 'Change birthday' in request.POST:
            new_birthday = request.POST['birthday']
            user.birthday = new_birthday
            user.save()
        
        elif 'Change password' in request.POST:
            new_password = make_password(password=request.POST['password'])
            user.password = new_password
            user.save()
            
            auth.login(request, user)
            
            return HttpResponseRedirect(reverse('user_profile:profile', kwargs= {'user_id': user_id})) 
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends') if friend[0]]
        
        data = {
            'title': f'{request.user}',
            'user': user,
            'username': request.user.username,
            'my_friends': my_friends,
            'form_image': form_image,
        }
        
        return  render(request, 'user_profile/user_profile.html', context=data)
