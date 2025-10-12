from .views import index
from django.urls import path

urlpatterns  = [
    path('api/index', index, name='index'),
]