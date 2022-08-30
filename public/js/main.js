const deleteBtn = document.querySelectorAll('.fa-trash')//creating a variable and assigning all elements with a class of .fa-trash
const item = document.querySelectorAll('.item span')//creating a variable and assigning it to a selection of span tags within a parent of class .item
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to selection of spans with a class of 'completed' inside of a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)// add an event listerning on click, which calls a function called deleteItem
})//closes our loop

Array.from(item).forEach((element)=>{//creating an array from our selection, starting a loop
    element.addEventListener('click', markComplete)//add an event listening to the current item that waits for a click and then calls a function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection, starting a loop
    element.addEventListener('click', markUnComplete)//adds an event listening to only completed items (can uncomplete an item that isn't complete)
})

async function deleteItem(){//declaring an asyncronous function 
    const itemText = this.parentNode.childNodes[1].innerText //looks inside of the list item and grabs only the inner text within the list span
    try{ //starting a try block to do something
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch to retrieve data from the result of deleteItem route
            method: 'delete', //sets CRUD method for the route
            headers: {'Content-Type': 'application/json'}, //specifying the type of content, which is JSON
            body: JSON.stringify({ //declare the message content being passed, and stringify (turn it into a string) that content
              'itemFromJS': itemText // setting the content of the body to the innerText of the list item and naming it 'itemFromJS'
            })//closing the body
          }) //closing object
        const data = await response.json() //waiting on JSON from the response to be converted
        console.log(data) //log data to console
        location.reload() //reloads the page to update what is displayed

    }catch(err){ // if an error occurs, pass the error into the catch block
        console.log(err) //log error into the console
    }//close catch block
}//close function

async function markComplete(){//declaring an asyncronous function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span
    try{//starting a try block block
        const response = await fetch('markComplete', {//creates a response variable that waits on a fetch to retrieve data from the result of markComplete route
            method: 'put',//setting the CRUD method to 'update' the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content, which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify (turn it into a string) that content
                'itemFromJS': itemText // setting the content of the body to the innerText of the list item and naming it 'itemFromJS'
            })//closing body
          })//closing object
        const data = await response.json()//waiting on JSON from the response to be converted
        console.log(data)//console log data
        location.reload()//reload page to update what is displayed

    }catch(err){// if an error occurs, pass the error into the catch block
        console.log(err)//log error into the console
    }
}

async function markUnComplete(){//declaring an asyncronous function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span
    try{//starting a try block block
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetch to retrieve data from the result of markUnComplete route
            method: 'put',//setting the CRUD method to 'update' the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content, which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify (turn it into a string) that content
                'itemFromJS': itemText// setting the content of the body to the innerText of the list item and naming it 'itemFromJS'
            })//closing body
          })//closing object
        const data = await response.json()//waiting on JSON from the response to be converted
        console.log(data)//console log data
        location.reload()//reload page to update what is displayed

    }catch(err){// if an error occurs, pass the error into the catch block
        console.log(err)console.log(err)//log error into the console
    }//closing the catch block
}//ends function