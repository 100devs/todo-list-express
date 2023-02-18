// setting up for event listeners with variables on html elements 
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//create an array from selection, start a loop
Array.from(deleteBtn).forEach((element)=>{
     //add an event listener to current item that waits for a click, once clicked, calls function "deleteItem"
    element.addEventListener('click', deleteItem)
})
//create an array from selection, start a loop
Array.from(item).forEach((element)=>{
    //add an event listener to current item that waits for a click, once clicked, calls function "markComplete"
    element.addEventListener('click', markComplete)
})
//create an array from selection, start a loop
Array.from(itemCompleted).forEach((element)=>{
    //add an event listener to current item that waits for a click, once clicked, calls function "markUnComplete"
    element.addEventListener('click', markUnComplete)
})
 //declare asynchronous function
async function deleteItem(){
    //look inside of list item to extract text value of the specified list item
    const itemText = this.parentNode.childNodes[1].innerText
    try{ //declare a try block
        //create a response variable that waits on a fetch to get data from the result of "deleteItem" route
        const response = await fetch('deleteItem', {
            method: 'delete',//set CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specify type of content expected (JSON)
            //declare the message content being passed and turn into a string
            body: JSON.stringify({
                //set the content of the body to the inner text of the list item, and naming it "itemFromJS"
              'itemFromJS': itemText
            })//close body
          })//close object
          //wait on JSON converstion from the response
        const data = await response.json()
        console.log(data) //log data to console
        location.reload() //refresh page to update display
//declare catch block, if an error occurs, pass into the catch block
    }catch(err){
        console.log(err) //log the error to the console
    } //close catch block
} //end of function

async function markComplete(){ //declare asynchronous function
    //look inside of list item to extract text value only of the specified list item
    const itemText = this.parentNode.childNodes[1].innerText
    try{ //declare try block
        //create a response variable that waits on a fetch to get data from the result of "markComplete" route
        const response = await fetch('markComplete', {
            method: 'put', //set CRUD method for the route
            //specify type of content expected (JSON)
            headers: {'Content-Type': 'application/json'},
            //declare the message content being passed and turn into a string
            body: JSON.stringify({
                //set the content of the body to the inner text of the list item, and naming it "itemFromJS"
                'itemFromJS': itemText
            }) //close body
          }) //close object
        const data = await response.json() //wait on JSON from the response
        console.log(data) //log the data to the console
        location.reload() //refresh page to update display

    }catch(err){ //declare catch block
        console.log(err) //log error to console
    } //close catch block
} //end function

async function markUnComplete(){ //declare async function
        //look inside of list item to extract text value only of the specified list item

    const itemText = this.parentNode.childNodes[1].innerText
    try{ //declare try block
        //create a response variable that waits on a fetch to get data from the result of "markUnComplete" route
        const response = await fetch('markUnComplete', {
            //set CRUD method for the route
            method: 'put',
            //specify type of content expected (JSON
            headers: {'Content-Type': 'application/json'},
            //declare the message content being passed and turn into a string
            body: JSON.stringify({
                //set the content of the body to the inner text of the list item, and naming it "itemFromJS"
                'itemFromJS': itemText
            }) //close body
          }) //close object 
          //wait on JSON converstion from the response
        const data = await response.json()
        console.log(data) //log data to console
        location.reload() //refresh to update the display

    }catch(err){ //declare try block
        console.log(err) //log details of error
    } //close catch block
} //end function