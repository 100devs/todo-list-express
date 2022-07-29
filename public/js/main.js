// select all trash button and bind them to the deleteBtn variable
const deleteBtn = document.querySelectorAll('.fa-trash')
// select all class item followed by a span element and bind them to the item variable
const item = document.querySelectorAll('.item span')
// select all class item followed by a span with class completed and bind them to the itemCompleted variable
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from Html Collection deleteBtn add loop through each of them
Array.from(deleteBtn).forEach((element)=>{
	// add a click eventlistener to the element to delete it with the deleteItem function
    element.addEventListener('click', deleteItem)
})

// create an array from Html Collection item add loop through each of them
Array.from(item).forEach((element)=>{
	// add a click event listener to load markComplete function on click
    element.addEventListener('click', markComplete)
})

// create an array from Html Collection itemCompleted add loop through each of them
Array.from(itemCompleted).forEach((element)=>{
	// add a click event to this element and load the markUnComplete function
    element.addEventListener('click', markUnComplete)
})

// delete item asynchornously
async function deleteItem(){
	// get the content of first child of the parent item
    const itemText = this.parentNode.childNodes[1].innerText
    
	// if possible
	try{
		// wait for the deletion of the item
        const response = await fetch('deleteItem', {
			// tell the server what method will be use for this request
            method: 'delete',
			// tell the server what type will be use
            headers: {'Content-Type': 'application/json'},
			// tell the server what information will be send
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
		  
		// get the response from the server and add the result in a variable ( data ) 
        const data = await response.json()
		// show the result in the console
		console.log(data)
		// reload this page
        location.reload()

    }
	// if error
	catch(err){
		// show the error message in the console
        console.log(err)
    }
}

// asynchronous function to set the todo as complete
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
		// wait for the deletion of the item
        const response = await fetch('markComplete', {
			// tell the server what method will be use for this request
            method: 'put',
			// tell the server what type will be use
            headers: {'Content-Type': 'application/json'},
			// tell the server what information will be send
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
		  
		// get the response from the server and add the result in a variable ( data ) 
        const data = await response.json()
		// show the result in the console
		console.log(data)
		// reload this page
        location.reload()

    }
	// if error
	catch(err){
		// show the error message in the console
        console.log(err)
    }

}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
		// wait for the deletion of the item
        const response = await fetch('markUnComplete', {
			// tell the server what method will be use for this request
            method: 'put',
			// tell the server what type will be use
            headers: {'Content-Type': 'application/json'},
			// tell the server what information will be send
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
		  
		// get the response from the server and add the result in a variable ( data ) 
        const data = await response.json()
		// show the result in the console
		console.log(data)
		// reload this page
        location.reload()

    }
	// if error
	catch(err){
		// show the error message in the console
        console.log(err)
    }

}