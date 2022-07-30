// variable that targets all elements within the DOM that have the 'fa-trash' class
const deleteBtn = document.querySelectorAll('.fa-trash')
// variable that targets all <span> tags WITHIN a parent that as the 'item' class
const item = document.querySelectorAll('.item span')
// variable that targets all <span> tags with the class of 'completed' WITHIN a parent class of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from the deleteBtn variable results, add 'click' event listener that calls the function 'deleteItem'
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// create an array from the item variable results, add 'click' event listenener that calls the function 'markComplete'
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// create an array from the item variable results with <span> tags classed 'completed'
// add 'click' event listener that calls the function 'markUnomplete' 
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Declare asynchronous function
async function deleteItem(){
    // traverse the DOM to the parent node and isolate inner text within the list span
    const itemText = this.parentNode.childNodes[1].innerText

    // start a try block to do something
    try{ 
        // create a response variable that waits on fetch to grab data from the result of 'deleteItem' route
        const response = await fetch('deleteItem', {
            method: 'delete', // sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected, JSON
            body: JSON.stringify({ // declare message content passed in, stringify that content
              'itemFromJS': itemText // set the content of the body to the innerText of the list item, naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        
        const data = await response.json() // await response to parse json data
        console.log(data) // log resulting data to console
        location.reload() // reload page to update after 
  
      
      }catch(err) { // if an error occurs, pass the error into the catch block
          console.log(err) // log the error to the console
      } // close catch block
}

// Declare asynchronous function
async function markComplete(){
    // traverse the DOM to the parent node and get text inside first <span> element
    const itemText = this.parentNode.childNodes[1].innerText

    // start a try block to do something
    try{
        // create a response variable that waits on fetch to grab data from the result of 'markComplete' route
        const response = await fetch('markComplete', {
            method: 'put', // sets CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected, JSON
            body: JSON.stringify({ // declare message content passed in, stringify that content
                'itemFromJS': itemText // set the content of the body to the innerText of the list item, naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object
        
        const data = await response.json() // await response to parse json data
        console.log(data) // log resulting data to console
        location.reload() // reload page to update after 

    
    }catch(err) { // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close catch block
}

// Declare asynchronous function
async function markUnComplete(){
    // traverse the DOM to the parent node and get text inside first <span> element
    const itemText = this.parentNode.childNodes[1].innerText

    // start a try block to do something
    try{
        // create a response variable that waits on fetch to grab data from the result of 'markUnComplete' route
        const response = await fetch('markUnComplete', {
            method: 'put', // sets CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected, JSON
            body: JSON.stringify({ // declare message content passed in, stringify that content
                'itemFromJS': itemText // set the content of the body to the innerText of the list item, naming it 'itemFromJS'
            }) // closing the body
          }) // closing the object

    const data = await response.json() // await response to parse json data
    console.log(data) // log resulting data to console
    location.reload() // reload page to update after 

    
    }catch(err) { // if an error occurs, pass the error into the catch block
        console.log(err) // log the error to the console
    } // close catch block
}
