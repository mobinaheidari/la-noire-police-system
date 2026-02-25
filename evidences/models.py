from django.db import models
from django.conf import settings

class Evidence(models.Model):
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, related_name='evidences')
    recorder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    evidence_type = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

class BioEvidence(models.Model):
    evidence = models.OneToOneField(Evidence, on_delete=models.CASCADE, related_name='bio_detail')
    coroner_approved = models.BooleanField(null=True, blank=True)
    db_result = models.TextField(null=True, blank=True)
    image_url = models.URLField(null=True, blank=True)

class VehicleEvidence(models.Model):
    evidence = models.OneToOneField(Evidence, on_delete=models.CASCADE, related_name='vehicle_detail')
    model_name = models.CharField(max_length=100)
    color = models.CharField(max_length=50)
    plate_number = models.CharField(max_length=20, null=True, blank=True)
    serial_number = models.CharField(max_length=50, null=True, blank=True)

class IDEvidence(models.Model):
    evidence = models.OneToOneField(Evidence, on_delete=models.CASCADE, related_name='id_detail')
    owner_name = models.CharField(max_length=255)
    details = models.JSONField(default=dict)

class DetectiveBoardNode(models.Model):
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, related_name='board_nodes')
    evidence = models.ForeignKey(Evidence, on_delete=models.CASCADE, null=True, blank=True)
    note = models.TextField(null=True, blank=True)
    pos_x = models.FloatField(default=0.0)
    pos_y = models.FloatField(default=0.0)

class DetectiveBoardEdge(models.Model):
    case = models.ForeignKey('cases.Case', on_delete=models.CASCADE, related_name='board_edges')
    source = models.ForeignKey(DetectiveBoardNode, related_name='outgoing_edges', on_delete=models.CASCADE)
    target = models.ForeignKey(DetectiveBoardNode, related_name='incoming_edges', on_delete=models.CASCADE)