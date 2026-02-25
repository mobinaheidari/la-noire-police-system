from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class RewardsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testcitizen',
            email='citizen@test.com',
            phone_number='09120000003',
            national_code='1234567893',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)

    def test_get_rewards_list(self):
        response = self.client.get('/api/rewards/list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)