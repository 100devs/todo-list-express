const deleteBtn = document.querySelectorAll('.fa-trash') //create variable deleteBtn that holds a call to the document object (DOM entry) with the function that selects all the elements with class fa-trash
const item = document.querySelectorAll('.item span') //create variable item that holds the DOM entry with the function that selects all elements with the class .item with a child span
const itemCompleted = document.querySelectorAll('.item span.completed') //create variable itemCompleted holding DOM entry with function selection all elements with class item with a child of span which has a class of completed

Array.from(deleteBtn).forEach((element)=>{ // Create a temp array from the instructions held in deleteBtn and running a forEach function on the values
    element.addEventListener('click', deleteItem) // forEach element in the array, add an event listener for click that runs the deleteItem function
}) // close the forEach

Array.from(item).forEach((element)=>{ // create a temp array from the item variable and run forEach on it
    element.addEventListener('click', markComplete)// for each element in the array, add an event listener for click and run markComplete function
}) // close the forEach

Array.from(itemCompleted).forEach((element)=>{ // create temp array from itemCompleted and run forEach on it
    element.addEventListener('click', markUnComplete) // on each element add an event listener for click that runs function markUnComplete
})

async function deleteItem(){ // declare asynchronous function called deleteItem with no parameters
    const itemText = this.parentNode.childNodes[1].innerText // create variable itemText containing a route to the text of an entered item
    try{ // declare a try block so that we can have an error handling catch block after
        const response = await fetch('deleteItem', { // create variable response holding a halting fetch call to get data from the result of the deleteItem server route and creating an object literal
            method: 'delete', // sets the CRUD delete method for the route in a key:value pair
            headers: {'Content-Type': 'application/json'}, // create a key:value pair holding an object holding a key:value pair declaring the content type expected to be JSON
            body: JSON.stringify({ // key:value pair holding the results of a translation of javascript to JSON through stringify
              'itemFromJS': itemText // key:value pair being stringified holding the call for the info held in itemText
            }) //close stringify
          }) // close fetch
        const data = await response.json() // create a variable data holding a halting call waiting for the conversion to JSON of the halting fetch held in response 
        console.log(data) //log to console the info stored in data from the JSON conversion
        location.reload() // reload the page to show changes

    }catch(err){ // start catch block with parameter to get error from try
        console.log(err) //console log the passed error
    } // end function
}

async function markComplete(){ // declare asynchronous function called markComplete with no parameters
    const itemText = this.parentNode.childNodes[1].innerText // create variable itemText containing a route to the text of an entered item
    try{ // declare a try block
        const response = await fetch('markComplete', { // create variable to hold halting fetch async function getting the response from the server and opening an object
            method: 'put', // sets the CRUD update method in a key:value pair
            headers: {'Content-Type': 'application/json'}, // key:value pair holding an object declaring the content type as JSON
            body: JSON.stringify({ // key:value pair holding the results of a called stringify translating JS to JSON
                'itemFromJS': itemText // key:value pair holding the contents of itemText defined earlier
            }) // close stringify
          }) // close fetch
        const data = await response.json() // create variable to hold a halting function waiting for the results of the object made in response
        console.log(data) // log the data to console
        location.reload() // reload the webpage

    }catch(err){ // start catch block to grab an error if try fails
        console.log(err) // log the error
    } // clode the catch block
} // close markComplete

async function markUnComplete(){ // declare asynchronous function called markUnComplete with no parameters
    const itemText = this.parentNode.childNodes[1].innerText // create variable itemText containing a route to the text of an entered item
    try{ // declare a try block
        const response = await fetch('markUnComplete', { // create variable to hold halting fetch async function getting the response from the server and opening an object
            method: 'put', // sets the CRUD update method in a key:value pair
            headers: {'Content-Type': 'application/json'}, // key:value pair holding an object declaring the content type as JSON
            body: JSON.stringify({ // key:value pair holding the results of a called stringify translating JS to JSON
                'itemFromJS': itemText // key:value pair holding the contents of itemText defined earlier
            }) // close stringify
          }) // close fetch
        const data = await response.json() // create variable to hold a halting function waiting for the results of the object made in response
        console.log(data) // log the data to console
        location.reload() // reload the webpage

    }catch(err){ // start catch block to grab an error if try fails
        console.log(err) // log the error
    } // clode the catch block
} // close markComplete