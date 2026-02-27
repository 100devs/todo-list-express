//variable for the selection of the fa-trash class
const deleteBtn = document.querySelectorAll('.fa-trash')
//variable for selection of the span within an item class
const item = document.querySelectorAll('.item span')
//variable for the seelction of the completed class in span
const itemCompleted = document.querySelectorAll('.item span.completed')

//array that runs the deleteItem function everytime a deleteBtn is clicked
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//array taht runs the markComplete function everytime an item is clicked
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//array that runs the markUncomplete function everytime itemCompleted is clicked
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//Function to delete Item
async function deleteItem(){
    //Grabs inner text from element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //deletes item
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //variable of data from response 
        const data = await response.json()
        //logs data
        console.log(data)
        //tells page to refresh
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//function to mark tasks complete
async function markComplete(){
    //grabs the inner text of the task
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //updates the status
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //variable of the response data
        const data = await response.json()
        console.log(data)
        //reloads the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//function to mark a task as incomplete
async function markUnComplete(){
    //grabs inner text of the task
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //updates the task to incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //variable to log the data from the response
        const data = await response.json()
        //console log the response
        console.log(data)
        //tell the page to reload and update the data on the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}