from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Max
from .models import Suspect, Interrogation, Bail
from .serializers import SuspectSerializer, InterrogationSerializer, BailSerializer
from rest_framework.decorators import api_view

class SuspectViewSet(viewsets.ModelViewSet):
    queryset = Suspect.objects.all()
    serializer_class = SuspectSerializer


    def get_queryset(self):
        queryset = Suspect.objects.all()
        case_id = self.request.query_params.get('case', None)
        if case_id is not None:
            queryset = queryset.filter(case_id=case_id)
        return queryset

    @action(detail=False, methods=['get'])
    def most_wanted(self, request):
        most_wanted = self.queryset.filter(status='most_wanted')
        serializer = self.get_serializer(most_wanted, many=True)
        return Response(serializer.data)


class InterrogationViewSet(viewsets.ModelViewSet):
    queryset = Interrogation.objects.all().order_by('-created_at')
    serializer_class = InterrogationSerializer

    def get_queryset(self):
        queryset = self.queryset
        case_id = self.request.query_params.get('case')
        if case_id:
            queryset = queryset.filter(suspect__case_id=case_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(detective=self.request.user)

class BailViewSet(viewsets.ModelViewSet):
    queryset = Bail.objects.all()
    serializer_class = BailSerializer

@api_view(['GET', 'POST'])
def payment_callback(request):
    transaction_status = request.GET.get('status', 'success')
    if transaction_status == 'success':
        return Response({"message": "Payment verified successfully.", "status": 200})
    return Response({"message": "Payment failed or canceled.", "status": 400})