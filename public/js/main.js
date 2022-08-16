const deleteBtn = document.querySelectorAll('.fa-trash') //creates a variable called deteleBtn and assigning it to a selection of all elements with a class of trash can
const item = document.querySelectorAll('.item span') // creates a variable called item and and asigns it to a selection of all span tags in the parent element with the class item
const itemCompleted = document.querySelectorAll('.item span.completed') //creates a variable with the selection of completed spans inside of the parent class item 

Array.from(deleteBtn).forEach((element)=>{ //creates an array from our selection, deleteBtn and loop through each individual element
    element.addEventListener('click', deleteItem)//creates an event listener to the current element that deletes on click or(waits for a click then calls a function deleteItem) we use deleteItem instead of deleteIte() because we don't want it to execute right away
})//close the loop

Array.from(item).forEach((element)=>{//create an array from our selection, item and start a loop
    element.addEventListener('click', markComplete)//creates an event listener to the current element that marks complete on click or (waits for a click then calls a function markComplete)
})//closes the loop

Array.from(itemCompleted).forEach((element)=>{//creates an array from our selection, itemCompleted and starts a loop
    element.addEventListener('click', markUnComplete)//creates an event listener to ONLY completed items
})

async function deleteItem(){ //declaring a async function - for flexibility on when and how things run
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the innertext within the list span
    try{//starting a try block to do something
        const response = await fetch('deleteItem', { //creates a variable that waits on a fetch to retrieve data from the results of deleteItem route
            method: 'delete', //sets a CRUD method route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //body is the actual info that is being passed and put into string
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and nameing it itemFromJS
            })
          })
        const data = await response.json()//waiting a JSON from the response to be converted
        console.log(data)
        location.reload()//reloads the page to display updates

    }catch(err){ //to catch errors
        console.log(err) //log the error to the console
    }
}

async function markComplete(){ //declaring an async function called markcomplete
    const itemText = this.parentNode.childNodes[1].innerText //it grabs the get pizza text and sends it with the request using a fetch which is going to be a put and send along a request to the server side
    try{ //a try block to do something
        const response = await fetch('markComplete', { //creates a variable that waits on a fetch to retrieve data from the results of route markComplete
            method: 'put', //a crud method that updates for the route markCOmplete
            headers: {'Content-Type': 'application/json'}, //specifying the type of content expected which is JSON
            body: JSON.stringify({ //we are stringifying the content
                'itemFromJS': itemText //setting the content of the body to itemText
            }) //closing the body
          })//closing the method
        const data = await response.json()//awaiting a JSON from the response to be converted
        console.log(data)//logging the data to the console
        location.reload()//reloading the page

    }catch(err){ //catches error
        console.log(err) //console logs the error
    }
}

async function markUnComplete(){//declare an asynchronous function called markUncomplete
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of a list item and grabs only the innerText withing the list span
    try{//a try block to do something
        const response = await fetch('markUnComplete', { //creates a variable that awaits a fetch to retrieve data from the results of route markUncomplete
            method: 'put',//a CRUD method that updates for the route markUncomplete
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({////specifying the type of content expected which is JSON
                'itemFromJS': itemText //setting the content of the body to itemText
            })//closing the body
          })//closing the method
        const data = await response.json()//awaiting a JSON from the response to be converted
        console.log(data)//logging the data
        location.reload()//refreshes the page to display updates

    }catch(err){//catch error
        console.log(err)//loggs error
    }//closes catch block
}//closes asycnc function