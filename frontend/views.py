from django.shortcuts import render

# Create your views here.

def task_list_frontend(request):
	return render(request, 'frontend/task_list.html')
