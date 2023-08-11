const deleteBtn = document.querySelectorAll('.fa-trash') //here we define our buttons from the ejs
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed') 

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //for these three functions, we are adding an eventListener to act as a button that runs the routes we have set in server.js. so if we click the delete button on a specific item, it will run the /delete route and remove it from the db
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //here we delete the item from the ejs 
    try{
        const response = await fetch('deleteItem', {  //in the response we are setting up the way the data will be deleted by JSON
            method: 'delete',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
              'itemFromJS': itemText //we are assigning the itemText which we defined above to the name 'itemFromJS' which is reffered to in the server.js /delete route
            })
          })
        const data = await response.json() //wait for a response
        console.log(data)
        location.reload() //reload the page

    }catch(err){
        console.log(err)
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
        location.reload() //the same is done for these two functions as well for their respective purpose, mark complete, and mark uncomplete.

    }catch(err){
        console.log(err) //catch and log any errors
    }
}