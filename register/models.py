from django.db import models
from django.contrib.auth import get_user_model, models as auth_models

# User = get_user_model()

class Users(auth_models.AbstractUser):
    phone = models.CharField(max_length=20, unique=True)
    username = models.CharField(max_length=50, unique=True)
    birthday = models.CharField(max_length=50, null=True)
    password = models.TextField()
    friends = models.ManyToManyField('self', blank=True, default=None)
    
    def __str__(self) -> str:
        return self.username
    
    class Meta:
        ordering = ['pk']
        
        verbose_name = 'User'
        verbose_name_plural = 'Users'
