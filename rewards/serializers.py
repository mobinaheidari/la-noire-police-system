from rest_framework import serializers
from .models import RewardClaim

class RewardClaimSerializer(serializers.ModelSerializer):
    class Meta:
        model = RewardClaim
        fields = '__all__'
        read_only_fields = ('unique_code', 'reward_amount')