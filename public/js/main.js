// get all the DOM elements with a class of `fa-trash` and assign the NodeList to deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
// get all of the DOM elements that are spans and descendants of elements with a class of `item`, and assign to the item variable
const item = document.querySelectorAll('.item span')
// get all of the DOM elements that are spans with a class of `completed` and are descendants of elements with a class of `item`, assigning them to the `itemCompleted` variable.
const itemCompleted = document.querySelectorAll('.item span.completed')

// convert deleteBtn NodeList to an array, then call .forEach on the array
Array.from(deleteBtn).forEach((element)=>{
    // adding the deleteItem function as a click event listener for each item in deleteBtn
    element.addEventListener('click', deleteItem)
})

//creating an array form the nodelist assigned to item. looping through it and adding an event listener to each element that will
//'listen' for a click and passing the function "markComplete"
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//creating an array form the nodelist assigned to itemCompleted. looping through it and adding an event listener to each element that will
//'listen' for a click and passing the function "markUnComplete"
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//created and asycronous function called deleteItem
async function deleteItem(){
//we get the innertext of the first children of the parent node ( which is the span) where this funcion was called from
    const itemText = this.parentNode.children[0].innerText
    try{
//make a fetch to deletItem path and await for it
        const response = await fetch('deleteItem', {
//set request method to delete
            method: 'delete',
// set Content-Type header to application/json - so it knows we're sending JSON
            headers: {'Content-Type': 'application/json'},
// send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // attempt to load and parse the response body as JSON, assigning it to data
        const data = await response.json()
        console.log(data)
        //F5!!
        location.reload()

        // If any errors are caught, console.log them
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    // get the innerText of the <span>(changed childnodes[1] to children[0] since the comments are part of the childnode and broke the code!!)
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
        // attempt to load and parse the response body as JSON, assigning it to data
        const data = await response.json()
        console.log(data)
        // reload the webpage
        location.reload()

    }catch(err){
        // If any errors are caught, console.log them
        console.log(err)
    }
}

async function markUnComplete(){
     // get the innerText of the <span>
    const itemText = this.parentNode.children[0].innerText
    try{
        // make fetch to markUnComplete path
        const response = await fetch('markUnComplete', {
            // set request method to PUT
            method: 'put',
            // set Content-Type header to application/json - so it knows we're sending JSON
            headers: {'Content-Type': 'application/json'},
            // send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // attempt to load and parse the response body as JSON, assigning it to data
        const data = await response.json()
        console.log(data)
        // reload the webpage
        location.reload()

        // If any errors are caught, console.log them
    }catch(err){
        console.log(err)
    }
}
