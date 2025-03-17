from operator import truediv
from django.contrib.auth import get_user_model, authenticate
from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from ..posts.models import Post
from ..messenger.models import *
from ..user_profile.models import UserProfile
from .serializers import *
from .pagination import *


User = get_user_model()


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
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
            'user_id': user.id,
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
                'user_id': user.id,
                'status': 201,
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refreshToken')
        if not refresh_token:
            return Response({'error': 'Необходим Refresh token'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'success': 'Выход успешен', 'status': 200}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Неверный Refresh token'},
                            status=status.HTTP_400_BAD_REQUEST)


class PostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = PostPagination
    

class MessageViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    pagination_class = MessagePagination
    
    def get_queryset(self):
        queryset = super().get_queryset()
        room_id = self.request.query_params.get('room_id', None)
        if room_id is not None:
            queryset = queryset.filter(room_id=room_id)
        return queryset
    

class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """
        Обновление данных пользователя через PATCH-запрос.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_friend(self, request, pk):
        user = self.get_object()
        current_user = request.user

        if user == current_user:
            return Response({'error': 'Вы не можете добавить себя в друзья', 'status': '400'}, status=status.HTTP_400_BAD_REQUEST)
        
        if current_user.id in user.friends.all():
            return Response({'error': 'Этот пользователь уже является вашим другом', 'status': '400'}, status=status.HTTP_400_BAD_REQUEST)

        user.friends.add(current_user)
        current_user.friends.add(user)
        return Response({'success': 'Пользователь успешно добавлен в друзья', 'status': '200'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def delete_friend(self, request, pk):
        user = self.get_object()
        current_user = request.user

        if user == current_user:
            return Response({'error': 'Вы не можете удалить себя из друзей', 'status': '400'}, status=status.HTTP_400_BAD_REQUEST)

        if current_user not in user.friends.all():
            return Response({'error': 'Этот пользователь не является вашим другом', 'status': '400'}, status=status.HTTP_400_BAD_REQUEST)

        user.friends.remove(current_user)
        current_user.friends.remove(user)
        return Response({'success': 'Пользователь успешно удален из друзей', 'status': '200'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['patch'])
    def update_avatar(self, request, pk):
        user = self.get_object()
        avatar = request.FILES.get('avatar')
                
        if avatar:
            user.avatar = avatar
            user.save()
            serializer = self.get_serializer(user)
            return Response({'success': 'Аватар успешно обновлен'}, status=status.HTTP_200_OK)
        
        return Response({'error': 'No avatar provided'}, status=status.HTTP_400_BAD_REQUEST)


class RoomViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    

class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
