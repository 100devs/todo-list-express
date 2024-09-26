const deleteBtn = document.querySelectorAll('.fa-trash') //selects all elements with the class of fa-trash
const item = document.querySelectorAll('.item span') //selects all span elements inside the class item
const itemCompleted = document.querySelectorAll('.item span.completed') // selects all spans with the class of completed inside the class item

//foreach on an array from deleteBtn. Add click event 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//foreach on an array from item. Add click event
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//foreach on an array from itemCompleted. Add click event
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// function used when we want to delete an item from todo-list
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //itemText becomes the specific item that we want to use
    try{
        const response = await fetch('deleteItem', { //fetch inside a try catch. We specify the method we want to use, and then an object with different info for the backend.
            method: 'delete', //tells the backend that we want to delete something
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //We send the specific item to the backend. 
              'itemFromJS': itemText
            })
          })
        const data = await response.json() //assign data the json response from our fetch
        console.log(data)//logs data
        location.reload()//reload the site as an easy way to update what the user sees

    }catch(err){//catch error if any
        console.log(err)//log that error
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //itemText becomes the specific item that we want to use
    try{
        const response = await fetch('markComplete', { //fetch inside a try catch. We specify the method we want to use, and then an object with different info for the backend.
            method: 'put', //tells the backend that we want to update something
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //We send the specific item to the backend.
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //assign data the json response from our fetch
        console.log(data)//logs data
        location.reload()//reload the site as an easy way to update what the user sees
  
    }catch(err){//catch error if any
          console.log(err)//log that error
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //itemText becomes the specific item that we want to use
    try{
        const response = await fetch('markUnComplete', { //fetch inside a try catch. We specify the method we want to use, and then an object with different info for the backend.
            method: 'put', //tells the backend we want to update something
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ //We send the specific item to the backend.
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //assign data the json response from our fetch
        console.log(data)//logs data
        location.reload()//reload the site as an easy way to update what the user sees

    }catch(err){//catch error if any
        console.log(err)//log that error
    }
}