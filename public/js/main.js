// selects elem with class fa-trash, delete buttons for each todo list
const deleteBtn = document.querySelectorAll('.fa-trash')
//this will represent the main content of each todo item
const item = document.querySelectorAll('.item span')
// when a todo list is completed, marking it as completed
const itemCompleted = document.querySelectorAll('.item span.completed')


//converts NodeList returned by querySelectorAll into array, .forEach() iterates over each element in array
//inside callback func: elem === each individual del button element
//with addEvent... attaches a click event listener to each elem
//deleteItem func: will be defined further down on the code, handles logic for deleting item when clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//we are selecting all elems with class 'item', converting NodeList with Array.from(), iterating over each elem with forEach()
//attaching a click event listener to each elem
//markComplete func is defined further down, handles logic for marking item as complete when clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//convert NodeList returned by querySelectorAll into array
//.forEach() allows iteration over each element in converted array
//.addEventList.. attaches click eventListener to each elem
//markUncomplete() func is to be defined further down the code, logic for marking item as incomplete when clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//this func implements a DELETE operation for a todo item
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText  
    try{
        const response = await fetch('deleteItem', { //parses response as JSON
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data) //logs received data
        location.reload() //reload page after deletion

    }catch(err){
        console.log(err)
    }
}
//this func implements a PUT operation for a todo item, it will mark todo item when completed
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //retrieves text content of the parent child node
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data) //logs received data
        location.reload() //reload page after deletion

    }catch(err){
        console.log(err)
    }
}

//this func implements a PUT operation for a todo item
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //retrieves text content, .this suggests func is attached to event listener 
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data) //logs received data
        location.reload() //reload page after deletion

    }catch(err){
        console.log(err)
    }
}