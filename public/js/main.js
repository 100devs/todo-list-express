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

async function deleteItem() {
	const itemText = this.parentNode.childNodes[1].innerText;
	try {
		const response = await fetch('deleteItem', {
			method: 'delete',
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