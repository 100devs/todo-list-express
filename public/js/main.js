const deleteBtn = document.querySelectorAll('.fa-trash')//creates variable for trash can
const item = document.querySelectorAll('.item span')//creates variable for all spans in class of item
const itemCompleted = document.querySelectorAll('.item span.completed')//creates variable for completed items

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})//adds event listener to all trash-cans and assigns to deleteIten function

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})//adds eventlistener to items and connects to function markComplete

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})//adds event listener to completed items and connects to function markUnComplete

async function deleteItem(){//function deleteItem allows you to delete item from the list
    const itemText = this.parentNode.childNodes[1].innerText//creates variable 
    try{
        const response = await fetch('deleteItem', {//connects to /deleteItem on server.js
            method: 'delete',// states method is delete
            headers: {'Content-Type': 'application/json'},//returns JSON data
            body: JSON.stringify({//sends JSON back as string
              'itemFromJS': itemText//makes itemFromJS itemText variable??
            })
          })
        const data = await response.json() //await data from server
        console.log(data)//data logging
        location.reload()//reloads page after delete

    }catch(err){
        console.log(err)//error logging
    }
}
//function deleteItem allows you to delete item from the list

async function markComplete(){//function markComplete allows you to mark an item from the list complete
    const itemText = this.parentNode.childNodes[1].innerText//creates variable
    try{
        const response = await fetch('markComplete', {//connects to /markComplete on server.js
            method: 'put',//update method
            headers: {'Content-Type': 'application/json'}, //returns JSON data
            body: JSON.stringify({//converts JSON data to string 
                'itemFromJS': itemText//makes itemFromJS itemText variable??
            })
          })
        const data = await response.json()//await data from server
        console.log(data)//data logging
        location.reload()//reloads page after update

    }catch(err){
        console.log(err)//error logging
    }
}

async function markUnComplete(){//function markUnComplete allows you to remove mark from completed list item, removes strike-through
    const itemText = this.parentNode.childNodes[1].innerText//assign variable
    try{
        const response = await fetch('markUnComplete', {//connects to markunComplete on server.js
            method: 'put',//update method
            headers: {'Content-Type': 'application/json'},//returns JSOn data
            body: JSON.stringify({//converts JSOn data to string
                'itemFromJS': itemText//makes itemFromJS itemText variable??
            })
          })
        const data = await response.json()//await data from server
        console.log(data)//data logging
        location.reload()//reloads page after update

    }catch(err){
        console.log(err)//error logging
    }
}