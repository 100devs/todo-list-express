
// selects all the elements with an fa-trash class
const deleteBtn = document.querySelectorAll('.fa-trash')
// selects all the span elements child of item class
const item = document.querySelectorAll('.item span')
// selects all the span elements with completed class child of item class
const itemCompleted = document.querySelectorAll('.item span.completed')


//selects the deleteBtn array and adds an event listener to them, with a callback function of deleteItem
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//selects the item array and adds an event listener to them, with a callback function of markComplete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//selects the itemCompleted array and adds an event listener to them, with a callback function of markUnComplete
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    //selects the first child node of the parent node of the trashcan clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //an API request to the backend to delete a value
        const response = await fetch('deleteItem', {
            //with a delete method
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //and sends it the value of itemText using JSON
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //waits for response
        const data = await response.json()
        console.log(data)
        //refreshes the page
        location.reload()

    }catch(err){
        //console.logs the error if any
        console.log(err)
    }
}

async function markComplete(){
    //selects the first child node of the parent node of the span clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //an API request to the backend to update a value
        const response = await fetch('markComplete', {
            // with an put/update method
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //and sends it the value of itemText using JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //waits for response
        const data = await response.json()
        console.log(data)
        //refreshes the page
        location.reload()

    }catch(err){
        //console.logs the error if any
        console.log(err)
    }
}

async function markUnComplete(){
    //selects the first child node of the parent node of the span clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //an API request to the backend to update a value
        const response = await fetch('markUnComplete', {
            // with an put/update method
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            //and sends it the value of itemText using JSON
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //waits for response
        const data = await response.json()
        console.log(data)
        //refreshes the page
        location.reload()

    }catch(err){
        //console.logs the error if any
        console.log(err)
    }
}