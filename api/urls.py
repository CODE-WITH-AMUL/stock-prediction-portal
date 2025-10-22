# stocks/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('analyze/<str:ticker>/', views.analyze_stock_api, name='analyze_stock'),
]