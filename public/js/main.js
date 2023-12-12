// assigning variables
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

// add event listener and click event to array 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// add event listener and click event to array 
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// add event listener and click event to array 
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// calling function to delete items
async function deleteItem(){
    //targeting specific item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetching specific item to delete
        const response = await fetch('deleteItem', {
            // path of delete
            method: 'delete',
            // content type is json
            headers: {'Content-Type': 'application/json'},
            // grabbing specified string from body
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          // responding json
        const data = await response.json()
        console.log(data)

        // rebooting page with updated delete
        location.reload()
        // catching anyerrors
    }catch(err){
        console.log(err)
    }
}

// calling function to update items
async function markComplete(){
    //targeting specific item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetching specific item to update
        const response = await fetch('markComplete', {
            // path of put
            method: 'put',
             // content type is json
            headers: {'Content-Type': 'application/json'},
            // grabbing specified string from body
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // responding json
        const data = await response.json()
        console.log(data)
        location.reload()
        // catching any errors
    }catch(err){
        console.log(err)
    }
}

// calling function to update items
async function markUnComplete(){
    //targeting specific item
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetching specific item to update
        const response = await fetch('markUnComplete', {
            // path of put
            method: 'put',
            // content type is json
            headers: {'Content-Type': 'application/json'},
            // grabbing specified string from body
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          // responding json
        const data = await response.json()
        console.log(data)
        location.reload()
        // catching any errors
    }catch(err){
        console.log(err)
    }
}
