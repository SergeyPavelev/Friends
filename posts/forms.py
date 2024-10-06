from dataclasses import fields
from django import forms
from .models import Post


class PostForm(forms.ModelForm):
    title = forms.CharField(widget=forms.Textarea(attrs={
        'name': 'title',
        'placeholder': 'Ввести название поста...',
        'spellcheck': 'True',
        'required': 'True',
    }))
    
    textarea = forms.CharField(widget=forms.Textarea(attrs={
        'name': 'textarea',
        'placeholder': 'Написать пост...',
        'spellcheck': 'True',
        'required': 'True',
    }))
    
    class Meta:
        model = Post
        fields = ('textarea',)