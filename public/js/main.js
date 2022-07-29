const deleteBtn = document.querySelectorAll('.fa-trash') // creating a variable and assigning it to a selection of all elements with the class of fa-trash
const item = document.querySelectorAll('.item span') // creating a variable and assigning it to a selection of all span tags that have a parent with the class of item
const itemCompleted = document.querySelectorAll('.item span.completed') // creating a variable and assigning it to a selection of span tags that have a class of completed and within a parent with the class of item 

Array.from(deleteBtn).forEach((element)=>{ // creating an array from deleteBtn and iterating through each element with forEach
    element.addEventListener('click', deleteItem) // add event listener to current item (of array); listens for a click and calls a function called deleteItem
}) // close loop 

Array.from(item).forEach((element)=>{ // creating an array from a list of spans and iterating through each element with forEach
    element.addEventListener('click', markComplete) // add event listener to current item (of array); listens for a click and calls a function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{ // creating an array from completed spans and iterating through each element with forEach
    element.addEventListener('click', markUnComplete) // add event listener to only completed items; listens for a click and calls a function called markUnComplete
})

async function deleteItem(){ // declare an asynchronous function (change flow of function - allow for other tasks to run)
    const itemText = this.parentNode.childNodes[1].innerText // looks inside of the list item to extract the text value only of the specified list item
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