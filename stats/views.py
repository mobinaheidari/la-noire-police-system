from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.apps import apps

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
       
        Case = apps.get_model('cases', 'Case')
        Suspect = apps.get_model('investigation', 'Suspect')
        Complaint = apps.get_model('complaints', 'Complaint')
        
       
        try:
            Trial = apps.get_model('trials', 'Trial')
            total_trials = Trial.objects.count()
        except (LookupError, Exception):
            total_trials = 0

        
        data = {
            "total_cases": Case.objects.count(),
            "total_suspects": Suspect.objects.count(),
            "total_trials": total_trials,
            "total_complaints": Complaint.objects.count()
        }
        
        return Response(data)