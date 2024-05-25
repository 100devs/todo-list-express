//Declare variables from the document object model with element values
//We are selecting classes
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//Create array from the elements pulled from the DOM.
Array.from(deleteBtn).forEach((element)=>{
    //Give each element an event listener on click which calls the function in the second parameter.
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//Follow functions allow the code to run asynchronously.
//When the await keyword is utilised what follows will be sent to the task queue while the stack is able to continue its exectution.
async function deleteItem(){
    //itemText assigned the text appearing in the HTML of the element in the deleteBtn array.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //When this fetch is executed it is blocking the queue until finished and returned to the stack.
        //We send a fetch request to '/deleteItem' which executes app.delete in our server.js file.
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //When this method call is executed it is blocking the queue until finished and returned to the stack.
        //Console log our response from JSON and reload the document.
        const data = await response.json()
        console.log(data)
        location.reload()
    //Catch errors executing the try statement.
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    //itemText assigned the text appearing in the HTML of the element in the item array.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //When this fetch is executed it is blocking the stack until finished.
        //We send a fetch request to '/markComplete' which executes app.put in our server.js file.
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //When this method call is executed it is blocking the queue until finished and returned to the stack.
        //Console log our response from JSON and reload the document.
        const data = await response.json()
        console.log(data)
        location.reload()
    //Catch errors executing the try statement.
    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){
    //itemText assigned the text appearing in the HTML of the element in the itemCompleted array.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //When this fetch is executed it is blocking the stack until finished.
        //We send a fetch request to '/markComplete' which executes app.put in our server.js fi
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //When this method call is executed it is blocking the queue until finished and returned to the stack.
        //Console log our response from JSON and reload the document.
        const data = await response.json()
        console.log(data)
        location.reload()
    //Catch errors executing the try statement.
    }catch(err){
        console.log(err)
    }
}