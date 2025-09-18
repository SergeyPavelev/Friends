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
    serializer_class = MessageSerializer
    pagination_class = MessagePagination
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Message.objects.filter(
            conversation__participants=self.request.user
        ).select_related('sender', 'conversation')
    
    
class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user).prefetch_related('participants', 'messages')
    
    def create(self, request):
        recipient_id = request.data.get('recipient')
        try:
            recipient = User.objects.get(pk=recipient_id)
        except User.DoesNotExist:
            return Response({'error': 'Recipient not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if conversation already exists
        conversation = Conversation.objects.filter(participants=request.user).filter(participants=recipient).first()
        if conversation:
            return Response(self.get_serializer(conversation).data, status=status.HTTP_200_OK)
        
        conversation = Conversation.objects.create()
        conversation.participants.add(request.user, recipient)
        return Response(self.get_serializer(conversation).data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        try:
            conversation = self.get_queryset().get(pk=pk)
        except Conversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
        # Mark unread messages as read
        Message.objects.filter(conversation=conversation, read=False).exclude(sender=request.user).update(read=True)
        messages = conversation.messages.all().select_related('sender')
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def get_by_participants(self, request):
        user_id_1 = request.query_params.get('user1')
        user_id_2 = request.query_params.get('user2')
        try:
            user1 = User.objects.get(pk=user_id_1)
            user2 = User.objects.get(pk=user_id_2)
        except User.DoesNotExist:
            return Response({'error': 'One or both users not found'}, status=status.HTTP_404_NOT_FOUND)
        # Поиск беседы между двумя пользователями
        conversation = Conversation.objects.filter(participants=user1).filter(participants=user2).first()
        if conversation:
            return Response(self.get_serializer(conversation).data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
    

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
    

class UserProfileViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
