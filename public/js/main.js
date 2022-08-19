const deleteBtn = document.querySelectorAll('.fa-trash') //get a list of document items that hold the 'fa-trash' class and hold them in the deleteBtn constant (creates an array of delete buttons)
const item = document.querySelectorAll('.item span') //get a list of document items that hold the 'item' class and 'span' tag and hold them in the item constant (creates an array of all list items text)
const itemCompleted = document.querySelectorAll('.item span.completed') //get a list of document items and hold the 'item' class and completed class that are children of the span tag in the itemCompleted constant (creates an array of completed list items text) 

Array.from(deleteBtn).forEach((element)=>{ //take the delete button array and for each element within
    element.addEventListener('click', deleteItem) //add a 'smurf' to watch if the user clicks on the deletion icon
})

Array.from(item).forEach((element)=>{ //take the (list) item array and for each element within
    element.addEventListener('click', markComplete) //add a 'smurf' to watch if the user clicks on the mark complete icon
})

Array.from(itemCompleted).forEach((element)=>{ //take the completed item array and for each element within
    element.addEventListener('click', markUnComplete) //add a 'smurf' to watch if the user clicks on the mark complete icon
})

async function deleteItem(){ //the deleteItem function, which operates asynchrously
    const itemText = this.parentNode.childNodes[1].innerText //from the calling location, look at the parent's second child's text and store it in the itemText constant
    try{ //try to do this, catch if it fails
        const response = await fetch('deleteItem', { //go the /deleteItem route and pass in the following object, wait for a response and stick that response into the response constant before continuing
            method: 'delete', //this object's method is delete
            headers: {'Content-Type': 'application/json'}, //this object uses json content
            body: JSON.stringify({ //this object's body is a string of the following json
              'itemFromJS': itemText //this object's json has the previously saved itemText stored in itemFromJS
            })
          })
        const data = await response.json() //wait for a json response, then store that json in the data constant
        console.log(data) //log that data in the console
        location.reload() //reload the browser (which updates the render)

    }catch(err){ //if an error, 
        console.log(err) //log the error in the console
    }
}

async function markComplete(){ //the markComplete function, which operates asynchrously
    const itemText = this.parentNode.childNodes[1].innerText //from the calling location, look at the parent's second child's text and store it in the itemText constant
    try{ //try to do this, catch if fails
        const response = await fetch('markComplete', { //go the /markComplete route and pass in the following object, wait for a response and stick that response into the response constant before continuing
            method: 'put', //this object method is put
            headers: {'Content-Type': 'application/json'}, //this object uses json content
            body: JSON.stringify({ //this object's body is a string of the following json
                'itemFromJS': itemText //this object's json has the previously saved itemText stored in itemFromJS
            })
          })
        const data = await response.json() //wait for a json response, then store that json in the data constant
        console.log(data) //log that data in the console
        location.reload() //reload the browser (which updates the render)

    }catch(err){ //if error
        console.log(err) //log that error in the console
    }
}

async function markUnComplete(){ //the markUnComplete function, which operates asynchrously
    const itemText = this.parentNode.childNodes[1].innerText//from the calling location, look at the parent's second child's text and store it in the itemText constant
    try{ //try to do this, catch if fails
        const response = await fetch('markUnComplete', {//go the /markUnComplete route and pass in the following object, wait for a response and stick that response into the response constant before continuing
            method: 'put', //this object method is put
            headers: {'Content-Type': 'application/json'}, //this object uses json content
            body: JSON.stringify({ //this object's body is a string of the following json
                'itemFromJS': itemText //this object's json has the previously saved itemText stored in itemFromJS
            })
          })
        const data = await response.json() //wait for a json response, then store that json in the data constant
        console.log(data) //log that data in the console
        location.reload() //reload the browser (which updates the render)

    }catch(err){ //if error
        console.log(err) //log that error in the console
    }
}