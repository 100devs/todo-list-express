const deleteBtn = document.querySelectorAll('.fa-trash') //declaring a variable and assigning it to a selection of all elemen ts with a class of the trash can
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags inside of a parent that have a class of item
const itemCompleted = document.querySelectorAll('.item span.completed') // declaring a variable and assigning it to a selection of span tags with a class of completed of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //creating an array from our selection and starting a loop, adding a click event listener to each deletebtn. calls a function called delete item
}) //close loop

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // creating an array from our selection and starting a loop, adding a click event listener to each item. calls a function called mark comeplete
}) //close loop

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //creates an array from our selection and starts a loop, adding a click event listener to each item. calls a function called mark uncomplete
}) //close loop

async function deleteItem(){ //declaring an async function. allows us to rearrange the flow of the execution. waits for response to run
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block (does something)
        const response = await fetch('deleteItem', { //creating a response variable that waits on a fetch to get data from the result of delete item
            method: 'delete', //sets the crud method for the route(deletay)
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is json
            body: JSON.stringify({ //declare the message content being passed and stringify that content
              'itemFromJS': itemText  // setting content of body to the inner text of the list item, and naming it itemFromJS
            }) //close body
          }) //close obj
        const data = await response.json() //wait for server to respond with json
        console.log(data) //consolelog the response back from server
        location.reload() //reload the page to update what is being displayed

    }catch(err){ //if error occurs, pass the error into the catch
        console.log(err) //log the error to the console
    } //close the catch block
} //end the function

async function markComplete(){ //declaring an async function, which allows us to rearrange the flow of the execution. waits for a response to run
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item, grabs the correct node and its innertext
    try{ //starting a try block to do something
        const response = await fetch('markComplete', { //creating a response variable that waits on a fetch to get data from the result of markComplete
            method: 'put', //sets the crud method for the route, which is update
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is json
            body: JSON.stringify({ //declare message content being passed and stringify that content
                'itemFromJS': itemText //setting content of body to the inner text of the list item, and naming it itemFromJS
            }) //close body
          }) //close obj
        const data = await response.json() //wait for the server to respond with json
        console.log(data) //consolelog the response back from server
        location.reload() //reload so we can see our changed data

    }catch(err){ //if error occurs, pass error into catch
        console.log(err) //consolelog the error
    }
}

async function markUnComplete(){ //declare an async function which allows us to rearrange the number execution flow
    const itemText = this.parentNode.childNodes[1].innerText //declare a variable named itemText which grabs the inner text of the correct node
    try{ //declares a try, which allows us to run something
        const response = await fetch('markUnComplete', {  //declare a response variable that waits on a fetch to get data from the result of markuncomplete
            method: 'put', //sets a crud method which is update
            headers: {'Content-Type': 'application/json'}, //declares the type of content expected back from the response, which is json
            body: JSON.stringify({ //declares message content being passed and stringify that content
                'itemFromJS': itemText //setting content of body to the inner text of the list item, and naming it itemFromJS
            }) // close body
          }) //close obj
        const data = await response.json() //wait for the response from the server with json
        console.log(data) //consolelog the response back from server
        location.reload()  //reload

    }catch(err){ //if error occurs, pass error to catch
        console.log(err) //console log the error
    }
}