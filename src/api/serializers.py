from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..posts.models import Post


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password_repeat = serializers.CharField(max_length=128, write_only=True)
    
    class Meta:
        model = User
        filds = ['id', 'phone', 'username', 'email', 'password', 'password_repeat']
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        if data['password'] != data['password_repeat']:
            raise serializers.ValidationError({'password_repeat': 'Пароли не совпадают'})
        return data

    def create(self, validated_data):
        del validated_data['password_repeat']
        return User.objects.create_user(**validated_data)


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'text', 'author']
