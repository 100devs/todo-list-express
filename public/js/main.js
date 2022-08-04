//this document bascially just assigning a bunch of event listeners in their proper place. Sending stuff up to the server, and waiting to hear back


const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable called deleteBtn and assigning it to a selection of all elements with a class of trash icon
const item = document.querySelectorAll('.item span') //creating a variable called item and assigning it to all span tags inside of a parent that has a class of "item"

const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a seleciton of spans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //adding an event listener to the current item. we listen for a click, and then run the deleteItem function if there is a click. NOTE: If you put deleteItem(), it runs immediately. deleteItem waits to be executed
})


Array.from(item).forEach((element)=>{ //creating an array from our selection (a span with a parent with an class of item) and starting a loop
    element.addEventListener('click', markComplete) //adding an event listener to the current item. we listen for a click, and then run the markComplete function if there is a click
})

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection (spans with a class of completed with a parent of item) and starting a loop
    element.addEventListener('click', markUnComplete) //adding an event listener toONLY completed items
})



async function deleteItem(){ //we declare an asynchronous function! Which allows us to wait for the response of the function to arrive while other code can run outside
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //declaring try block
        const response = await fetch('deleteItem', {  //creates a response variable that waits on a fetch to get data from the result of deleteItem route -- starting an object as well
            method: 'delete', //tells the server we're setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON 
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText  //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
    
        const data = await response.json()  //waiting on JSON from the response
        console.log(data) //log data to console
        location.reload()  //refresh the page to update what is displayed (the deleted item)
    }catch(err){  //if an error occurs, pass the error into the catch block
        console.log(err) //log error to the console
    } //close the catch block
} //end the function

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText  //creates a response variable that waits on the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', {  //creates sa response variable that waits on a fetch to get data from the result of the markCompleteroute
            method: 'put',  //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},  //specifiyng the type of content expected -- JSON
            body: JSON.stringify({  //declare the message content being passed, and stringify that content
                'itemFromJS': itemText  //setting the content of the body to the inner text of the list item, and naming it "itemfromJS"
            }) //closing the body
          }) //closing the object
        const data = await response.json()  //waiting on JSON from the response to be converted
        console.log(data)  //log the result to the console
        location.reload()  //reloads the page to update what is displayed

    }catch(err){  //if an error occurs, pass the error into the catch block
        console.log(err) //log error to the console
    } //close the catch block
} //end the function

async function markUnComplete(){  //dec;are an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText  //looks inside of the list item and grabs only the inner text within the list
    try{  //stating a try block to do something
        const response = await fetch('markUnComplete', {  //creates a response variable that waits on a fetch to get data from the result of the markUncomplete route
            method: 'put',  //setting the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, //specifiyng the type of content expected -- JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemfromJS"
            }) //closing the body
          })  //closing the object
        const data = await response.json()  //waiting on JSON from the response to be converted
        console.log(data)  //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){  //if an error occurs, pass the error into the catch block
        console.log(err) //log error to the console
    } //close the catch block
} //end the function