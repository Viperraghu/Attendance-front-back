from rest_framework import serializers
from .models import User , Attendance
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
       token = super().get_token(user)
       token['email'] = user.email
       token['is_admin'] = user.is_admin
       return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data['email'] = self.user.email
        data['is_admin'] = self.user.is_admin
        data['message'] = 'Login Successfully '
        return data

class AdminRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email' , 'username' , "password"]
        extra_kwargs = {'password' : {'write_only' : True}}
       
    def create(self, validated_data):
        validated_data['is_admin'] = True
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ['email' , "password"]
        extra_kwargs = {'password' : {'write_only' : True}}

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Credentials")
    
class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["id" , 'email' , 'full_name' , 'phone_number' , 'password' ]
        extra_kwargs = {'password' : {'write_only' : True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    

class AttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = ['id' , 'user' , 'date' , 'punch_in' , 'punch_out']
        read_only_fields = ["user" , "date"]