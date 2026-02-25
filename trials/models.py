from django.db import models
from django.conf import settings

class Trial(models.Model):
    case = models.OneToOneField('cases.Case', on_delete=models.CASCADE, related_name='trial')
    judge = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='judgments')
    trial_date = models.DateTimeField(auto_now_add=True)

class Verdict(models.Model):
    trial = models.ForeignKey(Trial, on_delete=models.CASCADE, related_name='verdicts')
    suspect = models.OneToOneField('investigation.Suspect', on_delete=models.CASCADE)
    is_guilty = models.BooleanField()
    punishment_title = models.CharField(max_length=255, null=True, blank=True)
    punishment_description = models.TextField(null=True, blank=True)