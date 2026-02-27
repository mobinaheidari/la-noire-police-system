from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from datetime import timedelta

class Suspect(models.Model):
    
    CRIME_LEVELS = (
        (1, 'سطح ۱ - خشن (Violent)'),
        (2, 'سطح ۲ - مالی (Financial)'),
        (3, 'سطح ۳ - سبک (Light)'),
    )

    STATUS_CHOICES = (
        ('suspect', 'مظنون (Suspect)'),
        ('wanted', 'تحت تعقیب (Wanted)'),
        ('arrested', 'بازداشتی (Arrested)'),
        ('convicted', 'مجرم (Convicted)'),
        ('cleared', 'تبرئه شده (Cleared)'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='suspicions', null=True, blank=True)
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, related_name='case_suspects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='suspect')
    crime_level = models.IntegerField(choices=CRIME_LEVELS, default=3)
    
    wanted_since = models.DateTimeField(null=True, blank=True) 
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_most_wanted(self):
        """طبق فصل ۵: اگر بیش از یک ماه تحت تعقیب باشد"""
        if self.wanted_since and self.status == 'wanted':
            return timezone.now() > self.wanted_since + timedelta(days=30)
        return False

  
    @property
    def days_wanted(self):
        """محاسبه تعداد روزهای تحت تعقیب برای فرانت‌اِند"""
        if self.wanted_since and self.status == 'wanted':
            delta = timezone.now() - self.wanted_since
            return delta.days
        return 0
    


    @property
    def reward_amount(self):
        """فرمول پاداش طبق فصل ۵: (بیشترین روزهای تعقیب * درجه جرمی) * ۲۰,۰۰۰,۰۰۰ ریال"""
        if not self.wanted_since:
            return 0
        days = (timezone.now() - self.wanted_since).days
      
        crime_rank = 4 - self.crime_level 
        return days * crime_rank * 20000000

class Interrogation(models.Model):
    """این مدل همان 'ثبت امتیاز گناهکاری' صفحه ۱۴ داک است"""
    suspect = models.ForeignKey(Suspect, on_delete=models.CASCADE, related_name='interrogations')
    transcript = models.TextField(verbose_name="گزارش بازجویی و اعترافات", null=True, blank=True) 
    
   
    detective = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='det_reports')
    detective_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    
    sergeant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='serg_reports')
    sergeant_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    
   
    captain_verdict = models.BooleanField(null=True, blank=True, verbose_name="تایید کاپیتان")
    chief_verdict = models.BooleanField(null=True, blank=True, verbose_name="تایید رئیس پلیس")
    
    created_at = models.DateTimeField(auto_now_add=True)

class Bail(models.Model):
    """سیستم وثیقه طبق فصل ۴: فقط برای جرائم سطح ۲ و ۳"""
    suspect = models.ForeignKey(Suspect, on_delete=models.CASCADE, related_name='bails')
    amount = models.DecimalField(max_digits=15, decimal_places=0, verbose_name="مبلغ به ریال")
    is_paid = models.BooleanField(default=False)
    
 
    assigned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True,blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.suspect.crime_level == 1:
            raise ValueError("برای جرائم سطح ۱ (خشن) امکان صدور وثیقه وجود ندارد.")
        super().save(*args, **kwargs)

    