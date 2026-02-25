from rest_framework import viewsets
from .models import Evidence, BioEvidence, VehicleEvidence, IDEvidence, DetectiveBoardNode, DetectiveBoardEdge
from .serializers import EvidenceSerializer, BioEvidenceSerializer, VehicleEvidenceSerializer, IDEvidenceSerializer, DetectiveBoardNodeSerializer, DetectiveBoardEdgeSerializer

class EvidenceViewSet(viewsets.ModelViewSet):
    queryset = Evidence.objects.all()
    serializer_class = EvidenceSerializer

class BioEvidenceViewSet(viewsets.ModelViewSet):
    queryset = BioEvidence.objects.all()
    serializer_class = BioEvidenceSerializer

class VehicleEvidenceViewSet(viewsets.ModelViewSet):
    queryset = VehicleEvidence.objects.all()
    serializer_class = VehicleEvidenceSerializer

class IDEvidenceViewSet(viewsets.ModelViewSet):
    queryset = IDEvidence.objects.all()
    serializer_class = IDEvidenceSerializer

class DetectiveBoardNodeViewSet(viewsets.ModelViewSet):
    queryset = DetectiveBoardNode.objects.all()
    serializer_class = DetectiveBoardNodeSerializer

class DetectiveBoardEdgeViewSet(viewsets.ModelViewSet):
    queryset = DetectiveBoardEdge.objects.all()
    serializer_class = DetectiveBoardEdgeSerializer