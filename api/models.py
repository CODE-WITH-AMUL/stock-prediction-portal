from django.db import models
from django.contrib.auth.models import User

# Create your models here.



class Stock_name(models.Model):
    name = models.CharField(max_length=100)
    file = models.FileField(upload_to='files/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"The CSV file of this stock {self.name}"
    
    