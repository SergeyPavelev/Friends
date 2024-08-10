from dataclasses import fields
from django import forms
from .models import Message


class MessageForm(forms.ModelForm):
    textarea = forms.CharField(widget=forms.Textarea(attrs={
        'name': 'textarea',
        'placeholder': 'Написать сообещие...',
        'maxlength': '500',
        'spellcheck': 'True',
        'required': 'True',
    }))
    
    class Meta:
        model = Message
        fields = ('textarea',)
