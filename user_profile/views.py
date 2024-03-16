from django.shortcuts import render
from django.views.generic import View
from django.contrib.auth import get_user_model


User = get_user_model()


class User_Profile(View):
    def get(self, request, user_id):
        my_friends = [User.objects.get(pk=friend[0]) for friend in User.objects.filter(pk=request.user.id).values_list('friends') if friend[0]]
        user = User.objects.get(pk=user_id)
        
        data = {
            'title': f'{request.user}',
            'user': user,
            'username': request.user.username,
            'my_friends': my_friends,
        }
        
        return  render(request, 'user_profile/user_profile.html', context=data)
    
    def post(self, request, user_id):
        pass
