const deleteBtn = document.querySelectorAll('.fa-trash') //Setting a varible to a query selector with the class of '.fa-trash' to allow for delete functionality
const item = document.querySelectorAll('.item span') //Setting a variable to a query selector with the class of '.item-span' to identify the Todos
const itemCompleted = document.querySelectorAll('.item span.completed') // Setting a variable to a query selector with the class of '.item span.completed' to identify completed Todos

//Three different forEach methods being called for the three variables above. Waiting for a click action and calling the respective function to either delete, markComplete or mark Uncomplete
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//Async function to retrieve the text of a node on the DOM and find it in the collection and delete it. Logs that data and reloads the page.
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
//Async function to find the text in the DOM and search in the collection and update the completion status to true, and log the data and relaod.
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
//Find innertext you clicked on in collection, then update completion status to false, log data, and reload
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