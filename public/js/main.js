const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')


//An array of each of the items with class .fa-trash is looped through and the event listener for each of the delete buttons is added.
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//An array of each of the span elements under classes "item" is looped through and the event listener for each of the delete buttons is added.
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//An array of each of the span elements with classes "completed" under "item" class is looped through and the event listener for each of the delete buttons is added.
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


//the text inside of a given parent node thas is selectd, i.e. the exact inner text of the ilement that is being deleted defined as "itemText". The deleteItem method is called on the server.js to sending a delete method to the Mongodb with the json  is send as json on an itemFromJS and the corresponding inner text that should be deleted. The page is then reloaded show onl the items from the data (of which now does not include the item that was deleted)
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item grabs ONLY the inner text within the list span
    try{
        const response = await fetch('deleteItem', { //creates response variable that waits on fetch to get data from result of deleteItem route
          //sets the methods as delete
            method: 'delete',
            //sets the content type as json
            headers: {'Content-Type': 'application/json'},

            //declares the message content being based and stringfy that content
            body: JSON.stringify({
              'itemFromJS': itemText //setting content of body to inner text of list item and making it itemFromJS
            })
          })
        const data = await response.json() //resonds to the sender
        console.log(data)
        location.reload() //refreshes

    }catch(err){
        console.log(err)
    }
}
//parent node is the element with the event listener. The child node [1] is the else part of if statement where span is not completed???. The innerText of the child node is send as itemFromJS with the innerText in json to the put method of server js
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //looks inside list item grabs ONLY the inner text within the list span


    //declaring try block
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json() //waiting on JSON from resonse to be converted
        console.log(data) //logs result to the console.
        location.reload() //refreshes

    }catch(err){ //catchees errors
        console.log(err)
    }
}

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
