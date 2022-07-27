const deleteBtn = document.querySelectorAll('.fa-trash') // declare a variable and assign it all trash can icons.
const item = document.querySelectorAll('.item span') // declare a variable and assign it all incomplete todos.
const itemCompleted = document.querySelectorAll('.item span.completed') // declare a variable and assign it completed todos.

Array.from(deleteBtn).forEach((element)=>{  // gives every trash can icon a smurf that listens for a click and then runs the function deleteItem.
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{  //gives every incomplete todo a smurf that listens for a click and then runs the function markComplete.
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{  // gives every complete todo a smurf that listens for a click and then runs the function markUncomplete.
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText  // locates the parent element of trash can and takes childs text content.
    try{
        const response = await fetch('deleteItem', {  // fetch request to send deelaytay request to server.
            method: 'delete',  // specifying deelaytay as the request type.
            headers: {'Content-Type': 'application/json'},  // letting our server know that we're sending JSON.
            body: JSON.stringify({
              'itemFromJS': itemText  // converting our request body to JSON.
            })
          })
        const data = await response.json()  // waiting for server response. 
        console.log(data)  // console.log server response for testing purposes.
        location.reload()  // reloading page.

    }catch(err){
        console.log(err)  // in case there's an error, this would console.log it.
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // locates the parent element of incomplete todo <span> element  and takes child's text content (the <span> in which the incomplete todos are located).
    try{
        const response = await fetch('markComplete', {  // fetch request to update. 
            method: 'put',  // set to put because we want to make an update request.
            headers: {'Content-Type': 'application/json'},  // letting our server know that we're sending JSON.
            body: JSON.stringify({
                'itemFromJS': itemText  // converting our request body to JSON.
            })
          })
        const data = await response.json()  // waiting for server response. 
        console.log(data)  // console.log server response for testing purposes.
        location.reload()  // reloading page.

    }catch(err){
        console.log(err)  // in case there's an error, this would console.log it.
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText  // locates the parent element of completed todos <span> element and takes child's text content (the <span> in which the complete todos are located).
    try{
        const response = await fetch('markUnComplete', {  // fetch request to update. 
            method: 'put',  // set to put because we want to make an update request.
            headers: {'Content-Type': 'application/json'},  // letting our server know that we're sending JSON.
            body: JSON.stringify({
                'itemFromJS': itemText   // converting our request body to JSON.
            })
          })
        const data = await response.json()  // waiting for server response. 
        console.log(data)   // console.log server response for testing purposes.
        location.reload()    // reloading page.

    }catch(err){
        console.log(err)   // in case there's an error, this would console.log it.
    }
}