"use strict";

(function() {
	const inputTask = document.getElementById('task')
	inputTask.focus();
})();

// create global object item
let activeItemEdit = Object.create(null);

// get task list from backend
const getTaskList = async () => {
	const url = 'http://localhost:8000/api/task-list/'
	const taskList = document.querySelector('.list-task')
	taskList.innerHTML = ""
	// const ulElemet = document.createElement('ul')
	// taskList.append(ulElemet)
	// console.log(taskList)
	const response = await fetch(url)
	const listData = await response.json()
	// console.log('task list', listData)

	var items = ''
	for(let task of listData){
		// console.log(task)
		const checked = task.completed ? 'checked' : '';
		const taskDone = checked ? 'task-done' : '';

		var item = `<div class="task" data-id=${task.id}>
			<div class="task-completed">
				<input type="checkbox" class="toggle-completed" ${checked}/>
        		<span class="checkbox-round"/>
			</div>
			<div class="task-name ${taskDone}">
				${task.title}
			</div>
			<button class="btn btn-secondary edit-btn">Edit</button>
			<button class="btn btn-danger remove-btn">Remove</button>
		</div>`

		items += item
	}

	// adding html content to element task list 
	taskList.innerHTML = items

	const editBtn = taskList.querySelectorAll('.edit-btn')
	const removeBtn = taskList.querySelectorAll('.remove-btn')
	const toggleCompleted = taskList.querySelectorAll('.toggle-completed')
	const inputTarget = document.getElementById('task')

	// edit task
	for(let edit of editBtn){
		edit.addEventListener('click', function(ev){
			// console.log('edit', this.parentElement.dataset)
			const currentId = parseInt(this.closest('.task').dataset.id)
			const dataItem = listData.find( data => data.id === currentId)
			inputTarget.value = dataItem.title
			inputTarget.focus()
			activeItemEdit = dataItem
		})
	}

	// remove task
	for(let remove of removeBtn){
		remove.addEventListener('click', function(ev){
			// console.log('remove', this.parentElement.dataset)
			const currentId = parseInt(this.closest('.task').dataset.id)
			const dataItem = listData.find( data => data.id === currentId)
			if(dataItem.completed){
				alert("Task is completed, cannot delete !")
				return null;
			}
			let url = `http://localhost:8000/api/task-delete/${dataItem.id}/`
			fetch(url, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				}
			}).then( () => getTaskList() )
		})
	}

	// toggle completed
	for(let toggle of toggleCompleted){
		toggle.addEventListener('click', function(ev) {
			const currentId = parseInt(this.closest('.task').dataset.id)
			const dataItem = listData.find( data => data.id === currentId)
			// console.log('currentId',dataItem)
			const url = `http://localhost:8000/api/task-update/${dataItem.id}/`
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title: dataItem.title,
					completed: !dataItem.completed
				})
			}).then( () => getTaskList() )
		})
	}
}

getTaskList();


// submit add task to backend
const taskForm = document.getElementById('task-form')
taskForm.addEventListener('submit', (ev) => {
	ev.preventDefault();
	const inputTarget = document.getElementById('task')
	const title = inputTarget.value.trim()
	if(!title){
		alert("Value is null, please input at least 1 word and then submit the new task !")
		return null;
	}
	// console.log(title)

	let url = 'http://localhost:8000/api/task-create/'
	if(activeItemEdit.id !== undefined){
		url = `http://localhost:8000/api/task-update/${activeItemEdit.id}/`
	}

	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			title: title
		})
	}).then( () => {
		getTaskList()
		inputTarget.value = null
	})
	
})
