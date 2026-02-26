from django.contrib import admin
from .models import Evidence, BioEvidence, VehicleEvidence, IDEvidence

admin.site.register(Evidence)
admin.site.register(BioEvidence)
admin.site.register(VehicleEvidence)
admin.site.register(IDEvidence)