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
    username = forms.CharField(max_length=25, widget=forms.TextInput(attrs={
        'id': 'inputUsername',
        'class': 'input-profile-data',
        'placeholder': 'Username',
        'type':'text',
        'name': 'username',
    }))
    
    phone = forms.CharField(max_length=15, widget=forms.TextInput(attrs={
        'id': 'inputPhone',
        'class': 'input-profile-data',
        'placeholder': 'Phone',
        'type':'tel',
        'name': 'phone',
    }))
    
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'id': 'inputEmail',
        'class': 'input-profile-data',
        'placeholder': 'Email',
        'type': 'email',
        'name': 'email',
    }))
    
    password = forms.CharField(max_length=255, widget=forms.PasswordInput(attrs={
        'id': 'inputPassword',
        'class': 'input-profile-data',
        'placeholder': 'Password',
        'type':'password',
        'name': 'password',
    }))
    
    firstname = forms.CharField(max_length=50, widget=forms.TextInput(attrs={
        'id': 'inputFirstName',
        'class': 'input-profile-data',
        'placeholder': 'Firstname',
        'type':'text',
        'name': 'firstname',
    }))
    
    middlename = forms.CharField(max_length=50, widget=forms.TextInput(attrs={
        'id': 'inputMiddleName',
        'class': 'input-profile-data',
        'placeholder': 'Middlename',
        'type':'text',
        'name': 'middlename',
    }))
    
    lastname = forms.CharField(max_length=50, widget=forms.TextInput(attrs={
        'id': 'inputLastName',
        'class': 'input-profile-data',
        'placeholder': 'Lastname',
        'type':'text',
        'name': 'lastname',
    }))
    
    birthday = forms.CharField(max_length=15, widget=forms.TextInput(attrs={
        'id': 'inputBirthday',
        'class': 'input-profile-data',
        'placeholder': 'Birthday',
        'type':'text',
        'name': 'birthday',
    }))
    
    biography = forms.CharField(max_length=255, widget=forms.TextInput(attrs={
        'id': 'inputBio',
        'class': 'input-profile-data',
        'placeholder': 'Biography',
        'type':'text',
        'name': 'biography',
    }))
    
    sex = forms.CharField(max_length=5, widget=forms.TextInput(attrs={
        'id': 'inputSex',
        'class': 'input-profile-data',
        'placeholder': 'Sex',
        'type': 'text',
        'name': 'sex',
    }))
    
    class Meta:
        model = User
        fields = '__all__'
