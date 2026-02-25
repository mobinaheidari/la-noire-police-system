from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SuspectViewSet, InterrogationViewSet, BailViewSet
from .views import payment_callback

router = DefaultRouter()
router.register(r'list', SuspectViewSet)
router.register(r'interrogations', InterrogationViewSet)
router.register(r'bails', BailViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('payment/callback/', payment_callback, name='payment-callback'),
]