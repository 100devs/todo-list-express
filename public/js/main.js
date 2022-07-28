//Select all the elements with the class fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')
//Select all the span elements with the class of item
const item = document.querySelectorAll('.item span')    
//Selec all of the span elements with the completed and item
const itemCompleted = document.querySelectorAll('.item span.completed')

//Transform our collection of delete button to an array so we can use a foreach
Array.from(deleteBtn).forEach((element)=>{
    //Creating click event for every delete button
    element.addEventListener('click', deleteItem)
})

//Transform our collection of items/todo to an array so we can use a foreach
Array.from(item).forEach((element)=>{
    
    element.addEventListener('click', markComplete)
})

//Transform our collection of completed items/todo to an array so we can use a foreach
Array.from(itemCompleted).forEach((element)=>{
    //Creating click event for every item so we can mark them as uncompleted
    element.addEventListener('click', markUnComplete)
})

//creating an asynchronous function
async function deleteItem(){
    //Select the text of the item selected
    const itemText = this.parentNode.childNodes[1].innerText

    //Try to do the following code
    try{
        //Making a fetch request to delete the item from the todo list passing a method, headers and the item itselft in the body
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        //We save the result of the fetch request as a json
        const data = await response.json()
        console.log(data)
        //This refresh the page to show the updated list (without this element)
        location.reload()

    //If the code inside the try doesnt works, this will be executed
    }catch(err){
        //Prints the error to the console
        console.log(err)
    }
}

//Creating an asynchronous function
async function markComplete(){
    
    //Select the text of the item selected
    const itemText = this.parentNode.childNodes[1].innerText

    //Try to do the following code
    try{
        //Making a fetch request to delete the item from the todo list passing a method, headers and the item itselft in the body
        //ASK TO LEON why did Leon used put instead of patch
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},  //
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        //We save the result of the fetch request as a json
        const data = await response.json()
        console.log(data)   //Console log the data in the console
        //This refresh the page to show the updated list (showing this items as completed)
        location.reload()

    //If the code inside the try doesnt works, this will be executed
    }catch(err){
        //Prints the error to the console
        console.log(err)
    }
}

//Creating an asynchronous function
async function markUnComplete(){
    
    //Select the text of the item selected
    const itemText = this.parentNode.childNodes[1].innerText 

    //Try to do the following code
    try{
        //Making a fetch request to delete the item from the todo list passing a method, headers and the item itselft in the body
        //ASK TO LEON again >.< why did he used put instead of patch
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })

        //We save the result of the fetch request as a json
        const data = await response.json()
        console.log(data)
        //This refresh the page to show the updated list (so we show the item ghas been marked as uncomplete)
        location.reload()

    //If the code inside the try doesnt works, this will be executed
    }catch(err){
        //Prints the error to the console
        console.log(err)
    }
}

//fetch items
//method: the action we want to perform
//header: conten-type: it tells the backend we are working with data structured as json
//body: we transforms the array? into a json