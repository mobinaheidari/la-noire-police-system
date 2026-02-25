from django.db import models
from django.conf import settings
import uuid

class RewardClaim(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('rejected_officer', 'Rejected Officer'),
        ('approved_officer', 'Approved Officer'),
        ('rejected_detective', 'Rejected Detective'),
        ('approved', 'Approved'),
    )
    citizen = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reward_claims')
    suspect = models.ForeignKey('investigation.Suspect', on_delete=models.CASCADE, related_name='related_rewards')
    information = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    unique_code = models.UUIDField(default=uuid.uuid4, editable=False, null=True, blank=True)
    reward_amount = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)