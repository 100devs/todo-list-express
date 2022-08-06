const deleteBtn = document.querySelectorAll('.fa-trash')
//selects everything with a trashcan icon and assigns it to a variable
const item = document.querySelectorAll('.item span')
//select all items within spans and assigns to variable
const itemCompleted = document.querySelectorAll('.item span.completed')
//take all completed items and assigns to variable

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//add event listener to each item in the deleteBtn (trashcans), turn to array 
//add clickevent, links to deleteItem function

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//add event listener to each item in the item selection, turn to Array
//add clickevent, links to markComplete function

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
//add event listener to each item in the itemcompleted, turns to Array
//add clickevent, links to markuncomplete function

async function deleteItem(){
    //declaring async function
    const itemText = this.parentNode.childNodes[1].innerText
        //name of the task in our list
    try{
        const response = await fetch('deleteItem', {
            //fetches "deleteitem" from server, second parameter is an object specifying the details of the request
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //Goes to deleteitem in server, telling server that request is in JSON and to expect a put.
          //.stringify puts request into JSON format
        const data = await response.json()
        //the deleted object is stored in a variable
        console.log(data)
        //console.log deleted object
        location.reload()
        //refreshes page to '/'

    }catch(err){
        console.log(err)
    }
    //error handling
}

async function markComplete(){
    //UPDATE function
    const itemText = this.parentNode.childNodes[1].innerText
    //name of the task in our list
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //Goes to markcomplete in server, telling server that request is in JSON and to expect a put.
          //.stringify puts request into JSON format
        const data = await response.json()
        //wait for json to come back, store in variable data
        console.log(data)
        //console.log deleted object
        location.reload()
        //refreshes page to '/'

    }catch(err){
        console.log(err)
    }
    //error handling
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    //Assigns variable to our selection
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //Goes to markUnComplete in server, telling server that request is in JSON and to expect a put.
          //.stringify puts request into JSON format
        const data = await response.json()
       //wait for json to come back, store in variable data
        console.log(data)
        //console.log deleted object
        location.reload()
        //refreshes page to '/'

    }catch(err){
        console.log(err)
    }
    //error handling
}