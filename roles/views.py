# roles/views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Role
from .serializers import RoleSerializer

class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [IsAdminUser]  # Only superusers/staff can manage roles!