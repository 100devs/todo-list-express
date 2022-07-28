const deleteBtn = document.querySelectorAll('.fa-trash') //selects the fa-trash class element and set it to the deleteBtn variable
const item = document.querySelectorAll('.item span') //selects the .item span class element and set it to the item variable
const itemCompleted = document.querySelectorAll('.item span.completed') //select the item spam and completed class element and set it to the itemCompleted variable 

Array.from(deleteBtn).forEach((element)=>{//creating an array from the delete buttons iterating through so each element in array has deleteBtn
    element.addEventListener('click', deleteItem)//create event listener using on click to run the deleteItem function 
})

Array.from(item).forEach((element)=>{//creating an array from the delete buttons iterating through so each element in array has deleteBtn
    element.addEventListener('click', markComplete)//create event listener using on click to run the deleteItem function 
}) 

Array.from(itemCompleted).forEach((element)=>{//creating an array from the delete buttons iterating through so each element in array has deleteBtn
    element.addEventListener('click', markUnComplete)//create event listener using on click to run the deleteItem function 
})

async function deleteItem(){ //function to delete item from list
    const itemText = this.parentNode.childNodes[1].innerText //location of item to be deleted
    try{//deleting item attempt
        const response = await fetch('deleteItem', { //giving server route of the item that is to be deleted
            method: 'delete',//telling server what were going to do(delete request)
            headers: {'Content-Type': 'application/json'}, //set content to json
            body: JSON.stringify({//send item text to server 
              'itemFromJS': itemText//send item text to server
            })
          })
        const data = await response.json() //get response from server
        console.log(data) //log response from server
        location.reload()//reload page

    }catch(err){//if above function didn't run, catch error will run
        console.log(err)//log error
    }
}

async function markComplete(){//function to mark item as complete
    const itemText = this.parentNode.childNodes[1].innerText//location of item that will be marked complete
    try{//marking the item complete attempt
        const response = await fetch('markComplete', {//telling server to wait until item is complete to run the fetch
            method: 'put',//put request send to server
            headers: {'Content-Type': 'application/json'},//telling server set content type to json
            body: JSON.stringify({//send item in json
                'itemFromJS': itemText//send item text to server
            })
          })
        const data = await response.json()//waiting for a response from server
        console.log(data)//logging that response from server
        location.reload()//reloading the page

    }catch(err){//telling server if the above functions don't run, catch error
        console.log(err)//console log that error
    }
}

async function markUnComplete(){//function to mark items uncomplete
    const itemText = this.parentNode.childNodes[1].innerText//location of item that will be marked uncomplete
    try{//attempt to mark item uncomplete 
        const response = await fetch('markUnComplete', {//giving server to run the item that will be marked uncomplete
            method: 'put',//put request to send to server
            headers: {'Content-Type': 'application/json'},//content type will be json
            body: JSON.stringify({//body will be in json formate
                'itemFromJS': itemText//telling server to mark the item as uncomplete in index.ejs and show that in our html
            })
          })
        const data = await response.json()//awaiting response from server in json
        console.log(data)//log that response
        location.reload()//refresh the page

    }catch(err){//error function runs if the above function doesnt
        console.log(err)//logging that error
    }
}