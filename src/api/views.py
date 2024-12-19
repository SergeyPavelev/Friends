from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny


User = get_user_model()

class ThemeChange(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        user = request.data.get('user')
        user = User.objects.get(username=user)
        theme = user.theme
        
        if theme == 'Light':
            user.theme = 'Dark'
            user.save()
            return Response({'success': 'Theme changed on dark'})
        elif theme == 'Dark':
            user.theme = 'Light'
            user.save()
            return Response({'success': 'Theme changed on light'})
        else:
            return Response({'error': 'Invalid theme'})
