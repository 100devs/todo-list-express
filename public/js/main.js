
const deleteBtn = document.querySelectorAll('.fa-trash') // set deleteBtn to a NodeList of all items that have the class '.fa-trash'
const item = document.querySelectorAll('.item span') // assign variable 'item' to a NodeList of all elements that are spans that have the class '.item'
const itemCompleted = document.querySelectorAll('.item span.completed') // set itemCompleted variable to a NodeList of all elements that have a 
                                                                        // class of '.item' and that are a span with a class '.completed'


// Creating an array from deleteBtn NodeList and
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) // adding a click event listener to each element and passing the deleteItem function as an argument
})


// Creating an array from the item NodeList and
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) // adding a click event listener to each element and passing the markComplete function as an argument
})


// Creating an array from the itemCompleted NodeList and
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) // adding a click event listener to each element and passing the markUnComplete function as an argument
})


// asynchronous function called when element in deleteBtn (trash can icon) is clicked
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // the parent of the trash span has two children, first the span with the name of the 
                                                             // to-do-item, second the trash span, thus, the next line assigns the innerText of the 
                                                             // to-do-item name to itemText
    try{ // run this block of code and test for any errors
        const response = await fetch('deleteItem', { // fetch takes two arguments and makes a request - first is the deleteItem url, second is an object:
            method: 'delete', // whose method is delete
            headers: {'Content-Type': 'application/json'}, // parsed as JSON data
            body: JSON.stringify({ //and the body data is turned into a string
              'itemFromJS': itemText // and the item is fed to the server to be deleted
            })
          })
        const data = await response.json() // waiting to get data back from the fetch with the item removed
        console.log(data) //log the response JSON data to the console
        location.reload() // reload page with item deleted

    }catch(err){ // throw an error if fetch cannot be completed
        console.log(err) // log error information to the console
    }
}


// asynchronous function called when element in MarkComplete is clicked
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // the parent is the li, and the first child node is the text of the element and
                                                             // we are assigning a variable to that inner text
    try{ //run this block of code and test for any errors
        const response = await fetch('markComplete', { // fetch takes two arguments and makes a request - first is the markComplete url, second is an object:
            method: 'put', // whose method is to update
            headers: {'Content-Type': 'application/json'}, // parsed as JSON data
            body: JSON.stringify({ // and the body data is turned into a string
                'itemFromJS': itemText // and the item name is fed to the server to be marked Completed
            })
          })
        const data = await response.json() // waiting to get data back from the fetch with the item marked completed
        console.log(data) // log response JSON data to the console
        location.reload() // reload page with item marked completed

    }catch(err){ //throw an error if fetch cannot be completed
        console.log(err) // log error information to the console
    }
}


// asynchronous function called when element in markUnComplete is clicked
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // the parnt is the li, and the first child node is the text of the element and we are
                                                             // assigning a variable to that inner text
    try{ // run this block of code and tesat for any errors
        const response = await fetch('markUnComplete', { // waiting to get data back from the fetch with the item marked unCompleted
            method: 'put', // whose method is to update, 
            headers: {'Content-Type': 'application/json'}, // parsed as JSON data
            body: JSON.stringify({ // and the body data is turned into a string
                'itemFromJS': itemText // and the item is fed to the server to be marked UnCompleted
            })
          })
        const data = await response.json() // waiting to get data back from the fetch with the item marked Uncompleted
        console.log(data) // log response JSON data to the console
        location.reload() // reload page with item marked Uncompleted

    }catch(err){ // throw an error if fetch cannot be completed
        console.log(err) // log information to the console
    }
}
