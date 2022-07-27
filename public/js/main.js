
//get all the DOM elements with a class of 'fa-trash' and assign the Nodelist to deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
//get all of the DOM elements that are spans and descendants of elements with a class of `item`, and assign to the item variable
const item = document.querySelectorAll('.item span')
// get all of the DOM elements that are spans with a class of `completed` and are descendants of elements with a class of `item`, assigning them to the `itemCompleted` variable.
const itemCompleted = document.querySelectorAll('.item span.completed')

//whenever our event button is clicked something happens in this case we are passing the deleteItem 
//convert deletBtn Nodelist to an array, then call .forEach on the array
// create an array from the querySelectorAll results, loop through all, and add a 'click' event listener that fires the 'deleteItem' function
Array.from(deleteBtn).forEach((element)=>{
    //adding the deletItem function as a click event listener for each item in deleBtn
    element.addEventListener('click', deleteItem)
})

//creating an array form the nodelist assigned to item. looping through it and adding an event listener to each element that will 'listen' for a click and passing the function "markComplete"
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//creating an array form the nodelist assigned to itemCompleted. looping through it and adding an event listener to each element that will 'listen' for a click and pass the function "markUnComplete"
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//hoisting! written here but hoisted to line 1
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    //give me the innerText of the first <span> element
    //// traverses the dom up to the parent (li) and gets the text inside of the first <span> element
    try{
            // sends a DELETE request to the 'deleteItem' endpoint, sets the headers to inform server that it is sending json content, and the itemText variable contents in the body.

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

//
async function markComplete(){
    //get the innerText of the first <span> element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // make fetch to markComplete path
        const response = await fetch('markComplete', {
            //set method to PUT
            method: 'put', //default method is get
            //set Content-Type header to application/json so it knows we are sending JSON
            headers: {'Content-Type': 'application/json'},
            //send the object with a property of itemFromJS and value of the itemText of the current item as a string of JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //only receives the headers until you say give me the rest of everything in a promise inside the data variable
          //waits for response and parses json
          //attempt to load and parse the response boady as JSON assigning it to data
        const data = await response.json()
        console.log(data)
        //this reloads the current page
        location.reload()

    }catch(err){
        //if any errors are caught, console log them
        console.log(err)
    }
}
//
async function markUnComplete(){
        //get the innerText of the first <span> element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
            // sends a PUT request to the 'markUnComplete' endpoint, sets the headers to inform server that it is sending json content, and the itemText variable contents in the body.

        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //cannot go forward until fetch is complete. if nothing goes wrong it is returned in the data variable and then console logged and then page reloads
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}