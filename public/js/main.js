//this is targeting our elements that will be used client side: trashcan and both span classes

const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//creating event listener for when the trash can is clicked upon by client, creating function in the paramter
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//creating event listener for when client clicks on the item (text) that has been completed
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//creating event listener for if/when the client clicks a completed task to revert the strikethrough
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//creating the function to delete the to do list item; grabbing the text and storing it as a variable; using async/wait for fetch;
//parsing the json object using stringify; logging the data to the console, reloading the page, and catching error if needed.
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

//creating the function to mark a text item as complete: creating a varialbe to hold the text; using async await to make the fetch; put request; 
//parsing the json; logging the data to the console; reloading the page; logging error if needed.
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

//creating the function to mark an item is uncomplete; using async await to make the fetch; saving the text as a variable; put method; 
//parsing json, loggigng data to the console; reloading the page; logging error if necessary
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