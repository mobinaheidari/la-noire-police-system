from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SuspectViewSet, InterrogationViewSet, BailViewSet

router = DefaultRouter()
router.register(r'list', SuspectViewSet)
router.register(r'interrogations', InterrogationViewSet)
router.register(r'bails', BailViewSet)

urlpatterns = [
    path('', include(router.urls)),
]