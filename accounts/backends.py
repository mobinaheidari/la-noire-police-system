# accounts/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

class MultiFieldAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if username is None:
            username = kwargs.get('username') or kwargs.get('email') or kwargs.get('phone_number') or kwargs.get('national_code')
            
        try:
            # We use Django's Q objects to perform an OR query across all 4 unique fields
            user = User.objects.get(
                Q(username=username) | 
                Q(email=username) | 
                Q(phone_number=username) | 
                Q(national_code=username)
            )
        except User.DoesNotExist:
            return None

        # Check the password if a user was found
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None