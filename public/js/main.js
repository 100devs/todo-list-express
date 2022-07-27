//Client side front end javascripts
const deleteBtn = document.querySelectorAll('.fa-trash') //create deleteBtn variable that applies to every item with class .fa-trash
const item = document.querySelectorAll('.item span')//create item variable that applies to every item with class .item span
const itemCompleted = document.querySelectorAll('.item span.completed') //create itemCompleted variable that applies to every item with class  .item span.completed

Array.from(deleteBtn).forEach((element)=>{ //create an array from the variable deleteBtn of dom objects
    element.addEventListener('click', deleteItem) //add event listen for each makes them clickable
})

Array.from(item).forEach((element)=>{ //create an array from the variable deleteBtn of dom objects
    element.addEventListener('click', markComplete) //add event listen for each makes them clickable
})

Array.from(itemCompleted).forEach((element)=>{ //create an array from the variable deleteBtn of dom objects
    element.addEventListener('click', markUnComplete) //add event listen for each makes them clickable
})

async function deleteItem(){ //declare async function deleteItem
    const itemText = this.parentNode.childNodes[1].innerText //this refers to whatever deleteBtn array is clicked on and takes the text of the span after the list marker
    try{ 
        const response = await fetch('deleteItem', { //make fetch request and store in response variable
            method: 'delete', //method type requests to delete
            headers: {'Content-Type': 'application/json'}, //headers of the json
            body: JSON.stringify({ //convert object into JSON
              'itemFromJS': itemText //item text is being stored in object and put into like 51ish of server.js
            })
          })
        const data = await response.json() //getting variable from server.js as json
        console.log(data) //console logs data to console
        location.reload() //refresh the window, re render

    }catch(err){
        console.log(err) //if there is an error console log it with a catch
    }
}

async function markComplete(){ //declare async function markComplete
    const itemText = this.parentNode.childNodes[1].innerText //this refers to whatever deleteBtn array is clicked on and takes the text of the span after the list marker
    try{
        const response = await fetch('markComplete', { //make fetch request and store in response variable
            method: 'put', //method type express type to update
            headers: {'Content-Type': 'application/json'}, //convert object into JSON
            body: JSON.stringify({
                'itemFromJS': itemText //item text is being stored in object and put into like 51ish of server.js
            })
          })
        const data = await response.json() //getting variable from server.js as json
        console.log(data) //console logs data to console
        location.reload() //refresh the window, re render

    }catch(err){
        console.log(err) //if there is an error console log it with a catch
    }
}

async function markUnComplete(){ //declare async function markUnComplete
    const itemText = this.parentNode.childNodes[1].innerText //this refers to whatever deleteBtn array is clicked on and takes the text of the span after the list marker
    try{
        const response = await fetch('markUnComplete', { //make fetch request and store in response variable
            method: 'put', //method type express type to update
            headers: {'Content-Type': 'application/json'}, //convert object into JSON
            body: JSON.stringify({
                'itemFromJS': itemText //item text is being stored in object and put into like 51ish of server.js
            })
          })
        const data = await response.json() //getting variable from server.js as json
        console.log(data) //console logs data to console
        location.reload() //refresh the window, re render

    }catch(err){
        console.log(err) //if there is an error console log it with a catch
    }
}