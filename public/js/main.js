//set up variables for the deletebtn items and completed
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//add a smurf to listen on each delete btn
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//add a smurf on each complete marker
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//add a smurf to listen for uncompleted
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//async function to delete an item
async function deleteItem(){
    //gets the inner text from the item that was selected
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //calls the deleteitem from server js
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            //sends it the item text as the target to delete
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        //puts the response in json
        const data = await response.json()
        console.log(data)
        //reloads the page
        location.reload()

    }catch(err){
        //if it fails, it will console log the error
        console.log(err)
    }
}

//function to mark item complete
async function markComplete(){
    //gets the inner text of the html item that was selected
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //calls mark complete and gives it the itemtext info as the target
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //puts response as json
        const data = await response.json()
        //console logs the data
        console.log(data)
        //reloads the page
        location.reload()

    }catch(err){
        //if it fails, it will console log the error
        console.log(err)
    }
}

//function to mark an item uncomplete
async function markUnComplete(){
    //grabs the innder text from the element marked uncomplete
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //calls markUnComplete passsing it the item text as the target
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //sets response as json object
        const data = await response.json()
        //logs the data
        console.log(data)
        //reloads the page
        location.reload()

    }catch(err){
        //if it fails, it console logs the error
        console.log(err)
    }
}
