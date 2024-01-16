//Grabbing the delete button from the dom, all of the ones that exist at least, the length of the node list depending on the amount of documents passed into the ejs file.
const deleteBtn = document.querySelectorAll('.fa-trash')
//grabbing all of our todo items.
const item = document.querySelectorAll('.item span')
//grabbing all of our todo items that have been completed.
const itemCompleted = document.querySelectorAll('.item span.completed')

//Creating an array from the nodelist returned by querySelectorAll selecting all the deleteBtns and adding an event listener for each one of them with the callback function of deleteItem, which is declared below.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Same for the items, we specify a callback of markComplete, when the user clicks on an uncomplete item, it will mark it.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Same for the completed items, when a click event is heard, will call the markUncomplete function and set that item to uncomplete.
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