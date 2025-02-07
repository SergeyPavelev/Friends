from django import forms
from .models import User


class LoginUserForm(forms.Form):
    username = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'placeholder': 'Username',
        'id': 'username-input',
        'type':'text',
        'name': 'username',
        'maxlength': '255',
        'required': 'True',
        }))
    
    password = forms.CharField(max_length=255, widget=forms.PasswordInput(attrs={
        'placeholder': 'Password',
        'id': 'password-input',
        'type':'password',
        'name': 'password',
        'maxlength': '255',
        'required': 'True',
        }))
    
    class Meta:
        model = User
        fields = ('username', 'password',)


class SignupUserForm(forms.Form):
    phone = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'placeholder': 'Phone',
        'id': 'phone-input',
        'type':'tel',
        'name': 'phone',
        'required': 'True',
    }))

    username = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'placeholder': 'Username',
        'id': 'username-input',
        'type':'text',
        'name': 'username',
        'required': 'True',
    }))

    password = forms.CharField(max_length=255, widget=forms.PasswordInput(attrs={
        'placeholder': 'Password',
        'id': 'password-input',
        'type':'password',
        'name': 'password1',
        'required': 'True',
    }))

    password_repeat = forms.CharField(max_length=255, widget=forms.PasswordInput(attrs={
        'placeholder': 'Confirm password',
        'id': 'password-repeat-input',
        'type':'password',
        'name': 'password2',
        'required': 'True',
    }))
    
    class Meta:
        model = User
        fields = ('phone', 'username', 'password', 'password_repeat',)
