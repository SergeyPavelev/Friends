from django.shortcuts import render, redirect
from django.views.generic import View
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.db.models import Q
from rest_framework.response import Response
from .models import Post
from .forms import PostForm


User = get_user_model()

class PostsView(View):
    def get(self, request):        
        data = {
            'title': 'Posts',
            'form': PostForm(),
        }
        
        return render(request, 'posts/list_posts.html', context=data)
