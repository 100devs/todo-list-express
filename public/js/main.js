const deleteBtn = document.querySelectorAll('.fa-trash') //assigns element class to a constant
const item = document.querySelectorAll('.item span') //assigns element class to a constant
const itemCompleted = document.querySelectorAll('.item span.completed') //assigns element class to a constant

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //adds event listener to each delete button 
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //adds event listener to each item on todo list
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //adds event listener to each item on todo list
})

async function deleteItem(){ //delete item function
    const itemText = this.parentNode.childNodes[1].innerText //look inside list items and grabs inner text
    try{
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //delete method
            headers: {'Content-Type': 'application/json'}, //headers for method
            body: JSON.stringify({ //body for method
              'itemFromJS': itemText //body for method
            })
          })
        const data = await response.json() //waiting on JSON from the response to be completed
        console.log(data) //logs the response
        location.reload() //reloads the page

    }catch(err){ //catch errors
        console.log(err) //logs errors
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
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

async function markUnComplete(){
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