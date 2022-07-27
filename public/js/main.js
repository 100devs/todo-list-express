const deleteBtn     = document.querySelectorAll('.fa-trash') //declare delete button as a variable, reach into the DOM selecting our trash icon 
const item          = document.querySelectorAll('.item span') //declaring item as a variable, reach into the DOM and select .item span class
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // add the deleteBtns into an event listener
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //add all items to an event listener
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // add all complete items into an event listener
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // this item text is the content inside the elemt which is inside the child node that lays inside the parent (direct reference) - try to use classes or id's/datatags instead of this 
    try{
        const response = await fetch('deleteItem', { 
            method : 'delete', // labeling the method as delete
            headers: {'Content-Type': 'application/json'}, //make it into json
            body   : JSON.stringify({ //turn into a string
              'itemFromJS': itemText //ties into our server.js delete
            })
          })
        const data = await response.json() //wait for response with data so we can read it
        console.log(data) //print the data we receive into our console
        location.reload() //refresh page

    }catch(err){ // if something fails, catch error when our promise doesn't fulfill
        console.log(err) // print the error to console
    }
}

async function markComplete(){ // function to update as we mark complete
    const itemText = this.parentNode.childNodes[1].innerText // this item text is the content inside the elemt which is inside the child node that lays inside the parent (direct reference) - try to use classes or id's/datatags instead of this 
    try{
        const response = await fetch('markComplete', { // declare variable to hold fetch data
            method : 'put', //define method being used
            headers: {'Content-Type': 'application/json'}, //make it json data
            body   : JSON.stringify({ //turn it into a string
                'itemFromJS': itemText //link us to server.js
            })
          })
        const data = await response.json() //wait for a response in json
        console.log(data) //print data we received to console
        location.reload() //refresh the page

    }catch(err){ //detect any errors with our promise fulfilling
        console.log(err) //print the error to our console
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method : 'put',
            headers: {'Content-Type': 'application/json'},
            body   : JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}