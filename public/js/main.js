// stores trashcan into variable
const deleteBtn = document.querySelectorAll('.fa-trash')
// stores all items and spans into item variable
const item = document.querySelectorAll('.item span')
// stores all completed items into itemCompleted variable
const itemCompleted = document.querySelectorAll('.item span.completed')

//create an array from trashcans and run for loop
Array.from(deleteBtn).forEach((element)=>{
    //for each element, add event listener that calls deleteItem function on click
    element.addEventListener('click', deleteItem)
})

// create array from items and run for loop
Array.from(item).forEach((element)=>{
    //for each element, add event listener that calls markComplete function on click
    element.addEventListener('click', markComplete)
})

// create array from items and run for loop
Array.from(itemCompleted).forEach((element)=>{
    //for each element, add event listener calls marksUnComplete function on click
    element.addEventListener('click', markUnComplete)
})

//asynchronous function called when trashcan is clicked
async function deleteItem(){
    // create constant storing the text of the selected element
    const itemText = this.parentNode.childNodes[1].innerText
    //try block for attempt
    try{
        //creates varaible that waits on a fetch to get data from the result of the deleteItem route (in server)
        const response = await fetch('deleteItem', {
            //defines method as delete for deletion
            method: 'delete',
            //creates neccessary headers that specfies the type of content expected, which is json
            headers: {'Content-Type': 'application/json'},
            //turns the item into a json string and sets that string as the message content being passed for the body
            body: JSON.stringify({
                //sets content of body to innertext of selected item into 'itemFromJS' property
                'itemFromJS': itemText
            }) //close body
          }) //close object
        //waits for json response from server to store into variable
        const data = await response.json()
        //logs resonse
        console.log(data)
        //reloads page
        location.reload()
    //if try block fails
    }catch(err){
        //log reason for failure
        console.log(err)
    } // close catch
} //close delete funtion

//asynchronous function called when span is clicked
async function markComplete(){
    //stores innertext of selected element
    const itemText = this.parentNode.childNodes[1].innerText
    //try block for attempt
    try{
        //create variable that wais on a fetch to get data from the result of the markComplete route (in server)
        const response = await fetch('markComplete', {
            //defines method as put method for updating
            method: 'put',
            //specifies type of content expected
            headers: {'Content-Type': 'application/json'},
            //turns item into a json string and sets string as the message content being passed for the body
            body: JSON.stringify({
                //sets content of body to innertext of selected item into 'itemFromJS' property
                'itemFromJS': itemText
            })// close body
          })// close fetch
        //waits for response from server to store into variable
        const data = await response.json()
        //logs data from reponse
        console.log(data)
        //reloads page
        location.reload()
    }// close try block
    //if try block fail
    catch(err){
        //log reason for failure
        console.log(err)
    }// close catch
} //close update function

//asynchronous function called when item with completed class is click
async function markUnComplete(){
    //stores inner text of selected element into constant
    const itemText = this.parentNode.childNodes[1].innerText
    //try block
    try{
        //creates constant that waits for fetch to get data from the result of markUnComplete endpoint
        const response = await fetch('markUnComplete', {
            //defines put method for updating
            method: 'put',
            //specifies the type of content expected
            headers: {'Content-Type': 'application/json'},
            //turns item into json string and stores it into body
            body: JSON.stringify({
                //sets content of body to innertext of selected item from 'itemFromJS' property
                'itemFromJS': itemText
            })//close body
          })//close fetch]
        //waits for response from server (as json) to store into constant
        const data = await response.json()
        //logs data from server
        console.log(data)
        //reload page
        location.reload()
    }// close try
    //error handling
    catch(err){
        //log reason for failure
        console.log(err)
    }
}