const deleteBtn = document.querySelectorAll(".fa-trash"); //Creating a variable and assigning it all the element with class of fa-trash
const item = document.querySelectorAll(".item span"); //Creating a variable and assigning it all the span which is inside of the parent with class of "item"
const itemCompleted = document.querySelectorAll(".item span.completed"); //Creating a variable and assigning it all the span with class "completed" which is inside of the parent with class of "item"

//creating array of deleteBtn and looping on it
Array.from(deleteBtn).forEach((element) => {
	//Adding an eventlistener which is listening for a click and implement deleteItem Function when clicked
	element.addEventListener("click", deleteItem);
}); //closing foreach

//creating array of "item" and looping on it (only selecting items which is not completed and marking it complete)
Array.from(item).forEach((element) => {
	//Adding an eventlistener which is listening for a click and implement markComplete Function when clicked
	element.addEventListener("click", markComplete);
}); //closing foreach

//creating array of "itemCompleted" and looping on it  (only selecting items which is completed and marking it incomplete)
Array.from(itemCompleted).forEach((element) => {
	//Adding an eventlistener which is listening for a click and implement markUnComplete Function when clicked
	element.addEventListener("click", markUnComplete);
}); //closing foreach

//Declaring asynchronous function "deleteItem"
async function deleteItem() {
	const itemText = this.parentNode.childNodes[1].innerText; //Looks inside of list item and grabs only the innertext within the list span
	//declaring try block
	try {
		//creating a response variable which is waiting for fetch to get data from result of deleteItem route
		const response = await fetch("deleteItem", {
			//sets delete method for the fetch
			method: "delete",
			//specifying type of content expected which is json here
			headers: { "Content-Type": "application/json" },
			//declare message content being passed, and stringifying that content
			body: JSON.stringify({
				//setting the content of the body as innertext of the list item and naming it to "itemFromJS"
				itemFromJS: itemText,
			}), //Closing the the object
		}); //Closing the fetch
		const data = await response.json(); //waiting for the response and converting it to json
		console.log(data); //log the response to console
		location.reload(); //reloading the page
		//if an error occurs it is passed to catch block
	} catch (err) {
		console.log(err); //log the error to console
	} //close the fetch block
} //closing deleteItem function

//Declaring asynchronous function "markComplete"
async function markComplete() {
	const itemText = this.parentNode.childNodes[1].innerText; //Looks inside of list item and grabs only the innertext within the list span
	//declaring try block
	try {
		//creating a response variable which is waiting for fetch to get data from result of markComplete route
		const response = await fetch("markComplete", {
			//sets update method for the fetch
			method: "put",
			//specifying type of content expected which is json here
			headers: { "Content-Type": "application/json" },
			//declare message content being passed, and stringifying that content
			body: JSON.stringify({
				//setting the content of the body as innertext of the list item and naming it to "itemFromJS"
				itemFromJS: itemText,
			}), //Closing the the object
		}); //Closing the fetch
		const data = await response.json(); //waiting for the response and converting it to json
		console.log(data); //log the response to console
		location.reload(); //reloading the page
		//if an error occurs it is passed to catch block
	} catch (err) {
		console.log(err); //log the error to console
	} //close the fetch block
} //closing markComplete function

//Declaring asynchronous function "markUnComplete"
async function markUnComplete() {
	const itemText = this.parentNode.childNodes[1].innerText; //Looks inside of list item and grabs only the innertext within the list span
	//declaring try block
	try {
		//creating a response variable which is waiting for fetch to get data from result of markUnComplete route
		const response = await fetch("markUnComplete", {
			//sets update method for the fetch
			method: "put",
			//specifying type of content expected which is json here
			headers: { "Content-Type": "application/json" },
			//declare message content being passed, and stringifying that content
			body: JSON.stringify({
				//setting the content of the body as innertext of the list item and naming it to "itemFromJS"
				itemFromJS: itemText,
			}), //Closing the the object
		}); //Closing the fetch
		const data = await response.json(); //waiting for the response and converting it to json
		console.log(data); //log the response to console
		location.reload(); //reloading the page
		//if an error occurs it is passed to catch block
	} catch (err) {
		console.log(err); //log the error to console
	} //close the fetch block
} //closing markUnComplete function
