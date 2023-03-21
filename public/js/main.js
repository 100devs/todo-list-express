const deleteBtn = document.querySelectorAll('.fa-trash')// deleteBtn will be where the bins are on the client side
const item = document.querySelectorAll('.item span') // item will be the span that comes after the class item
const itemCompleted = document.querySelectorAll('.item span.completed')// itemCompleted will be the span with the class completed that comes after the class item.

Array.from(deleteBtn).forEach((element)=>{ // for each delete button, when someone clicks on it, start the deleteItem function.
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{ // for each item , when someone clicks on it, start the markComplete function.
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // for each itemCompleted, when someone clicks on it, start the markUncomplete function.
})

async function deleteItem(){// if I click on the bin, send me to this function
    const itemText = this.parentNode.childNodes[1].innerText// get the text from the li
    try{
        const response = await fetch('deleteItem', {// send this info to the backend
            method: 'delete', // we will be deleting
            headers: {'Content-Type': 'application/json'},// be aware this is an object
            body: JSON.stringify({//convert the object into string
              'itemFromJS': itemText // place the inner text from the list under the property itemfromJs
            })
          })
        const data = await response.json()
        console.log(data) // show me the data in the console
        location.reload()// refresh the page

    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // get the inner text of the child from the list
    try{
        const response = await fetch('markComplete', { // send this info to the put in the backend
            method: 'put',
            headers: {'Content-Type': 'application/json'},// im sending you an object
            body: JSON.stringify({ // convert the object into a string
                'itemFromJS': itemText// place the inner text from the list under the property itemfromJs
            })
          })
        const data = await response.json()// now wait for response as an object
        console.log(data)
        location.reload()// reload

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText// get inner text from the list
    try{
        const response = await fetch('markUnComplete', {// send the response to the backend
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText // place the inner text from the list under the property itemfromJs
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}