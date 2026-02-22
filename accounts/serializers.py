# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from roles.serializers import RoleSerializer
from roles.models import Role

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    # Make password write-only so it doesn't get returned in the API response
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'phone_number', 'first_name', 'last_name', 'national_code')

    def create(self, validated_data):
        # We must use create_user so the password gets hashed!
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data['phone_number'],
            national_code=validated_data['national_code'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
    
class UserManagementSerializer(serializers.ModelSerializer):
    # This will display the full role details when reading, but accept a list of IDs when writing
    roles = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Role.objects.all(),
        required=False
    )

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'national_code', 'roles')
        
    def to_representation(self, instance):
        # When sending data OUT, show the full Role object (name, etc.) instead of just the ID
        representation = super().to_representation(instance)
        representation['roles'] = RoleSerializer(instance.roles.all(), many=True).data
        return representation