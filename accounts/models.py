# accounts/models.py
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from roles.models import Role

class CustomUserManager(BaseUserManager):
    def create_user(self, username, email, phone_number, national_code, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(
            username=username,
            email=email,
            phone_number=phone_number,
            national_code=national_code,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, phone_number, national_code, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, phone_number, national_code, password, **extra_fields)

class CustomUser(AbstractUser):
    # AbstractUser already includes first_name, last_name, username, and password
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    national_code = models.CharField(max_length=10, unique=True)
    
    # Many-to-Many relationship with Roles
    roles = models.ManyToManyField(Role, related_name='users', blank=True)

    objects = CustomUserManager()
    # Tells Django which fields to prompt for when running createsuperuser
    REQUIRED_FIELDS = ['email', 'phone_number', 'national_code']

    def __str__(self):
        return f"{self.username} - {self.national_code}"