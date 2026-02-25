from rest_framework import serializers
from .models import Suspect, Interrogation, Bail

class SuspectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suspect
        fields = '__all__'

class InterrogationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interrogation
        fields = '__all__'

class BailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bail
        fields = '__all__'