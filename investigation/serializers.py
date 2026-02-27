from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Suspect, Interrogation, Bail

User = get_user_model()


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username']

class SuspectSerializer(serializers.ModelSerializer):

    user_details = UserSimpleSerializer(source='user', read_only=True)
    

    days_wanted = serializers.ReadOnlyField()
    reward_amount = serializers.ReadOnlyField()

    class Meta:
        model = Suspect
        fields = [
            'id', 
            'user', 
            'user_details', 
            'case', 
            'status', 
            'crime_level', 
            'wanted_since', 
            'created_at', 
            'days_wanted',  
            'reward_amount' 
        ]

class InterrogationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interrogation
        fields = '__all__'

class BailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bail
        fields = '__all__'