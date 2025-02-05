from django.shortcuts import render
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.utils import timezone
from django.utils.formats import date_format
from rest_framework import generics, status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from ..posts.models import Post
from .serializers import UserSerializer, PostSerializer


User = get_user_model()


class ThemeChange(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
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
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid theme'}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username', None)
        password = request.data.get('password', None)
        
        if username is None or password is None:
            return Response({'error': 'Нужен и логин, и пароль'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)

        if user is None:
            return Response({'error': 'Неправильный логин или пароль'}, status=status.HTTP_401_UNAUTHORIZED)
            
        refresh = RefreshToken.for_user(user)
        refresh.payload.update({
            'user_id': user.id,
            'username': user.username,
        })
        
        return Response({
            'success': 'Вы успешно вошли в аккаунт!',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
        

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            refresh.payload.update({
                'user_id': user.id,
                'username': user.username,
            })
            
            return Response(data={
                'success': 'Вы успешно зарегистрировались!',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    
# class CreatePostView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
    
#     def post(self, request):
#         title_post = request.POST.get('title', '').strip()
#         text_post = request.POST.get('textarea', '').strip()
        
#         new_post = Post(title=title_post, text=text_post, author=request.user)
#         new_post.save()
        
#         data = {
#             'user': request.user.username,
#             'author': new_post.author.username,
#             'title': new_post.title,
#             'text': new_post.text,
#             'date_created': date_format(timezone.localtime(new_post.date_created), format="d E Y H:i"),
#             'profile_photo': request.user.avatar.url,
#         }
        
#         return Response({
#             'success': data,
#             'status': 'success',
#         })
    
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


# class DeletePostView(APIView):
#     def post(self, request, post_id):
#         post = Post.objects.get(pk=post_id)
#         post.visibility = 0
#         post.save()
        
#         return Response(data={
#             'status': 'success',
#         }, status=200)


# class EditPostView(APIView):
#     def post(self, request, post_id):
#         pass
        