from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Castom user model"""
    middle_name = models.CharField(max_length=50, null=True, default='')
    first_login = models.DateTimeField(null=True)
    phone = models.CharField(max_length=14, unique=True)
    avatar = models.ImageField(default='', null=True, blank=True)
    friends = models.ManyToManyField('self', blank=True, default=None)
    theme = models.CharField(max_length=15, default='Light')
    is_online = models.BooleanField(default=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f'{self.username}'
