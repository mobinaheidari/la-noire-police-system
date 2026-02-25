from django.db import models
from django.conf import settings

class Case(models.Model):
    STATUS_CHOICES = (
        ('pending_cadet', 'Pending Cadet'),
        ('pending_officer', 'Pending Officer'),
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('void', 'Void'),
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_cases', null=True, blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending_cadet')
    crime_scene_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)