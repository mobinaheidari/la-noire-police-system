from rest_framework import viewsets
from .models import RewardClaim
from .serializers import RewardClaimSerializer

class RewardClaimViewSet(viewsets.ModelViewSet):
    queryset = RewardClaim.objects.all()
    serializer_class = RewardClaimSerializer