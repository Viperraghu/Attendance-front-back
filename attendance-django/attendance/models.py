from django.db import models
from django.contrib.auth.models import AbstractBaseUser , BaseUserManager
from django.utils import timezone

# Create your models here.

class UserManager(BaseUserManager):
    def create_user(self , email , full_name , phone_number ,  password = None , **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        
        user = self.model(
            email = self.normalize_email(email) , full_name = full_name ,  phone_number = phone_number ,**extra_fields
        ) 
        user.set_password(password)
        user.save(using = self._db)
        return user
        
    def create_superuser(self , email , full_name , phone_number , password=None ,**extra_fields ):
        extra_fields.setdefault('is_admin',True)
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        
        return self.create_user(email , full_name , phone_number , password , **extra_fields)

class User(AbstractBaseUser):

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    
    
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['full_name' , 'phone_number']

    def __str__(self):
        return self.email
    
    

class Attendance(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    punch_in = models.TimeField(null=True , blank=True)
    punch_out = models.TimeField(null=True , blank=True)
   
    def __str__(self):
        return f"{self.user.full_name} - {self.date}"