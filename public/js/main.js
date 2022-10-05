const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a seclection of all elements with a class of the trash
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to any span tags inside a parent that has the item class
const itemCompleted = document.querySelectorAll('.item span.completed') // creating and assigning a variable to a selection of spans with a class of 'completed' inside of a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ //creating an array from all of the delete buttons and looping through each element
    element.addEventListener('click', deleteItem) //add an event listener to each delete button that runs deleteItem function
})//close loop

Array.from(item).forEach((element)=>{ //creating array from item and starting loop
    element.addEventListener('click', markComplete) //add event listener and run function markComplete
})//close loop

Array.from(itemCompleted).forEach((element)=>{ //creating array from itemCompleted and starting loop
    element.addEventListener('click', markUnComplete) //add event listener for only completed items and run function markUnComplete
})

async function deleteItem(){ //declare an async function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of data being sent
            body: JSON.stringify({ //declare the message content being passed and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            }) //closing body
          })//closing object
        const data = await response.json() //waiting on JSON from response
        console.log(data) //log result to console
        location.reload() //reload the page once complete to display updates

    }catch(err){ //if an error occurs–pass the error into the catch block
        console.log(err) //log error to console
    } //close catch block
} //end the function

async function markComplete(){ //declare async function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', //sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying type of data being sent
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text from the list item and naming it 'itemFromJS'
            }) //closing body
          }) //close object
        const data = await response.json() //waiting on JSON from response
        console.log(data) //log result to console
        location.reload() //reload page once complete to display updates

    }catch(err){ //if an error occurs–pass the error into the catch block
        console.log(err) //log the error to console
    } //close catch block
}//end the function

async function markUnComplete(){ //declare async function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //specifying type of data being sent
            method: 'put', //sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying type of data being sent
            body: JSON.stringify({ //declare the message content being passed and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text from the list item and name it 'itemFromJS'
            }) //closing body
          }) //close object
        const data = await response.json() //waiting on JSON from response
        console.log(data) //log result to console
        location.reload() //reload page once complete to display updates

    }catch(err){ //if an error occurs–pass the error into the catch block
        console.log(err) //log the error to console
    }//end catch block
}//end function block