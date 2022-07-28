const deleteBtn = document.querySelectorAll('.fa-trash') //creates variable and assigns it to a selection of all elements with a class of .fa-trash
const item = document.querySelectorAll('.item span') //creates variable to select all the spans within the class item in the ejs file
const itemCompleted = document.querySelectorAll('.item span.completed') //creates variable for items with the class completed

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //adds an event listener to the current item and waits for a click and then calls the deleteItem function
})
Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //adds an event listener to the current item and waits for a click and then calls the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items and waits for a click and then calls the markUnComplete function
})

async function deleteItem(){ //declares async function deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //assigns a variable itemText to the innerText of the li, to the itemText constant
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //set the delete method to the route
            headers: {'Content-Type': 'application/json'}, // sets content-type to JSON
            body: JSON.stringify({ //parses JSON into a string
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })
          })
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log data to console
        location.reload() //refresh page to update what is displayed

    }catch(err){
        console.log(err) //catches errors and console logs
    }
}

async function markComplete(){ //declares async function markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{
        const response = await fetch('markComplete', { //uses the route markComplete from the server.js
            method: 'put', //sets the put method to update for the route
            headers: {'Content-Type': 'application/json'}, //specifies type of content, JSON
            body: JSON.stringify({ //parses the JSON into a string
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })
          })
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log data to console
        location.reload() //refresh

    }catch(err){
        console.log(err) //catches errors and console logs
    }
}

async function markUnComplete(){ //declares async function markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //assigns a variable itemText from the ul.li innertext
    try{
        const response = await fetch('markUnComplete', { //uses the route markComplete from the server.js
            method: 'put', //uses the put method to update
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //parses the JSON into a string
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })
          })
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log data to console
        location.reload() //refresh

    }catch(err){
        console.log(err) //catches errors and console logs
    }
}