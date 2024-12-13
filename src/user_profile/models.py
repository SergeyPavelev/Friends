from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=250)
    sex = models.BooleanField()
    birthday = models.CharField(max_length=50, null=True)
