# accounts/views.py
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserRegistrationSerializer, UserManagementSerializer

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
       
        data = super().validate(attrs)

      
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
   
        }

        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    ویوی اختصاصی لاگین که علاوه بر توکن، اطلاعات کاربر را هم برمی‌گرداند
    """
    serializer_class = CustomTokenObtainPairSerializer


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