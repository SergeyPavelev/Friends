from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Castom user model"""
    middle_name = models.CharField(max_length=50, null=True)
    first_login = models.DateTimeField(null=True)
    phone = models.CharField(max_length=14, unique=True)
    avatar = models.ImageField(null=True, blank=True)
    friends = models.ManyToManyField('self', blank=True, default=None)
    theme = models.CharField(max_length=15, default='Light')
    
    def __str__(self) -> str:
        return f'{self.username}'
