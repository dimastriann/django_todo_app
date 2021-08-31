from django.urls import path
from . import views


urlpatterns = [
    path('', views.api_overview, name="overview"),
    path('task-list/', views.task_list),
    path('task-detail/<str:pk>/', views.task_detail),
    path('task-create/', views.task_create),
    path('task-update/<str:pk>/', views.task_update),
    path('task-delete/<str:pk>/', views.task_delete)
]