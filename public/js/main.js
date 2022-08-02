const deleteBtn = document.querySelectorAll('.fa-trash') // this creates a variable and assigns all elements with the class of fa-trash in our EJS file (document) to it //
const item = document.querySelectorAll('.item span') // this creates a variable and assigns all span tags inside of a parent that has a class of item to it //
const itemCompleted = document.querySelectorAll('.item span.completed') // this creates a variable and assigns all span tags with a class of completed inside a parents that has a class of item to it //

Array.from(deleteBtn).forEach((element)=>{ // we're creating an array from our selection and starting a loop //
    element.addEventListener('click', deleteItem) // we're adding an event listener that waits for a click, and then calls our deleteItem function to the current element //
}) // this closes our loop //

Array.from(item).forEach((element)=>{ // we're creating an array from our selection and starting a loop //
    element.addEventListener('click', markComplete) // we're adding an event listener that waits for a click, and then calls our markComplete function to the current element //
}) // this closes our loop //

Array.from(itemCompleted).forEach((element)=>{ // we're creating an array from our selection and starting a loop //
    element.addEventListener('click', markUnComplete) // we're adding an event listener that waits for a click, and then calls our markUnComplete function to the current element (this applies to only completed items) //
}) // this closes our loop //

async function deleteItem(){ // declaring asynchronous function named deleteItem //
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span and sets it to a variable of itemText //
    try{ // beginning of our try/catch block of our asynch function //
        const response = await fetch('deleteItem', { // we're creating a variable that waits on a fetch to get data from the result of the deleteItem route //
            method: 'delete', // sets the CRUD method for our route to 'delete' //
            headers: {'Content-Type': 'application/json'}, // we're setting our content-type to JSON //
            body: JSON.stringify({ // declare the message content being passed and stringify that content //
              'itemFromJS': itemText // setting the content of the body to the innertext of the list item and naming it 'itemFromJS' //
            }) // closing our stringify body //
          }) // closing our fetch //
        const data = await response.json() // we're waiting for the server to respond with JSON and assigning it to the variable of data //
        console.log(data) // we're console.logging our JSON response from our fetch //
        location.reload() // we're forcing a page refresh //

    }catch(err){ // this is the start of the end of our try/catch block... if an error occurs pass the error into our catch block //
        console.log(err) // if there's an error, it will be logged by the console //
    } // closing our catch //
} // closing our async function //

async function markComplete(){ // declaring an async function named markComplete //
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span and sets it to a variable of itemText //
    try{ // beginning of our try/catch block of our asynch function //
        const response = await fetch('markComplete', { // we're creating a variable that waits on a fetch to get data from the result of the markComplete route //
            method: 'put', // sets the CRUD method for our route to 'put' or update //
            headers: {'Content-Type': 'application/json'}, // we're setting our content-type to JSON //
            body: JSON.stringify({ // declare the message content being passed and stringify that content //
                'itemFromJS': itemText // setting the content of the body to the innertext of the list item and naming it 'itemFromJS' //
              }) // closing our stringify body //
            }) // closing our fetch //
          const data = await response.json() // we're waiting for the server to respond with JSON and assigning it to the variable of data //
          console.log(data) // we're console.logging our JSON response from our fetch //
          location.reload() // we're forcing a page refresh //
  
      }catch(err){ // this is the start of the end of our try/catch block... if an error occurs pass the error into our catch block //
          console.log(err) // if there's an error, it will be logged by the console //
      } // closing our catch //
  } // closing our async function //

  async function markUnComplete(){ // declaring an async function named markComplete //
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item and grabs only the inner text within the list span and sets it to a variable of itemText //
    try{ // beginning of our try/catch block of our asynch function //
        const response = await fetch('markUnComplete', { // we're creating a variable that waits on a fetch to get data from the result of the markComplete route //
            method: 'put', // sets the CRUD method for our route to 'put' or update //
            headers: {'Content-Type': 'application/json'}, // we're setting our content-type to JSON //
            body: JSON.stringify({ // declare the message content being passed and stringify that content //
                'itemFromJS': itemText // setting the content of the body to the innertext of the list item and naming it 'itemFromJS' //
              }) // closing our stringify body //
            }) // closing our fetch //
          const data = await response.json() // we're waiting for the server to respond with JSON and assigning it to the variable of data //
          console.log(data) // we're console.logging our JSON response from our fetch //
          location.reload() // we're forcing a page refresh //
  
      }catch(err){ // this is the start of the end of our try/catch block... if an error occurs pass the error into our catch block //
          console.log(err) // if there's an error, it will be logged by the console //
      } // closing our catch //
  } // closing our async function //