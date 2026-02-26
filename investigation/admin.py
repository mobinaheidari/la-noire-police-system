from django.contrib import admin
from .models import Suspect, Interrogation

@admin.register(Suspect)
class SuspectAdmin(admin.ModelAdmin):
    list_display = ('id', 'case', 'status') 
    list_filter = ('status',)
    search_fields = ('status',)

admin.site.register(Interrogation)