from django.urls import path
from .views import *


urlpatterns = [
     path('admin-register' , AdminRegisterView.as_view() , name = "register"),
     path("login" , LoginView.as_view() , name = "token_obtain_pair") ,
     path("attendance" , AttendanceCRUDView.as_view() , name ="attendance") ,
     path("attendance/<int:pk>" , AttendanceCRUDView.as_view() , name ="attendance") ,
     path("create-user" , UserCreateView.as_view() , name ="exportattendance") ,
     path("punch-in" , PunchInOutView.as_view() , name ="punch-in") ,
     path("punch-out" , PunchInOutView.as_view() , name ="punch-out") ,
     path("export/" , AttendanceExportView.as_view() , name ="punch_out") ,
     path("attendanceview" , AttendanceListView.as_view() , name = "attendanceview")
]

