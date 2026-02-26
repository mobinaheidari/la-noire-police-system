from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Suspect(models.Model):
    STATUS_CHOICES = (
        ('suspect', 'Suspect'),
        ('wanted', 'Wanted'),
        ('most_wanted', 'Most Wanted'),
        ('arrested', 'Arrested'),
        ('cleared', 'Cleared'),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='suspicions', null=True, blank=True)
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, related_name='case_suspects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='suspect')
    wanted_since = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Interrogation(models.Model):
    suspect = models.ForeignKey(Suspect, on_delete=models.CASCADE, related_name='interrogations')
    transcript = models.TextField(verbose_name="متن بازجویی", null=True, blank=True) 
    detective = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='detective_interrogations')
    sergeant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sergeant_interrogations', null=True, blank=True)
    detective_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    sergeant_score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)], null=True, blank=True)
    
    captain_verdict = models.BooleanField(null=True, blank=True)
    chief_verdict = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Bail(models.Model):
    suspect = models.ForeignKey(Suspect, on_delete=models.CASCADE, related_name='bails')
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    payment_ref = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)