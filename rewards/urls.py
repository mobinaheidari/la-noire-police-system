from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RewardClaimViewSet

router = DefaultRouter()
router.register(r'list', RewardClaimViewSet)

urlpatterns = [
    path('', include(router.urls)),
]