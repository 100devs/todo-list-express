const deleteBtn = document.querySelectorAll(".fa-trash");		         //get all trash can 
const item = document.querySelectorAll(".item span");		             //get all thing [items]
const itemCompleted = document.querySelectorAll(".item span.completed"); //get all completed items 

Array.from(deleteBtn).forEach((element) => {        //loop over all trash can on set and Listener for 'Click' Event
	element.addEventListener("click", deleteItem);  //delete item on click
});

Array.from(item).forEach((element) => {					//loop over all items not completed 
	element.addEventListener("click", markComplete);	//turn items to completed
});

Array.from(itemCompleted).forEach((element) => {		//loop over completed items
	element.addEventListener("click", markUnComplete);  //turn to uncompleted item
});

async function deleteItem() {								  //Async func to deleteItems with trash can icon
	const itemText = this.parentNode.childNodes[1].innerText; //get item Text 
	try {
		const response = await fetch("deleteItem", {
			method: "delete",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

async function markComplete() {
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		const response = await fetch("markComplete", {
			method: "put",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

async function markUnComplete() {
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		const response = await fetch("markUnComplete", {
			method: "put",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});
		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}
