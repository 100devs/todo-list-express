const deleteBtn = document.querySelectorAll('.fa-trash')//selecting fa trash putting it in variable
const item = document.querySelectorAll('.item span')//selecting item span putting it on variable
const itemCompleted = document.querySelectorAll('.item span.completed')//selecting span completed and putting on variable

Array.from(deleteBtn).forEach((element)=>{  //loop through each item and add a delete event listener to it
    element.addEventListener('click', deleteItem)//adding the event listener
})

Array.from(item).forEach((element)=>{ //loop through each item and add an completed event listener to it
    element.addEventListener('click', markComplete)//adding the event listener
})

Array.from(itemCompleted).forEach((element)=>{ // loop through each item and add a uncomplete event listener to it
    element.addEventListener('click', markUnComplete)//adding the event listener
})

async function deleteItem(){//create async function
    const itemText = this.parentNode.childNodes[1].innerText//getting the text of the second child node of the parent element
    try{
        const response = await fetch('deleteItem', {//throw a fetch request to delete an item to connect to server side 'deleteItem'
            method: 'delete',//using the method delete
            headers: {'Content-Type': 'application/json'},//letting the system know that the conent is json
            body: JSON.stringify({//converting the object to json string
              'itemFromJS': itemText
            })
          })
        const data = await response.json()//waits for the response from the server and assign the response to data
        console.log(data)//display data
        location.reload()//refresh the page

    }catch(err){//if error is caught
        console.log(err)//display the error
    }
}

async function markComplete(){//create async function
    const itemText = this.parentNode.childNodes[1].innerText//get the text of the 2nd child of the parent node
    try{
        const response = await fetch('markComplete', {//throw a fetch request to the server that has 'markComplete' and assign it to response
            method: 'put',//using the put method
            headers: {'Content-Type': 'application/json'},//telling the system that the content is json
            body: JSON.stringify({//converting the object to a string
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//wait for the response from the server and assign it to data
        console.log(data)//display data
        location.reload()//refresh page

    }catch(err){//if error is caught 
        console.log(err)//display the error
    }
}

async function markUnComplete(){//create async function
    const itemText = this.parentNode.childNodes[1].innerText//get the text of the 2nd childnode of the parent node
    try{
        const response = await fetch('markUnComplete', {//throw a fetch request to the server that has 'markUnComplete' params and assign to response
            method: 'put',//using the put method
            headers: {'Content-Type': 'application/json'},//letting the system know that the content is json
            body: JSON.stringify({//converting the object to json string
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//waiting for the server to respond and assigning it to data
        console.log(data)//display the data
        location.reload()//refresh the page

    }catch(err){//if error is caught 
        console.log(err)//display the error
    }
}