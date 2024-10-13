const deleteBtn = document.querySelectorAll('.fa-trash') // assigns delete button to variable
const item = document.querySelectorAll('.item span') //any span inside class item is declared the variable item
const itemCompleted = document.querySelectorAll('.item span.completed') // this assigns a variable when the completed class is added to the previous class

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
}) //assigns event listener to each delete button

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
}) //assigns event listener when you click on item

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
}) //assigns event listener when you click on itemCompleted

async function deleteItem(){ //function that runs when you hit delete button
    const itemText = this.parentNode.childNodes[1].innerText //takes the first child's inner text
    try{
        const response = await fetch('deleteItem', { //runs server call that we set up in server.js
            method: 'delete', // use the delete method
            headers: {'Content-Type': 'application/json'}, //get on the same page as the server
            body: JSON.stringify({ //make sure we're using json 
              'itemFromJS': itemText //key:value pair 
            })
          })
        const data = await response.json() //assign variable to json response
        console.log(data) //console.log the data
        location.reload() // reload the page

    }catch(err){
        console.log(err) // log error
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText // assign variable to first child's innerText
    try{
        const response = await fetch('markComplete', { // use fetch function
            method: 'put', // use put
            headers: {'Content-Type': 'application/json'}, //request that header be in json
            body: JSON.stringify({ // request that body be in json
                'itemFromJS': itemText // key: value pair
            })
          })
        const data = await response.json() //assign variable to json response
        console.log(data) //log data
        location.reload() //reload page

    }catch(err){
        console.log(err) //log error 
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText //assign variable to first child's innerTex
    try{
        const response = await fetch('markUnComplete', { // declare variable response and assign it to await function
            method: 'put', // use the put method
            headers: {'Content-Type': 'application/json'}, //make sure headers are json
            body: JSON.stringify({ // make sure JS values are turned into json
                'itemFromJS': itemText // key: value pair
            })
          })
        const data = await response.json() //declare variable data and assign it to response that is now json
        console.log(data) // log data
        location.reload() // reload page

    }catch(err){
        console.log(err)
    } //catch errors
}