// get all the DOM elements with a class of `fa-trash` and assign the NodeList to deleteBtn
const deleteBtn = document.querySelectorAll('.fa-trash')
// get all the DOM elements that are spans and descendants of elements with a class of `item`, and assign to the item variable
const item = document.querySelectorAll('.item span')
// get all the DOM elements that are spans with a class of `completed` and are descendants of elements with a class of `item`, assigning them to the `itemCompleted` variable
const itemCompleted = document.querySelectorAll('.item span.completed')

// convert deleteBtn NodeList to an array and then call .forEach on the array
Array.from(deleteBtn).forEach((element)=>{
    // adding the deleteItem function as a click event listener for each item in deleteBtn
    element.addEventListener('click', deleteItem)
})

// creating an array from the nodelist assigned to the item variable, looping through it and adding an event listener to each element that will 'listen' for a click and passing the function 'markComplete'
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// creating an array from the nodelist assigned to itemCompleted. Looping through the array
Array.from(itemCompleted).forEach((element)=>{
    // add event listener to each element that will 'listen' for a click and passing the function 'markUnComplete' 
    element.addEventListener('click', markUnComplete)
})

// declare an async function called deleteItem
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