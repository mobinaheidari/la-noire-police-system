from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Max
from .models import Suspect, Interrogation, Bail
from .serializers import SuspectSerializer, InterrogationSerializer, BailSerializer

class SuspectViewSet(viewsets.ModelViewSet):
    queryset = Suspect.objects.all()
    serializer_class = SuspectSerializer

    @action(detail=False, methods=['get'])
    def most_wanted(self, request):
        most_wanted = self.queryset.filter(status='most_wanted')
        serializer = self.get_serializer(most_wanted, many=True)
        return Response(serializer.data)

class InterrogationViewSet(viewsets.ModelViewSet):
    queryset = Interrogation.objects.all()
    serializer_class = InterrogationSerializer

class BailViewSet(viewsets.ModelViewSet):
    queryset = Bail.objects.all()
    serializer_class = BailSerializer