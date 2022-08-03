const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable storing all tags with class .fa-trash in the  variable
const item = document.querySelectorAll('.item span') //creating a variable storing all span tags with class .item in the variable
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable storing all  spans with .completed tags within tags with class .item in the variable 

Array.from(deleteBtn).forEach((element)=>{ // Creating an array from the variable deleteBtn, and calling each item in the array as an element
    element.addEventListener('click', deleteItem) // Adding an event listener to run the deleteItem function when the tag is clicked.
}) // Ending forEach

Array.from(item).forEach((element)=>{ // Creating an array from the variable item, and calling each item in the array as an element
    element.addEventListener('click', markComplete)// Adding an event listener to run the markComplete function when the tag is clicked.
}) // Ending forEach

Array.from(itemCompleted).forEach((element)=>{ // Creating an array from the variable deleteBtn, and calling each item in the array as an element
    element.addEventListener('click', markUnComplete) // Adding an event listener to run the itemCompleted function when the tag is clicked.
}) // Ending forEach

async function deleteItem(){ // async function declared and named deleteItem, no parameters used.
    const itemText = this.parentNode.childNodes[1].innerText //declare variable and store inputted text contained in the second child node of a parent node
    try{ // Start try block to do something
        const response = await fetch('deleteItem', { //create and store in variable response the data from a fetch request
            method: 'delete', // declare the method of the fetch request
            headers: {'Content-Type': 'application/json'}, // declare the type of content to be expected, JSON
            body: JSON.stringify({ // declare the message content being passed, and stringify that content
              'itemFromJS': itemText // play key of itemFromJS and property from itemText variable to body for request
            }) // end body being sent
          })// end fetch request
        const data = await response.json() // convert response of fetch request to json and store in data
        console.log(data) //console log the data
        location.reload() // refresh the page

    }catch(err){ // start catch block to catch errors if fetch request goes wrong
        console.log(err) //  console log the error
    } // end catch block
} // close function

async function markComplete(){ // async function declared and named markComplete, no params used.
    const itemText = this.parentNode.childNodes[1].innerText // reach into tag the event listener is attached to, go up to its parent than down to its child note that contains the inner text of the tag and places the inner text into itemText
    try{ // Start try block
        const response = await fetch('markComplete', { // create and store in response the data returned from the fetch request sent to the path markComplete
            method: 'put',  //declare the method of the fetch request as put
            headers: {'Content-Type': 'application/json'}, //declare the type of data being sent in the fetch request
            body: JSON.stringify({ //place into the body of the request a stringified json object 
                'itemFromJS': itemText // name the key itemFromJs and value as itemText from variable itemText for the object
            }) // end obj
          }) // end fetch request
        const data = await response.json() // declare and store into data variable the json response from fetch
        console.log(data) //console.log data
        location.reload() // reload page

    }catch(err){ // declare catch block
        console.log(err) //log error
    }// close catch block
}// close function

async function markUnComplete(){ // declare async function
    const itemText = this.parentNode.childNodes[1].innerText // declare and store in var ItemText info from the tag then move up to the tags parent than down to the tags child[1] and take the inner text
    try{ // declare try black
        const response = await fetch('markUnComplete', { // declare and store data from fetch request to path markUnComplete
            method: 'put', // declare method type as put
            headers: {'Content-Type': 'application/json'}, // declare type of data being sent in fetch request
            body: JSON.stringify({ // send in the body of the fetch request a JSON.stringified object
                'itemFromJS': itemText // place into the object a key value pair
            }) // end body object
          }) // end fetch request
        const data = await response.json() // declare and store in the data var the fetch json response
        console.log(data) // log data
        location.reload() // reload page

    }catch(err){ // start catch
        console.log(err) // log error
    } // end catch
} // end function