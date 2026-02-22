# accounts/views.py
from rest_framework import generics,viewsets
from rest_framework.permissions import AllowAny,IsAdminUser
from django.contrib.auth import get_user_model
from .serializers import UserRegistrationSerializer,UserManagementSerializer



User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # Anyone can access the registration page
    serializer_class = UserRegistrationSerializer



class UserViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Users. Only accessible by Admins to manage accounts and assign roles.
    """
    queryset = User.objects.all()
    serializer_class = UserManagementSerializer
    permission_classes = [IsAdminUser] # Strictly limits access to superusers