from django import forms
from .models import Message


class MessageForm(forms.ModelForm):
    textarea = forms.CharField(widget=forms.Textarea(attrs={
        'name': 'textarea',
        'placeholder': 'Type a message',
        'maxlength': '500',
        'spellcheck': 'True',
        'required': 'True',
    }))
    
    class Meta:
        model = Message
        fields = ('textarea',)
