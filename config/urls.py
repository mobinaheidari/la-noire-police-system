# config/urls.py
from django.contrib import admin
from django.urls import path, include

# JWT Imports
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Swagger Imports
from rest_framework import permissions  # <--- This is the missing piece!
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger configuration
schema_view = get_schema_view(
   openapi.Info(
      title="L.A. Noire Police Department API",
      default_version='v1',
      description="API documentation for the 2025 Police Department System",
      contact=openapi.Contact(email="admin@lpd.com"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Swagger Documentation URLs
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Auth endpoints
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('accounts.urls')), 
    
    # Role endpoints
    path('api/', include('roles.urls')),
]