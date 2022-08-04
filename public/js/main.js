const deleteBtn = document.querySelectorAll('.fa-trash') //giving the trash icon a variable name 
const item = document.querySelectorAll('.item span') //creating variable for all spans with a class of item 
const itemCompleted = document.querySelectorAll('.item span.completed') //creating a vairable for all spans with class of 'completed inside a parent with a class of 'item'

Array.from(deleteBtn).forEach((element)=>{ //creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem) //for each event listener added to item add function named deleteItem, listening for a click
})

Array.from(item).forEach((element)=>{   //creating an array from our selection of item's and starting a loop
    element.addEventListener('click', markComplete) //for each item that is completed, create an event listener add function named markcomplete, listening for a click
})

Array.from(itemCompleted).forEach((element)=>{  //creating an array from our selection of itemcompleted's, add event listener to each waiting for click
    element.addEventListener('click', markUnComplete) //for each event listener added to incompleted items, add function named markUnComplete
})

async function deleteItem(){  //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and grabs only the inner text within the span 
    try{ //starting a try block
        const response = await fetch('deleteItem', { //creating a response variable that waits on a fetch to get data from the result of deleteItem
            method: 'delete', //declaring a method of delete method, setting the CRUD method for the route
            headers: {'Content-Type': 'application/json'}, // specifying the content expected which is JSON
            body: JSON.stringify({ //declaring the message content being passed and turn it into a string
              'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            })
          })
        const data = await response.json() //waiting on server to get some JSON back
        console.log(data) //console log the result 
        location.reload() //reloading the page to update what is desplayed 

    }catch(err){ //if error occurs, pass the error into the catch block
        console.log(err) //log errors to console 
    }
}

async function markComplete(){ //declaring asynchronous function named markComplete
    const itemText = this.parentNode.childNodes[1].innerText //// looks inside the list item and grabs only the inner text within the span 
    try{ //start a try block
        const response = await fetch('markComplete', { ////creating a response variable that waits on a fetch to get data from the result of markComplete
            method: 'put', //Updating 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ //declare the message content being passed and make into a string 
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            })
          })
        const data = await response.json() //waiting on JSON from the response
        console.log(data) //log that data to console
        location.reload() //reloading the page

    }catch(err){ //if error occurs, pass the error into the catch block
        console.log(err) //log errors to console 
    }
}

async function markUnComplete(){ //declaring asynchronous function named markComplete
    const itemText = this.parentNode.childNodes[1].innerText // looks inside the list item and grabs only the inner text within the span 
    try{ //start a try block
        const response = await fetch('markUnComplete', { //creating a response variable that waits on a fetch to get data from the result of markUnComplete
            method: 'put', //CRUD method Update
            headers: {'Content-Type': 'application/json'}, // specifying the content expected which is JSON
            body: JSON.stringify({ //declare the message content being passed and make into a string 
                'itemFromJS': itemText //setting the content of the body to the inner text of the list item and naming it itemFromJS
            })
          })
        const data = await response.json() //waiting on JSON from the response
        console.log(data) //log data to console
        location.reload() //reload page

    }catch(err){ //if error occurs, pass the error into the catch block
        console.log(err)
    }
}