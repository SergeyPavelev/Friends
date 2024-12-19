from django import forms
from .models import User


class LoginUserForm(forms.Form):
    username = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'placeholder': 'Username',
        'id': 'username-input',
        'type':'text',
        'name': 'username',
        }))
    
    password = forms.CharField(max_length=255, widget=forms.PasswordInput(attrs={
        'placeholder': 'Password',
        'id': 'password-input',
        'type':'password',
        'name': 'password',
        }))
    
    class Meta:
        model = User
        fields = ('username', 'password',)


class RegisterUserForm(forms.Form):
    phone = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'placeholder': 'Phone',
        'id': 'phone-input',
        'type':'tel',
        'name': 'phone',
    }))

    username = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'placeholder': 'Username',
        'id': 'username-input',
        'type':'text',
        'name': 'username',
    }))

    password = forms.CharField(max_length=255, widget=forms.PasswordInput(attrs={
        'placeholder': 'Password',
        'id': 'password-input',
        'type':'password',
        'name': 'password1',
    }))

    password_repeat = forms.CharField(max_length=255, widget=forms.PasswordInput(attrs={
        'placeholder': 'Confirm password',
        'id': 'password-repeat-input',
        'type':'password',
        'name': 'password2',
    }))
    
    class Meta:
        model = User
        fields = ('phone', 'username', 'password', 'password_repeat',)
