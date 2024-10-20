from django.shortcuts import render
from django.views.generic import View
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from django.utils.formats import date_format
from .models import Post
from .forms import PostForm


User = get_user_model()

class View_Posts(View):
    def get(self, request):
        if not self.request.user.is_authenticated:
            return HttpResponseRedirect(reverse('auth:login'))
        
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=self.request.user.id).values_list('friends') if friend[0]]
        posts = Post.objects.all().order_by("-date_created") # filter('если автор поста у меня в друзьях')
        
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
        
        title_post = request.POST.get('title', '').strip()
        text_post = request.POST.get('textarea', '').strip()
                
        if title_post and text_post:
            new_post = Post(title=title_post, text=text_post, author=request.user)
            new_post.save()
            
            data = {
                'user': request.user.username,
                'author': new_post.author.username,
                'title': new_post.title,
                'text': new_post.text,
                'date_created': date_format(timezone.localtime(new_post.date_created), format="d E Y H:i"),
            }
            
            return JsonResponse({
                'success': data,
                'status': 'success',
            })
        else:
            return JsonResponse({
                'errors': form.errors,
                'status': 'errors'
            })