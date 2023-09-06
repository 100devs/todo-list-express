//Code by #100Devs, Leon Noel
//Comments by Upasana Devkota

//Description
//A todo list application that displays the tasks you have completed, need to complete, and the number of tasks left to do
// You can mark tasks complete or incomplete and switch between the two
//You can add a tasks by adding the task
// You can delte tasks by clicking on the trashcans

const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
//save all trash icons in a variable
//save all uncompleted to do list items in variable
//save all completed to do list items in a variable

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//Add event listeners to fire the same fetch in each category by iterating through array of trash icons, uncompleted to do list items, or completed to do list items and adding their respective event listener

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
//delete aysnc request function
//save the to do list item from the dom in a variable that we clicked the trash can on
//send a fetch delete request that is stringified into JSON format that has a property of itemFromJS and value equal to that of the to do list item gotten from the dom where the trash icon was clicked, tell the server we are sending data in json format
//after waiting for the response, console.log the response and refresh client-side js
////run a catch error with console.log(error) if anything goes wrong 

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
//update/put aysnc request function: completed 
//save the to do list item from the dom in a variable that we clicked 
//send a fetch put request that is stringified into JSON format that has a property of itemFromJS and value equal to that of the to do list item gotten from the dom where the to do list item was clicked, tell the server we are sending data in json format
//after waiting for the response, console.log the response and refresh client-side js
////run a catch error with console.log(error) if anything goes wrong 

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
//update/put aysnc request function: uncompleted
//save the to do list item from the dom in a variable that we clicked 
//send a fetch put request that is stringified into JSON format that has a property of itemFromJS and value equal to that of the to do list item gotten from the dom where the to do list item was clicked, tell the server we are sending data in json format
//after waiting for the response, console.log the response and refresh client-side js
////run a catch error with console.log(error) if anything goes wrong 

//documentation for each function 
//document.querySelectorAll() 
//https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll

//Array.from()
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from

//.forEach()
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach

//.addEventListener()
//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

//async await func
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await

//JSON.stringify()
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify

//location.reload()
//https://developer.mozilla.org/en-US/docs/Web/API/Location/reload

