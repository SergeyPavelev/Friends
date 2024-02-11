from django.shortcuts import render
from messenger.models import Message
from django.contrib.auth import get_user_model


User = get_user_model()

def index(request):    
    data = {
        'title': "Friends.com",
        'request': request,
    }
    
    if request.user.is_authenticated:
        messages = Message.objects.filter(pk=request.user.id)
        
        data['messages'] = messages
    
    return render(request, "main/index.html", context=data)
