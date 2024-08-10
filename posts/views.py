from django.shortcuts import render
from django.views.generic import View, ListView
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model
from django.urls import reverse
from .models import Post
from .forms import PostForm


User = get_user_model()

class View_Posts(View):
    def get(self, request):
        if not self.request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=self.request.user.id).values_list('friends') if friend[0]]
        posts = Post.objects.all() #Сделать потом фильтр!!!
        
        data = {
            'title': 'Posts',
            'request': request,
            'username': self.request.user.username,
            'my_friends': my_friends,
            'posts': posts,
            'form': PostForm(),
        }
        
        return render(request, 'posts/list_posts.html', context=data)
    
    def post(self, request):
        form = PostForm(request.POST)
        
        if form.is_valid():
            title_post = str(request.POST['title']).strip()
            text_post = str(request.POST['textarea']).strip()
            
            Post(title=title_post, text=text_post, author=request.user).save()
            
            return HttpResponseRedirect(reverse(f'messenger:posts:posts'))
        else:
            form = PostForm()
            
            data = {
                'title': "Posts",
                'request': request,
                'username': request.user.username,
                'form': form,
            }
            
            return render(request, 'posts/list_posts.html', context=data)
