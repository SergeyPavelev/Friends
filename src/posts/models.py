from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Post(models.Model):
    title = models.CharField(max_length=200)
    text = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    visibility = models.BooleanField('Отображение поста', default=True)
    
    class Meta:
        ordering = ['date_created']
        
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'
