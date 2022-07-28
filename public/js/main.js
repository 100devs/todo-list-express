//sets the deleteBtn variable equal to all elements with class fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//sets item variable equal to all elements with .item class parents that are spans
const item = document.querySelectorAll('.item span')
//sets itemsCompleted variable equal to all elements with item class parents that are spans and have completed class
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates an array from the elements in the deleteBtn variable and loops through them
Array.from(deleteBtn).forEach((element)=>{
    //adds a click event listener to each item that runs deleteItem function
    element.addEventListener('click', deleteItem)
})

//creates an array from the elements in the item variable and loops through them
Array.from(item).forEach((element)=>{
    //adds a click event listener to all of them that runs markComplete function
    element.addEventListener('click', markComplete)
})

//creates an araray from elements in itemCompleted variable and loops through them
Array.from(itemCompleted).forEach((element)=>{
    //adds a click event listener to all of the elements that runs markUncomplete function
    element.addEventListener('click', markUnComplete)
})

//cretes an async function named delete items
async function deleteItem(){
    //creates a variable and goes the parent node of the item clicked, then takes innerText of the first childNodes
    const itemText = this.parentNode.childNodes[1].innerText
    //try blocks runs
    try{
        //creates a response variable and set it equal to the fetch to deleteItems path in API
        const response = await fetch('deleteItem', {
            //sets method to delete
            method: 'delete',
            //sets header content-type property to application/json
            headers: {'Content-Type': 'application/json'},
            //sets body property to a JSON string
            body: JSON.stringify({
               //sends itemsFromJS property equal to itemText which is the name of the todo list item
              'itemFromJS': itemText
            })
          })
        // sets data equal to response as json
        const data = await response.json()
        //should tell us it has been deleted in the console
        console.log(data)
        //reloads the page so that u can see the updates
        location.reload()

    }
    //if something in try block errors out and comes down here and gets logged to the console
    catch(err){
        console.log(err)
    }
}

//creates an async function named markComplete
async function markComplete(){
    //creates a variable and goes the parent node of the item clicked, then takes innerText of the first childNodes
    const itemText = this.parentNode.childNodes[1].innerText
    //the try block runs
    try{
        //creates a response variable that is a fetch to the markComplete path in the api
        const response = await fetch('markComplete', {
            //sets method to put which is update
            method: 'put',
            //headers content type is application-json
            headers: {'Content-Type': 'application/json'},
            //turns the body into json
            body: JSON.stringify({
                //sends the property 'itemsFromJS' and it's equal to the itemText variable which is the name of the todo list item
                'itemFromJS': itemText
            })
          })
        // sets data equal to the response from the backend once it arrives
        const data = await response.json()
        //logs the data which should tell us it was updated
        console.log(data)
        //reloads the page to see the update
        location.reload()

    }
    //if something in try block errors out and comes down here and gets logged to the console
    catch(err){
        console.log(err)
    }
}

//creates async function named markUncomplete
async function markUnComplete(){
    //creates itemText var from the item clickeds parent's first child node's inner text
    const itemText = this.parentNode.childNodes[1].innerText
    //try block runs
    try{
        //sets response variable equal to a fetch to the makrUnComplete path in api
        const response = await fetch('markUnComplete', {
            //sets method to put/update request
            method: 'put',
            //headers content-type property is set to application/json
            headers: {'Content-Type': 'application/json'},
            //the body is turned into json
            body: JSON.stringify({
                //itemsFromJs property is set with itemText as its value which is the name of the todolist item
                'itemFromJS': itemText
            })
          })
        //data is set to equal response once it arrives
        const data = await response.json()
        //should console log that is has been completed
        console.log(data)
        //reload the page to show your changes
        location.reload()

    }
    //if something in try block errors out and comes down here and gets logged to the console
    catch(err){

        console.log(err)
    }
}