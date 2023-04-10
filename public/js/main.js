const deleteBtn = document.querySelectorAll('.fa-trash') //assigning the .fa-trash icon to const deleteBtn
const item = document.querySelectorAll('.item span') //assigning .item and spans to const item
const itemCompleted = document.querySelectorAll('.item span.completed')//assigning .item and span.completed to const itemCompleted

//creates array from items in deleteBtn and starts a for loop for each
Array.from(deleteBtn).forEach((element)=>{
    //add smurf to hear click, if click happens call deleteItem Function
    element.addEventListener('click', deleteItem)
})
//creates array from items in item and starts a for loop for each
Array.from(item).forEach((element)=>{
    //add smurf to hear click, if click happens call markComplete Function
    element.addEventListener('click', markComplete)
})
//creates array from items in itemCompleted and starts a for loop for each
Array.from(itemCompleted).forEach((element)=>{
    //add smurf to hear click, if click happens call markUnComplete Function
    element.addEventListener('click', markUnComplete)
})

//create async function deleteItem that does the following:
async function deleteItem(){
    //go the the parent of the item this (which was clicked on), the go the the child with the index of 1, then assign that child's inner text to itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //try to do the following, if unable trigger error
    try{
        //await a fetch sent to the server route deleteItem. response is a variable created and assigned to the server's response from the result of the deleteItem Route. 
        const response = await fetch('deleteItem', {
            //set CRUD method delete, for the route.
            method: 'delete',
            //specify the type of content returned, JSON.
            headers: {'Content-Type': 'application/json'},
            //convert value to a JSON String
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //assigns the const variable data to the awaited response value converted to JSON
        const data = await response.json()
        //console logs data
        console.log(data)
        //refreshes browser
        location.reload()
          //catch any potential errors, if there are any console.log them
    }catch(err){
        console.log(err)
    }
}

//create async function markComplete that does the following:
async function markComplete(){
    //go to this clicked on items parent, then go to index 1, assign the innerText value to the const itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //try to do the following, if unable catch error.
    try{
        //await a fetch sent to the server route markComplete, assign the return value to response.
        const response = await fetch('markComplete', {
            //set CRUD method put, for the route.
            method: 'put',
            //specify the conent type as JSON
            headers: {'Content-Type': 'application/json'},
            //turn the JSON into a string
            body: JSON.stringify({
                //assigns the clicked on items, parent's, index 1 child's inner-text to 'itemsFromJS' so that the deleteItem route on the server knows what to delete. 
                'itemFromJS': itemText
            })
          })
          //instantiate data equal to the awaited JSON response. (will be confimation of action completed)
        const data = await response.json()
        //console.log that data
        console.log(data)
        //refresh the browser
        location.reload()
    //catch any potential errors, if there are any console.log them
    }catch(err){
        console.log(err)
    }
}

//create async function markUncomplete that does the following:
async function markUnComplete(){
    //go to this clicked on items parent, then go to index 1, assign the innerText value to the const itemText
    const itemText = this.parentNode.childNodes[1].innerText
    //try to do the following, if unable catch error.
    try{
        //await a fetch sent to the server route markUncomplete, asign it's return to response.
        const response = await fetch('markUnComplete', {
            //declare the crud method being used
            method: 'put',
            //declare the type of content we expect
            headers: {'Content-Type': 'application/json'},
            //this parses the JSON contents into a string. 
            body: JSON.stringify({
                //assigns the clicked on items, parent's, index 1 child's inner-text to 'itemsFromJS' so that the markUncomplete route on the server knows what to mark. 
                'itemFromJS': itemText
            })
          })
        //instantiate data equal to the awaited JSON response. (will be confimation of action completed)
        const data = await response.json()
        //console.log that data
        console.log(data)
        //refresh browser
        location.reload()
//catch any potential errors, if there are any console.log them
    }catch(err){
        console.log(err)
    }
}