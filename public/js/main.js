const deleteBtn = document.querySelectorAll('.fa-trash')
// creates a variable of all trashcan elements
const item = document.querySelectorAll('.item span')
// creates a variable assigns it to a selection  of span tage that have a t class of itm
const itemCompleted = document.querySelectorAll('.item span.completed')
// creating spand with a class of completes inside of a parent class of item

Array.from(deleteBtn).forEach((element)=>{
    // creating an array for each of the delete buttons, event listener waits for 'click' event
    element.addEventListener('click', deleteItem)
    // on click deletes item
})
// loop is closed

Array.from(item).forEach((element)=>{
    // creates an array for all other items. iterates through all items an marks complete whn they have been completed.
    element.addEventListener('click', markComplete)
    // on click it is marked complere
})
// loop is closed

Array.from(itemCompleted).forEach((element)=>{
       // creating an array for each of the item completed, event listener waits for 'click' event
    element.addEventListener('click', markUnComplete)
    // only tasks marked as complete get addded to this Array
})

async function deleteItem(){
    // function has been referenced it can now be called. now declaring an asynchronus function
    const itemText = this.parentNode.childNodes[1].innerText
    // selects some innertext, deals with the childnode insise of the parent node. looks inside the list item and grrabs only the innertext in the list span 
    try{
        // start a try block  tries to do the action in the block
        const response = await fetch('deleteItem', {
            // creates a response variable that waits on a fetch to get data from the results of the deleteItem block           
             method: 'delete',
            //  sets CRUD methos for the route
            headers: {'Content-Type': 'application/json'},
            // specifies the type of content expected, in this case JSON
            body: JSON.stringify({
                // declares the message content being passed and stringifying that content
              'itemFromJS': itemText
            //   setting the content of the body to the inner teext of the list ite and naming it 'itemFromJS'
            })
            // close body 
          })
        //   close object
        const data = await response.json()
        // waiting in the JSON fromthe response to be converted
        console.log(data)
        // log data to console
        location.reload()
        // reloads page to update the new data

    }catch(err){
        // if an error orrurs pass the error into the catch block
        // if try block fails, error block runs
        console.log(err)
        // error is logged to the console
    }
    // close catch block
}
// end function

async function markComplete(){
    // declaring an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText
    // looks inside the list item and grabs inner text from list in the span
    try{
        // starting a try block to do another thing
        const response = await fetch('markComplete', {
            // creates a response varaible that waits o a fetch to get data from the result of markComplete route
            method: 'put',
             // setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'},
            // specifyin the type of contect expected, in this case JSON
            body: JSON.stringify({
                // deelcare the content being pasessed and stringyfying it
                'itemFromJS': itemText
                // setting the content of the body to the inner text of the list item, and naming it 'itemFrom JS'
            })
            // closing the body
          })
        //   closing the object


        const data = await response.json()
        // waiting for JSON response to be converted
        console.log(data)
        // console log data
        location.reload()
        // reloads the page to display no data

    }catch(err){
        // runs the catch if  the try fails
        console.log(err)
        // console logs error
    }
    // close catch block
}
// end function

async function markUnComplete(){
    // asynchronious function called markUncomplete
    const itemText = this.parentNode.childNodes[1].innerText
    // 
    try{
        // runs try block
        const response = await fetch('markUnComplete', {
             // creates a response varaible that waits o a fetch to get data from the result of markComplete route
            method: 'put',
              // setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'},
            // specifyin the type of contect expected, in this case JSON
            body: JSON.stringify({
                   // delcare the content being pasessed and stringyfying it
                'itemFromJS': itemText
                    // setting the content of the body to the inner text of the list item, and naming it 'itemFrom JS'
            })
               // closing the body
          })
        //   close the object
        const data = await response.json()
            // waiting for JSON response to be converted
        console.log(data)
        // console log data once JSON is received
        location.reload()
        // reload to show data

    }catch(err){
        // catch error if try fials
        console.log(err)
        // console logs error
    }
    // close catch block
}
// close function