// declare variables to for ease of use
// deleteBtn grabs font awesome trash can
// item grabs span elements in item classes
// itemCompleted grabs all item spans with completed class 
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//create an array from every deleteBtn and add event listener to each one that runs deleteItem function on a click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//create an array from all spans with item classes and add event listener to each that runs markComplete function if clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//create an array from all item spans with completed class and add event listener to each that run markUnComplete function when clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//create an async await function for deleteItem
async function deleteItem(){
    //declare variable for the text value of the of the list span
    const itemText = this.parentNode.childNodes[1].innerText
    //starts a try block
    try{
        //creates variable response which waits on a fetch to grab data from the deleteItem route
        const response = await fetch('deleteItem', {
            method: 'delete', //sets method of delete for route
            headers: {'Content-Type': 'application/json'}, //specifies content type used will be json
            body: JSON.stringify({ //put message content into itemFromJS and turn it into a string
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //variable data which will hold the response from the delete fetch converted to json
        console.log(data) //console log the data received 
        location.reload() //reloads the page
    //catch for errors which console logs the error
    }catch(err){
        console.log(err)
    }
}

//create an async function called markComplete
async function markComplete(){
    //create variable to hold inner text of list span
    const itemText = this.parentNode.childNodes[1].innerText
    try{ //create try block
        //create response variable that awaits a fetch from the markComplete route
        const response = await fetch('markComplete', {
            method: 'put', //declares method put (update) for route
            headers: {'Content-Type': 'application/json'}, //specifies that content will be in json
            body: JSON.stringify({ //sets body message being passed and change to string
                'itemFromJS': itemText
            })
          })
          //creates data variable which waits for conversion of response to json
        const data = await response.json()
        console.log(data) //console logs previous data
        location.reload() //reloads the page

    }catch(err){
        console.log(err)
    }
}

//create async function for markUnComplete
async function markUnComplete(){
    //variable created to hold inner text of list
    const itemText = this.parentNode.childNodes[1].innerText
    //try block creates to await fetch from markUnComplete route
    try{
        const response = await fetch('markUnComplete', {
            method: 'put', //sets CRUD method for route to 'update'
            headers: {'Content-Type': 'application/json'}, //specifies json will be received
            body: JSON.stringify({
                'itemFromJS': itemText //setting content of body 
            })
          })
        const data = await response.json() //awaiting conversion to json
        console.log(data)
        location.reload() //reload page
    //create catch block to console log errors
    }catch(err){
        console.log(err)
    }
}