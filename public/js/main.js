//declares a variable for the delete button
const deleteBtn = document.querySelectorAll('.fa-trash')
//declares a variable for the list items
const item = document.querySelectorAll('.item span')
//declaring a variable for the completed items
const itemCompleted = document.querySelectorAll('.item span.completed')

//a loop to create event listeners for the delete function (click event)
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//a loop to create event listeners for the marking items complete function (click event)
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//a loop to create event listeners for the marking items uncomplete function (click event)
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//function that deletes items from the list (async function)
async function deleteItem(){
    //declaring a variable to the list item in the DOM
    //The read-only parentNode property of the Node interface returns the parent of the specified node in the DOM tree.
    //The read-only childNodes property of the Node interface returns a live NodeList of child nodes of the given element where the first child node is assigned index 0. 
    //Child nodes include elements, text and comments.
    //SOURCE: MDN
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
           //declare a data variable to console log json
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//function that marks an item complete on the list (async function)
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // declaring a variable to get a delete response from the server (deleteItem method)
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //declare a data variable to console log json
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//function that marks an item uncomplete on the list (async function)
async function markUnComplete(){
    
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        / declaring a variable to get a markUncomplete response from the server (mark Uncomplete method)
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
           //declare a data variable to console log json
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}