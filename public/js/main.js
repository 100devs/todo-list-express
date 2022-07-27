// set deleteBtn to a NodeList of all items that have the class '.fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
// assign variable 'item' to a NodeList of all elements that are spans that have the class '.item'
const item = document.querySelectorAll('.item span')
// set itemCompleted to a NodeList of all elements that have a class of '.item' and that are a span with a class '.completed'
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creating an array from deleteBtn NodeList and adding a click event listener to each element and passing the deleteItem function as an argument
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

// Creating an array from the item NodeList and adding an event click listener to each element and passing the markComplete function as an argument
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

// Creating an array from the itemCompleted NodeList and adding a click event listener to each element and passing the markUnComplete function as an argument
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// asynchronous function called when element in deleteBtn (trash can icon) is clicked
async function deleteItem(){
    // the parent of the trash span has two children, first the span with the name of the to-do-item, second the trash span, thus, the next line assigns the innerText of the to-do-item name to itemText
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // fetch takes two arguments - first is the deleteItem url, second is an object whose method is delete, parsed as JSON data, and the body is turned into a string and the item name is fed to the server to be deleted
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // waiting to get data back from the fetch with the item removed
        const data = await response.json()
        console.log(data)
        // reload page with item deleted
        location.reload()
      // throw an error if fetch cannot be completed
    }catch(err){
        // log error information to the console
        console.log(err)
    }
}


// asynchronous function called when element in markComplete is clicked
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // waiting to get data back from the fetch with the item marked completed
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
    // throw an error if fetch cannot be completed
    }catch(err){
        // log error information to the console
        console.log(err)
    }
}

// asynchronous function called when element in markUnComplete is clicked
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // waiting to get data back from the fetch with the item marked unCompleted
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
    // throw an error if fetch cannot be completed
    }catch(err){
        // log error information to the console
        console.log(err)
    }
}
