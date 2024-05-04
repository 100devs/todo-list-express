// selects all the elements with a class of .fa-trash and stores into one variable
const deleteBtn = document.querySelectorAll('.fa-trash');
// selects all the elements that are a span with a class of item into one variable
const item = document.querySelectorAll('.item span');
// selects all the spans with a class of completed and item
const itemCompleted = document.querySelectorAll('.item span.completed');

//array from converts the nodelist into an array of delete buttons and uses the foreach method to loop over each element and add a eventlistener that when clicked calls the deleteItem function
Array.from(deleteBtn).forEach((element) => {
	element.addEventListener('click', deleteItem);
});

//array.from converts the item nodelist into an array of items and uses the forEach method to loop over each element and add a eventlistener to each item that when clicked it calls the markComplete function
Array.from(item).forEach((element) => {
	element.addEventListener('click', markComplete);
});

// array.from converts the item nodelist into an array of itemsCompleted and uses the forEach method to loop over each element and add a click eventlistener that calls the markunComplete when clicked on
Array.from(itemCompleted).forEach((element) => {
	element.addEventListener('click', markUnComplete);
});

// async function for deleting an item when the trash can is clicked on
async function deleteItem() {
	// selects the innerText of the element with the trash can that is clicked and stores it in itemText. use the odd number when using childNodes
	const itemText = this.parentNode.childNodes[1].innerText;
	//trys to run
	try {
		// await fetchs the deleteItem relative route from the server side delete request
		const response = await fetch('deleteItem', {
			// what type of http request will be fetched in this case delete
			method: 'delete',
			//informs the client who receives the http response what type of data is being sent
			headers: { 'Content-Type': 'application/json' },
			// attaches a json object of itemFromJS containing the itemText variable to the body
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		// takes the response from the server side parsed into json and stored into the data
		const data = await response.json();
		console.log(data);
		//reloads page
		location.reload();
		//if the try fails it console.logs the error
	} catch (err) {
		console.log(err);
	}
}

// async function that when a span text with the class of item is clicked on will store the spans innertext into itemText
async function markComplete() {
	const itemText = this.parentNode.childNodes[1].innerText;
	//trys to run functions
	try {
		// fetches for a put request on the markComplete route
		const response = await fetch('markComplete', {
			method: 'put',
			// informs the client who receives the http response what type of data is being sent
			headers: { 'Content-Type': 'application/json' },
			// attaches a json object of itemFromJS with a value of the itemText variable to the body
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		// takes the server side response parsed into json and stores it into data
		const data = await response.json();
		console.log(data);
		//reloads page
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

// async function that when a span with the classes completed and item are clicked they call the function and the innerText are stored into the itemText variable
async function markUnComplete() {
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		// fetchs for a put request on the markUnComplete route
		const response = await fetch('markUnComplete', {
			method: 'put',
			// informs the client who receives the http response what type of data is being sent
			headers: { 'Content-Type': 'application/json' },
			// attaches a json object of itemFromJS with a value of the itemText variable to the body
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		// takes the server side response parsed into json and stores it into data
		const data = await response.json();
		console.log(data);
		//reloads page
		location.reload();
	} catch (err) {
		console.log(err);
	}
}
