const deleteBtn = document.querySelectorAll('.fa-trash')//web api that returns elements with .fa-trash class
const item = document.querySelectorAll('.item span.task')//web api that returns spans that are descendents of .item class. added .task for more specifity so trash icon not included.
const itemCompleted = document.querySelectorAll('.item span.completed')//web api that returns span.completed elements that are descendents of .item class

//The Array.from() static method creates a new, shallow-copied Array instance from an iterable or array-like object.

//creates a shalow-copied Array instance from deleteBtn(array-like object) and iterates through each element
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)//for each element in deleteBtn adds an event listener that runs deleteItem() on click.
})

//creates a shalow-copied Array instance from item(array-like object) and iterates through each element
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)//for each element in item adds an event listener that runs markComplete() on click.
})

//creates a shalow-copied Array instance from itemCompleted(array-like object) and iterates through each element
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)//for each element in item adds an event listener that runs markUnComplete() on click.
})

//async callback function that is run when element in deleteBtn is clicked. It is async bc it has to send a delete request to server and wait for response.
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText//grabs the innerText of span that has task. this is the seconde child of the parent node(li)
    console.log(this)//testing to see what "this" is. it is the span containing trash icon
    console.log(this.parentNode)//testing to see what parentNode is. it is the li containing task and trash icon
    try{//try catch block. tries running code below and catches error if there is one from the fetch
        const response = await fetch('deleteItem', {//sends a delete request to server route /deleteitem and awaits reponse
            method: 'delete',//method of fetch is delete
            headers: {'Content-Type': 'application/json'},//specifies content type which is JSON
            body: JSON.stringify({//converts object containing itemText to json string and puts into body of request
              'itemFromJS': itemText
            })
          })
        const data = await response.json()//waits for delete response to convert to json.
        console.log(data)//logs response.json()
        location.reload()//reloads current url (like refresh button on browser) which updates list with item removed

    }catch(err){//catches error if there is one from the try block and console.logs it
        console.log(err)
    }
}

//async callback function that is run when element in item is clicked. It is async bc it has to send a put request to server and wait for response.
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText//grabs the innerText of span that has task. this is the seconde child of the parent node(li)
    try{
        const response = await fetch('markComplete', {//sends a put request to /markComplete route in server and waits for response
            method: 'put',//method of request is put
            headers: {'Content-Type': 'application/json'},//specifies content type which is JSON
            body: JSON.stringify({// converts object with itemText to JSON to send to server
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//waits for response from server which is then converted to JSON
        console.log(data)//logs the json data received
        location.reload()//reloads current url which updates the item to now be crossed out on list

    }catch(err){//if errors occur during request catches them here and logs them
        console.log(err)
    }
}

//async callback function that is run when element in item is clicked. It is async bc it has to send a put request to server and waits for response.
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText//grabs the innerText of span that has task. this is the seconde child of the parent node(li)
    try{
        const response = await fetch('markUnComplete', {//sends a put request to /markUnComplete route in server and waits for response
            method: 'put',//request type is put
            headers: {'Content-Type': 'application/json'},//content type of request is json
            body: JSON.stringify({//converts object containt itemText to json to send to server
                'itemFromJS': itemText
            })
          })
        const data = await response.json()//awaits server response and then converts to json
        console.log(data)//logs json data
        location.reload()//reloads current url and updates list with item now uncrossed out

    }catch(err){//catches any errors that occur during request and logs them
        console.log(err)
    }
}

