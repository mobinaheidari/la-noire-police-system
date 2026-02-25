from django.db import models
from django.conf import settings

class Complaint(models.Model):
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, related_name='complaints', null=True, blank=True)
    complainant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='complaints')
    title = models.CharField(max_length=255)
    description = models.TextField()
    reject_count = models.IntegerField(default=0)
    rejection_reason = models.TextField(null=True, blank=True)
    is_valid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)