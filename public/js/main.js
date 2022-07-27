//delcaring 3 global variables
const deleteBtn = document.querySelectorAll('.fa-trash') //selecting all the trash icons and storing them as a node list
const item = document.querySelectorAll('.item span')    //grabbing all the elements with class of item and all spans and storing as node list 'item'
const itemCompleted = document.querySelectorAll('.item span.completed') //grabbing all the elements with class of 'item' and also spans with class of 'completed' and storing as 'itemCompleted'

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //looping through all the trash icons and adding an event listener to them
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //looping through all the items on the list and adding event listeners to them
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //looping through all the completed items on the list and adding event listeners to them
})

async function deleteItem(){ //async function declared, so client side function to delete items
    const itemText = this.parentNode.childNodes[1].innerText //grabbing text from the DOM api, the text from the childnodes from  whatever element is called to delete
    try{ //try/catch block
        const response = await fetch('deleteItem', { //fetch deleteItem from server.js
            method: 'delete', //this is the method
            headers: {'Content-Type': 'application/json'}, //set the content as json
            body: JSON.stringify({ //turn json into string
              'itemFromJS': itemText //turn the const from before into string stored as the 'itemFromJS' property
            })
          })
        const data = await response.json() //if it responds, put response as json
        console.log(data) //console logs the data in json form
        location.reload() //reload the page

    }catch(err){ //catches errors if try block fails
        console.log(err) //console logs the error
    }
}

async function markComplete(){ //client side async function to mark the completed items on the list
    const itemText = this.parentNode.childNodes[1].innerText //grabbing text from the DOM api, the text from the childnodes from  whatever element is called to mark completed
    try{ //try/catch block
        const response = await fetch('markComplete', { //fetch markComplete from server.js
            method: 'put', //method type is put, so changes the content
            headers: {'Content-Type': 'application/json'}, //set content as json
            body: JSON.stringify({ //turn json into string
                'itemFromJS': itemText //turn the const from earlier into 'itemFromJS' property
            })
          })
        const data = await response.json() //if it responds, put response as json
        console.log(data) //console logs the data in json form
        location.reload() //reload the page

    }catch(err){ //catches errors if try block fails
        console.log(err) //console logs the error
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText//grabbing text from the DOM api, the text from the childnodes from  whatever element is called to mark as NOT completed
    try{ //try/catch block
        const response = await fetch('markUnComplete', { //fetch markUnComplete from server.js
            method: 'put', //method type is put, so changes the content
            headers: {'Content-Type': 'application/json'},//set content as json
            body: JSON.stringify({//turn json into string
                'itemFromJS': itemText //turn the const from earlier into 'itemFromJS' property
            })
          })
        const data = await response.json() //if it responds, put response as json
        console.log(data) //console logs the data in json form
        location.reload() //reload the page

    }catch(err){ //catches errors if try block fails
        console.log(err) //console logs the error
    }
}
