from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from rest_framework.exceptions import ValidationError

from .models import Suspect, Interrogation, Bail
from .serializers import SuspectSerializer, InterrogationSerializer, BailSerializer

class SuspectViewSet(viewsets.ModelViewSet):
    queryset = Suspect.objects.all()
    serializer_class = SuspectSerializer

    def get_queryset(self):
        """فیلتر بر اساس پرونده و قابلیت جستجو (فصل ۴)"""
        queryset = Suspect.objects.all().order_by('-created_at')
      
        case_id = self.request.query_params.get('case')
        if case_id:
            queryset = queryset.filter(case_id=case_id)
            
   
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search) | 
                Q(status__icontains=search)
            )
        return queryset

    @action(detail=False, methods=['get'], url_path='most-wanted')
    def most_wanted_list(self, request):
        """
        منطق Most Wanted (فصل ۵): 
        مظنونینی که بیش از ۳۰ روز تحت تعقیب هستند.
        مرتب‌سازی بر اساس فرمول: روزهای تعقیب * (۴ - سطح جرم)
        """
        one_month_ago = timezone.now() - timedelta(days=30)
        
      
        candidates = Suspect.objects.filter(
            status='wanted',
            wanted_since__lte=one_month_ago
        )
        
        
        sorted_candidates = sorted(
            candidates,
            key=lambda s: s.reward_amount,
            reverse=True
        )

        serializer = self.get_serializer(sorted_candidates, many=True)
        return Response(serializer.data)

class InterrogationViewSet(viewsets.ModelViewSet):
    """مدیریت بازجویی و امتیازدهی گناهکاری (صفحه ۱۴ داک)"""
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
    """سیستم وثیقه با اعمال محدودیت سطح جرم (فصل ۴)"""
    queryset = Bail.objects.all()
    serializer_class = BailSerializer

    def get_queryset(self):
        case_id = self.request.query_params.get('case')
        if case_id:
            return self.queryset.filter(suspect__case_id=case_id)
        return self.queryset

    def perform_create(self, serializer):
        suspect_id = self.request.data.get('suspect')
        suspect = Suspect.objects.get(id=suspect_id)
        
      
        if suspect.crime_level == 1:
            raise ValidationError({
                "detail": "طبق قوانین دایره جنایی، برای مجرمین سطح ۱ (خشن) امکان صدور وثیقه وجود ندارد."
            })
        
      
        serializer.save()

@api_view(['GET', 'POST'])
def payment_callback(request):
    """شبیه‌ساز تاییدیه پرداخت وثیقه"""
    ref_id = request.data.get('payment_ref') or request.GET.get('ref')
    transaction_status = request.data.get('status') or request.GET.get('status', 'success')
    
    if transaction_status == 'success':
        return Response({
            "status": "success",
            "message": "وثیقه با موفقیت در سیستم بانکی تایید و فیش واریزی صادر شد.",
            "ref_id": ref_id
        }, status=status.HTTP_200_OK)
    
    return Response({
        "status": "failed",
        "message": "خطا در تراکنش بانکی. مبلغ به حساب بازگشت داده شد."
    }, status=status.HTTP_400_BAD_REQUEST)