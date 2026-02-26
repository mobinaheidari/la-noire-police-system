from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework import permissions  
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from accounts.views import CustomTokenObtainPairView
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
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    path('api/auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('accounts.urls')), 
    path('api/', include('roles.urls')),

    path('api/cases/', include('cases.urls')),
    path('api/complaints/', include('complaints.urls')),
    path('api/evidences/', include('evidences.urls')),

    path('api/suspects/', include('investigation.urls')),
    path('api/trials/', include('trials.urls')),
    path('api/rewards/', include('rewards.urls')),
    path('api/stats/', include('stats.urls')),
]