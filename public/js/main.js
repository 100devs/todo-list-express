const deleteBtn = document.querySelectorAll('.fa-trash') //select dom elements with fa-trash class
const item = document.querySelectorAll('.item span') // span tags inside of an item class
const itemCompleted = document.querySelectorAll('.item span.completed') // spans with completed class inside of item class elements

Array.from(deleteBtn).forEach((element)=>{ //create an array from node list and start a loop
    element.addEventListener('click', deleteItem) //add listener to each dom element and attach deleteItem function
})

Array.from(item).forEach((element)=>{ //create an array from the span dom elements, start a loop
    element.addEventListener('click', markComplete) //add event listener to each, attaching markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ //create an array from .completed spans, start loop
    element.addEventListener('click', markUnComplete)  //add event listener, attaching markUncomplete function
})

async function deleteItem(){ //async function declaration
    const itemText = this.parentNode.childNodes[1].innerText //get li span element text
    try{
        const response = await fetch('deleteItem', { //create variable, go to /deleteItem route
            method: 'delete', //using a delete method
            headers: {'Content-Type': 'application/json'}, //specify the type of content expected
            body: JSON.stringify({ //turn body of the message into a JSON string
              'itemFromJS': itemText //set content of body, storing text in itemFromJS variable
            }) //closing the body
          }) //closing the await/fetch
        const data = await response.json() //wait for json
        console.log(data) //log data to console
        location.reload() //reload the window

    }catch(err){ //if there's an error
        console.log(err) //console log the error
    }
} //end function

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        const response = await fetch('markComplete', {
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