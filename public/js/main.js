
//assigns delete button to the class .fa-trash
const deleteBtn = document.querySelectorAll('.fa-trash')

//assignign variable item by query selecting all elements with this class
const item = document.querySelectorAll('.item span')

//assigns completed items variable by query selecting elemtns with class .item that are completed
const itemCompleted = document.querySelectorAll('.item span.completed')

//turn delete button into array, add event listener handling the click event 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//turn items into array and process click event with event listener
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//turn completed items into array, add event listener handling the click event 
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//function that gets called when you hit delete button, makes a fetch uses delete method, converts the JS object to JSON, assigns the variable for data and awaits JSON response, console logs the data and throws any errors
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

//function that gets called when you hit complete button, makes a fetch uses put method, converts the JS object to JSON, assigns the variable for data and awaits JSON response, console logs the data and logs any errors
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

//same logic flow as earlier function but for marking items uncompleted via its dedicated function call
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