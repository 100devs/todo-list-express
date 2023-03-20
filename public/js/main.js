const deleteBtn = document.querySelectorAll('.fa-trash') // store the selection of all Font Awesome trash icons from the DOM
const item = document.querySelectorAll('.item span') // store in a variable all the selections of the span tags within the class item
const itemCompleted = document.querySelectorAll('.item span.completed') // store in a variable all the selections of the span class completed within the class item

Array.from(deleteBtn).forEach((element)=>{ // create an array from our deleteBtn selection and iterate each element
    element.addEventListener('click', deleteItem) // add an event listener for each click on element's trash can
})

Array.from(item).forEach((element)=>{
  // create an array from our item selection and iterate each element
  element.addEventListener('click', markComplete) // add an event listener for each click on the element renderization
})

Array.from(itemCompleted).forEach((element)=>{
  // create an array from our itemCompleted selection and iterate each element
  element.addEventListener('click', markUnComplete) // add an event listener for each click on completed element
})

async function deleteItem(){ // declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // get the text of the listed item from the DOM and store it in a variable
    try{ 
        const response = await fetch('deleteItem', { // await the response which is a fetch for delete the item
            method: 'delete', // method of the fetch request
            headers: {'Content-Type': 'application/json'}, // header indicates the type of the response, which is JSON
            body: JSON.stringify({ // set the body of our request as a json string
              'itemFromJS': itemText // Name it itemFromJS with the content of our listed item that was clicked
            })
          })
        const data = await response.json() // store the response in json format in data variable
        console.log(data) // console log the response
        location.reload() // refresh the page for the user

    }catch(err){ // catch any error who may occur
        console.log(err) // print the error to the console
    }
}

async function markComplete(){
  // declare an asynchronous function
  const itemText = this.parentNode.childNodes[1].innerText // get the text of the completed items from the DOM and store it in a variable
  try {
    const response = await fetch('markComplete', {
      // await the response which is a fetch for update the item
      method: 'put', // Set method of request to PUT
      headers: { 'Content-Type': 'application/json' }, // indicates the type of the response, which is JSON
      body: JSON.stringify({
        // Send the object with a property of itemFromJS and value of the `itemText` of the current item as a JSON string
        itemFromJS: itemText
      })
    })
    const data = await response.json() // Attempt to load and parse the response body as JSON, assigning it to data
    console.log(data)
    // Reload the webpage
    location.reload()
  } catch (err) {
    // If there are any errors, console.log them
    console.log(err)
  }
}

async function markUnComplete(){
  const itemText = this.parentNode.childNodes[1].innerText // From the current <span> (bound to this by the event listener), get the parentNode - the <li> - then get the 1th childNode - the <span>, then retrieve the text content of it by reading the `innerText` property
  try {
    const response = await fetch('markUnComplete', {
      // Make a fetch to the relative path `markUnComplete`
      method: 'put', // set the method request to `PUT`
      headers: { 'Content-Type': 'application/json' }, // tells what kind of data we will be transfering on this request
      body: JSON.stringify({ // send the body of the request as a JSON string
        itemFromJS: itemText // send the itemText as a value of the property itemFromJS
      })
    })
    // Attempt to load and parse the response body as JSON, assigning it to data
    const data = await response.json()
    console.log(data)
    // Reload the webpage
    location.reload()
  } catch (err) {
    // If there are any errors, console.log them
    console.log(err)
  }
}