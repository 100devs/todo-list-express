//selects all elements with class 'fa-trash' and assigns them to variable 'deleteBtn'
const deleteBtn = document.querySelectorAll('.fa-trash');
//selects all spans w/in an element w/ class 'item' and assigns them to variable 'item'
const item = document.querySelectorAll('.item span');
//selects all spans w/ a 'completed' class inside an element w/ class 'item' and assigns them to variable 'itemCompleted'
const itemCompleted = document.querySelectorAll('.item span.completed');

//creates an array out of all elements held in 'deleteBtn' and adds an eventlistener that fires on a click and excutes the callback 'deleteItem'
Array.from(deleteBtn).forEach((element) => {
	element.addEventListener('click', deleteItem);
});

//creates an array out of all elements held in 'item' and adds an eventlistener that fires on a click and excutes the callback 'markComplete'
Array.from(item).forEach((element) => {
	element.addEventListener('click', markComplete);
});

//creates an array out of all elements held in 'itemCompleted' and adds an eventlistener that fires on a click and excutes the callback 'markUnComplete'
Array.from(itemCompleted).forEach((element) => {
	element.addEventListener('click', markUnComplete);
});

//the asynchronous function the runs when any item in the variable 'deleteBtn' is clicked
async function deleteItem() {
	//grabs the actual name of the item next to the delete button and assigns it to itemText
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		//sends DELETE request to server on the todos/deleteItem route
		const response = await fetch('deleteItem', {
			method: 'delete',
			headers: { 'Content-Type': 'application/json' },
			//sends the value of the item's name along in the req.body as = to 'itemFromJs'
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		//assigns the output returned from the server to variable 'data' and logs the info client-side
		const data = await response.json();
		console.log(data);
		//triggers a refresh so that new changes will be displayed
		location.reload();
	} catch (err) {
		//if there is an error during this request, it will log client side
		console.log(err);
	}
}

//the asynchronous function the runs when any item in the variable 'item' is clicked
async function markComplete() {
	//grabs the actual name of the item next to the delete button and assigns it to itemText
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		//sends PUT request to server on the todos/markComplete route
		const response = await fetch('markComplete', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			//sends the value of the item's name along in the req.body as = to 'itemFromJs'
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		//assigns the output returned from the server to variable 'data' and logs the info client-side
		const data = await response.json();
		console.log(data);
		//triggers a refresh so that new changes will be displayed
		location.reload();
	} catch (err) {
		//if there is an error during this request, it will log client side
		console.log(err);
	}
}

//the asynchronous function the runs when any item in the variable 'itemCompleted' is clicked
async function markUnComplete() {
	//grabs the actual name of the item next to the delete button and assigns it to itemText
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		//sends PUT request to server on the todos/markUnComplete route
		const response = await fetch('markUnComplete', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			//sends the value of the item's name along in the req.body as = to 'itemFromJs'
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		//assigns the output returned from the server to variable 'data' and logs the info client-side
		const data = await response.json();
		console.log(data);
		//triggers a refresh so that new changes will be displayed
		location.reload();
	} catch (err) {
		//if there is an error during this request, it will log client side
		console.log(err);
	}
}
