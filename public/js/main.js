const deleteBtn = document.querySelectorAll('.fa-trash') //initialize variable deleteBtn all items with class of fa-trash
const item = document.querySelectorAll('.item span')//initialize variable item all items with class item spans
const itemCompleted = document.querySelectorAll('.item span.completed')//initialize variable itemCompleted all items with class item and value of span.completed

Array.from(deleteBtn).forEach((element)=>{ //forEach loop for all the delete buttons
    element.addEventListener('click', deleteItem) //adding event listeners to each deleteBtn
})

Array.from(item).forEach((element)=>{//forEach loop for all the item 
    element.addEventListener('click', markComplete) //adding event listeners to each item
})

Array.from(itemCompleted).forEach((element)=>{//forEach loop for all the item 
    element.addEventListener('click', markUnComplete)//adding event listeners to each itemCompleted
})

async function deleteItem(){ //async await function for deleting items
    const itemText = this.parentNode.childNodes[1].innerText //declare variable itemText to innertext of parentnodes first childnode
    try{ //try block
        const response = await fetch('deleteItem', { //setting variable repsones to fetch deleteItem
            method: 'delete', //using method delete
            headers: {'Content-Type': 'application/json'}, //listen for the specified json content
            body: JSON.stringify({ //converts Javascript value or object to a JSON string
              'itemFromJS': itemText //the data in the database which is used (itemFromJS is the key and itemText is the value)
            })
          })
        const data = await response.json() //setting variable of data to the response json parsed
        console.log(data) //console.log data
        location.reload() // reload page

    }catch(err){ //catch errors
        console.log(err) //console.log error
    }
}

async function markComplete(){ //async await function for marking items completed
    const itemText = this.parentNode.childNodes[1].innerText //declare variable itemText to innertext of parentnodes first childnode
    try{ //try block
        const response = await fetch('markComplete', { //setting variable repsones to fetch MarkComplete
            method: 'put', //using method put
            headers: {'Content-Type': 'application/json'}, //listen for the specified json content
            body: JSON.stringify({ //converts Javascript value or object to a JSON string
                'itemFromJS': itemText //the data in the database which is used (itemFromJS is the key and itemText is the value)
            })
          })
        const data = await response.json() //setting variable of data to the response json parsed
        console.log(data) //console.log data
        location.reload() // reload page

    }catch(err){//catch errors
        console.log(err) //console.log error
    }
}

async function markUnComplete(){ //async await function for marking items uncomplete
    const itemText = this.parentNode.childNodes[1].innerText //declare variable itemText to innertext of parentnodes first childnode
    try{ //try block
        const response = await fetch('markUnComplete', { //setting variable repsones to fetch markUnComplete
            method: 'put',//using method put
            headers: {'Content-Type': 'application/json'}, //listen for the specified json content
            body: JSON.stringify({ //converts Javascript value or object to a JSON string
                'itemFromJS': itemText //the data in the database which is used (itemFromJS is the key and itemText is the value)
            })
          })
        const data = await response.json() //setting variable of data to the response json parsed
        console.log(data)//console.log data
        location.reload()// reload page

    }catch(err){//catch errors
        console.log(err)//console.log error
    }
}