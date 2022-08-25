const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and selecting all elements with the class fa-trash
const item = document.querySelectorAll('.item span') // creting a variable and assigning it to a selection of span tags inside of a parent that has a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // creting a variable and assigning it to a selection of spans with a class of 'completed' inside of  a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) // adding an event listener to the current item that waits for a click then calls a function called deleteItem
}) //close loop

Array.from(item).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // adding an event listener to the current item that waits for a click then calls a function called markComplete
}) //close loop

Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // adding an event listener to the current item that waits for a click then calls a function called markUncomplete
}) //close loop

async function deleteItem(){ //declare async function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list intem to extract the etext value only of the specified list item
    try{ //starting a try block
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of deleteItem 
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // Specifying the type of content expected which is JSON
            body: JSON.stringify({ //declare the message content stringify that content
              'itemFromJS': itemText // setting the content of the body to the inner text of the list item and naming it 'itemFromJs'
            }) //close body
          }) //close object
        const data = await response.json() //waiting on JSOn from response
        console.log(data) // console logging the data from the function
        location.reload() //reload the page data

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // log error to console
    } //close block
} //end function

async function markComplete(){ //declare async function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside list item and only grabs inner text from the item
    try{ // opening of try block
        const response = await fetch('markComplete', { // creates a response variable that waits on a fetch to get data from result of the markComplete route
            method: 'put', // Sets the crud method for the route
            headers: {'Content-Type': 'application/json'}, // Specifying type of content expected which is JSON
            body: JSON.stringify({ // declare message content and stringify the content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJs'
            }) //close body
          }) //close object
        const data = await response.json() //waiting on JSON from response
        console.log(data) // console log the data from the function
        location.reload() // reload the page data

    }catch(err){ //if an error occurs, pass the error into the catch block
        console.log(err) // log error to console
    } //close block
} //end function

async function markUnComplete(){ //declare async function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside list item and only grabs inner text from the item
    try{  // opening of try block
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from result of the markComplete route
            method: 'put', // Sets the crud method for the route
            headers: {'Content-Type': 'application/json'}, // Specifying type of content expected which is JSON
            body: JSON.stringify({ // declare message content and stringify the content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it 'itemFromJs'
            }) //close body
          }) //close object
        const data = await response.json() //waiting on JSON from response
        console.log(data) // console log the data from the function
        location.reload() // reload the page data

    }catch(err){ //pass error to error block
        console.log(err) // log error to console
    } //close catch
} //close function