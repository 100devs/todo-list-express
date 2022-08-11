const deleteBtn = document.querySelectorAll('.fa-trash') //select the trash can icon, and store it in a variable

const item = document.querySelectorAll('.item span') //select the span elements that are children of .item, and stores them in a variable

const itemCompleted = document.querySelectorAll('.item span.completed') //select the span.copmleted elements (children of .item) and stores them in a variable


//add event listeners to each element in the deleteBtn Array (trashcans)
Array.from(deleteBtn).forEach((element)=>{
 
    element.addEventListener('click', deleteItem) //add the click event that can be used to invoke deletion
    
})

Array.from(item).forEach((element)=>{
    //add event listener to each element in the item Array
    element.addEventListener('click', markComplete)
    //add the click event, invoke markComplete
})

Array.from(itemCompleted).forEach((element)=>{
    //add event listener to each item in the item array
    element.addEventListener('click', markUnComplete)
    //add the click event, invoke 'markUncomplete'
})

//declaring async function for the delete protocol
async function deleteItem(){
    
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            //fetch changes the URL path to /deleteItem
            // the second paramter is an object specifying the details of the request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        //the 'Todo Deleted' object is stored in a variable called data
        console.log(data)
        //console log the data
        location.reload()
        //refreshes the page to the root directory

    }catch(err){
        console.log(err)
    }
    //error handling
}

async function markComplete(){
    //this is the function that UPDATES the span to be completed (add's the strike through text)
    const itemText = this.parentNode.childNodes[1].innerText
    //this 
    try{
        const response = await fetch('markComplete', {
            //the fetch requests a url path that calls a function that lives in the server.js
            //specifies the info about the request
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        //wait for the json to come back, and store it in a variable named 'data'
        console.log(data)
        //console log it
        location.reload()
        //refresh the page back to '/'

    }catch(err){
        console.log(err)
        //error handling
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    //grab the item text
    try{
        const response = await fetch('markUnComplete', {
            //changes our path to '/markUncomplete'
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //CONTENT-TYPE determines what language to expect
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        //wait for the data and store it in a variable
        console.log(data)
        //console log it
        location.reload()
        //refresh the page '/'

    }catch(err){
        console.log(err)
    }
    //error handling
}