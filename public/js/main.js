const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//Select all of these

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // add the deleteBtns into an event listener
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{// Add all complete Items into an Event Listener
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){// Deleting things.
    const itemText = this.parentNode.childNodes[1].innerText//Direct reference - Grab the parent, then child, second one, then text.
    //Text- Don't do this use classes,ids,datatags,etc you animal.
    try{
        const response = await fetch('deleteItem', {//This happens
            method: 'delete',
            headers: {'Content-Type': 'application/json'},//Make it into json
            body: JSON.stringify({//Make it a string
              'itemFromJS': itemText //Ties into our server.js delete
            })
          })
        const data = await response.json() //We got it back
        console.log(data)//We got it back
        location.reload()//Refresh the page

    }catch(err){//Something failed.
        console.log(err)
    }
}

async function markComplete(){//
    const itemText = this.parentNode.childNodes[1].innerText//See notes above
    try{
        const response = await fetch('markComplete', {
            method: 'put',//Different method
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//We waited now were reading it.
        console.log(data)//Response
        location.reload()//Refresh

    }catch(err){
        console.log(err)//Heres what to fix
    }
}

async function markUnComplete(){// Same as above but complete to uncomplete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},//Make sure it's Json
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