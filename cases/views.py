from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from investigation.models import Suspect
from .models import Case
from .serializers import CaseSerializer  

class CaseViewSet(viewsets.ModelViewSet):
   
    queryset = Case.objects.all()
    serializer_class = CaseSerializer
  

    @action(detail=True, methods=['post'], url_path='close')
    def close_case(self, request, pk=None):
        case = self.get_object()
        
        if case.status == 'closed':
            return Response(
                {"detail": "این پرونده قبلاً مهر مختومه خورده است!"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        case.status = 'closed'
        case.save()

        suspects = case.case_suspects.all() 
        for suspect in suspects:
            if suspect.status in ['suspect', 'wanted', 'arrested']:
                last_interrogation = suspect.interrogations.order_by('-created_at').first()
                if last_interrogation and last_interrogation.chief_verdict:
                    suspect.status = 'convicted'
                else:
                    suspect.status = 'cleared'
                suspect.save()

        return Response({
            "message": "پرونده با مهر تایید بسته شد و به بایگانی راکد منتقل گردید.",
            "status": "closed"
        }, status=status.HTTP_200_OK)