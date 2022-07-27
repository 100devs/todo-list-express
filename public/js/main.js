//Store delete button, incomplete item, and completed item elements in variables
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Add event listeners to all delete button elements which call deleteItem() on click
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Add event listeners to all incomplete item elements which call markComplete() on click
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Add event listeners to all completed item elements which call markUnComplete() on click
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText        //Store item text in a variable
    try{
        const response = await fetch('deleteItem', {                //Send delete request to server at endpoint /deleteItem
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText                                //itemFromJS is the item the server will tell mongodb to find and delete
            })
          })
        const data = await response.json()                          //When the server responds,
        console.log(data)                                           //Console log the response
        location.reload()                                           //Reload the page

    }catch(err){
        console.log(err)                                            //Catch errors if any
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText        //Store item text in variable
    try{
        const response = await fetch('markComplete', {              //Send a put request to server at endpoint /markComplete
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText                              //itemFromJS is the item the server will tell mongoDB to find and update
            })
          })
        const data = await response.json()                          //When the server responds,
        console.log(data)                                           //Log the response
        location.reload()                                           //Reload the page

    }catch(err){    
        console.log(err)                                            //Catch errors, if any
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText        //Store item text in variable
    try{
        const response = await fetch('markUnComplete', {            //Send a put request to server at endpoint /markUnComplete
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText                              //itemFromJS is the item the server will tell mongoDB to find and update
            })
          })
        const data = await response.json()                          //When the server responds,
        console.log(data)                                           //Log the response
        location.reload()                                           //Reload the page

    }catch(err){
        console.log(err)                                            //Catch errors, if any
    }
}