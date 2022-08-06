const deleteBtn = document.querySelectorAll('.fa-trash') // Creating a variable for the delete button that selects all elements with a class of .fa-trash
const item = document.querySelectorAll('.item span') // Creating a variable for the item that selects all elements with the class of .item and any span inside them
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable for itemcompleted that has the class .item and any span.completed attribute inside it.
// blank line
Array.from(deleteBtn).forEach((element)=>{ // Creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //Add an event listen to the deleteBtn. waiting for a click. When a click occurs it calls the deleteItem function.
}) //Closing the tags
// blank line
Array.from(item).forEach((element)=>{ // creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete) // Add an event listen to the item. Waiting for a click. When a click occurs it calls the markComplete function. 
}) //closing the tags
// blank line
Array.from(itemCompleted).forEach((element)=>{ // creating an array from our selection and starting a loop. 
    element.addEventListener('click', markUnComplete) // Add an event listen to the item. Waiting for a click. When a click occurs it callst he markUnComplete function.
})//closing the tags.
// blank line
async function deleteItem(){  //declare an asynchronus function
    const itemText = this.parentNode.childNodes[1].innerText  // Looks inside of the list item and grabs only the inner text within the list.
    try{ //Try block openign
        const response = await fetch('deleteItem', {  // Creates a resposne variable that waits on a fetch to get a data from the result of deleteItem
            method: 'delete', // Setst the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the type of content expected, which is JSON. 
            body: JSON.stringify({ // declaring the message content and then stringify.
              'itemFromJS': itemText // setting the content of the body to the inner text. 
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON fromt he response to be converted.
        console.log(data) // Logging the result to the console. 
        location.reload() // reloading the page to update the display to any new changes. 
// blank line. 
    }catch(err){ //catch error 
        console.log(err) // log the error that occurs 
    } // closing catch
} // closing function
// blank line
async function markComplete(){  //decare an asynchronus function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of the list item and grabs only the inner text within the list.
    try{ //Try block openign
        const response = await fetch('markComplete', { // Creates a response variable that waits on a fetch to get data from the result of the markComplete route. 
            method: 'put', // setting the CRUD method to update. 
            headers: {'Content-Type': 'application/json'},// The type of content the fucntion to expect which is JSON
            body: JSON.stringify({ // Declaring the message content being passed and using Stringify
                'itemFromJS': itemText // Seeting hte content of the body to iner text of the list item. 
            }) // closing the body
        }) // closing the object 
        const data = await response.json() // waiting on JSON from the response to be converted
        console.log(data) // console logs the data each time something happens.
        location.reload() // Reloading the page to update any new changes. 
// blank line
    }catch(err){ // Catch error
        console.log(err) // Logging the error if one occurs
    } // closing catch
} // closing function
// blank line
async function markUnComplete(){  //decare an asynchronus function called UnmarkComplete
    const itemText = this.parentNode.childNodes[1].innerText // Looks inside of the list item and grabs only the inner text within the list.
    try{  //Try block openign
        const response = await fetch('markUnComplete', { // Creates a response variable that waits on a fetch to get data from the result of the markComplete route. 
            method: 'put', // setting the CRUD method to update. 
            headers: {'Content-Type': 'application/json'}, // The type of content the fucntion to expect which is JSON
            body: JSON.stringify({ // Declaring the message content being passed and using Stringify
                'itemFromJS': itemText // Seeting hte content of the body to iner text of the list item. 
            }) // closing the body
          }) // closing the object 
        const data = await response.json() // waiting on JSON from the response to be converted to JSON
        console.log(data) // console logs the data each time something happens.
        location.reload() // Reloading the page to update any new changes. 
// blank line
}catch(err){ // Catch error
    console.log(err) // Logging the error if one occurs
} // closing catch
} // closing function