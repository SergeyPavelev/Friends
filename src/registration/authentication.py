from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication


User = get_user_model()

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access_token')
        if access_token:
            validated_token = self.get_validated_token(access_token)
            return self.get_user(validated_token), validated_token
        return None