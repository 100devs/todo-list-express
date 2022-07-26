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


async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    // get the innerText of the <span>
    const itemText = this.parentNode.childNodes[1].innerText
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
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}