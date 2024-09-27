// get all classes with .fa-trash to add a trash icon to
const deleteBtn = document.querySelectorAll('.fa-trash') 
// get all spans inside .item class to use for db searches
const item = document.querySelectorAll('.item span')
// get all spans that have .completed to set the class in the html for the css styling to strike through
const itemCompleted = document.querySelectorAll('.item span.completed')


// creates an array from the nodelist and add deleteItem event listeners to each
Array.from(deleteBtn).forEach((element)=>{ // Array.from 
    element.addEventListener('click', deleteItem)
})

// creates an array from the nodelist and add markComplete event listeners to each
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creates an array from the nodelist and add markUnComplete event listeners to each
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// 
async function deleteItem(){
    // this - object that was tied to event listener, 
	// parent node - parent of that object, childnode [1] - the span text
	const itemText = this.parentNode.childNodes[1].innerText 

	// error handling through a try catch
    try{
		//delete item is a route for the backend in the server.js and runs the deleteItem function
        const response = await fetch('deleteItem', { 
			// one of the four requests to the server and in this case is a delete
            method: 'delete', 
			// shows what type is being returned and in this case it is Json
            headers: {'Content-Type': 'application/json'}, 
            // wait for data to get returned from the backend
			body: JSON.stringify({ 
              'itemFromJS': itemText
            })
          })
		  
        const data = await response.json()
		// log the data we receive
        console.log(data)
		// reload the page and get request to populate new data
        location.reload()
		// if there was an error sending the delete request log to console the error
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
	// this - object that was tied to event listener, 
	// parent node - parent of that object, childnode [1] - the span text
    const itemText = this.parentNode.childNodes[1].innerText
	// error handling through a try catch
    try{
		//delete item is a route for the backend in the server.js and runs the deleteItem function
        const response = await fetch('markComplete', {
			// one of the four requests to the server and in this case is a put which is updating
            method: 'put',
			// shows what type is being returned and in this case it is Json
            headers: {'Content-Type': 'application/json'},
			// wait for data to get returned from the backend
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        const data = await response.json()
        console.log(data)
		//log the data we receive 
        location.reload()
		// if there was an error sending the put request log to console the error

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}