from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EvidenceViewSet, BioEvidenceViewSet, VehicleEvidenceViewSet, IDEvidenceViewSet, DetectiveBoardNodeViewSet, DetectiveBoardEdgeViewSet

router = DefaultRouter()
router.register(r'general', EvidenceViewSet)
router.register(r'bio', BioEvidenceViewSet)
router.register(r'vehicle', VehicleEvidenceViewSet)
router.register(r'id', IDEvidenceViewSet)
router.register(r'board/nodes', DetectiveBoardNodeViewSet)
router.register(r'board/edges', DetectiveBoardEdgeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]