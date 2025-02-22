from django.dispatch import receiver
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..posts.models import Post
from ..messenger.models import Message, Room


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password_repeat = serializers.CharField(max_length=128, write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'phone', 'username', 'email', 'password', 'password_repeat', 'theme', 'avatar', 'friends']
        extra_kwargs = {
            'password': {'write_only': True},
            'phone': {'required': False},
            'username': {'required': False},
            'email': {'required': False},
            'password': {'required': False},
            'password_repeat': {'required': False},
            'theme': {'required': False},
            'avatar': {'required': False},
            'friends': {'required': False},
        }
    
    def validate(self, data):
        password = data.get('password')
        password_repeat = data.get('password_repeat')

        if password and password_repeat:
            if password != password_repeat:
                raise serializers.ValidationError({'password_repeat': 'Пароли не совпадают'})
        return data

    def create(self, validated_data):
        del validated_data['password_repeat']
        return User.objects.create_user(**validated_data)
    
    def update(self, instance, validated_data):
        validated_data.pop('password_repeat', None)
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class PostSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'text', 'author', 'visibility', 'date_created']
    
    def to_representation(self, instance):
        """
        Переопределяем метод для возврата полной информации о пользователе при GET-запросе.
        """
        representation = super().to_representation(instance)
        representation['author'] = UserSerializer(instance.author).data
        return representation

    def to_internal_value(self, data):
        """
        Переопределяем метод для обработки только ID пользователя при POST-запросе.
        """
        internal_value = super().to_internal_value(data)
        # Проверяем, что sender и receiver переданы как ID
        if data.get('author'):
            if not isinstance(data.get('author'), int):
                raise serializers.ValidationError({'sender': 'Sender must be an integer ID.'})
        return internal_value


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'room', 'text_message', 'date_created', 'time_created', 'sender_visibility', 'receiver_visibility']
        extra_kwargs = {
            'sender': {'required': False},
            'receiver': {'required': False},
            'date_created': {'required': False},
            'time_created': {'required': False},
        }

    
    def to_representation(self, instance):
        """
        Переопределяем метод для возврата полной информации о пользователях при GET-запросе.
        """
        representation = super().to_representation(instance)
        representation['sender'] = UserSerializer(instance.sender).data
        representation['receiver'] = UserSerializer(instance.receiver).data
        return representation

    def to_internal_value(self, data):
        """
        Переопределяем метод для обработки только ID пользователей при POST-запросе.
        """
        internal_value = super().to_internal_value(data)
        # Проверяем, что sender и receiver переданы как ID
        if data.get('sender') or data.get('receiver'):
            if not isinstance(data.get('sender'), int):
                raise serializers.ValidationError({'sender': 'Sender must be an integer ID.'})
            if not isinstance(data.get('receiver'), int):
                raise serializers.ValidationError({'receiver': 'Receiver must be an integer ID.'})
        return internal_value
        
class RoomSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)
    
    class Meta:
        model = Room
        fields = ['id', 'users']        
