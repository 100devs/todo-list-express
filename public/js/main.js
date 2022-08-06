const deleteBtn = document.querySelectorAll('.fa-trash') //declare a variable and assigning it to all elements with a trashcan 
const item = document.querySelectorAll('.item span') //declare a variable and assigning it to all spans within the item class. so going to the item and just getting all the spans
const itemCompleted = document.querySelectorAll('.item span.completed') //declare a variable and assign it to a selection of spans that have the completed property , within an item parent.

Array.from(deleteBtn).forEach((element)=>{ //creating an array from the deleteBtn variable, and looping through each element
    element.addEventListener('click', deleteItem) //in each item, we are listening for clicks, and executing the deleteItem function if clicked.
}) //close our loop

Array.from(item).forEach((element)=>{ //creating an array from the item variable, and looping through each element
    element.addEventListener('click', markComplete) //in each item, we are listening for clicks, and calling the markComplete function if clicked.
})

Array.from(itemCompleted).forEach((element)=>{ //creating an array from the itemCompleted variable, and looping through each element
    element.addEventListener('click', markUnComplete) //in each item, we are listening for clicks, and calling the markUncomplete function if clicked ( adds an event listener but only to completed items)
}) //close the loop

async function deleteItem(){ //declaring an asychronous function
    const itemText = this.parentNode.childNodes[1].innerText //declares a variable that selects the innertext within the list span
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creating a response variable that waits on a fetch to go get data from a deletion
            method: 'delete', //sets the CRUD method used for the route (delete)
            headers: {'Content-Type': 'application/json'}, //sets the type of content expected which is JSON
            body: JSON.stringify({ //declare the messsage content being passed, and stringify that content. 
              'itemFromJS': itemText //setting the content of the body to the innertext of the li item, and naming it itemFromJS
            }) //close the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the data to the console
        location.reload() //refreshes the page - so that the updated db can be reflected (one item deleted)

    }catch(err){ //if an eror occurs, pass it into the catch method
        console.log(err) //log the error to the console.
    } //close catch bloick
} //close the function

async function markComplete(){ //declare an async function called markCOmplete
    const itemText = this.parentNode.childNodes[1].innerText //declare a variable selecting innertext within the span of the item
    try{ //start a try block 
        const response = await fetch('markComplete', { //declare a response variable that waits on a fetch to get data from the markComplete route
            method: 'put', //set an UPDATE request to update for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected (JSON)
            body: JSON.stringify({ //setting content of the message being passed to a string
                'itemFromJS': itemText //setting the content of the body and naming it itemfromJS
            })
          })
        const data = await response.json() // waiting on JSON from the response
        console.log(data) //console log the data
        location.reload() //reload the page to update what is displayed. 

    }catch(err){ //if an error occurs, send it to the catch block
        console.log(err) //log the error to the console. 
    }//close the catch block
} //end the function

async function markUnComplete(){ // //declare an asynch function called markUncomplete
    const itemText = this.parentNode.childNodes[1].innerText //declare a variable selecting innertext within the span of the item
    try{ //start a try block
        const response = await fetch('markUnComplete', { //create a response variable waiting on a fetch to get data from the result of the markUnCOmplete route
            method: 'put', //set an UPDATE request to update for the route
            headers: {'Content-Type': 'application/json'}, //specifying  the type of content expected (JSON)
            body: JSON.stringify({ // setting the content of the message being passed to a string 
                'itemFromJS': itemText//setting the content of rht body and naming it 'itemFromJS'
            }) //closing the body
          })//closing the object
        const data = await response.json() //waiting on the JSON from the response
        console.log(data) //console log the data
        location.reload() //reload the page to reflect the changes in the display

    }catch(err){ //if an error occurs, send it to the catch block
        console.log(err) //console log the error 
    }
}