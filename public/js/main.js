const deleteBtn = document.querySelectorAll('.fa-trash') // creating variable and assinging it to a selection of all elements with a class of the trash can
const item = document.querySelectorAll('.item span') //creating variable and assignin it to a selection of span tags inside of a parent that has a class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') // creating variable and assignin it to a selection of spans with a class of 'completed'inside a parent with a class of 'item'

//creating an array from our 'deleteBtn' const selection and starting a loop;
// add an event listener to the current element that waits for a click, and calls a function called deleteItem when clicked
// close our loop
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//creating an array from our 'item' const selection and starting a loop
// add an event listener to the current element that waits for a click, and calls a function called markComplete when clicked
// close our loop
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//creating an array from our 'itemCompleted' const selection and starting a loop
// add an event listener to the current element that waits for a click, and calls a function called markUnComplete when clicked
// close our loop
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){  //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span (mayanwolfe)
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { // creates a response variable that waits on a fetch to get data from the result of deleteItem and then starts an object
            method: 'delete', // declaring a method of delete (crud method for the route)
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is json
            body: JSON.stringify({ // declare the message content being passed, and turn it into a string
              'itemFromJS': itemText // setting the content of the body to the innerText of the list item, and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on json from the response to be converted, and assigning it to const data
        console.log(data) // log data to console
        location.reload() // reloads the page to update what's displayed

    }catch(err){ // if error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close the fetch block
} // end the function

async function markComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span (mayanwolfe)
    try{ //starting a try block to do something
        const response = await fetch('markComplete', {  // creates a response variable that waits on a fetch to get data from the result of markComplete and then starts an object
            method: 'put', // declaring a method of put (crud method for the route)
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is json
            body: JSON.stringify({ // declare the message content being passed, and turn it into a string
                'itemFromJS': itemText // setting the content of the body to the innerText of the list item, and naming it itemFromJS
            }) // closing the body
          }) // closing the object
        const data = await response.json() // waiting on json from the response to be converted, and assigning it to const data
        console.log(data) // log data to console
        location.reload() // reloads the page to update what's displayed

      }catch(err){ // if error occurs, pass the error into the catch block
          console.log(err) // log the error to the console
      } // close the fetch block
    } // end the function

async function markUnComplete(){ //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span (mayanwolfe)
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { // creates a response variable that waits on a fetch to get data from the result of markUnComplete and then starts an object
            method: 'put', // declaring a method of put (crud method for the route)
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is json
            body: JSON.stringify({ // declare the message content being passed, and turn it into a string
                'itemFromJS': itemText // setting the content of the body to the innerText of the list item, and naming it itemFromJS
              }) // closing the body
            }) // closing the object
        const data = await response.json() // waiting on json from the response to be converted, and assigning it to const data
        console.log(data) // log data to console
        location.reload() // reloads the page to update what's displayed

      }catch(err){ // if error occurs, pass the error into the catch block
          console.log(err) // log the error to the console
      } // close the fetch block
    } // end the function
