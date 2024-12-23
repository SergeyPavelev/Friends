from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib import auth
from django.contrib.auth.hashers import make_password
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .forms import LoginUserForm, SignupUserForm


User = auth.get_user_model()


class RegisterUser(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse(f'messenger:messenger'))
        
        form = SignupUserForm()
        
        data = {
            'title': "Register",
            'form' : form,
        }
        
        return render(request, "registration/signup.html", context=data)
    
    def post(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse(f'messenger:messenger'))

        phone = request.data.get('phone')
        username = request.data.get('username')
        password = request.data.get('password')
        password_repeat = request.data.get('password_repeat')
        
        if not RegisterUser .confirmation_phone_and_username(phone=phone, username=username):
            return Response(data={'error': 'Данные уже используются'}, status=400)

        if password != password_repeat:
            return Response(data={'error': 'Пароли не совпадают'}, status=400)
                    
        user = User(phone=phone, username=username, password=make_password(password))
        user.save()
        
        user = auth.authenticate(request=request, username=username, password=password)
        if user is not None:
            auth.login(request, user)
            return Response(data={'success': 'Регистрация успешна'}, status=201)
        else:
            return Response(data={'error': 'Ошибка аутентификации'}, status=400)


    def confirmation_phone_and_username(phone, username):
        """This is a function to confirm the uniqueness of phone numbers and username

        Args:
            phone (string): user number phone
            username (string): user name

        Returns:
            bool: True or False
        """
        
        list_phone = User.objects.values_list('phone', flat=True)
        list_username = User.objects.values_list('username', flat=True)
        
        if phone not in list_phone and username not in list_username:
            return True
        return False


class LoginUser(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse(f'messenger:messenger'))
        
        form = LoginUserForm()
        
        data = {
            'title': "Login",
            'form' : form,
        }
        
        return render(request, "registration/login.html", context=data)
    
    def post(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse(f'messenger:messenger'))

        username = request.data.get('username')
        password = request.data.get('password')
        user = auth.authenticate(request=request, username=username, password=password)
                    
        if user is not None:
            auth.login(request, user)
            return Response(data={'success': 'Вход в аккаунт успешен'}, status=200)
        else:
            return Response(data={'error': 'Ошибка аутентификации'}, status=400)


class LogoutUser(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        auth.logout(request)
        
        return Response(data={'success': 'Вы успешно вышли',}, status=200)
