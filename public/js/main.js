const deleteBtn = document.querySelectorAll('.fa-trash') //create a variable called deleteBtn that will select every element with a class of fa-trash// 
const item = document.querySelectorAll('.item span') // creating a variable called item for all elements that are spans with a parent element with a class of item 
const itemCompleted = document.querySelectorAll('.item span.completed') // variable called itemCompleted that selects spans with a class of completed that are children of an element with class of item//

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) // makes an array from all deleteBtns and runs a foreach method which adds an event listener for clicks on them and runs function called deleteItem//

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})// makes an array of all items and runs foreach that adds an eventlistener to each item which runs markComplete function when clicked.//

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) // makes an array of all completed tasks and runs foreach which adds click event listener that runs function of markUncomplete//

async function deleteItem(){ // async function that can run asynchronously when delete buttons are clicked//
    const itemText = this.parentNode.childNodes[1].innerText // variable for item text taken from inner list span//
    try{//starts a try block to do something
        const response = await fetch('deleteItem', { // creates variable, awaits a fetch to get data from deleteItem function
            method: 'delete', //set CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifies type of content (json)
            body: JSON.stringify({ //declare the message being passed and stringify that content
              'itemFromJS': itemText //setting content of body to the innertext of the list item and naming it 'itemfromjs'
            })//close brackets of object
          })//close brackets
        const data = await response.json() // variable of data for when json responds
        console.log(data) //logs this data to console
        location.reload() // refreshes page to update the dom with new list where item is deleted

    }catch(err){ //if error occurs it is eneterd as param into catch block
        console.log(err) //logs error to console
    }//closes catch block
}//closes async function

async function markComplete(){ // declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of list item and grabs inner text within list span as a variable
    try{ // starting a try block
        const response = await fetch('markComplete', { //creates a response variable that waits on a fetch to get data from result of markComplete function
            method: 'put', //sets CRUD method to update for the route
            headers: {'Content-Type': 'application/json'}, //declare the message being passed and stringify that content
            body: JSON.stringify({
                'itemFromJS': itemText//setting content of body to the innertext of the list item and naming it 'itemfromjs'
            })//close body
          }) //close object
        const data = await response.json()//wait for JSON from response to be converted
        console.log(data) //log the result
        location.reload() //refresh page

    }catch(err){//catch block with error as the parameter
        console.log(err)//log error
    }//close catch block
}// end function

async function markUnComplete(){ //declare async function
    const itemText = this.parentNode.childNodes[1].innerText// looks inside of list item and grabs inner text within list span as a variable
    try{// starting a try block
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetch to get data from result of markComplete function
            method: 'put',//sets CRUD method to update for the route
            headers: {'Content-Type': 'application/json'},//declare the message being passed and stringify that content
            body: JSON.stringify({
                'itemFromJS': itemText//setting content of body to the innertext of the list item and naming it 'itemfromjs'
            })//close body
          })//close object
        const data = await response.json()//await the JSON from response to be converted
        console.log(data) //log data to console
        location.reload() //refresh page

    }catch(err){ //catch block opened with error as param
        console.log(err) //log error
    }//close catch block
} //close function