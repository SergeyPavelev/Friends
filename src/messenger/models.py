from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone
import uuid


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        ordering = ['-modified_at']
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
    
    
    def __str__(self) -> str:
        return f'{self.id}'


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    read = models.BooleanField(default=False)
    edit = models.BooleanField(default=False)
    sender_visibility = models.BooleanField(default=True)
    receiver_visibility = models.BooleanField(default=True)
    
    
    class Meta:
        ordering = ['timestamp']
        
        
class UserStatus(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(auto_now=True)
