from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class CasesAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testcaseuser',
            email='case@test.com',
            phone_number='09120000005',
            national_code='1234567895',
            password='testpassword123'
        )
        self.client.force_authenticate(user=self.user)

    def test_get_cases_list(self):
        response = self.client.get('/api/cases/list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)