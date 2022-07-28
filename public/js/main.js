const deleteBtn = document.querySelectorAll('.fa-trash') // selects all elements with class of fa-trash and assigns it to the var deleteBtn
const item = document.querySelectorAll('.item span')// selects all span elements with class of item and assigns it to the var item
const itemCompleted = document.querySelectorAll('.item span.completed') // selects span elements with class of completed inside of 
//a parent with class completed, and assigns it to the const variable itemCompleted

Array.from(deleteBtn).forEach((element)=>{ //creates an array from selection and starts a loop
    element.addEventListener('click', deleteItem) //adds an event listener to the current item that waits for a click and then calls 
    //a function called deleteItem
}) //close our loop

Array.from(item).forEach((element)=>{  //creates an array from selection and starts a loop 
    element.addEventListener('click', markComplete)  //adds an event listener to the current item that waits for a click and then calls 
    //a function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{ //creates an array from selection and starts a loop 
    element.addEventListener('click', markUnComplete) //adds an event listener to the only Completed items
}) //close our loop

 
async function deleteItem(){ // declares asynchronous function deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item to extract the text value 
    //only of the specified list item
    try{ //declares a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch
            // to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},// specifies the type of content expected - JSON
            body: JSON.stringify({ // declares the message content, and turn that content into a string
              'itemFromJS': itemText // sets the content of the body to the inner text of the list item and naming it itemFromJs
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waits on JSON from the response to be converted
        console.log(data) //logs the data to the console
        location.reload() //refreshes the page

    }catch(err){ // if something went wrong, pass the error into catch block
        console.log(err) // logs the error to the console
    } //closes the catch block
} //ends the function

async function markComplete(){ // declares asynchronous function markComplete
    const itemText = this.parentNode.childNodes[1].innerText //  looks inside of the list item to extract the text value 
    //only of the specified list item
    try{ //declares a try block to do something
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch
            // to get data from the result of the markComplete route
            method: 'put', // sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},// specifies the type of content expected - JSON
            body: JSON.stringify({ // declares the message content, and turn that content into a string
                'itemFromJS': itemText // sets the content of the body to the inner text of the list item and names it itemFromJs
            }) //closes the body 
          }) //closes the object
        const data = await response.json()  //waits on JSON from the response to be converted
        console.log(data)//logs the data to the console
        location.reload()//refreshes the page
 
    }catch(err){// if something went wrong, pass the error into catch block
        console.log(err)  // logs the error to the console
    }//closes the catch block
}//ends the function

async function markUnComplete(){ // declares asynchronous function markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //  looks inside of the list item to extract the text value 
    //only of the specified list item
    try{//declares a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch
            // to get data from the result of the markUnComplete route
            method: 'put', // sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'}, // specifies the type of content expected - JSON
            body: JSON.stringify({ // declares the message content, and turn that content into a string
                'itemFromJS': itemText  // sets the content of the body to the inner text of the list item and names it itemFromJs
            })//closes the body 
          })//closes the object
        const data = await response.json() //waits on JSON from the response to be converted
        console.log(data) //logs the data to the console
        location.reload()//refreshes the page

    }catch(err){// if something went wrong, pass the error into catch block
        console.log(err) //logs the data to the console
    }//closes the catch block
}//ends the function