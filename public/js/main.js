//assigning elements with the class of fa-trash to the variable deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
//assigning elements with the class of item span to the variable item
const item = document.querySelectorAll('.item span')
//assigning elements with the class of completed AND a parent element with the class of item to the variable itemCompleted
const itemCompleted = document.querySelectorAll('.item span.completed')

//creates an array from selection and starts a loop
Array.from(deleteBtn).forEach((element)=>{
    //adds an event listener that calls the deleteItem function on click
    element.addEventListener('click', deleteItem)
})

//creates an array from selection and starts a loop
Array.from(item).forEach((element)=>{
    //adds an event listener that calls the markComplete function on click
    element.addEventListener('click', markComplete)
})

//creates an array from selection and starts a loop
Array.from(itemCompleted).forEach((element)=>{
    //adds an event listener that calls the markUnComplete function on click
    element.addEventListener('click', markUnComplete)
})

//defining the asynchronous function deleteItem
async function deleteItem(){
    //assigns the inner text of the list item span to a variable
    const itemText = this.parentNode.childNodes[1].innerText
    //try the following code first
    try{
        //assigns the fetch function to a variable, waits on the fetch to actually get the data from the deleteItem route before assigning that data to the variable, 
        const response = await fetch('deleteItem', {
            //method is to delete/remove from database
            method: 'delete',
            //specifiying that we'll be dealing with JSON
            headers: {'Content-Type': 'application/json'},
            //turn the response data into a string
            body: JSON.stringify({
                //setting body content to the inner text of the list item, naming it itemFromJS
              'itemFromJS': itemText
              //close stringify
            })
            //close fetch
          })
        //waited for the response, now that we have it we're awaiting converting the response data into json
        const data = await response.json()
        //console log the response
        console.log(data)
        //reload the page and display the updates
        location.reload()
    //if there is an error, do the following     
    }catch(err){
        //console log the error
        console.log(err)
    //close catch
    }
//close function
}

//creating an asynchronous function called markComplete
async function markComplete(){
    //assigns the inner text of the list item span to a variable
    const itemText = this.parentNode.childNodes[1].innerText
    //try the following code first
    try{
        //assigns the fetch function to a variable, waits on the fetch to actually get the data from the markComplete route before assigning that data to the variable
        const response = await fetch('markComplete', {
            //method is to put new item into database
            method: 'put',
            //specifiying that we'll be dealing with JSON
            headers: {'Content-Type': 'application/json'},
            //turn the response data into a string
            body: JSON.stringify({
                //setting body content to the inner text of the list item, naming it itemFromJS
                'itemFromJS': itemText
            //close stringify
            })
            //close fetch
          })
        //waited for the response, now that we have it we're awaiting converting the response data into json
        const data = await response.json()
        //console log response data
        console.log(data)
        //reload the page to display updates
        location.reload()
    //if there is an error, do the following   
    }catch(err){
        //console log the error
        console.log(err)
    //close catch
    }
//close function
}

//creating an asynchronous function called markUnComplete
async function markUnComplete(){
    //assigns the inner text of the list item span to a variable
    const itemText = this.parentNode.childNodes[1].innerText
    //try the following code first
    try{
        //assigns the fetch function to a variable, waits on the fetch to actually get the data from the markUnComplete route before assigning that data to the variable
        const response = await fetch('markUnComplete', {
            //method is to add item to database
            method: 'put',
            //specifiying that we'll be dealing with JSON
            headers: {'Content-Type': 'application/json'},
            //turn the response data into a string
            body: JSON.stringify({
                //setting body content to the inner text of the list item, naming it itemFromJS
                'itemFromJS': itemText
            //close stringify
            })
            //close try
          })
        //waited for the response, now that we have it we're awaiting converting the response data into json
        const data = await response.json()
        //console log response
        console.log(data)
        //reload window to display changes
        location.reload()
    //if there is an error, do the following 
    }catch(err){
        //console log the error
        console.log(err)
    //close catch
    }
//close function
}