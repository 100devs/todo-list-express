// get all the DOM elements with a class of `fa-trash` and assign the NodeList to deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
// get all the DOM elements that are spans and descendants of elements with a class of `item`, and assign to the item variable
const item = document.querySelectorAll('.item span')
// get all the DOM elements that are spans with a class of `completed` and are descendants of elements with a class of `item`, assigning them to the `itemCompleted` variable
const itemCompleted = document.querySelectorAll('.item span.completed')

// convert deleteBtn NodeList to an array and then call .forEach on the array
Array.from(deleteBtn).forEach((element)=>{
    // adding the deleteItem function as a click event listener for each item in deleteBtn
    element.addEventListener('click', deleteItem)
})

// creating an array from the nodelist assigned to the item variable, looping through it and adding an event listener to each element that will 'listen' for a click and passing the function 'markComplete'
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creating an array from the nodelist assigned to itemCompleted. Looping through the array
Array.from(itemCompleted).forEach((element)=>{
    // add event listener to each element that will 'listen' for a click and passing the function 'markUnComplete' 
    element.addEventListener('click', markUnComplete)
})

// declare an async function called deleteItem
async function deleteItem(){
    // get the innerText of the span element and assign it to the itemText variable
    const itemText = this.parentNode.children[0].innerText
    try{
        // make fetch to deleteItem path and assign to response variable
        const response = await fetch('deleteItem', {
            // set request method to DELETE
            method: 'delete',
            // set Content-Type header to application/json - so it knows we're sending JSON
            headers: {'Content-Type': 'application/json'},
            // send the object with a property of itemFromJS and value of itemText of the current item as a string of JSON
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // attempt to load and parse the response body as JSON, assigning it to the data variable
        const data = await response.json()
        // console log the JSON object assigned to data
        console.log(data)
        // reload the webpage
        location.reload()

    }catch(err){
        // if any errors are caught, console log them
        console.log(err)
    }
}

async function markComplete(){
    // get the innerText of the span element
    const itemText = this.parentNode.children[0].innerText
    try{
        // make fetch to markComplete path
        const response = await fetch('markComplete', {
            // set request method to PUT
            method: 'put',
            // set Content-Type header to application/json - so it knows we're sending JSON
            headers: {'Content-Type': 'application/json'},
            // send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // attempt to load and parse the response body as JSON, assigning it to the data variable
        const data = await response.json()
        // console log the JSON object
        console.log(data)
        // reload the webpage
        location.reload()

    }catch(err){
        // if any errors are caught, console log them
        console.log(err)
    }
}

async function markUnComplete(){
    // get the innerText of the span
    const itemText = this.parentNode.children[0].innerText
    try{
        // make fetch request to markUnComplete path
        const response = await fetch('markUnComplete', {
            // set request method to PUT
            method: 'put',
            // set Content-Type header to application/json - so that it knows we're sending JSON
            headers: {'Content-Type': 'application/json'},
            // send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // attempt to load and parse the response body as JSON, assigning it to the data variable
        const data = await response.json()
        // console log the JSON response
        console.log(data)
        // reload the webpage
        location.reload()

    }catch(err){
        // if any errors are caught, console log them
        console.log(err)
    }
}