from django.contrib import admin
from .models import Case

@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'creator', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('title', 'description')