"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from apigateway.views import subject_list,subject_detail,teacher_list,teacher_detail,logininfo_list,logininfo_detail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('subjects/', subject_list, name='subject-list'),
    path('subjects/<int:SubjectID>/', subject_detail, name='subject-detail'),
    # Teacher URLs
    path('teachers/', teacher_list, name='teacher-list-create'),  # GET, POST
    path('teachers/<str:TID>/', teacher_detail, name='teacher-detail'),  # GET, PUT, DELETE

    # LoginInfo URLs
    path('logininfos/', logininfo_list, name='login-list-create'),  # GET, POST
    path('logininfos/<str:TID>/', logininfo_detail, name='login-detail'),  # GET, PUT, DELETE
]
