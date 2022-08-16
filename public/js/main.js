const deleteBtn = document.querySelectorAll('.fa-trash')  // imports delete button by class of fa-trash
const item = document.querySelectorAll('.item span') //imports item by class of 
const itemCompleted = document.querySelectorAll('.item span.completed')

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{  //creates a new event listener for every item in the todo
    element.addEventListener('click', markComplete) //on click, it runs the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ //Creates a new event listener for every item marked as completed in the todo
    element.addEventListener('click', markUnComplete)// on click, it runs the markUncomplete function
})

async function deleteItem(){  //function that deletes item 
    const itemText = this.parentNode.childNodes[1].innerText// grabs the value (inner text) of the item clicked for deletion
    try{
        const response = await fetch('deleteItem', { //makes a fetch request
            method: 'delete',   //delete request
            headers: {'Content-Type': 'application/json'}, //content of request in json
            body: JSON.stringify({
              'itemFromJS': itemText   // value of deleted item is now stored in the itemFromJS property
            })
          })
        const data = await response.json() //waits for response and converts it to json
        console.log(data)  //console logs the response
        location.reload()  // reloads page so that it makes a get request and gets the most up to date site

    }catch(err){
        console.log(err) //handles errors
    }
}

async function markComplete(){  //mark complete function
    const itemText = this.parentNode.childNodes[1].innerText  // gets value of item that is marked as completed
    try{
        const response = await fetch('markComplete', { //makes fetch request to server
            method: 'put', //defines the type of request to be a put
            headers: {'Content-Type': 'application/json'}, // establishe that content is in json format
            body: JSON.stringify({
                'itemFromJS': itemText // value of deleted item is now stored in the itemFromJS property
            })
          })
        const data = await response.json() //transforms response to json 
        console.log(data) //logs the response
        location.reload() // reloads page and makes new get request to reflect changes

    }catch(err){
        console.log(err)//handles errors
    }
}

async function markUnComplete(){ //uncomplete function
    const itemText = this.parentNode.childNodes[1].innerText // sets value of item to itemText
    try{
        const response = await fetch('markUnComplete', { // makes fetch request
            method: 'put', //request is put (update)
            headers: {'Content-Type': 'application/json'},// tell server request is in json format
            body: JSON.stringify({
                'itemFromJS': itemText // value of deleted item is now stored in the itemFromJS property
            })
          })
        const data = await response.json()//converts response to json
        console.log(data)// logs the response
        location.reload()// reloads page to reflect changes

    }catch(err){
        console.log(err)//handles errors
    }
}