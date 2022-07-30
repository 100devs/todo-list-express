const deleteBtn = document.querySelectorAll('.fa-trash') //all elements with the class fa-trash will be selected into a new variable deleteBtn
const item = document.querySelectorAll('.item span') //all elements with the parent class item and is a span will be selected into a new variable item
const itemCompleted = document.querySelectorAll('.item span.completed') //all elements with the parent item and span with the class completed will be selected into a new variable 'itemCompleted'

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//for each element in the deleteBTn array, the click event listener is addded attached to the deleteItem function through the forEach loop
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//for each element in the item array, the click event listener is addded attached to the markComplete function through the forEach loop
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//for each element in the itemCompleted array, the click event listener is addded attached to the markUncomplete function through the forEach loop

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
//the function above is used to delete items from the todolist after they have been entered in the database
// once the function is called a new const called ItemText
//the next operation will fetch the deleteItem from the server and using the delete method it will delete the itemText selected frm the innerText(from the index.ejs file selection)
//the selected item will be turned into a json string itemFromJs will have the itemText assigned into it
//after the respons executed, the resultses will be parsed into json and assigned to the data variable then the location on the ejs file will be reloaded.


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

//the function above is initiated when a markComplete action is executed on the index.ejs file for each item
//the element selected is assigned into the variable itemText after which the markComplete fetch is initiated
//the put method which will upadete the status of the file into the database on the field itemFromJS
// the response will be parsed into json and asssigned into the data const and location on the index.ejs will be reloaded to show the 
// in the event of an error, the error will be caught and displayed on the console
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