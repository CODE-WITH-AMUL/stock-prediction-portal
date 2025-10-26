# urls.py (add to your main urls.py)
from django.urls import path
from . import views  # assuming views.py in same app

urlpatterns = [
    # Search removed; only analysis endpoint
    path('stocks/analyze/<str:ticker>/', views.analyze_stock, name='analyze_stock'),
]   