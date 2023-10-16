// connects delete button to .fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
// connects item to the .item span
const item = document.querySelectorAll('.item span')
// store elements with class name item span completed in itemCompleted variable
const itemCompleted = document.querySelectorAll('.item span.completed')

// loops through deleteBtn elements and adds click event
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// loops through item elements and adds click event 
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// loops through itemCompleted elements and adds click event
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// aync funtion to delete item
async function deleteItem(){
    // extracting text to be deleted from sibling span element within same parent node
    const itemText = this.parentNode.childNodes[1].innerText

    try{
        // request to specified url
        const response = await fetch('deleteItem', {
            // assinging method as delete
            method: 'delete',
            // assinging header content type application/json
            headers: {'Content-Type': 'application/json'},
            // sending body as JSON
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // parse response data
          //response sent from server
        const data = await response.json()
        // logs retreived data
        console.log(data)
        // refresh page
        location.reload()
    // catch error
    }catch(err){
        //log error
        console.log(err)
    }
}

// function to mark items complete
async function markComplete(){
    // get text from sibling span element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // Put response with markComplete
        const response = await fetch('markComplete', {
            // assinging method as put
            method: 'put',
            // assinging header content type application/json
            headers: {'Content-Type': 'application/json'},
            // sending body as JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // console log response
        const data = await response.json()
        console.log(data)
        //refresh page
        location.reload()
    //catch errors
    }catch(err){
        console.log(err)
    }
}

//function to mark uncomplete
async function markUnComplete(){
    // get text from sibling span element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // sending PUT request to API endpoint
        const response = await fetch('markUnComplete', {
             // assinging method as put
            method: 'put',
            // assinging header content type application/json
            headers: {'Content-Type': 'application/json'},
            // sending body as JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
           // console log response
        const data = await response.json()
        console.log(data)
        //refresh
        location.reload()
    //catch errors and log
    }catch(err){
        console.log(err)
    }
}