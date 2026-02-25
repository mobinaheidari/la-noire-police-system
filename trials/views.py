from rest_framework import viewsets
from .models import Trial, Verdict
from .serializers import TrialSerializer, VerdictSerializer

class TrialViewSet(viewsets.ModelViewSet):
    queryset = Trial.objects.all()
    serializer_class = TrialSerializer

class VerdictViewSet(viewsets.ModelViewSet):
    queryset = Verdict.objects.all()
    serializer_class = VerdictSerializer