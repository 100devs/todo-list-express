const deleteBtn = document.querySelectorAll('.fa-trash')    //refer to .fa-trash selection as deleteBtn
const item = document.querySelectorAll('.item span')    //group all items with .item class into item
const itemCompleted = document.querySelectorAll('.item span.completed') //group all items with .item and .completed classes into itemCompleted

Array.from(deleteBtn).forEach((element)=>{  //iterate through all deleteBtm elements
    element.addEventListener('click', deleteItem)   //on click, run deleteItem function
})

Array.from(item).forEach((element)=>{   //iterate through all item elements
    element.addEventListener('click', markComplete) //on click, run markComplete function
})

Array.from(itemCompleted).forEach((element)=>{  //iterate through all itemCompleted
    element.addEventListener('click', markUnComplete)   //on click, run markUnComplete function
})

async function deleteItem(){    //create async function to delete items
    const itemText = this.parentNode.childNodes[1].innerText    //select item text in selected node
    try{
        const response = await fetch('deleteItem', {    //delete request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()  //hold json response in data
        console.log(data)   //print data to console
        location.reload()   //reload element

    }catch(err){
        console.log(err)    //print error to console
    }
}

async function markComplete(){  //create async function to mark items as complete
    const itemText = this.parentNode.childNodes[1].innerText    //select item text in selected node
    try{
        const response = await fetch('markComplete', {  //put request for completed status
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()  //hold json response in data
        console.log(data)   //print data to console
        location.reload()   //reload element

    }catch(err){
        console.log(err)    //print error to console
    }
}

async function markUnComplete(){    //create async function to mark items as not complete
    const itemText = this.parentNode.childNodes[1].innerText    //select item text in selected node
    try{
        const response = await fetch('markUnComplete', {    //put request for not completed status
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)   //print data to console
        location.reload()   //reload element

    }catch(err){
        console.log(err)    //print error to console
    }
}