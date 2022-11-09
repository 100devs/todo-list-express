// find all delete buttons 
const deleteBtn = document.querySelectorAll('.fa-trash')
// find all span elements with a class of '.item'
const item = document.querySelectorAll('.item span')
// find all span items marked as completed by checking if they have the '.completed' css class
const itemCompleted = document.querySelectorAll('.item span.completed')

// Each NodeList is converted to an array, then within a forEach loop, each element has a click event assigned with a callback function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// function to submit a delete request to the server
async function deleteItem(){
    // the text of the tiem whose delete button was clicked
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // delete request sent to the server as a json converted to a string
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            // itemFromJS will be the property that holds our marked complete item in our request.body.itemFromJS in our app.put('/deleteItem')
              'itemFromJS': itemText
            })
          })
        // server response is converted to json and page refreshes
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// function to mark an item as complete on the server
async function markComplete(){
    // This is the text of the item whose mark-complete button was clicked stored in variable 'itemText'
    const itemText = this.parentNode.childNodes[1].innerText
    try{
         // The edit/put request sent to the server so that this item can be marked as complete.
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // itemFromJS will be the property that holds our marked complete item in our request.body.itemFromJS in our app.put('/markComplete')
                'itemFromJS': itemText
            })
          })
        // server response is converted to json and page refreshes triggering get request
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// function to mark an item as incomplete on the server
async function markUnComplete(){
    // This is the text of the item whose "mark-uncomplete" button was clicked.
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // The edit/put request sent to the server so that this item can be marked as incomplete
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // itemFromJS will be the property that holds our marked complete item in our request.body.itemFromJS in our app.put('/markUnComplete')
                'itemFromJS': itemText
            })
          })
        // server response is converted to json and page refreshes
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}