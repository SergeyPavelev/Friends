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
        if not self.request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=self.request.user.id).values_list('friends') if friend[0]]
        posts = Post.objects.all().filter(Q(author__in=my_friends) | Q(author=request.user), visibility=1).order_by("-date_created")
        
        data = {
            'title': 'Posts',
            'request': request,
            'username': self.request.user.username,
            'my_friends': my_friends,
            'posts': posts,
            'form': PostForm(),
        }
        
        return render(request, 'posts/list_posts.html', context=data)
