const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of all elements with 
                                                        //a class of the trash can
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of all span tags inside of a parent
                                                    //that has a class of item (all spans inside .item)
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of spans that are inside
                                                                            //the class of item parent but have a class completed too (probably missing a space
                                                                            //between span and .completed)

Array.from(deleteBtn).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //adding an event listener to the current item that waits for a click and then calls a function
                                                    // called deleteItem   WE DON'T PUT () AFTER THE FUNCTION NAME BECAUSE THEN IT WOULD RUN IMMEDIATELY
})  //close our loop

Array.from(item).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) //adding an event listener to the current item that waits for a click and then calls a function
                                                    // called markComplete
})  //close our loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete) // adds an event listener to ONLY completed items
})  //close our loop

async function deleteItem(){ //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list and grabs only the inner text within the list span  (parentNode- list item, childNode - span(inside tag element 0 is the opening tag/the text indent, span with text is el 1, closing tag el 2) this = container in which the element is in  
    try{            // starting a try block to do something
        const response = await fetch('deleteItem', { // creating a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', // setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and turn it into a string (body is the actual info that is being passed)
              'itemFromJS': itemText // setting the content of the body to the inner text of the list  item, and naming it itemFromJs(itemText is the innerText of the things being passed)
            }) //closing the body
          }) // closing the object
        const data = await response.json() //waiting on the server to respond with some JSON to be converted (we waited for a response, now we need to read it and wait for JSON) (line 26 awaits the reponse, line 33 awaits the response being parsed and converted from json to a javascript object-conversion)
        console.log(data) //log the result to the console
        location.reload() // reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    } // close the catch block
}//end the function

async function markComplete(){ //declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list and grabs only the inner text within the list span  
    try{// starting a try block to do something
        const response = await fetch('markComplete', {// creating a response variable that waits on a fetch to get data from the result of markComplete route
            method: 'put', // setting the CRUD method UPDATE for the route
            headers: {'Content-Type': 'application/json'},// specifying the type of content expected, which is JSON
            body: JSON.stringify({ // declare the message content being passed, and turn it into a string
                'itemFromJS': itemText // setting the content of the body to the inner text of the list  item, and naming it itemFromJS
            }) //closing the body
          })// closing the object
        const data = await response.json() //waiting on the server to respond with some JSON to be converted 
        console.log(data)//log the result to the console
        location.reload()// reloads the page to update what is displayed

    }catch(err){// if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }
}

async function markUnComplete(){//declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText// looks inside of the list and grabs only the inner text within the list span  
    try{// starting a try block to do something 
        const response = await fetch('markUnComplete', {// creating a response variable that waits on a fetch to get data from the result of markUnComplete route
            method: 'put', // setting the CRUD method UPDATE for the route
            headers: {'Content-Type': 'application/json'},// specifying the type of content expected, which is JSON
            body: JSON.stringify({// declare the message content being passed, and turn it into a string
                'itemFromJS': itemText// setting the content of the body to the inner text of the list  item, and naming it itemFromJS
            })//closing the body
          })// closing the object
        const data = await response.json()//waiting on the server to respond with some JSON to be converted 
        console.log(data)//log the result to the console
        location.reload()// reloads the page to update what is displayed

    }catch(err){// if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }// close the catch block
}//end the function