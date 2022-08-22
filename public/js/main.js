// delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash');
// items without a completed class
const item = document.querySelectorAll('.item span:not(.completed)');
// items with a completed class
const itemCompleted = document.querySelectorAll('.item span.completed');

// give delete buttons functionality of deleteItem on click
Array.from(deleteBtn).forEach((element) => {
	element.addEventListener('click', deleteItem);
});

// give incomplete items functionality of markComplete on click
Array.from(item).forEach((element) => {
	element.addEventListener('click', markComplete);
});

// give complete items functionality of markIncomplete on click
Array.from(itemCompleted).forEach((element) => {
	element.addEventListener('click', markIncomplete);
});

async function deleteItem() { // declaring an asynchronous function
	const itemText = this.parentNode.childNodes[1].innerText; // looks inside of the list item and grabs only the inner text within the list span
	try {
		const response = await fetch('deleteItem', { // create a response variable that waits on a fetch to get data from the result of deleteItem
			method: 'delete', // sets the CRUD method for the route
			headers: { 'Content-Type': 'application/json' }, // specifying the type of content expected (JSON)
			body: JSON.stringify({ // declare the message content being passed, and turn it into a string
				'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
			})
		});
		const data = await response.json(); // waiting on JSON from the response to be converted
		console.log(data); // log the result to the console
		location.reload(); // reload the page
	} catch (err) {
		console.error(err); // if an error occurs log it to console
	}
}

async function markComplete() {
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		const response = await fetch('markComplete', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				'itemFromJS': itemText
			})
		});
		const data = await response.json();
		console.log(data);
		location.reload();

	} catch (err) {
		console.log(err);
	}
}

async function markIncomplete() {
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		const response = await fetch('markIncomplete', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				'itemFromJS': itemText
			})
		});
		const data = await response.json();
		console.log(data);
		location.reload();

	} catch (err) {
		console.log(err);
	}
}