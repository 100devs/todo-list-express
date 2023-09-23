//Select all elements with class 'fa-trash' and store them in 'deleteBtn'
const deleteBtn = document.querySelectorAll('.fa-trash')
//Select all elements with class 'item span' and store them in 'item'
const item = document.querySelectorAll('.item span')
//Select all elements with class 'item span.completed' and store them in 'itemCompleted'
const itemCompleted = document.querySelectorAll('.item span.completed')

//Add a click event listener to each element with class 'fa-trash'
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//add a click event listener to each element with class 'item span'
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//Add a click event listener to each element with class 'item span.complted'
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//Function to handle the deletion of an item
async function deleteItem(){
    //Get the text of the item to be deleted
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Send a DELETE request to 'deleteItem' route with the item text as JSON
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //Parse the response JSON
        const data = await response.json()

        //log the response data and reload the page
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//Function to handle marking an item as complete
async function markComplete(){
    //Get the text of the item to be marked as complete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Send a PUT request to 'markComplete' route with the item text as JSON
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //Parse the response JSON
        const data = await response.json()
        //Log the response data and reload the page
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//Function to handle marking an item as uncomplete
async function markUnComplete(){
    //Get the text of the item to be marked as uncomplete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //Send a PUT request to 'markUnComplete' route with the item text as JSON
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //Parse the response JSON
        const data = await response.json()
        //Log the response data and reload the page
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}