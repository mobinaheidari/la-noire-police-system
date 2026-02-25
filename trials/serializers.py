from rest_framework import serializers
from .models import Trial, Verdict

class VerdictSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verdict
        fields = '__all__'

class TrialSerializer(serializers.ModelSerializer):
    verdicts = VerdictSerializer(many=True, read_only=True)

    class Meta:
        model = Trial
        fields = '__all__'