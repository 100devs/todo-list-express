//all this main.js does is add event listeners and then sends it up to the correct server route

const deleteBtn = document.querySelectorAll('.fa-trash') //creating a CONSTANT variable and ssigning it to a selectoion of all elements with a class of fa-trash
const item = document.querySelectorAll('.item span') //creating a CONSTANT variable and assinging it to a selection of all spans with a parent with a cvlass of item
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a CONSTANT variable and assinging it to a selection of all spans with the class of completed within a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ //created an array from all of the delete button. Then the forEach loop will iterate through each element and do the next line to each element.
    element.addEventListener('click', deleteItem) //This adds an event listenser in the form of a click and when it recognises a click it will call the deleteItem function
}) //close the loop

Array.from(item).forEach((element)=>{ //created an array from all of the item declared in the const at the top. Then the forEach loop will iterate through each element and do the next line to each element.
    element.addEventListener('click', markComplete) //This adds an event listenser in the form of a click and when it recognises a click it will call the markComplete function
}) //close the loop

Array.from(itemCompleted).forEach((element)=>{ //created an array from all of the itemCompleted declared in the const at the top. Then the forEach loop will iterate through each element and do the next line to each element.
    element.addEventListener('click', markUnComplete) //This adds an event listenser in the form of a click and when it recognises a click it will call the markUnComplete function
}) //close the loop

// these below are the functions called in the click events above

async function deleteItem(){ //declaering a async function called deleteItem, async because it allows us to contorl the flow of execution, wait for it to execute while other code runs outside of the function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item (parent node) to extracts the text value only of the specified list span and settign a const variable. the comments may be messing wiht the way the nodes are being selected
    try{ //declares thwe try block, allows us to execute code 
        const response = await fetch('deleteItem', { //setting a response variable that waits on a fetch to get data from the result of deleteItem. also starting an object with the following details
            method: 'delete', //setting the method (route) to delete
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is json
            body: JSON.stringify({ // declare the message content being passed amd stringify the content
              'itemFromJS': itemText //settign the cvontent of the body to the inner text of the list item (variable set above) and naming it itemFromJS
            }) //closing the body
          }) //closing object
        const data = await response.json() //waiting on the json from the response to be converted
        console.log(data) //console logging the data
        location.reload() //reloads the page to display the updated list

    }catch(err){ //declare the catch block which handles any errors
        console.log(err) //console log the error
    } //close the catch block
} //close the function block

async function markComplete(){ //decalre async function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item (parent node) to extracts the text value only of the specified list span and settign a const variable. the comments may be messing wiht the way the nodes are being selected
    try{ //declaring a try block
        const response = await fetch('markComplete', { //setting a response variable that waits on a fetch to get data from the result of markComplete. also starting an object with the following details
            method: 'put', //method is the route which is a put(CRUD method = update). can change the route to change th esection of the server that will execute
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is json
            body: JSON.stringify({ // declare the message content being passed amd stringify the content
                'itemFromJS': itemText //settign the cvontent of the body to the inner text of the list item (variable set above) and naming it itemFromJS
            }) //closing the body
          }) //closing the object
          const data = await response.json() //waiting on the json from the response to be converted
          console.log(data) //console logging the data
          location.reload() //reloads the page to display the updated list

        }catch(err){ //declare the catch block which handles any errors
            console.log(err) //console log the error
        } //close the catch block
    } //close the function block

async function markUnComplete(){ //decalre async function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText  //looks inside of the list item (parent node) to extracts the text value only of the specified list span and settign a const variable. the comments may be messing wiht the way the nodes are being selected
    try{ //declaring a try block
        const response = await fetch('markUnComplete', { //setting a response variable that waits on a fetch to get data from the result of markUnComplete. also starting an object with the following details
            method: 'put', //method is the route which is a put(CRUD method = update). can change the route to change th esection of the server that will execute
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is json
            body: JSON.stringify({ // declare the message content being passed amd stringify the content
                'itemFromJS': itemText //settign the cvontent of the body to the inner text of the list item (variable set above) and naming it itemFromJS
            }) //closing the body
        }) //closing the object
          const data = await response.json() //waiting on the json from the response to be converted
          console.log(data) //console logging the data
          location.reload() //reloads the page to display the updated list

        }catch(err){ //declare the catch block which handles any errors
            console.log(err) //console log the error
        } //close the catch block
    } //close the function block