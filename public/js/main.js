// select delete buttons for deleting todos
const deleteBtn = document.querySelectorAll(".fa-trash");

// select incomplete todos
const item = document.querySelectorAll(".item span");

// select complete todos
const itemCompleted = document.querySelectorAll(".item span.completed");

// create event listener on delete buttons
Array.from(deleteBtn).forEach((element) => {
	element.addEventListener("click", deleteItem);
});

// create event listener on incomplete todos
Array.from(item).forEach((element) => {
	element.addEventListener("click", markComplete);
});

// create event listener on complete todos
Array.from(itemCompleted).forEach((element) => {
	element.addEventListener("click", markUnComplete);
});

// this function sends a request to the server to delete a todo
async function deleteItem() {
	// goes up to the parent node and then back down to the second child (which contains the todo text) and gets the text
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		// sends a request to /deleteItem
		const response = await fetch("deleteItem", {
			// to delete
			method: "delete",
			// using a JSON object
			headers: { "Content-Type": "application/json" },
			// that contains the item text
			body: JSON.stringify({
				"itemFromJS": itemText,
			}),
		});
		// resolves the response
		const data = await response.json();
		// logs the result
		console.log(data);
		// reloads the page to update the todos that are shown
		location.reload();

		// catches any errors
	} catch (err) {
		console.log(err);
	}
}

// this function marks incomplete todos as complete
async function markComplete() {
	// gets the item text
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		// sends a request to /markComplete
		const response = await fetch("markComplete", {
			// to update
			method: "put",
			// with a JSON object
			headers: { "Content-Type": "application/json" },
			// that uses the item text
			body: JSON.stringify({
				"itemFromJS": itemText,
			}),
		});
		// log the result
		const data = await response.json();
		console.log(data);
		// reload the page
		location.reload();
		// cathes any error
	} catch (err) {
		console.log(err);
	}
}

// marks complete todos incomplete
async function markUnComplete() {
	// get item text
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		// send  update request with item text
		const response = await fetch("markUnComplete", {
			method: "put",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				"itemFromJS": itemText,
			}),
		});
		// log result
		const data = await response.json();
		console.log(data);
		// reload page
		location.reload();
		// catch errors
	} catch (err) {
		console.log(err);
	}
}
