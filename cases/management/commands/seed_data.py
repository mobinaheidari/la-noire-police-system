from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from cases.models import Case
from investigation.models import Suspect
from complaints.models import Complaint
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the database with L.A. Noire test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

   
        user = User.objects.first()
        if not user:
            self.stdout.write(self.style.ERROR('No user found. Please create a superuser first.'))
            return

   
        case_titles = [
            "سرقت مسلحانه از بانک مرکزی",
            "قتل مرموز در هتل رولت",
            "قاچاق اشیاء عتیقه در بندر",
            "اختلاس در شهرداری لوس‌آنجلس",
            "آتش‌سوزی عمدی در انبار غله"
        ]

        statuses = ['open', 'pending_officer', 'closed']

        for title in case_titles:
            case, created = Case.objects.get_or_create(
                title=title,
                defaults={
                    'description': f"گزارش عملیاتی مربوط به {title}. شواهد اولیه در صحنه جرم جمع‌آوری شده است.",
                    'status': random.choice(statuses),
                    'creator': user,
                    'crime_scene_time': "2026-02-26T10:00:00Z"
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Case "{title}" created.'))

                Suspect.objects.create(
                    case=case,
                    status='suspect'
                )

        Complaint.objects.get_or_create(
            title="شکایت از مزاحمت خیابانی",
            defaults={
                'complainant': user,
                'description': "در خیابان ۲۲ محله چینی‌ها مزاحمت ایجاد شده است.",
                'is_valid': True
            }
        )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))