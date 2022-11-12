const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and assigning it to a selection of all elements with a class of 'fa-trash'
const item = document.querySelectorAll('.item span') //creating a variable and assigning it to a selection of span tags within a parent with the class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a variable and assigning it to a selection of span tags with the class of "completed" within a parent with the class of "item"

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection of .fa-trash and starting a loop
    element.addEventListener('click', deleteItem) //adding an event listener to the current item that waits for a click and onclick, it calls a function called deleteItem
}) //close our loop

Array.from(item).forEach((element)=>{//creating an array from our variable item from above and starting a loop
    element.addEventListener('click', markComplete) //adding an event listener to the current item that waits for a click and onclick, it calls a function called markComplete
}) //close our loop

Array.from(itemCompleted).forEach((element)=>{ //creating an array from our itemCompleted selection and starts a loop
    element.addEventListener('click', markUnComplete) //adds an event listener to only completed items, listens to a click, and then runs markUnComplete
}) //close our loop


async function deleteItem(){ //declaring an asynchronous function 
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