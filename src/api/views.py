from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.utils.formats import date_format
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from ..posts.models import Post


User = get_user_model()

class ThemeChange(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user = request.data.get('user')
        user = User.objects.get(username=user)
        theme = user.theme
        
        if theme == 'Light':
            user.theme = 'Dark'
            user.save()
            return Response({
                'success': 'Theme changed on dark',
                'theme': 'dark',
            })
        elif theme == 'Dark':
            user.theme = 'Light'
            user.save()
            return Response({
                'success': 'Theme changed on light',
                'theme': 'light',
            })
        else:
            return Response({'error': 'Invalid theme'})


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request=request, username=username, password=password)
                    
        if user:
            login(request, user)
            # token, _ = Token.objects.get_or_create(user=user)
            return Response(data={'token': 'token.key', 'success': 'Вход в аккаунт успешен'}, status=200)
        else:
            return Response(data={'error': 'Ошибка аутентификации'}, status=400)


class SignupView(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        username = request.data.get('username')
        password = request.data.get('password')
        password_repeat = request.data.get('password_repeat')
        
        if not self.is_unique(phone=phone, username=username):
            return Response(data={'error': 'Данные уже используются'}, status=400)

        if password != password_repeat:
            return Response(data={'error': 'Пароли не совпадают'}, status=400)
                    
        user = User(phone=phone, username=username, password=make_password(password))
        user.save()

        login(request, user)
        return Response(data={'success': 'Регистрация успешна'}, status=201)


    @staticmethod
    def is_unique(phone, username):
        """Проверка уникальности телефона и имени пользователя"""
        return not (User.objects.filter(phone=phone).exists() or User.objects.filter(username=username).exists())


class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        logout(request)
        
        return Response(data={'success': 'Вы успешно вышли',}, status=200)
    
    
class CreatePostView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        title_post = request.POST.get('title', '').strip()
        text_post = request.POST.get('textarea', '').strip()
        
        new_post = Post(title=title_post, text=text_post, author=request.user)
        new_post.save()
        
        data = {
            'user': request.user.username,
            'author': new_post.author.username,
            'title': new_post.title,
            'text': new_post.text,
            'date_created': date_format(timezone.localtime(new_post.date_created), format="d E Y H:i"),
            'profile_photo': request.user.avatar.url,
        }
        
        return Response({
            'success': data,
            'status': 'success',
        })
    
    # @staticmethod
    # def edit_post(request, post_id):        
    #     post = Post.objects.get(pk=post_id)
    #     my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends') if friend[0]]
    #     posts = Post.objects.all().filter(visibility=1).order_by("-date_created") # filter('если автор поста у меня в друзьях')
        
    #     if request.method == "POST":
    #         form = PostForm(request.POST)
    #         if form.is_valid():
    #             new_title_text = form.cleaned_data['title']
    #             new_textarea_text = form.cleaned_data['textarea']
                
    #             post.title = new_title_text
    #             post.text = new_textarea_text
                
    #             post.save()
    #             return HttpResponseRedirect(reverse('messenger:posts:posts'))
    #     else:
    #         form = PostForm(initial={
    #             'title': post.title,
    #             'textarea': post.text,
    #         })

    #     data = {
    #         'title': 'Posts',
    #         'request': request,
    #         'username': request.user.username,
    #         'my_friends': my_friends,
    #         'posts': posts,
    #         'form': form,
    #     }

    #     return render(request, 'posts/list_posts.html', context=data)


class DeletePostView(APIView):
    def post(self, request, post_id):
        post = Post.objects.get(pk=post_id)
        post.visibility = 0
        post.save()
        
        return Response(data={
            'status': 'success',
        }, status=200)


class EditPostView(APIView):
    def post(self, request, post_id):
        pass
