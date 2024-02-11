from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from .models import Users
from .forms import LoginUserForm, RegisterUserForm


def login_user(request):
    if request.user.is_authenticated:
       return HttpResponseRedirect(reverse(f'messenger:messenger'))
    
    elif request.method == 'POST':
        form = LoginUserForm(request.POST)

        if form.is_valid():
            username = request.POST['username']
            password = request.POST['password']
            user = auth.authenticate(request=request, username=username, password=password)
                        
            if user is not None:
                auth.login(request, user)
                return HttpResponseRedirect(reverse(f'messenger:messenger'))
            else:
                return HttpResponse(f'Invalid login! - {user} - {form.errors}')
        else:
            return HttpResponse(f'{form.errors}')
    
    else:
        form = LoginUserForm()
    
    data = {
        'title': "Вход",
        'form' : form,
    }
    
    return render(request, "register/login.html", context=data)

def register_user(request):
    if request.user.is_authenticated:
        return HttpResponseRedirect(reverse(f'messenger:messenger'))
    
    elif request.method == "POST":
        form = RegisterUserForm(data=request.POST)
        
        if form.is_valid():
            phone = request.POST['phone']
            username = request.POST['username']
            birthday = request.POST['birthday']
            password1 = request.POST['password1']
            password2 = request.POST['password2']
                        
            if confirmation_phone_and_username(phone=phone, username=username):
                if password1 == password2:
                    Users(phone=phone, username=username, birthday=birthday, password=make_password(password=password1)).save()
                    
                    user = auth.authenticate(request=request, username=username, password=password1)
                    if user is not None:
                        auth.login(request, user)
                        return HttpResponseRedirect(reverse(f'messenger:messenger'))
                    else:
                        return HttpResponseRedirect(reverse('auth:login'))
                else:
                    return HttpResponse('Пароли не совпадают')
            else:
                return HttpResponse('Данные уже используются')
    else:
        form = RegisterUserForm()
    
    data = {
        'title': "Регистрация",
        'form' : form,
    }
    
    return render(request, "register/register.html", context=data)


def confirmation_phone_and_username(phone, username):
    """This is a function to confirm the uniqueness of phone numbers and username

    Args:
        phone (string): user number phone
        username (string): user name

    Returns:
        bool: True or False
    """
    
    list_phone = Users.objects.values_list('phone', flat=True)
    list_username = Users.objects.values_list('username', flat=True)
    
    if phone not in list_phone and username not in list_username:
        return True
    return False

def logout_user(request):
    auth.logout(request)
    return HttpResponseRedirect(reverse('auth:login'))
