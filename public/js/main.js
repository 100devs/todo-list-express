// selects all elements with the class of '.fa-trash' and assigns them to a varibale
const deleteBtn = document.querySelectorAll('.fa-trash')

// selects all elements with the classes of '.item span' and assigns them to a varibale
const item = document.querySelectorAll('.item span')

// selects all elements with classes of '.item span.completed' and assigns them to a varibale
const itemCompleted = document.querySelectorAll('.item span.completed')

// creates an array form the elements in deleteBtn and gives them a event listener by looping through them
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// creates array from item and adds event listeners to each elemen by looping through them
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creates array from itemCompleted and adds event listeners to each element by looping through them
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


async function deleteItem(){ // declaring a asyncronous function  
    const itemText = this.parentNode.childNodes[1].innerText // looks inside current item to extract the text value only of the specified list item
    
    try{ // starting a try block to do something
        const response = await fetch('deleteItem', { // declaring a variable that waits on fetch to get data from the reslult of deleteItem
            method: 'delete', // sets the CRUD meothod for the route
            headers: {'Content-Type': 'application/json'}, // specify the typeof content expected, which is JSON
            body: JSON.stringify({ // delcare the message content being passed and stringify that content
              'itemFromJS': itemText // passing our declared variable to the content of the body and naming it 'itemFromJS'
            }) // closing body
          }) // closing the object
        const data = await response.json() // declare a variable data that waits for respond from server then converting it to json
        console.log(data) // logs data to the console
        location.reload() // reloads the page to update what is diplayed

    }catch(err){ // catch block that accepts an error as a parameter if there's one
        console.log(err) // log error to console
    } // close catch block
}

async function markComplete(){ // declare a asyncronous function 
    const itemText = this.parentNode.childNodes[1].innerText // declare variable with text from specified node child form current parent
    try{ // start try block
        const response = await fetch('markComplete', { // declare varibale that fetches data from 'markCompleted'
            method: 'put', // setst the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected, which is json
            body: JSON.stringify({ // stringify the contents of the body
                'itemFromJS': itemText // pass the itemText variable to the body of the response
            })
          })
        const data = await response.json() // declare variable that waits for server to respond, convert response to json
        console.log(data) // log data to the console
        location.reload() // reload the page to update what is been displayed

    }catch(err){ // catch block that accepts an error as a parameter
        console.log(err) // log the error to the console
    } // end of catch block
} // end of function

async function markUnComplete(){  // declare a asyncronous function 
    const itemText = this.parentNode.childNodes[1].innerText // declare variable with text from specified node child form current parent
    try{ // start try block
        const response = await fetch('markUnComplete', { // declare varibale that fetches data from 'markCompleted'
            method: 'put', // setst the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specify the type of content expected, which is json
            body: JSON.stringify({ // stringify the contents of the body
                'itemFromJS': itemText // pass the itemText variable to the body of the response
            }) 
          })
        const data = await response.json() // declare variable that waits for server to respond, convert response to json
        console.log(data) // log data to the console
        location.reload() // reload the page to update what is been displayed

    }catch(err){ // catch block that accepts an error as a parameter
        console.log(err) // log the error to the console
    } // end of catch block
} // end of function