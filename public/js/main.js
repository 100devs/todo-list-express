const deleteBtn = document.querySelectorAll('.fa-trash') // select all the delete buttons and save it in a deleteBtn Variable
const item = document.querySelectorAll('.item span') //  select all the  items spans  and save it in the variable item
const itemCompleted = document.querySelectorAll('.item span.completed') // select all completed items  in a variable  itemCompleted 

Array.from(deleteBtn).forEach((element)=>{// give eventListeners click  for all the delete buttons using a forEach and looping over the  deleteBtn array
    element.addEventListener('click', deleteItem) // on the event 'click'  activate the function  deleteItem
})

Array.from(item).forEach((element)=>{// give eventListeners click  for all the check buttons using a forEach and looping over the item array
    element.addEventListener('click', markComplete)//on the event click activate the function matkCompleted to mark the task as completed
})

Array.from(itemCompleted).forEach((element)=>{ // give eventListeners click  for all the completed buttons using a forEach and looping over the itemCompleted array
    element.addEventListener('click', markUnComplete) // on the event of click activate the function mark Uncomplete
})

async function deleteItem(){ //function to delete items
    const itemText = this.parentNode.childNodes[1].innerText // saving the clicked on  text element  in a variable called  itemText
    try{ // try  the  code below  first 
        const response = await fetch('deleteItem', { // wait for the fetch  with the path  of deleteItem and save it  in a constant variable called response 
            method: 'delete', // decide the fetch method as delete
            headers: {'Content-Type': 'application/json'}, // decide the data content type as json 
            body: JSON.stringify({ // change the  itemText data into json format
              'itemFromJS': itemText // assign  itemFromJS to itemText
            })
          })
        const data = await response.json()  // wait for the response and  make sure it's a json format and save it in a constant variable called data
        console.log(data) // log the data (the response) into the console
        location.reload() // reload  the same page 

    }catch(err){  // if an error  happen  run the code below
        console.log(err) // log the error into the console
    }
}

async function markComplete(){ // markComplete function to mark the task as completed after clicking event on the button
    const itemText = this.parentNode.childNodes[1].innerText // saving the clicked on  text element  in a variable called  itemText
    try{ // try and run the code below first
        const response = await fetch('markComplete', { // wait for the fetch  of markComplete to happen and then assign it into a constant variable called response 
            method: 'put', // decide the fetch method as  a put (update)
            headers: {'Content-Type': 'application/json'}, // decide the content type as json
            body: JSON.stringify({ // take the  data from the body  and turn it into  json 
                'itemFromJS': itemText // assign "itemFromJS" to the itemText
            })
          })
        const data = await response.json() // wait for the response to come in a json format and then save it in aconstant variable called data
        console.log(data) // log the data (the response) into the console
        location.reload() // reload  the same page 


    }catch(err){ // if an error  happen  run the code below
        console.log(err) // log the error into the console
    }
}

async function markUnComplete(){  // mark the task as UnCompleted after a click on the button
    const itemText = this.parentNode.childNodes[1].innerText // saving the clicked on  text element  in a variable called  itemText
    try{ // try and  run the code below first
        const response = await fetch('markUnComplete', { // wait for the fetch  on the path unComplete and save it in a constant variable called response 
            method: 'put', // decide the fetch method as put (update)
            headers: {'Content-Type': 'application/json'}, // decide the content type as json 
            body: JSON.stringify({ //take the data in the body and turn it into json
                'itemFromJS': itemText // assign "itemsFromJS" to itemText
            })
          })
        const data = await response.json() // wait for the response to come  in ajson format  and save it  constant variable called data
        console.log(data) // log the data into the console
        location.reload() //reload  the page  on the same location

    }catch(err){ // if an error happend  run the code below 
        console.log(err) // log the error into the console
    }
}