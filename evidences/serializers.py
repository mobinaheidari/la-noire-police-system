from rest_framework import serializers
from .models import Evidence, BioEvidence, VehicleEvidence, IDEvidence, DetectiveBoardNode, DetectiveBoardEdge

class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = '__all__'

class BioEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BioEvidence
        fields = '__all__'

class VehicleEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleEvidence
        fields = '__all__'

class IDEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = IDEvidence
        fields = '__all__'

class DetectiveBoardNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectiveBoardNode
        fields = '__all__'

class DetectiveBoardEdgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectiveBoardEdge
        fields = '__all__'