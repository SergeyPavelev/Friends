from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    phone = models.CharField(max_length=20, unique=True)
    username = models.CharField(max_length=50, unique=True)
    birthday = models.CharField(max_length=50, null=True)
    password = models.TextField()
    
    def __str__(self) -> str:
        return self.username
    
    class Meta:
        ordering = ['pk']
        
        verbose_name = 'User'
        verbose_name_plural = 'Users'
