const deleteBtn = document.querySelectorAll('.fa-trash')  // creates node list from delete buttons
const item = document.querySelectorAll('.item span') // creats node list for items
const itemCompleted = document.querySelectorAll('.item span.completed') // creates node list for completed items

Array.from(deleteBtn).forEach((element)=>{ // creates array for delete buttons and makes for loop
    element.addEventListener('click', deleteItem) // assigns event listener to each trash can icon
})

Array.from(item).forEach((element)=>{ // creates for array for items and makes for loop
    element.addEventListener('click', markComplete) // assigns event listener to each item
})

Array.from(itemCompleted).forEach((element)=>{ // creates array from items and makes for loop
    element.addEventListener('click', markUnComplete) // assigns event listener to mark uncompelte
})

async function deleteItem(){  // creates async funtion
    const itemText = this.parentNode.childNodes[1].innerText // sets itemText to select 
    try{
        const response = await fetch('deleteItem', { // sets up fetch request
            method: 'delete', // assigns the method to delet
            headers: {'Content-Type': 'application/json'}, // sets the content type to json
            body: JSON.stringify({ // converts object into json values
              'itemFromJS': itemText //sets itemsFromJS to the list of documents from mongoDB
            })
          })
        const data = await response.json()  // stores json data to variable
        console.log(data) // console logs json data
        location.reload() // reloads the page

    }catch(err){ // sets up catch for errors
        console.log(err) // console logs error if error occurs
    }
}

async function markComplete(){  // creates async function to mark item as completed
    const itemText = this.parentNode.childNodes[1].innerText // selects the text of the item
    try{ //  executes first
        const response = await fetch('markComplete', { // sets fetch request
            method: 'put', // assigns the method to update
            headers: {'Content-Type': 'application/json'},  // sets the content type to json
            body: JSON.stringify({ // converts object data into json values
                'itemFromJS': itemText // sets itemsFromJS to the list of documents from mongoDB
            })
          })
        const data = await response.json() // stores json data to variable
        console.log(data) // console logs json data
        location.reload() // reloads page

    }catch(err){ // sets up error if error occurs
        console.log(err)  // console logs said error 
    }
}

async function markUnComplete(){  // sets function to mark item not completed
    const itemText = this.parentNode.childNodes[1].innerText  // grabs item based on innertext of item
    try{  // executes first
        const response = await fetch('markUnComplete', {  //sets fetch request 
            method: 'put', // assigns the method to update
            headers: {'Content-Type': 'application/json'}, // sets content type to json
            body: JSON.stringify({ // converst object data into json values
                'itemFromJS': itemText // sets itemsFromJS to the list of documents from mongoDB
            })
          })
        const data = await response.json() // sets json data to a variable
        console.log(data)  // console logs data
        location.reload() // reloads page

    }catch(err){ // sets up catch if error
        console.log(err) // console logs error if error occurs 
    }
}
