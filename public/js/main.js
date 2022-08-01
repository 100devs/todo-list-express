//* variable declaration
const deleteBtn = document.querySelectorAll('.fa-trash') //! declaring a variable that holds the value of all of the trash can icons
const item = document.querySelectorAll('.item span') //! declaring a variable that holds the value of all span tags within an element that has a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') //! declaring a variable that holds the value of all spans with a class of completed within an element with a class of item

//* creates arrays, loops them, and adds click event listeners that call a function to each item in the array
Array.from(deleteBtn).forEach((element) => {
	//*! creates an array from the value of the variable deleteBtn and loops through each item in that array
	element.addEventListener('click', deleteItem) //! for each element in the array, add a click smurf that will call the delete item function when he hears his click
}) //! end the loop

Array.from(item).forEach((element) => {
	//! creates an array from the value of the variable item and loops through each item in that array
	element.addEventListener('click', markComplete) //! for each element in the array, add click smurf that will call the markComplete function when he hears his click
}) //! end the loop

Array.from(itemCompleted).forEach((element) => {
	//! creates an array from the value of the variable itemCompleted and loops through each item in that array
	element.addEventListener('click', markUnComplete) //! for each element in the array, add a click smurf that will call the markUnComplete function when he hears his click
}) //! end the loop

//* function to remove todo and refresh the page
async function deleteItem() {
	//! declares an async function named deleteItem
	const itemText = this.parentNode.childNodes[1].innerText //! creates a response variable itemText that holds the value of the second child nodes(the span within the list item) inner text
	try {
		//! opens the try portion of a try/catch block
		const response = await fetch('deleteItem', {
			//! creates a variable that holds the content of the server response when the /deleteItem route is called
			method: 'delete', //! lets the server know that this is a delete request (aka deeleetaay)
			headers: { 'Content-Type': 'application/json' }, //! sets the headers for the fetch request - ie: tells the server that content type should be in the json format
			body: JSON.stringify({
				//! calls the JSON.stringify method on the body of the content being returned from the server
				itemFromJS: itemText, //! sets the body of the content to itemFromJS, which has the value of itemText
			}), //! closes the JSON.stringify method
		}) //! closes the fetch request
		const data = await response.json() //! creates a variable named data to hold the value of the server response
		console.log(data) //! logs the server response aka data to the console
		location.reload() //! reloads the current page
	} catch (err) {
		//! opens the catch portion of the try/catch block and passes in err aka error
		console.log(err) //! logs the value of err to the conosle
	} //! closes the catch block
} //! closes the deleteItem function

//* function to mark a todo complete and refresh the page
async function markComplete() {
	//! declares an async function named markComplete
	const itemText = this.parentNode.childNodes[1].innerText //! creates a variable itemText that holds the value of the second child nodes(the span within the list item) inner text
	try {
		//! opens the try portion of a try/catch block
		const response = await fetch('markComplete', {
			//! creates a response variable that holds the content of the server response when the /markComplete route is hit
			method: 'put', //! lets the server know that this is a put request (aka update)
			headers: { 'Content-Type': 'application/json' }, //! sets the headers for the fetch request - ie: tells the server that content type should be in the json format
			body: JSON.stringify({
				//! calls the JSON.stringify method on the body of the content being returned from the server
				itemFromJS: itemText, //! sets the body of the content to itemFromJS, which has the value of itemText
			}), //! closes the JSON.stringify method
		}) //! closes the fetch request
		const data = await response.json() //! creates a variable named data to hold the value of the server response
		console.log(data) //! logs the server response object aka data to the console
		location.reload() //! refreshes the page
	} catch (err) {
		//! opens the catch portion of the try/catch block and passes in err aka error
		console.log(err) //! logs the value of err to the conosle
	} //! closes the catch block
} //! closes the markComplete function

//* function to mark a todo incomplete and respond to the server
async function markUnComplete() {
	//! declares an async function named markUnComplete
	const itemText = this.parentNode.childNodes[1].innerText //! creates a variable itemText that holds the value of the second child nodes(the span within the list item) inner text
	try {
		//! opens the try portion of a try/catch block
		const response = await fetch('markUnComplete', {
			//! creates a response variable that holds the content of the server response when the /markComplete route is hit
			method: 'put', //! lets the server know that this is a put request (aka update)
			headers: { 'Content-Type': 'application/json' }, //! sets the headers for the fetch request - ie: tells the server that content type should be in the json format
			body: JSON.stringify({
				//! calls the JSON.stringify method on the body of the content being returned from the server
				itemFromJS: itemText, //! sets the body of the content to itemFromJS, which has the value of itemText
			}), //! closes the JSON.stringify method
		}) //! closes the fetch request
		const data = await response.json() //! creates a variable named data to hold the value of the server response
		console.log(data) //! logs the server response object aka data to the console
		location.reload() //! reloads the page
	} catch (err) {
		//! opens the catch portion of the try/catch block and passes it err aka error
		console.log(err) //! logs the value of err to the console
	} //! closes the catch block
} //! closes the markUnComplete function
