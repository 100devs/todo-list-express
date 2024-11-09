// declare variable for delete button
const deleteBtn = document.querySelectorAll('.fa-trash')

// declare variable for todo item (span elements within a parent class of item)
const item = document.querySelectorAll('.item span')

// declare variable for completed items
const itemCompleted = document.querySelectorAll('.item span.completed')

// listen to delete item clicks
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// listen to todo item clicks
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// listen to 'completed' class clicks
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//when delete item is clicked, get text from the list item
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{

        //label list item text as "itemFromJS" and make a delete request to the server with the route '/deleteItem'
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })

        //when server responds, the data will be console logged and the page will refresh
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//when item is marked as complete, get text from the list item
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{

       //label list item text as "itemFromJS" and make a put request to the server with the route '/markComplete'
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        //when server responds, the data will be console logged and the page will refresh
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//when item is marked as incomplete, get text from the list item
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{

         //label list item text as "itemFromJS" and make a put request to the server with the route '/markUnComplete'
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })

        //when server responds, the data will be console logged and the page will refresh
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}