from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrialViewSet, VerdictViewSet

router = DefaultRouter()
router.register(r'list', TrialViewSet)
router.register(r'verdicts', VerdictViewSet)

urlpatterns = [
    path('', include(router.urls)),
]