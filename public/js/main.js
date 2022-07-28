const deleteBtn = document.querySelectorAll('.fa-trash')//add delete buttons to a NodeListOf
const item = document.querySelectorAll('.item span')//add uncompleted todos to a NodeListOf
const itemCompleted = document.querySelectorAll('.item span.completed')//add completed todos to a NodeListOf

Array.from(deleteBtn).forEach((element)=>{//Loop through delete buttons and add an event listener
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{//Loop through uncompleted todos and add an event listener
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{//Loop through completed todos and add an event listener
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){//Deletes a note
    const itemText = this.parentNode.childNodes[1].innerText //get the text of the todo so we can search for it in the db
    try{
        const response = await fetch('deleteItem', {//Make a fetch to the server's '/deleteItem' route.
            method: 'delete',//Set the html method to delete.
            headers: {'Content-Type': 'application/json'},//Set a request header stating that the content being sent is in json format.
            body: JSON.stringify({//Set itemText as the value of an object named 'itemFromJs', convert it to json, and add it to the request body. 
              'itemFromJS': itemText
            })
          })
        const data = await response.json()//Await the fetch response, parse json to JS and store it in 'data'.
        console.log(data)//log 'data' to the browser console.
        location.reload()//Refresh the page

    }catch(err){
        console.log(err)//If there is an error log it to the console
    }
}

async function markComplete(){//Marks a note as complete
    const itemText = this.parentNode.childNodes[1].innerText//get the text of the todo so we can search for it in the db
    try{
        const response = await fetch('markComplete', {//Make a fetch to the server's '/markComplete' route.
            method: 'put',//Set the html method to put
            headers: {'Content-Type': 'application/json'},//Set a request header stating that the content being sent is in json format.
            body: JSON.stringify({//Set itemText as the value of an object named 'itemFromJs', convert it to json, and add it to the request body. 
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//Await the fetch response, parse json to JS and store it in 'data'.
        console.log(data)//log 'data' to the browser console.
        location.reload()//Refresh the page

    }catch(err){
        console.log(err)//If there is an error log it to the console
    }
}

async function markUnComplete(){//Marks a note as not complete
    const itemText = this.parentNode.childNodes[1].innerText//get the text of the todo so we can search for it in the db
    try{
        const response = await fetch('markUnComplete', {//Make a fetch to the server's '/markUnComplete' route.
            method: 'put',//Set the html method to put
            headers: {'Content-Type': 'application/json'},//Set a request header stating that the content being sent is in json format.
            body: JSON.stringify({//Set itemText as the value of an object named 'itemFromJs', convert it to json, and add it to the request body. 
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//Await the fetch response, parse json to JS and store it in 'data'.
        console.log(data)//log 'data' to the browser console.
        location.reload()//Refresh the page

    }catch(err){
        console.log(err)//If there is an error log it to the console
    }
}    