const deleteBtn = document.querySelectorAll('.fa-trash') //selects all elements with the class '.fa-trash' and stores in variable
const item = document.querySelectorAll('.item span')//selects all span items that are children of class '.item'
const itemCompleted = document.querySelectorAll('.item span.completed')//selects all completed

Array.from(deleteBtn).forEach((element)=>{ //adds an event listener to every single delete button
    element.addEventListener('click', deleteItem) //listening for a click
})

Array.from(item).forEach((element)=>{ //adds an event listener to see if someone clicks on the item to mark it as complete
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{ //same as above but marks it not complete again
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){ //function to delete an item. 
    const itemText = this.parentNode.childNodes[1].innerText //selects the item the client wants
    try{
        const response = await fetch('deleteItem', {//sends request to delete item. first param is url endpoint
            method: 'delete', //which method
            headers: {'Content-Type': 'application/json'}, //requests json
            body: JSON.stringify({  //uses body
              'itemFromJS': itemText //property and value
            })
          })
        const data = await response.json() //respond using json
        console.log(data) //console log data
        location.reload() //reload the page

    }catch(err){
        console.log(err) //catches errors
    }
}

async function markComplete(){ //function to change the text in the list to complete
    const itemText = this.parentNode.childNodes[1].innerText //selects the text that was clicked on
    try{
        const response = await fetch('markComplete', { //sends the request to mark as complete. url endpoint
            method: 'put', //put method
            headers: {'Content-Type': 'application/json'}, //requests json
            body: JSON.stringify({ //as a string
                'itemFromJS': itemText // property and value
            })
          })
        const data = await response.json() //respond using json
        console.log(data) //console log the data returned
        location.reload() //refresh the page

    }catch(err){
        console.log(err) //console log errors found
    }
}

async function markUnComplete(){ //same as above but incomplete
    const itemText = this.parentNode.childNodes[1].innerText //selects text
    try{
        const response = await fetch('markUnComplete', { //request with url endpoint
            method: 'put', //put method (update)
            headers: {'Content-Type': 'application/json'}, //sets the request headers
            body: JSON.stringify({ //return as string
                'itemFromJS': itemText //property and value
            })
          })
        const data = await response.json() //respond with json
        console.log(data) //console log the data
        location.reload() //refresh the page to see the changes

    }catch(err){
        console.log(err) //console log any errors
    }
}