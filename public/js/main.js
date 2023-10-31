const deleteBtn = document.querySelectorAll('.fa-trash')//create a variable that holds the selection of all elements with the .fa-trash (the trash can) class
const item = document.querySelectorAll('.item span')//create a variable that holds the selection of all span tags within the .item class
const itemCompleted = document.querySelectorAll('.item span.completed')//create a variable that holds the selection of all spans with a class of completed inside of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{//create an array from all of the elements inside the deleteBtn variable and start a loop
    element.addEventListener('click', deleteItem)//add an event listener that waits for a click and runs deleteItem on click to every element inside deleteBtn variable
})//close our loop

Array.from(item).forEach((element)=>{//create an array from all of the elements inside the item variable and start a loop
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
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

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
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