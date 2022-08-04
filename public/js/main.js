const deleteBtn = document.querySelectorAll('.fa-trash')
// creating a variable and assigning it to a selection of all elements with the class of fa-trash 
const item = document.querySelectorAll('.item span')
// creating a variable item and assigning it to a selection of all elements with a class of item and element span 

const itemCompleted = document.querySelectorAll('.item span.completed')
//creating a variable of itemCompleted and we are selecting all of the elements with a class of item with a span also with the completed class 

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Creating an array from the delete button then applying forEach method  on the element and adding an event listener to each deleteBtn that will run deleteItem when clicked on 

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Creating array and starting a loop and selecting span  that has parent class of item then add an event listener for each of the elements when clicked will run the function markComplete 

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// Creating array from itemCompleted then we are using forEach to apply an eventlistener that will run the markUncomplete function 

async function deleteItem(){ // declaring an async function of deleteItem, it will help and allow to change the flow of execution 
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list and only grabs the inner text within the list span 
    try{ // declaring a try block 
        const response = await fetch('deleteItem', {  // declaring a variable response -> that waits on a fetch to get data from the result of the deleteItem route 
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying type of content expected, which is JSON 
            body: JSON.stringify({ // declare the message content being passed, and stringify that content  
              'itemFromJS': itemText //setting the content of the body, to the inner text of the list item, and naming it itemFromJS
            })
          })
        const data = await response.json() // waiting for server to respond with JSON 
        console.log(data) // logging the data to the console
        location.reload() //refreshing the page 

    }catch(err){ // run this if there is an error 
        console.log(err) // console log the error 
    } // close the catch 
}// end the function 

async function markComplete(){ // declaring an async function here
    const itemText = this.parentNode.childNodes[1].innerText // this looks inside the list item and grabs only the inner text within the list 
    try{// declaring a try block 
        const response = await fetch('markComplete', { // declaring a variable response -> that waits on a fetch to get data from the result of the markComplete route 
            method: 'put', // means update, in this case we are setting the crud method to update for the route 
            headers: {'Content-Type': 'application/json'}, //specifying type of content expected, which is JSON 
            body: JSON.stringify({  // declare the message content being passed, and stringify that content  
                'itemFromJS': itemText //setting the content of the body, to the inner text of the list item, and naming it itemFromJS
            })
          })
        const data = await response.json() // waiting for server to respond with JSON 
        console.log(data) // logging the data to console
        location.reload() //refresh the page 

    }catch(err){ //if an error occurs, pass the error into the catch 
        console.log(err) // log the error to the console
    } // close catch block
} //

async function markUnComplete(){   // declaring an async function here
    const itemText = this.parentNode.childNodes[1].innerText // this looks inside the list item and grabs only the inner text within the list 
    try{ // declaring a try block 
        const response = await fetch('markUnComplete', {  // declaring a variable response -> that waits on a fetch to get data from the result of the markUNComplete route  
            method: 'put', // Here we are specifying the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, // Specifying type of content expected, which is JSON
            body: JSON.stringify({ //  declare the message content being passed and stringify content
                'itemFromJS': itemText  // setting content of the body, to the inner text of the list item and naming it from itemFrom 
            })
          })
          const data = await response.json() // waiting for server to respond with JSON 
          console.log(data) // logging the data to console
          location.reload() //refresh the page 

        }catch(err){ //if an error occurs, pass the error into the catch 
            console.log(err) // log the error to the console
        } // close catch block
    
}