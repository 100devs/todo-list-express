//set 'deleteBtn' varable to select html class of '.fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
//set 'item' variable to an element of span within an element that has a class of 'item'
const item = document.querySelectorAll('.item span')
//set 'itemCompleted' variable to element of span with a class of completed within an element with the class of item
const itemCompleted = document.querySelectorAll('.item span.completed')

//Creates an array from all items within trash. For each item add event listener
Array.from(deleteBtn).forEach((element)=>{
    //Create event listener on click that runs the function deleteItem
    element.addEventListener('click', deleteItem)
})//closes the loop
//Creates an array from all items within 'item'. Foreach item add event listener
Array.from(item).forEach((element)=>{
    //Create event listener on click that runs the function markComplete
    element.addEventListener('click', markComplete)
})//closes the loop

//Creates an array from all items within 'itemCompleted'. For each itme add event listener
Array.from(itemCompleted).forEach((element)=>{
    //Create event listener on click that runs the function markUnComplete
    element.addEventListener('click', markUnComplete)
})//closes the loop

//Setup an async function named deleteItem
async function deleteItem(){
    //set 'itemText' to parentNode.childnode second child's innerText
    const itemText = this.parentNode.childNodes[1].innerText
    //Try catch block for error handeling
    try{
        //set response to await fetch of deleteItem from server.js
        const response = await fetch('deleteItem', {
            //method set to delete
            method: 'delete',
            //headers set to Content-Type: application/json
            headers: {'Content-Type': 'application/json'},
            //body set to stringify json
            body: JSON.stringify({
                //setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
              'itemFromJS': itemText
            })//closing the body
          })//closing the object
        //set data to await the value of response.json()   
        const data = await response.json()
        //console.log the data
        console.log(data)
        //refresh window
        location.reload()

    //Catch errors    
    }catch(err){
        //log the error to the console
        console.log(err)
    }//close the catch block
}//end the function

async function markComplete(){//declare an async function called markComplete
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span.
    try{//startign a try block to do something
        const response = await fetch('markComplete', {//creates a response variable that waits on a fetch to get data from the result of the markComplete route
            //method set to put to 'update' for the route
            method: 'put',
            headers: {'Content-Type': 'application/json'}, //specifying the type of contecnt expected, which is JSON
            body: JSON.stringify({//declare the message content being passes, and stringifying that content
                'itemFromJS': itemText// setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//closing the body
          })//closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data)//log the result to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){ //if an error occures, pass the error into the catch block
        console.log(err) //log the error to the console
    }//closing the catch block
} //end the function

async function markUnComplete(){ //declare an async function called markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span.
    try{ //startign a try block to do something
        const response = await fetch('markUnComplete', { //creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put', //method set to put to 'update' for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of contecnt expected, which is JSON
            body: JSON.stringify({ //declare the message content being passes, and stringifying that content
                'itemFromJS': itemText // setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            }) //closing the body
          }) //closing the object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log the result to the console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ //if an error occures, pass the error into the catch block
        console.log(err) //log the error to the console
    } //closing the catch block
} //end the function