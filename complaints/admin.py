from django.contrib import admin
from .models import Complaint

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('title', 'complainant', 'is_valid', 'reject_count')
    list_filter = ('is_valid',)