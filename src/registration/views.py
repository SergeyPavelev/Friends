from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.contrib import auth
from django.urls import reverse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .forms import LoginUserForm, SignupUserForm


User = auth.get_user_model()


class SignupUser(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        if request.user.is_authenticated:
            return HttpResponseRedirect(reverse(f'messenger:messenger'))
        
        form = SignupUserForm()
        
        data = {
            'title': "Signup",
            'form' : form,
        }
        
        return render(request, "registration/signup.html", context=data)


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
