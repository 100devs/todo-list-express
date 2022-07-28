const deleteBtn = document.querySelectorAll('.fa-trash') // A variable for grabbing the trash class from the dom
const item = document.querySelectorAll('.item span') // A vaiable for grabbing the span item from the dom
const itemCompleted = document.querySelectorAll('.item span.completed') // A variable for grabbing the span that involves the completed number from the dom

Array.from(deleteBtn).forEach((element)=>{ // Creates an array for each delete button
    element.addEventListener('click', deleteItem) // To each delete button, we add an event listener that will respond to a "click" with the deleteItem function
})

Array.from(item).forEach((element)=>{ // Creates an array for each item 
    element.addEventListener('click', markComplete) // To each item, will run the "markComplete" function when clicked
})

Array.from(itemCompleted).forEach((element)=>{ // Creates an array for each itemCompleted
    element.addEventListener('click', markUnComplete) // To each itemCompleted, will run the "markUncomplete" function when clicked
})

async function deleteItem(){ // This is the deleteItem function, it will run asynchronously
    const itemText = this.parentNode.childNodes[1].innerText // Whatever item that was clicked, we will zoom out one level and grab the parent container, then zoom back down a level and grab the text of the item that was clicked
    try{
        const response = await fetch('deleteItem', { // This is the response that will happen, it will fetch the deleteItem route
            method: 'delete', // this is type of request 
            headers: {'Content-Type': 'application/json'}, // The request will be made using json format
            body: JSON.stringify({ // The body of the request is in json
              'itemFromJS': itemText // The thing that will be deleted is whatever matches this property here
            })
          })
        const data = await response.json() // Tells the response to be returned in json format
        console.log(data) // Will console log the response
        location.reload() // Refreshes the page

    }catch(err){
        console.log(err) // If the deletion could not occur, an error will log into the console
    }
}

async function markComplete(){ // This is the markComplete function
    const itemText = this.parentNode.childNodes[1].innerText // Same idea as delete function above where it grabs the text of what was selected
    try{
        const response = await fetch('markComplete', { // This will make a markComplete put request to the server
            method: 'put', // This tells the app that it's a put request
            headers: {'Content-Type': 'application/json'}, // The content of the request will be in json format
            body: JSON.stringify({ // This is setting the format to json
                'itemFromJS': itemText // This is the identifying factor so the database knows what to delete (it matches what was grabbed from line 36)
            })
          })
        const data = await response.json() // Sets "data" variable as the response in json format
        console.log(data) // Console logs the data
        location.reload() // Refreshes the page

    }catch(err){ // If there is an error that occurs... 
        console.log(err) // ... an error will be logged in the console
    }
}

async function markUnComplete(){ // This is the markUncomplete function
    const itemText = this.parentNode.childNodes[1].innerText //Same idea as delete function above where it grabs the text of what was selected
    try{
        const response = await fetch('markUnComplete', { // This will make a markUncomplete put request to the server
            method: 'put',// This tells the app that it's a put request
            headers: {'Content-Type': 'application/json'}, // The content of the request will be in json format
            body: JSON.stringify({ // This is setting the format to json
                'itemFromJS': itemText // This is the identifying factor so the database knows what to delete (it matches what was grabbed from line 56)
            })
          })
        const data = await response.json() // Sets "data" variable as the response in json format
        console.log(data) // Console logs the data
        location.reload() // Refreshes the page

    }catch(err){ // If there is an error that occurs... 
        console.log(err) // ... an error will be logged in the console
    }
}