const deleteBtn = document.querySelectorAll('.fa-trash') //create variable to hold elements with '.fa-trash'
const item = document.querySelectorAll('.item span') //create variable to hold elements with class of span that are children of .item
const itemCompleted = document.querySelectorAll('.item span.completed') //select all completed items

Array.from(deleteBtn).forEach((element)=>{ //create array from all selected deleteBtns, loop through array
    element.addEventListener('click', deleteItem) //add event listener with deleteItem function
})

Array.from(item).forEach((element)=>{ //create array from all selected items, loop through array
    element.addEventListener('click', markComplete) //add event listener with markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ //create array from all selected completed items, loop through array
    element.addEventListener('click', markUnComplete) //add event listener with markUnComplete function
})

async function deleteItem(){ //async function
    const itemText = this.parentNode.childNodes[1].innerText //create variable to get current element's parentNode > childNode[1], innerText
    try{ //executes first, then catch if exception
        const response = await fetch('deleteItem', { //fetch from deleteItem route
            method: 'delete', //set method to delete
            headers: {'Content-Type': 'application/json'}, //set to json
            body: JSON.stringify({ //convert JSON to string
              'itemFromJS': itemText
            })
          })
        const data = await response.json() // get json of response
        console.log(data)
        location.reload() //reload page

    }catch(err){ //catch error
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //create variable to get current element's parentNode > childNode[1], innerText
    try{ //mostly same as above
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//mostly same as above
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}