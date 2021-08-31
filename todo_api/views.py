from django.shortcuts import render, redirect
from django.http import HttpResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import TaskSerializer
from .models import Task

# Create your views here.

@api_view(['GET'])
def api_overview(request):
	api_urls_endpoint = {
		'Task-List': '/task-list/',
		'Detail-Task': '/task-detail/<str:pk>/',
		'Create': '/task-create/',
		'Update': '/task-udpate/<str:pk>/',
		'Delete': '/task-delete/<str:pk>',
	}
	return Response(api_urls_endpoint)


@api_view(['GET'])
def task_list(request):
	tasks = Task.objects.all().order_by('-id')
	serializer = TaskSerializer(tasks, many=True)
	return Response(serializer.data)


@api_view(['GET'])
def task_detail(request, pk):
	tasks = Task.objects.get(id=pk)
	serializer = TaskSerializer(tasks, many=False)
	return Response(serializer.data)


@api_view(['POST'])
def task_create(request):
	serializer = TaskSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)


@api_view(['POST'])
def task_update(request, pk):
	task = Task.objects.get(id=pk)
	serializer = TaskSerializer(instance=task ,data=request.data)
	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)


@api_view(['DELETE'])
def task_delete(request, pk):
	task = Task.objects.get(id=pk)
	task.delete()
	# return redirect('/api')
	return Response("Delete Successfully")

