from dataclasses import fields
from django import forms
from django.contrib.auth import get_user_model


User = get_user_model()

class ProfileImageForm(forms.ModelForm):
    photo = forms.ImageField(widget=forms.FileInput(attrs={
        'type': 'file',
        'id': 'upload',
        'class': 'upload-input',
        'name': 'photo',
    }))
    
    class Meta:
        model = User
        fields = ('photo',)
        

class ChangeDataProfileForm(forms.ModelForm):
    phone = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'placeholder': 'Phone',
        'type':'tel',
        'name': 'phone',
        # 'value': '',
    }))
    
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'placeholder': 'Email',
        'type': 'email',
        'name': 'email',
    }))
    
    birthday = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'placeholder': 'Birthday',
        'type':'text',
        'name': 'birthday',
    }))
    
    password = forms.CharField(max_length=255, widget=forms.PasswordInput(attrs={
        'placeholder': 'Password',
        'type':'password',
        'name': 'password',
        }))
    
    class Meta:
        model = User
        fields = ('phone', 'email', 'birthday', 'password')
