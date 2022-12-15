const deleteBtn = document.querySelectorAll('.fa-trash') //store the span in a variable
const item = document.querySelectorAll('.item span') //store all the spans in the class item in a variable
const itemCompleted = document.querySelectorAll('.item span.completed') //store the completed span in the item class in a variable

Array.from(deleteBtn).forEach((element)=>{ 
    element.addEventListener('click', deleteItem) //put an event listener on all of the deleteBtn's and upon click run the deleteItem function
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //put an event listener on all of the item's and upon click run the deleteItem function
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //put an event listener on all of the itemCompleted's and upon click run the deleteItem function
})

async function deleteItem(){ // enable promise-based behavior to be written in a cleaner style
    const itemText = this.parentNode.childNodes[1].innerText //the thing you clicked on, go up to its parent, find the first child node and the text inside of it
    try{
        const response = await fetch('deleteItem', { //go to the server and go 'fetch' the deleteItem method
            method: 'delete', //delete request
            headers: {'Content-Type': 'application/json'}, //sends the http json header to the browser to inform it what kind of data it expects.
            body: JSON.stringify({ //passing to the server another 'body' the information from the ejs file which the client selected
              'itemFromJS': itemText //the item the client selected
            })
          })
        const data = await response.json() //respond what was given from server and parse to json
        console.log(data) //print data to console
        location.reload()

    }catch(err){ //if try doesn't work
        console.log(err) //print error to console
    }
}

async function markComplete(){ // enable promise-based behavior to be written in a cleaner style
    const itemText = this.parentNode.childNodes[1].innerText //the thing you clicked on, go up to its parent, find the first child node and the text inside of it
    try{
        const response = await fetch('markComplete', { //go to the server and go 'fetch' the markComplete method
            method: 'put', //update request
            headers: {'Content-Type': 'application/json'}, //sends the http json header to the browser to inform it what kind of data it expects
            body: JSON.stringify({ //passing to the server another 'body' the information from the ejs file which the client selected
                'itemFromJS': itemText //the item the client selected
            })
          })
        const data = await response.json() //respond what was given from server and parse to json
        console.log(data) //print data to console
        location.reload()

    }catch(err){ //if try doesn't work
        console.log(err) //print error to console
    }
}

async function markUnComplete(){ // enable promise-based behavior to be written in a cleaner style
    const itemText = this.parentNode.childNodes[1].innerText //the thing you clicked on, go up to its parent, find the first child node and the text inside of it
    try{
        const response = await fetch('markUnComplete', { //go to the server and go 'fetch' the markUnComplete method
            method: 'put', //update request
            headers: {'Content-Type': 'application/json'}, //sends the http json header to the browser to inform it what kind of data it expects.
            body: JSON.stringify({ //passing to the server another 'body' the information from the ejs file which the client selected
                'itemFromJS': itemText //the item the client selected
            })
          })
        const data = await response.json() //respond what was given from server and parse to json
        console.log(data) //print data to console
        location.reload()

    }catch(err){ //if try doesn't work
        console.log(err) //print error to console
    }
}