// set deleteBtn to a NodeList of all items that have the class '.fa-trash'
const deleteBtn = document.querySelectorAll('.fa-trash')
// assign variable 'item' to a NodeList of all elements that are spans that have the class '.item'
const item = document.querySelectorAll('.item span')
// set itemCompleted to a NodeList of all elements that have a class of '.item' and that are a span with a class '.completed'
const itemCompleted = document.querySelectorAll('.item span.completed')

// Creating an array from deleteBtn NodeList and 
Array.from(deleteBtn).forEach((element)=>{
    // adding a click event listener to each element and passing the deleteItem function as an argument
    element.addEventListener('click', deleteItem)
})

// Creating an array from the item NodeList and 
Array.from(item).forEach((element)=>{
    // adding an event click listener to each element and passing the markComplete function as an argument
    element.addEventListener('click', markComplete)
})

// Creating an array from the itemCompleted NodeList and 
Array.from(itemCompleted).forEach((element)=>{
    // adding a click event listener to each element and passing the markUnComplete function as an argument
    element.addEventListener('click', markUnComplete)
})

// asynchronous function called when element in deleteBtn (trash can icon) is clicked
async function deleteItem(){
    // the parent of the trash span has two children, first the span with the name of the to-do-item, second the trash span, thus, the next line assigns the innerText of the to-do-item name to itemText
    const itemText = this.parentNode.childNodes[1].innerText
    // run this block of code and test for any errors
    try{
        // fetch takes two arguments and makes a request - first is the deleteItem url, second is an object:
        const response = await fetch('deleteItem', {
            //whose method is delete,
            method: 'delete',
            // parsed as JSON data,
            headers: {'Content-Type': 'application/json'},
            // and the body data is turned into a string
            body: JSON.stringify({
              // and the item name is fed to the server to be deleted
              'itemFromJS': itemText
            })
          })
        // waiting to get data back from the fetch with the item removed
        const data = await response.json()
        // log response JSON data to the console
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
    // the parent is the li, and the first child node is the text of the element and we are assigning a variable to that inner text 
    const itemText = this.parentNode.childNodes[1].innerText
    // run this block of code and test for any errors
    try{
        // fetch takes two arguments and makes a request - first is the markComplete url, second is an object:
        const response = await fetch('markComplete', {
            //whose method is to update,
            method: 'put',
            // parsed as JSON data,
            headers: {'Content-Type': 'application/json'},
            // and the body data is turned into a string
            body: JSON.stringify({
                // and the item name is fed to the server to be marked Completed
                'itemFromJS': itemText
            })
          })
        // waiting to get data back from the fetch with the item marked completed
        const data = await response.json()
        // log response JSON data to the console
        console.log(data)
        // reload page with item marked completed
        location.reload()
    // throw an error if fetch cannot be completed
    }catch(err){
        // log error information to the console
        console.log(err)
    }
}

// asynchronous function called when element in markUnComplete is clicked
async function markUnComplete(){
    // the parent is the li, and the first child node is the text of the element and we are assigning a variable to that inner text
    const itemText = this.parentNode.childNodes[1].innerText
    // run this block of code and test for any errors
    try{
        // waiting to get data back from the fetch with the item marked unCompleted
        const response = await fetch('markUnComplete', {
            //whose method is to update,
            method: 'put',
            // parsed as JSON data,
            headers: {'Content-Type': 'application/json'},
            // and the body data is turned into a string
            body: JSON.stringify({
                // and the item name is fed to the server to be marked UnCompleted
                'itemFromJS': itemText
            })
          })
        // waiting to get data back from the fetch with the item marked Uncompleted
        const data = await response.json()
        // log response JSON data to the console
        console.log(data)
        // reload page with item marked Uncompleted
        location.reload()
    // throw an error if fetch cannot be completed
    }catch(err){
        // log error information to the console
        console.log(err)
    }
}
