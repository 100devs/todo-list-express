const deleteBtn = document.querySelectorAll('.fa-trash') //selects the fa-trash class element and sets it to deleteBtn
const item = document.querySelectorAll('.item span')//selects the item span class element and sets it to item
const itemCompleted = document.querySelectorAll('.item span.completed')//selects the item span completed class element and sets it to itemComplete

Array.from(deleteBtn).forEach((element)=>{
    //add event listener to delete button, create an array of all delete buttons
    element.addEventListener('click', deleteItem)// add event listener to each delete button 
})

Array.from(item).forEach((element)=>{//add event listener to item, create an array of all items 
    element.addEventListener('click', markComplete)//add event listeners to each item to mark completed with clicked 
})

Array.from(itemCompleted).forEach((element)=>{//add event listener to itemCompleted, create an array of all items.
    element.addEventListener('click', markUnComplete)//add event listener to each item to mark complete when clicked 
})

async function deleteItem(){ //delete item from list 
    const itemText = this.parentNode.childNodes[1].innerText// get item from list item at this nodeList position
    try{//try to delete item
        const response = await fetch('deleteItem', {//await promise and delete item from server
            method: 'delete',//let's server know we are using the delete method
            headers: {'Content-Type': 'application/json'},//sets content type to json
            body: JSON.stringify({//converts JS object to a JSON string
              'itemFromJS': itemText//send item from JS to server
            })
          })
        const data = await response.json()//await promise and sends res as json to server
        console.log(data)//console log the data 
        location.reload()//reload the page 

    }catch(err){
        console.log(err)//if NOT OK, log the error 
    }
}

async function markComplete(){ //mark item complete from list
    const itemText = this.parentNode.childNodes[1].innerText//get item from list item at this nodeList position
    try{//try to mark complete 
        const response = await fetch('markComplete', {//await promise, mark item as complete and send to server
            method: 'put', //let's server know we are using PUT method
            headers: {'Content-Type': 'application/json'}, //sets content type to JSON
            body: JSON.stringify({//converts JS object to a JSON string
                'itemFromJS': itemText //send item from JS to server
            })
          })
        const data = await response.json()//await promise and sends response as JSON 
        console.log(data)//console log the data
        location.reload()//reload the page 

    }catch(err){
        console.log(err)//if NOT OK, log the error to console
    }
}

async function markUnComplete(){//unclicks item marked complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{// try to uncheck item
        const response = await fetch('markUnComplete', {//await promise, uncheck item and send to server as unchecked
            method: 'put',//let's server know we are using PUT method
            headers: {'Content-Type': 'application/json'},//sets content-type to JSON
            body: JSON.stringify({//converts JS obj to a JSON string
                'itemFromJS': itemText //send item from JS to server
            })
          })
        const data = await response.json()//await promise and sends response as JSON
        console.log(data)//console log the data
        location.reload()//reload the page

    }catch(err){
        console.log(err)//if NOT OK, log the error to console
    }
}