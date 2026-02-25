from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class StatsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testadmin', password='testpassword123')
        self.client.force_authenticate(user=self.user)

    def test_get_dashboard_stats(self):
        response = self.client.get('/api/stats/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)