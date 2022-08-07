//declare and assign variable for delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
//declare and assign variable for all element with class .item span
const item = document.querySelectorAll('.item span')
//declare and assign variable for all items with class .item span and .completed
const itemCompleted = document.querySelectorAll('.item span.completed')

// Generates and arry from the deletBtn variable and loops over all of the elements with the forEach method
Array.from(deleteBtn).forEach((element)=>{
    //Adds an event listener to each element to listen for a Click event. Also provides a function to run when the Click event is triggered.
    element.addEventListener('click', deleteItem) // Function call without () as the function only needs to be called when Clicked! if the () are added the call will trigger the function when this line gets read, not wainting for the click even to happen.
})

// Generates and arry from the item variable and loops over all of the elements with the forEach method
Array.from(item).forEach((element)=>{
    //Adds an event listener to each element to listen for a Click event. Also provides a function to run when the Click event is triggered.
    element.addEventListener('click', markComplete)
})

// Generates and arry from the itemCompleted variable and loops over all of the elements with the forEach method
Array.from(itemCompleted).forEach((element)=>{
    //Adds an event listener to each element to listen for a Click event. Also provides a function to run when the Click event is triggered.
    element.addEventListener('click', markUnComplete)
})

// Declare Async function
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //direct reference: grab parent, then child, then 2nd element, then the text (don't do this, use classes, datatags), looks inside of list item an extracts the text value of the specified list item

    try{ //starting try block, try block(allows us to run something or other) and catch block(if an error is thrown, it handles that error) go together

        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from a deleteItem
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //parse as JSON, specifying the type of content that is expected which JSON
            body: JSON.stringify({ //the body is the method that we are getting, make it a string
              'itemFromJS': itemText //setting the content to the body to innnerText of the list item and naming it 'itemFromJS', same as line84 in server.js. they need to match, they are tied together
            })
          })
        const data = await response.json() //we waited for the response, now we need to read it(conversion) and wait for JSON
        console.log(data) //log data to console
        location.reload() //refresh the page, show updated list

    }catch(err){ //something failed, if an error occurs pass the error into the attached block
        console.log(err) //log error to the console
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
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