//creating a variable deleteBtn that cannot be reassigned and assigning it to a selection of all elements with the class of .fa-trash and stores it in the variable
const deleteBtn = document.querySelectorAll('.fa-trash')
//creating a variable item that cannot be reassigned and assigning it to a selection of all elements with the class of .item and nested span elements (all span elements inside a parent that has a class of item) and stores it in the variable 
const item = document.querySelectorAll('.item span')
//creating a variable itemCompleted that cannot be reassigned and assigning it to a selection of all elements with the class of .item and nested span elements (all span elements inside a parent that has a class of item) with the class of .completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//creating an array from our selection and starting a loop
Array.from(deleteBtn).forEach((element)=>{
    //in each iteration of the loop, we are adding an event listener to the current item and listening for a click - on that click, we call the function deleteItem (no parentheses on the function ex. deleteItem() because if we did that, it would execute immediately instead of waiting for the click - this is a reference/callback rather than invoking the function immediately)
    element.addEventListener('click', deleteItem)
    //closing our loop
})

//creating an array from our selection and starting a loop
Array.from(item).forEach((element)=>{
    //in each iteration of the loop, we are adding an event listener to the current item and listening for a click - on that click, we call the function markComplete
    element.addEventListener('click', markComplete)
    //closing our loop
})

//creating an array from our selection and starting a loop
Array.from(itemCompleted).forEach((element)=>{
    //in each iteration of the loop, we are adding an event listener to the current item and listening for a click - on that click we call the function markUnComplete 
    element.addEventListener('click', markUnComplete)
    //closing our loop
})

//declaring an asynchronous function deleteItem()
async function deleteItem(){
    //creating a variable itemText that cannot be reassigned and looks inside of the list item to extract the text value only of the specified list item parentNode(ul).childNodes(li)[1](element 2 - span w/text).innerText
    const itemText = this.parentNode.childNodes[1].innerText
    //declaring a try block
    try{
        //creating a variable response that cannot be reassigned and waits on a fetch to get data from the result of the deleteItem route in server.js - starting an object
        const response = await fetch('deleteItem', {
            //declaring a method of delete - sets the CRUD method that we're using for the route
            method: 'delete',
            //specifying the type of content expected - JSON
            headers: {'Content-Type': 'application/json'},
            //declaring the message content being passed and turn that content into a string
            body: JSON.stringify({
              //setting the content of the body to the inner text of the list item and naming it itemFromJS
              'itemFromJS': itemText
              //closing the body 
            })
            //closing the object
          })
        //creating a variable data that cannot be reassigned and waiting on JSON from the response to be converted/parsed
        const data = await response.json()
        //logging the data to the console
        console.log(data)
        //reloads the page to update the DOM
        location.reload()
    //declaring a catch block - if an error occurs, pass the error into the catch block
    }catch(err){
        //logs error to the console
        console.log(err)
    //closing the catch block
    }
    //ending the function deleteItem()
}

//declaring an asynchronous function markComplete()
async function markComplete(){
      //creating a variable itemText that cannot be reassigned and looks inside of the list item to extract the text value only of the specified list item parentNode(ul).childNodes(li)[1](element 2 - span w/text).innerText
    const itemText = this.parentNode.childNodes[1].innerText
    //declaring a try block
    try{
         //creating a variable response that cannot be reassigned and waits on a fetch to get data from the result of the markComplete route in server.js - starting an object
        const response = await fetch('markComplete', {
            //declaring a method of put(/update) - sets the CRUD method that we're using for the route
            method: 'put',
            //specifying the type of content expected - JSON
            headers: {'Content-Type': 'application/json'},
             //declaring the message content being passed and turn that content into a string
            body: JSON.stringify({
                //setting the content of the body to the inner text of the list item and naming it itemFromJS
                'itemFromJS': itemText
            //closing the body
            })
          //closing the object
          })
        //creating a variable data that cannot be reassigned and waiting on JSON from the response to be converted/parsed
        const data = await response.json()
        //logging the data to the console
        console.log(data)
        //reloads the page to update the DOM
        location.reload()

    //declaring a catch block - if an error occurs, pass the error into the catch block
    } catch (err) {
        //logs error to the console
        console.log(err)
    //closing the catch block
    }
//closing the function markComplete()
}

//declaring asynchronous function markUnComplete
async function markUnComplete(){
     //creating a variable itemText that cannot be reassigned and looks inside of the list item to extract the text value only of the specified list item parentNode(ul).childNodes(li)[1](element 2 - span w/text).innerText
    const itemText = this.parentNode.childNodes[1].innerText
    //declaring try block
    try{
        //creating a variable response that cannot be reassigned and waits on a fetch to get data from the result of the markUnComplete route in server.js - starting an object
        const response = await fetch('markUnComplete', {
            //declaring a method of put(/update) - sets the CRUD method that we're using for the route
            method: 'put',
            //specifying te type of content expected - JSON
            headers: {'Content-Type': 'application/json'},
            //declaring the message content being passed and turn that content into a string
            body: JSON.stringify({
                //setting the content of the body to the inner text of the list item and naming it itemFromJS
                'itemFromJS': itemText
            //closing the body
            })
          //closing the object
          })
        //creating a variable data that cannot be reassigned and waiting on JSON from the response to be converted/parsed
        const data = await response.json()
        //logging the data to the console
        console.log(data)
        //reloads the page to update the DOM
        location.reload()

    //declaring a catch block - if an error occurs, pass the error into the catch block
    } catch (err) {
        //logs error to the console
        console.log(err)
    //closing the catch block
    }
//closing the function markUnComplete()
}