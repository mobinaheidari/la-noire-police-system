from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplaintViewSet

router = DefaultRouter()
router.register(r'list', ComplaintViewSet)

urlpatterns = [
    path('', include(router.urls)),
]