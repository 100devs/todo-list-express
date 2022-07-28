//* dom manipulation
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//* loops the todos and puts an event listener on the deleteBtn that will run deleteItem when clicked
Array.from(deleteBtn).forEach((element) => {
	element.addEventListener('click', deleteItem)
})

//* loops the todos and runs markComplete
Array.from(item).forEach((element) => {
	element.addEventListener('click', markComplete)
})

//* loops the todos and runs markUncomplete
Array.from(itemCompleted).forEach((element) => {
	element.addEventListener('click', markUnComplete)
})

//* function to remove todo
async function deleteItem() {
	const itemText = this.parentNode.childNodes[1].innerText
	try {
		const response = await fetch('deleteItem', {
			//* sends the response and info the server
			method: 'delete',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		})
		const data = await response.json()
		console.log(data)
		location.reload()
	} catch (err) {
		console.log(err)
	}
}

//* function to mark a todo complete and respond to the server
async function markComplete() {
	const itemText = this.parentNode.childNodes[1].innerText
	try {
		const response = await fetch('markComplete', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		})
		const data = await response.json()
		console.log(data)
		location.reload()
	} catch (err) {
		console.log(err)
	}
}

//* function to mark a todo incomplete and respond to the server
async function markUnComplete() {
	const itemText = this.parentNode.childNodes[1].innerText
	try {
		const response = await fetch('markUnComplete', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		})
		const data = await response.json()
		console.log(data)
		location.reload()
	} catch (err) {
		console.log(err)
	}
}
