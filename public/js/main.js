const deleteBtn = document.querySelectorAll('.fa-trash') //shorthand for .fa-trash class
const item = document.querySelectorAll('.item span') //shorthand for .item class span element
const itemCompleted = document.querySelectorAll('.item span.completed') //shorthand for .item class span element with .completed class

Array.from(deleteBtn).forEach((element)=>{ //for each .fa-trash class element
    element.addEventListener('click', deleteItem) //add smurf to listen for clicks and call deleteItem function
})

Array.from(item).forEach((element)=>{ //for each .item span
    element.addEventListener('click', markComplete) //smurf to listen for clicks and call markComplete
})

Array.from(itemCompleted).forEach((element)=>{ //for each completed class span
    element.addEventListener('click', markUnComplete) //smurf to listen for clicks and call markUncomplete
})

async function deleteItem(){ //async function to remove items
    const itemText = this.parentNode.childNodes[1].innerText //set var to text value of the entry of the parent
    try{
        const response = await fetch('deleteItem', { //try request to server to delete item and get resp
            method: 'delete', //delete header
            headers: {'Content-Type': 'application/json'}, //content set to json
            body: JSON.stringify({ //set body header to item changed to json string
              'itemFromJS': itemText //send value and assign to itemFromJS value in JSON
            })
          })
        const data = await response.json() //get result from server
        console.log(data) //console output result
        location.reload() //reload page

    }catch(err){
        console.log(err) //on error, console error
    }
}

async function markComplete(){  //async function to set complete key value
    const itemText = this.parentNode.childNodes[1].innerText //set itemText to value of the entry of parent
    try{
        const response = await fetch('markComplete', { //try update request to mark complete key as true
            method: 'put', // update req header
            headers: {'Content-Type': 'application/json'}, //content set to json
            body: JSON.stringify({ //set body header to item changed to json string
                'itemFromJS': itemText //send value and assign to itemFromJS value in JSON
            })
          })
        const data = await response.json() //get result from server
        console.log(data) //console output result
        location.reload() //reload page

    }catch(err){
        console.log(err)  //on error, console error
    }
}

async function markUnComplete(){  //async function to set complete key value
    const itemText = this.parentNode.childNodes[1].innerText //set itemText to value of the entry of parent
    try{
        const response = await fetch('markUnComplete', { //try update request to mark complete key as false
            method: 'put', // update req header
            headers: {'Content-Type': 'application/json'}, //content set to json
            body: JSON.stringify({ //set body header to item changed to json string
                'itemFromJS': itemText //send value and assign to itemFromJS value in JSON
            })
          })
        const data = await response.json() //wait for result
        console.log(data) //output result to console
        location.reload() //reload page

    }catch(err){
        console.log(err) //on error, console error
    }
}