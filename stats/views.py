from rest_framework.views import APIView
from rest_framework.response import Response
from django.apps import apps
from django.contrib.auth import get_user_model

class DashboardStatsView(APIView):
    def get(self, request):
        try:
            Case = apps.get_model('cases', 'Case')
            closed_cases = Case.objects.filter(status='closed').count()
            active_cases = Case.objects.exclude(status='closed').count()
        except LookupError:
            closed_cases = 0
            active_cases = 0
            
        User = get_user_model()
        total_employees = User.objects.filter(is_staff=True).count()
        
        return Response({
            "closed_cases": closed_cases,
            "active_cases": active_cases,
            "total_employees": total_employees
        })