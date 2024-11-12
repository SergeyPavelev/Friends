from dataclasses import fields
from django import forms
from .models import Post


class PostForm(forms.ModelForm):
    title = forms.CharField(widget=forms.Textarea(attrs={
        'id': 'title-input',
        'name': 'title',
        'placeholder': 'What do you want to talk about?',
        'spellcheck': 'True',
        'required': 'True',
    }))
    
    textarea = forms.CharField(widget=forms.Textarea(attrs={
        'id': 'textarea-input',
        'name': 'textarea',
        'placeholder': 'Your post here...',
        'spellcheck': 'True',
        'required': 'True',
    }))
    
    class Meta:
        model = Post
        fields = ('textarea',)