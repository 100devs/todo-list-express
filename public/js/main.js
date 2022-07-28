const deleteBtn = document.querySelectorAll('.fa-trash') // store all elements with .fa-trash class
const item = document.querySelectorAll('.item span') // store all the spans that have .item as ancestors
const itemCompleted = document.querySelectorAll('.item span.completed') //store the spans with the completed class that have an ancestor with the item class 

Array.from(deleteBtn).forEach((element)=>{ // use the deleteBtn constant from earlier and convert to an array and iterate over each element of that
    element.addEventListener('click', deleteItem) // add a 'click' eventListener that calls the deleteItem function when clicked
}) // end iteration

Array.from(item).forEach((element)=>{// convert item to an array and iterate over each element of that
    element.addEventListener('click', markComplete) // add a 'click' eventListener that calls the markComplete function when clicked
}) // end iteration

Array.from(itemCompleted).forEach((element)=>{ // convert itemCompleted to an array and iterate over each element of that
    element.addEventListener('click', markUnComplete) // add a 'click' eventListener that calls the markUnComplete function when triggered
}) // end iteration

async function deleteItem(){ // define an asynchronous function called deleteItem()
    const itemText = this.parentNode.childNodes[1].innerText // get the text from the clicked on element's span sibling 
    try{ // try to do the following
        const response = await fetch('deleteItem', { // await the completion of the request and save it to response make the request to the route 'deleteItem'
            method: 'delete', // tells fetch to make a delete request to the server
            headers: {'Content-Type': 'application/json'}, // request headers
            body: JSON.stringify({ // create the body of the request as a JSON string
              'itemFromJS': itemText // assign itemText from line 18 to 'itemFromJS'
            }) // end JSON.stringify
          }) // end of fetch method
        const data = await response.json() // await parsing the JSON to make an object stored in the response
        console.log(data) // log the returned data 'Todo Deleted'
        location.reload() // reload the page to fetch/display the new state

    }catch(err){ // if the tried thing failed
        console.log(err) // log the error
    } // end of catch
} // end of function

async function markComplete(){ // define an asynchronous function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // Get the item text from its location in the DOM
    try{ // try
        const response = await fetch('markComplete', { // use the route 'markComplete'
            method: 'put', // with the request type of put
            headers: {'Content-Type': 'application/json'}, // define the header
            body: JSON.stringify({ // turn an object into a JSON string
                'itemFromJS': itemText // assign itemFromJS the contents of itemText
            }) // end of stringified body
          }) // end or fetch call
        const data = await response.json() // await the conversion of the response JSON to an object
        console.log(data) // log the object we got from the response.json()-- a string 'Marked Complete'
        location.reload() //reload the page so the updated state is fetched and displayed

    }catch(err){ // if try fails, do this
        console.log(err) // log the error
    } // end of catch
} // end of function

async function markUnComplete(){ // define an asynchronous function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText // Get the item text from its location in the DOM
    try{ // try
        const response = await fetch('markUnComplete', { // use the route 'markUnComplete'
            method: 'put', // with the request type of put
            headers: {'Content-Type': 'application/json'}, // define the header
            body: JSON.stringify({ // turn an object into a JSON string
                'itemFromJS': itemText // assign itemFromJS the contents of itemText
            }) // end of stringified body
          }) // end or fetch call
        const data = await response.json() // await the conversion of the response JSON to an object
        console.log(data) // log the object we got from the response.json()-- a string 'Marked Complete' this is a typo in the server
        location.reload() //reload the page so the updated state is fetched and displayed

    }catch(err){ // if try fails, do this
        console.log(err) // log the error
    } // end of catch
} // end of function