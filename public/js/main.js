
const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class of fa-trash. Selecting all trash can icons and assign it to this variable.//

const item = document.querySelectorAll('.item span')
//All spans withing a parent that has a class of item. Selecting a class of item and span tags associated with class item.  itemCompleted = true or false?

const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assignin git to a selectio of spans with a class of "completed" inside of a parent with a class of "item"//

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//creating an array from our selection and starting a loop.Add an event listener to current item that waits for a click.  once there is a click, it calls a function called "deleteItem//

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) //creating an array from our selection and starting a loop.  Selecting a span that has a parent class of "item".  adding an event listener that waits for a click then calls a function called "markComplete"

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})//creating an array from our selection and starting a loop.  Selecting a span that has a parent class of "itemCompleted".  Adds an event listener to only completed items.

async function deleteItem(){//declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs ony the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemsFromJs"
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){ //declaring an asynch function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs ony the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //declaring a response that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //setting the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemsFromJs"
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the results to the console
        location.reload() //reload the page to update what is displayed
 
    }catch(err){ //if an error occurs, pass the error into the catch
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markUnComplete(){ //declaring an asynch function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs ony the inner text within the list span.
    try{ //starting a try block to do something
        const response = await fetch('markUnComplete', { //declaring a response that waits on a fetch to get data from the result of the markUncomplete route
            method: 'put', // setting the CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify that content
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item, and naming it "itemsFromJs"
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //logging the data into the console
        location.reload() //reload the page to update what is displayed

    }catch(err){ //if an error occurs, pass the error into the catch
        console.log(err) //log the error into the console.
    } //close the catch block
} //end the function