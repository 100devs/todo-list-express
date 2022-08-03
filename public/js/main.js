// creating a variable and assigning it to all elements with the class .fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
// creating a variable and assigning it to a selection of span tags in a parent that has a class of item 
const item = document.querySelectorAll('.item span')
// creating a variable and assigning it to a selection of span tags with a class of completed in a parent with a class of item
const itemCompleted = document.querySelectorAll('.item span.completed')

// create an array from all elements in variable deleteBnt, for each element in variable add an event listener and on click do function deleteItem 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// create an array from all elemnts in variable item, iterate through each item in array
Array.from(item).forEach((element)=>{
    //  for each iteration, add an event listener and on click do function markComplete
    element.addEventListener('click', markComplete)
})

// create an array from all elemnts in variable itemCompleted, iterate through each item in array
Array.from(itemCompleted).forEach((element)=>{
    //  for each iteration, add an event listener and on click do function markUnComplete
    element.addEventListener('click', markUnComplete)
})

// declaring an asychronous function called deleteItem ()
async function deleteItem(){
    // looks inside list item and grabs only the inner text in the list span. Parent node of trash can is li, child is the span, target the inner text  
    const itemText = this.parentNode.childNodes[1].innerText
    // starting a try block to start our async function
    try{
        // creating a response variable, that waits on a fetch to get data from the result of the deleteItem route, also an object is starting
        const response = await fetch('deleteItem', {
            // sets the CRUD method for the route
            method: 'delete',
            // specifing the type of content expected which will be JSON
            headers: {'Content-Type': 'application/json'},
            // declare the message content being passed and stringify that conent 
            body: JSON.stringify({
                // setting the content of the body to the inner text of the list item and naming it itemFromJS
              'itemFromJS': itemText
            //   closing body
            })
            // closing object
          })
        // waiting on the JSON from the response to be converted
        const data = await response.json()
        // log the results
        console.log(data)
        // reloads the page to update what is displayed
        location.reload()
    // catch block to cartch error that might be thrown when try executes something above, if error occurs, catch it and pass it in
    }catch(err){
        // log the error
        console.log(err)
    // close catch block
    }
// end function
}

// Declaring an asynchronous function called markComplete
async function markComplete(){
    // looks inside list item and grabs only the inner text in the list span. 
    const itemText = this.parentNode.childNodes[1].innerText
    // starting a try block to do something
    try{
        // declaring a response and awaiting a response on the markComplete route
        const response = await fetch('markComplete', {
            // sets the CRUD method for the route, meaning update
            method: 'put',
            // specifing the type of content which is JSON
            headers: {'Content-Type': 'application/json'},
            // declare the message conent being passed and stringify that content
            body: JSON.stringify({
                // setting the content of the body to the inner text of the list item and naming it itemFromJS
                'itemFromJS': itemText
            })
          })
        //   waiting on JSON from response
        const data = await response.json()
        // log data
        console.log(data)
        // reloads the page and updates what is displayed
        location.reload()
    //  catch block to cartch error that might be thrown when try executes something above, if error occurs, catch it and pass it in
    }catch(err){
        // log the error 
        console.log(err)
    }
}

// declare an asynchronoud function called markUnComplete
async function markUnComplete(){
    // looks inside list item and grabs only the inner text in the list span and declares is as a variable. 
    const itemText = this.parentNode.childNodes[1].innerText
    // declare a try block to execute something
    try{
        // declare a response that awaits a fetch that will retrive some data from the markUnComplete route
        const response = await fetch('markUnComplete', {
            // Sets the CRUD method for the route, which is an update
            method: 'put',
            // specifing the type of content which is JSON
            headers: {'Content-Type': 'application/json'},
            // take this JSON data and make it to a string
            body: JSON.stringify({
                // setting the content of the body to the inner text of the list item and naming it itemFromJS
                'itemFromJS': itemText
            })
          })
        //   waiting on JSON from response
        const data = await response.json()
        // log the data
        console.log(data)
        // reloads page and updates it as well
        location.reload()
    // start a catch block that will pass error
    }catch(err){
        // log the error
        console.log(err)
    }
}