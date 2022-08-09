const deleteBtn = document.querySelectorAll('.fa-trash') //assigns the variable deleteBtn to everything in the dom with the class fa-trash
const item = document.querySelectorAll('.item span') // assigns the variable item to select all the documents in the dom with a span within the .item class
const itemCompleted = document.querySelectorAll('.item span.completed') // assigns variable itemComplete to select all documents in the dom with item.complete with the item class

Array.from(deleteBtn).forEach((element)=>{ // takes the array from deleteBtn variable and loops through each element 
    element.addEventListener('click', deleteItem) // deletBtn has an event listener of click to activate the deleteItem function
})

Array.from(item).forEach((element)=>{ // loops through the array from the item variable
    element.addEventListener('click', markComplete) //adds an event listener to trigger on a click and call the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ // loops through that array from the itemCompleted variable 
    element.addEventListener('click', markUnComplete) //adds an event listener to callback the markUncomplete function on a click
})

async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText // assigns the itemText variable to the text of the first index of the child node of the parent node 
    try{ // run the code
        const response = await fetch('deleteItem', { // assigns the variable response to wait for the fetch deleteItem 
            method: 'delete', // using the delete method to take out
          headers: {'Content-Type': 'application/json'}, //indicates the type of resource being used in the request which is json
            body: JSON.stringify({ //makes the body of the object a string from json data
              'itemFromJS': itemText // deleting itemText value with itemFromJS property
            })
          })
        const data = await response.json() //assigns the data variable to the response from the server in json form
        console.log(data) //console logs the response
        location.reload() // reloads the current webpage 

    }catch(err){ // this will run if there is an error
        console.log(err) //console logs the error
    }
}

async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText  // assigns the itemText variable to the text of the first index of the child node of the parent node
    try{
        const response = await fetch('markComplete', { // assigns the variable response to wait for the fetch markedComplete path
            method: 'put', //allows the object to be edited
            headers: {'Content-Type': 'application/json'}, //indicates the type of resource being used in the request which is json
            body: JSON.stringify({ //makes the body of the object a string from json data
                'itemFromJS': itemText //edits the itemText value with itemFromJS property
            })
          })
        const data = await response.json() //assigns the data variable to the response of the server in json format
        console.log(data) //console logs data 
        location.reload() //reloads the webpage

    }catch(err){ //if a promise is not returned it runs the catch function
        console.log(err) // console logs error
    }
}

async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText  // assigns the itemText variable to the text of the first index of the child node of the parent node
    try{
        const response = await fetch('markUnComplete', { // assigns the variable response to wait for the fetch markedUncomplete path
            method: 'put', //allows to edit the data
            headers: {'Content-Type': 'application/json'},  //indicates the type of resource being used in the request which is json
            body: JSON.stringify({  //makes the body of the object a string from json data
                'itemFromJS': itemText  //edits the itemText value with itemFromJS property
            })
          })
        const data = await response.json() //assigns the data variable to the response of the server in json format
        console.log(data) //console logs data
        location.reload() // reloads the webpage

    }catch(err){ //if promise is not returned it runs this function
        console.log(err) //console logs the error
    }
}
