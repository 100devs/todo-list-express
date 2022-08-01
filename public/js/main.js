//Select and store groups of items from the DOM
const deleteBtn = document.querySelectorAll('.fa-trash') //All the delete buttons (trash icon)
const item = document.querySelectorAll('.item span') //All spans with class="item"
const itemCompleted = document.querySelectorAll('.item span.completed') //All spans with both 'item' and 'completed' classes

//Add an event listener to each delete button 
Array.from(deleteBtn).forEach((element)=>{
    //When clicked, call 'deleteItem'
    element.addEventListener('click', deleteItem)
})

//Add an event listener to each list item. 
Array.from(item).forEach((element)=>{
    //When clicked, call 'markComplete'
    element.addEventListener('click', markComplete)
})

//Add an event listener to each item in itemCompleted
Array.from(itemCompleted).forEach((element)=>{
    //When clicked, call 'markUnComplete'
    element.addEventListener('click', markUnComplete)
})

//Async function to delete todo items
async function deleteItem(){
    // Select the parent node of this (this is the trash icon within the todo list item), then get the inner text of the second child of it (should be text content of list item)
    //Had to change to childNodes[5] from [1] due to added comments!
    const itemText = this.parentNode.childNodes[5].innerText
    console.log(itemText)
    //Async try this
    try{
        //Send fetch request to '/deleteItem'
        const response = await fetch('deleteItem', {
            method: 'delete', /* Tell server to the delete method */
            headers: {'Content-Type': 'application/json'}, /* Tell server to expect JSON content */
            body: JSON.stringify({ 
              'itemFromJS': itemText /* Convert itemText to JSON */
            })
          })
        const data = await response.json() /* Wait for the server's response */
        console.log(data) /* Output response to the console */
        location.reload() /* Reload window */

    }catch(err){
        // Catch any error and display on the console.
        console.log(err)
    }
}

//Async function for marking items as complete
async function markComplete(){
    // Get identifying info  **look into parentNode/childNodes**
    const itemText = this.parentNode.childNodes[5].innerText

    //Try to contact the server
    try{
        //Send fetch request to '/markComplete'
        const response = await fetch('markComplete', {
            method: 'put', /* Tell server to use 'put' method */
            headers: {'Content-Type': 'application/json'}, /* Tell server to expect JSON content */
            body: JSON.stringify({
                'itemFromJS': itemText /* Convert itemText to JSON */
            })
          })
        const data = await response.json() /* Wait for the server's response */
        console.log(data) /* Output response to the console */
        location.reload() /* Reload window */

    }catch(err){
        console.log(err) // Catch any error and display on the console.
    }
}

//Async function for marking items un-complete
async function markUnComplete(){
    // Get identifying info  **look into parentNode/childNodes**
    const itemText = this.parentNode.childNodes[5].innerText
    console.log(itemText)
    try{
        //Send fetch request to '/markUnComplete'
        const response = await fetch('markUnComplete', {
            method: 'put',  /* Tell server to use 'put' method */
            headers: {'Content-Type': 'application/json'}, /* Tell server to expect JSON content */
            body: JSON.stringify({
                'itemFromJS': itemText /* Convert itemText to JSON */
            })
          })
        const data = await response.json() /* Wait for the server's response */
        console.log(data) /* Output response to the console */
        location.reload() /* Reload window */

    }catch(err){
        console.log(err) // Catch any error and display on the console.
    }
}