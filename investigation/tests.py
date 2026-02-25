from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class InvestigationAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testofficer', password='testpassword123')
        self.client.force_authenticate(user=self.user)

    def test_get_suspects_list(self):
        response = self.client.get('/api/suspects/list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_most_wanted(self):
        response = self.client.get('/api/suspects/list/most_wanted/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_interrogations_list(self):
        response = self.client.get('/api/suspects/interrogations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)