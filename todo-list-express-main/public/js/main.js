//Looks for the classes and elements specified in parentheses
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed') 
//select all of these

//Calls deleteItem() function on click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) //add the delete buttons into an event listener

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) //add all items to an event listener

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//add all complete items into an event listener

async function deleteItem(){ //start function, await response, delete some stuff
    const itemText = this.parentNode.childNodes[1].innerText //direct reference- grab parent, then child, second one, then text, or can use class or ID
    try{ 
        const response = await fetch('deleteItem', { //if anything in here fails, go to catch; 
            method: 'delete', //label as delete
            headers: {'Content-Type': 'application/json'}, //make it JSON
            body: JSON.stringify({ //make it a string
              'itemFromJS': itemText //ties into our server.js delete
            })
          })
        const data = await response.json() //awaited response, now we need to read it
        console.log(data) //say we got data back
        location.reload() //refresh the page

    }catch(err){ //something failed
        console.log(err) //here's what failed
    }
}

async function markComplete(){ //we are updating some stuff
    const itemText = this.parentNode.childNodes[1].innerText //see notes  above (line 22); they match up from the deleteItem function
    try{ 
        const response = await fetch('markComplete', { //
            method: 'put', //different method
            headers: {'Content-Type': 'application/json'}, //make sure it's JSON
            body: JSON.stringify({ //make it a string
                'itemFromJS': itemText //links us to the server.js
            })
          })
        const data = await response.json() //we waited now reading it
        console.log(data) //we got a response
        location.reload() //refresh page

    }catch(err){ //there was an error
        console.log(err) //this is what to fix
    }
}

async function markUnComplete(){ //same code as above, but uncomplete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
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