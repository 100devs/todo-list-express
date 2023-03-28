// This code is using the Array.from method to convert a collection of elements stored in the todoItem variable into an array, and then it is calling the forEach method on that array.

// For each element in the array, the code is adding an event listener to listen for a 'click' event. The event listener is calling a function named markComplete, which is not shown in this code.

// The purpose of this code is likely to add a click event listener to each element in a list of to-do items, so that when the user clicks on an item in the list, it will be marked as completed by executing the markComplete function.


//variable holding the del class
const deleteBtn = document.querySelectorAll('.del')
//variable holding the not class 
const todoItem = document.querySelectorAll('span.not')
//variable holding the .completed class
const todoComplete = document.querySelectorAll('span.completed')


//adding a smurf to each element that runs the dleteTodo function on click 
Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})
//adding a smurf to element in the forEach method. On the click the markComplete function is invoked 
Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})
//all the elements with the completed class are converted to an array and chained to a forEach methoc
Array.from(todoComplete).forEach((el)=>{
    //a smurf is added to the element in the arrayand once it hears a click it runs the markIncomplete function
    el.addEventListener('click', markIncomplete)
})

//async delete function
async function deleteTodo(){
    //variable holding the id of the todo item
    const todoId = this.parentNode.dataset.id
    //try/catch block
    try{
        //variabhle holding the response from fetch api to delete items on todo list
        const response = await fetch('todos/deleteTask', {
            //HTTP method
            method: 'delete',
            //header indicates content type in this case json
            headers: {'Content-type': 'application/json'},
            //convert the body to JSON
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        //data awaiting the JSOn data
        const data = await response.json()
        console.log(data)
        //when the response is returned the page reloads
        location.reload()
    }catch(err){
        console.log(err)
    }
}

//async function marking todo items as complete
async function markComplete(){
    //variable holding the id of the todo item
    const todoId = this.parentNode.dataset.id
    try{
        //variable holding the response from the fetch api
        const response = await fetch('todos/markTask', {
            //MEthod is put
            method: 'put',
            //headers determines the type of resonse here it is json
            headers: {'Content-type': 'application/json'},
            //body of the response is parsed into json
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/unmarkTask', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}