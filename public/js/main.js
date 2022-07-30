//variable to select all of the delete buttons
const deleteBtn = document.querySelectorAll('.fa-trash')
//variable to select all items
const item = document.querySelectorAll('.item span')
//variable to select all items with the class of completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates an array from all the delete buttons and creates a click event listener for each one
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//creates an array from all the task items and creates a click event listener for each one
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//creates an array from all the completed task items and creates a click event listener for each one
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//asynchronous function for deleting an item
async function deleteItem(){
    //makes a variable the holds the text from the item to be deleted or in other words, it holds the text from whatever was just clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //makes a delete request in our server.js and it passes to it the second argument.
        const response = await fetch('deleteItem', {
            //specifies that we want to make a delete request
            method: 'delete',
            //specifies that we are sending json
            headers: {'Content-Type': 'application/json'},
            //turns the itemText variable to our server as a variable called itemFromJS as json
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //turns the response from above into data that we can work on
        const data = await response.json()
        //console logs the data from above
        console.log(data)
        //refreshes the page so that the screen is updated from the work above
        location.reload()

    }catch(err){
        //shows error message if something went wrong with the fetch
        console.log(err)
    }
}

async function markComplete(){
    //saves the text from the clicked item into the variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //makes a put fetch request to the server
        const response = await fetch('markComplete', {
            //specifiying that it is a put
            method: 'put',
            //specifying that we are sending json
            headers: {'Content-Type': 'application/json'},
            //sends the server a variable itemFromJS in the form of json
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //turns the above response into data
        const data = await response.json()
        //console logs the data
        console.log(data)
        //refreshes the page
        location.reload()

    }catch(err){
        //console logs an error if the fetch went wrong
        console.log(err)
    }
}

async function markUnComplete(){
    //saves the text from the clicked button into this variable
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //makes a fetch request to the server to un-check a task
        const response = await fetch('markUnComplete', {
            //specifies that it is a put method which is used to update something
            method: 'put',
            //specifying that we are sending the server json
            headers: {'Content-Type': 'application/json'},
            //takes the itemText variable we made earlier and sends it to the server only renamed to itemFromJS and makes it into json which is how the server understands it
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //takes the above response from the server and then parses the returned json into js
        const data = await response.json()
        //and then console logs it
        console.log(data)
        //finally refreshes the page
        location.reload()

    }catch(err){
        //console logs an error if the fetch went wrong
        console.log(err)
    }
}