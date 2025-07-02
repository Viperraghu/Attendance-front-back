# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import permissions , status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate 
from rest_framework.authtoken.models import Token
from .models import User , Attendance 
from .serializers import *
from django.utils.timezone import now
import pandas as pd
from rest_framework.response import Response
from django.http import HttpResponse
from django.contrib.auth import login 
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from datetime import datetime , date , timedelta
  


# Admin-only User Creation
class AdminRegisterView(APIView):
    
    def post(self , request):
        serializer = AdminRegisterSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message" : "Admin Register Succesfuly .. !"})
        return Response(serializer.errors)
    
# Login 
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
# @method_decorator(csrf_exempt , name='dispatch')
class LoginView(TokenObtainPairView):

   serializer_class = MyTokenObtainPairSerializer
  
   # def post(self , request):
    #    serializer = LoginSerializer(data =request.data)
     #   if serializer.is_valid():
           # normal Login #
        #  user = serializer.validated_data
        #  login(request , user)
        #  return Response({"Message" : "Login Succesfull" , 'is_admin' : user.is_admin})

          # Token based login #
             # user = serializer.validated_data
             # token , _ = Token.objects.get_or_create(user = user)
             # return Response ({
             #     "Message" : "Login Successfuly" ,
             #    "token" : token.key ,

             #  "is_admin" : user.is_admin 
           # })
      #  return Response({"Message" : "Invalid email and password"} , status=400)
            
# User Creation 
class UserCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self , request):
        if not request.user.is_admin:
            return Response({"Error" : "Only Admins Can Create Users "}) 
        serializer = UserSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message" : "User Created Succesfully "})
        return Response(serializer.errors , status=400)
        
# Punch Out
class PunchInOutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self , request):
        user = request.user
        today = date.today()
        now = datetime.now().time()
        
        attendance , created = Attendance.objects.get_or_create(user = user , date = today)
       
        if not attendance.punch_in:
            attendance.punch_in = now
            attendance.save()
            return Response ({"Message" : "Punched In"} , status=200)
        elif not attendance.punch_out:
            attendance.punch_out = now
            attendance.save()
            return Response({"Message" : "Punched Out"} , status=200)
        else:
            return Response({"Message" : "Already Punched in and out today"} ,status=400)
        

#Attendance CRUD - Admin Only
class AttendanceCRUDView(APIView):
    
    def get(self , request):
        if not request.user.is_admin:
            return Response({"Message" : "Only admins can view attendance"})
        attendance = Attendance.objects.all()   
        serializer = AttendanceSerializer(attendance , many =True)
        return Response({"Data's " : serializer.data})
    
    def post(self , request):
        if not request.user.is_admin:
            return Response({"Details" : "Only Admin Can Create Attendance"})
        serializer = AttendanceSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message" : "Attendance created succesfully"})
        return Response({"Message" : "Not create a attendance"})
    
    def put(self , request , pk=None):
        if not request.user.is_admin:
            return Response({"Details" : "Only Admin Can Update"})
        
        try:
            attendance = Attendance.objects.get(pk=pk)
        except Attendance.DoesNotExist:
            return Response({"Message" : "Attendance not found"})
        serializer = AttendanceSerializer(attendance , data = request.data , partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response({"Message" : "Attendance Update Successfully"})
        
    def delete(self , request , pk):
        if not request.user.is_admin:
            return Response({"Detail" : "Only Admin Can Delete.. !"})
        try:
            attendance = Attendance.objects.get(pk=pk)
            attendance.delete()
            return Response({"Message" : "Delete Success.. !"})
        except Attendance.DoesNotExist:
            return Response({"Message" : "Not Delete Data .. !" })
       
#attendance view (admin , user)        
class AttendanceListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self , request):
        if request.user.is_admin:
            attendance = Attendance.objects.all()  
        else:
            attendance = Attendance.objects.filter(user = request.user)   
        serializer = AttendanceSerializer(attendance , many= True)    
        return Response({"Data's" : serializer.data}) 

#Export as Excel 
class AttendanceExportView(APIView):
    permission_classes = [IsAuthenticated]
    

    def get(self , request ):
        export_type = request.query_params.get("type")
                   
        if export_type == 'weekly':
            start_date = datetime.now() - timedelta(days=7)
            #Apply monthly filter
        elif export_type  == 'monthly':
            start_date = datetime.now() - timedelta(days=30)
        else:
            return Response({"error" : "Invalid type user ?type=weekly or ?type=monthly"} )
            #Get attendance data
        attendance = Attendance.objects.filter(date__gte=start_date)
        data =[]
        for att in attendance:
           data.append({
               "User" : att.user.full_name ,
               "Email" : att.user.email ,
               "Date" : att.date.strftime("%Y-%m-%d") ,
               "Punch In" :att.punch_in.strftime("%H:%M:%S") if att.punch_in else "" ,
               "Punch Out" : att.punch_out.strftime("%H:%M:%S") if att.punch_out else "" 

            })
        df = pd.DataFrame(data)
        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' )
        filename = f"attendance_{export_type}_{datetime.now().strftime('%Y%m%d%H%M%S')}.xlsx"
        response['Content-Disposition'] = f'attachment; filename = "{filename}"'
        with pd.ExcelWriter(response , engine='openpyxl') as writer:
            df.to_excel(writer , index=False , sheet_name="Attendance")
        return response
    