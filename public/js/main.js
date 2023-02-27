// grab all font-awesome trash cans that are created in the EJS file
const deleteBtn = document.querySelectorAll('.fa-trash')
// grab all items that are created in the EJS file that are grabbed from the collection. These are the uncompleted objects
const item = document.querySelectorAll('.item span')
// grab all items that are created in the EJS file that are grabbed from the collection. These are the completed objects
const itemCompleted = document.querySelectorAll('.item span.completed')

//Here we add an event listen to each variable above. Fist we have to turn them into an array.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


// created an async function that is a callback for the eventlistener above.
async function deleteItem(){
    //once clicked, it grabs the parentNode of the item we click, goes down to the childNode and grabs the innerText. Stores it in itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //we store our fetch in our response variable. Here we use a fetch to send data to the route deleteItem in our server. It creates a request sending where the data will be sent, what method we are using, the header and what the body is. The body is the .innerText which we grabbed when clicked on the item. It grabbed its innerText. The next step goes to the server
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
              'itemFromJS': itemText // the key works with or without quotes
            })
          })
        // after the server deletes the item, we receive in JSON (Todo Deleted) completing our fetch with a response. That repsonse is then console.logged
        const data = await response.json()
        console.log(data)
        //and we refresh the page. We need to refresh on the client side because the server needs to send back a response.
        location.reload()

    }catch(err){
        console.log(err)
    }
}


// created an async function that is a callback for the eventlistener above.
async function markComplete(){
    //once clicked, it grabs the parentNode of the item we click, goes down to the childNode and grabs the innerText. Stores it in itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //we store our fetch in our response variable. Here we use a fetch to send data to the route markComplete in our server. It creates a request sending where the data will be sent, what method we are using, the header and what the body is. The body is the .innerText which we grabbed when clicked on the item. It grabbed its innerText. The next step goes to the server
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //changes the completed value from false to true. It responds with completing the change.
        const data = await response.json()
        console.log(data)
        //refresh the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}


// created an async function that is a callback for the eventlistener above.
async function markUnComplete(){
    //once clicked, it grabs the parentNode of the item we click, goes down to the childNode and grabs the innerText. Stores it in itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //we store our fetch in our response variable. Here we use a fetch to send data to the route deleteItem in our server. It creates a request sending where the data will be sent, what method we are using, the header and what the body is. The body is the .innerText which we grabbed when clicked on the item. It grabbed its innerText. The next step goes to the server
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //changes the completed value from true to false. It responds with completing the change.
        const data = await response.json()
        console.log(data)
        //refresh the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}