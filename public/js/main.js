//set 'deleteBtn' variable to select html class of '.fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
//set 'item' variable to an element of 'span' within an element that has a class of 'item'
const item = document.querySelectorAll('.item span')
//set 'itemCompleted' variable to element of span with a class of completed within an element with the class of item
const itemCompleted = document.querySelectorAll('.item span.completed')

//Creates an array from all items within 'deleteBtn'. Foreach item add event listener
Array.from(deleteBtn).forEach((element)=>{
    //Create event listener on click that runs the function deleteItem
    element.addEventListener('click', deleteItem)
})

//Creates an array from all items within 'item'. Foreach item add event listener
Array.from(item).forEach((element)=>{
    //Create event listener on click that runs the function markComplete
    element.addEventListener('click', markComplete)
})

//Creates an array from all items within 'itemCompleted'. Foreach item add event listener
Array.from(itemCompleted).forEach((element)=>{
    //Create event listener on click that runs the function markUnComplete
    element.addEventListener('click', markUnComplete)
})

//Set up an async function named deleteItem
async function deleteItem(){
    //set 'itemText' to parentNode.childnode second child's innerText
    const itemText = this.parentNode.childNodes[1].innerText
    //Try catch block for error handleling
    try{
        //set response to await fetch of deleteItem from server.js
        const response = await fetch('deleteItem', {
            //method set to delete
            method: 'delete',
            //headers set to Content-Type: application/json
            headers: {'Content-Type': 'application/json'},
            //body set to stringified json
            body: JSON.stringify({
                //grabs text from itemFromJS and sends it to server
              'itemFromJS': itemText
            })
          })
        //Set data to await the value of response.json() 
        const data = await response.json()
        //console.log the data
        console.log(data)
        //refresh window
        location.reload()
    
    //Catch errors
    }catch(err){
        //console log errors
        console.log(err)
    }
}

//Set up an async function named markComplete
async function markComplete(){
    //set 'itemText' to parentNode.childnode second child's innerText
    const itemText = this.parentNode.childNodes[1].innerText
    //Try catch block for error handleling
    try{
        //set response to await fetch of markComplete from server.js
        const response = await fetch('markComplete', {
            //method set to put
            method: 'put',
            //headers set to Content-Type: application/json
            headers: {'Content-Type': 'application/json'},
            //body set to stringified json
            body: JSON.stringify({
                //grabs text from itemFromJS and sends it to server
                'itemFromJS': itemText
            })
          })
        //Set data to await the value of response.json() 
        const data = await response.json()
        //console.log the data
        console.log(data)
        //refresh window
        location.reload()

    //Catch errors
    }catch(err){
        //console log errors
        console.log(err)
    }
}

//Set up an async function named markUnComplete
async function markUnComplete(){
    //set 'itemText' to parentNode.childnode second child's innerText
    const itemText = this.parentNode.childNodes[1].innerText
    //Try catch block for error handleling
    try{
        //set response to await fetch of markUnComplete from server.js
        const response = await fetch('markUnComplete', {
            //method set to put
            method: 'put',
            //headers set to Content-Type: application/json
            headers: {'Content-Type': 'application/json'},
            //body set to stringified json
            body: JSON.stringify({
                //grabs text from itemFromJS and sends it to server
                'itemFromJS': itemText
            })
          })
        //Set data to await the value of response.json() 
        const data = await response.json()
        //console.log the data
        console.log(data)
        //refresh window
        location.reload()

    //Catch errors
    }catch(err){
        //console log errors
        console.log(err)
    }
}