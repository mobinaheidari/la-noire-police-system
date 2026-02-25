from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class TrialsAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testjudge',
            email='judge@test.com',
            phone_number='09120000002',
            national_code='1234567892',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)

    def test_get_trials_list(self):
        response = self.client.get('/api/trials/list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_verdicts_list(self):
        response = self.client.get('/api/trials/verdicts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)