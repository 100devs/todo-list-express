const deleteBtn = document.querySelectorAll('.fa-trash')//web api that returns elements with .fa-trash class
const item = document.querySelectorAll('.item span')//web api that returns spans that are descendents of .item class
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
    console.log(this)
    console.log(this.parentNode)
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

