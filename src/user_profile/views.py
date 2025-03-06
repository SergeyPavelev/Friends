from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.views.generic import View
from django.contrib import auth
from django.urls import reverse
from .forms import ProfileImageForm, ChangeDataProfileForm


User = auth.get_user_model()


class User_Profile(View):
    def get(self, request, user_id):
        data = {
            'title': 'Profile',
            'form_image': ProfileImageForm(),
            'form_data': ChangeDataProfileForm(),
        }
        
        return  render(request, 'user_profile/user_profile.html', context=data)
    