const deleteBtn = document.querySelectorAll('.fa-trash') //Creates new variable refering to all of the objects with the class 'fa-trash'
const item = document.querySelectorAll('.item span') //Creates new variable refering to all of the span tags within a parent with the class 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') //Creates new variable refering to all of the objects named span tags with the class 'completed' within a parent with the class 'item'

Array.from(deleteBtn).forEach((element)=>{ //Create an array of all the deleteBtn items and do the following to each of them
    element.addEventListener('click', deleteItem) //Add an event listener to the element that activates when the object is clicked on and runs the function 'deleteItem'
}) //Close the loop

Array.from(item).forEach((element)=>{ //Create an array of all the item items and do the following to each of them
    element.addEventListener('click', markComplete) //Add an event listener to the element that activates when the object is clicked on and runs the function 'markComplete'
}) //Close the loop

Array.from(itemCompleted).forEach((element)=>{ //Create an array of all the itemCompleted items and do the following to each of them
    element.addEventListener('click', markUnComplete) //Add an event listener to the element that activates when the object is clicked on and runs the function 'markUnComplete'
}) //Close the loop

async function deleteItem(){ //Declare and asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //Creates a variable that selects the inner text of the 2nd child of the parent of the specified item 'this'
    try{//Starting a try block. (Means: Try to do something, but if an error occurs, do something else)
        const response = await fetch('deleteItem', { //Creates a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', //We are trying to delete something
            headers: {'Content-Type': 'application/json'}, //The content expected in JSON
            body: JSON.stringify({ //The content being passed, stringify that content
              'itemFromJS': itemText //Setting the content of the body to the inner text(the variable we declared earlier) of the list item and naming it 'itemFromJS'
            })//Close the body
          })//Close the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the eroror into the catch block
        console.log(err) //Log the erro to the console
    }//Close the catch block
}//End the function

async function markComplete(){ //declare an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //Creates a variable that selects the inner text of the 2nd child of the parent of the specified item 'this'
    try{ //Starting a try block. (Means: Try to do something, but if an error occurs, do something else)
        const response = await fetch('markComplete', { //Creates a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', //We are using update as the route
            headers: {'Content-Type': 'application/json'}, //The content expected in JSON
            body: JSON.stringify({ //The content being passed, stringify that content
                'itemFromJS': itemText //Setting the content of the body to the inner text(the variable we declared earlier) of the list item and naming it 'itemFromJS'
            }) //Close body
          }) //Close the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the eroror into the catch block
        console.log(err) //Log the erro to the console
    } //Close the catch block
} //End the function

async function markUnComplete(){ //declare an asyncronous function
    const itemText = this.parentNode.childNodes[1].innerText //Creates a variable that selects the inner text of the 2nd child of the parent of the specified item 'this'
    try{ //Starting a try block. (Means: Try to do something, but if an error occurs, do something else)
        const response = await fetch('markUnComplete', { //Creates a response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', //We are using update as the route
            headers: {'Content-Type': 'application/json'}, //The content expected in JSON
            body: JSON.stringify({ //The content being passed, stringify that content
                'itemFromJS': itemText //Setting the content of the body to the inner text(the variable we declared earlier) of the list item and naming it 'itemFromJS'
            }) //Close body
          }) //Close the object
        const data = await response.json() //Waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //If an error occurs, pass the eroror into the catch block
        console.log(err)  //Log the erro to the console
    } //Close the catch block
} //End the function