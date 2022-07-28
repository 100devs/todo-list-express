// declare variable for trash-can
const deleteBtn = document.querySelectorAll('.fa-trash')

// declare variable for a new item
const item = document.querySelectorAll('.item span')

// declare variable for completed items
const itemCompleted = document.querySelectorAll('.item span.completed')

// set array that includes all elements in deleteBtn
Array.from(deleteBtn).forEach((element)=>{
    // add event listner to each element when on click runs function deleteItem
    element.addEventListener('click', deleteItem)
})

// set array that includes all elements in item array
Array.from(item).forEach((element)=>{
    // add event listener to each element when on click runs function markComplete
    element.addEventListener('click', markComplete)
})

// set array that includes all elements in itemCompleted array
Array.from(itemCompleted).forEach((element)=>{
    // add event listner to each element when on click runs function markUnCopmlete
    element.addEventListener('click', markUnComplete)
})

// declare asynchronous function deleteItem to delete from database
async function deleteItem(){
    // declare variable itemText that takes text of second child of parent element
    const itemText = this.parentNode.childNodes[1].innerText
    // if code runs successfully hence run try, which is like .then
    try{
        // send fetch request to endpoint of deleteItem using delete method
        // which server will receive as json object having key/value pair as itemFromJs and itemText respectively
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // await response from server which should resolve as json  
        const data = await response.json()
        // log data in console
        console.log(data)
        // reload current page
        location.reload()

    // log errors in console if no success        
    }catch(err){
        console.log(err)
    }
}

// declare function markComplete to update in database
async function markComplete(){
    // declare variable itemText that takes text of second child of parent element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send fetch request to endpoint of markComplete using put method
        // which server will receive as json object having key/value pair as itemFromJs and itemText respectively
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // await response from server which should resolve as json    
        const data = await response.json()
        // log data in console
        console.log(data)
        // reload current page
        location.reload()

    // log errors in console      
    }catch(err){
        console.log(err)
    }
}

// declare function markUnComplete to update in database
async function markUnComplete(){
    // declare variable itemText that takes text of second child of parent element
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // send fetch request to endpoint of markUnComplete using put method
        // which server will receive as json object having key/value pair as itemFromJs and itemText respectively
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // await response from server which should resolve as json      
        const data = await response.json()
        // log data in console
        console.log(data)
        // reload current page
        location.reload()

    // log errors in console    
    }catch(err){
        console.log(err)
    }
}