//Selects all font-awesome trash icons on the page and assigns them to variable 'deleteBtn'
const deleteBtn = document.querySelectorAll('.fa-trash');
//Selects all children of elements with 'item' class that are spans
const item = document.querySelectorAll('.item span');
//Selects all children of element with 'item' class that are spans AND have class of completed
const itemCompleted = document.querySelectorAll('.item span.completed');

// QSA creates an array of elements, allowing forEach to assign an event listener to each along with specific functions outlined below.We do not use () in function calls because we don't want to invoke it prematurely.
Array.from(deleteBtn).forEach((element) => {
	element.addEventListener('click', deleteItem);
});
Array.from(item).forEach((element) => {
	element.addEventListener('click', markComplete);
});
Array.from(itemCompleted).forEach((element) => {
	element.addEventListener('click', markUnComplete);
});

// Async function
async function deleteItem() {
	//'this' means the deleteBtn, travel to parent (li), then to 2nd child(span) and select the innerText of that item
	const itemText = this.parentNode.childNodes[1].innerText;
	//try block
	try {
		//response variable waiting for return of a promise via fetch to deleteItem route
		const response = await fetch('deleteItem', {
			// specifies method for CRUD
			method: 'delete',
			// specifies type of content
			headers: { 'Content-Type': 'application/json' },
			// declare message content and turning it into a string and naming it 'itemFromJS'
			body: JSON.stringify({
				itemFromJS: itemText,
			}), // closing body
		}); // closing object
		const data = await response.json(); // assigning the response(parsed via json()) to a variable named 'data'
		console.log(data); // logging data to console
		location.reload(); // reload the page without a redirect
	} catch (err) {
		// if there is an error, pass it into catch block
		console.log(err); //console.log the error
	} //close
}
//Async function
async function markComplete() {
	//'this' means the span that is a child of an element with class 'item'
	// Travel up to <li>, then down to second node and assign the innerText of that element to itemText
	const itemText = this.parentNode.childNodes[1].innerText;
	//try block
	try {
		//Assigns a promise from a fetch to the /markComplete route
		const response = await fetch('markComplete', {
			// specifies method for CRUD
			method: 'put',
			// specifies content type as json
			headers: { 'Content-Type': 'application/json' },
			// specifies body of the request using
			body: JSON.stringify({
				// the innerText variable assigned above
				itemFromJS: itemText,
			}), //close
		}); //close
		// processes response via json() and assigns it to 'data'
		const data = await response.json();
		// logs the data
		console.log(data);
		// reload without redirect
		location.reload();
	} catch (err) {
		// catch block that passes in an error
		// logs error to console
		console.log(err);
	} // close
} // close
//Async function
async function markUnComplete() {
	//'this' means the span that is a child of an element with class 'item'
	// Travel up to <li>, then down to second node and assign the innerText of that element to itemText
	const itemText = this.parentNode.childNodes[1].innerText;
	// Open try block
	try {
		const response = await fetch('markUnComplete', {
			// specifies method for CRUD
			method: 'put',
			// specifies content type as json
			headers: { 'Content-Type': 'application/json' },
			// specifies body of the request using
			body: JSON.stringify({
				// Assigns itemText from above to 'itemFromJS' in body
				itemFromJS: itemText,
			}), // close
		}); // close
		// assigns response variable parsed via json() to data
		const data = await response.json();
		// logs data to console
		console.log(data);
		// reload page without redirect
		location.reload();
	} catch (err) {
		// opens catch block
		// logs error to the console
		console.log(err);
	} //close
} //close
