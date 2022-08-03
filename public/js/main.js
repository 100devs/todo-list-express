const { Router } = require("express")

const deleteBtn = document.querySelectorAll('.fa-trash')//Creating a variable and assigning it to a selection of all elements with a class of the trashcan.
const item = document.querySelectorAll('.item span')//Creating a variable and assigning it to a selection of span tags inside a parent that has the class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')//Creating a variable and assigning it to a selection of spans with a completed class located inside a parent with the class of item

Array.from(deleteBtn).forEach((element)=>{ //Creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)//add an event listener to the current item that listens for click, then calls a function deleteItem
})//Closes the loop

Array.from(item).forEach((element)=>{//Creating an array from our selection and starting a loop
    element.addEventListener('click', markComplete)//adding an event listener to current element that listens for click, then calls function, markComplete
})

Array.from(itemCompleted).forEach((element)=>{//Create an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)//add event listener to the ONLY Completed items that waits for click, then calls function, markUnComplete
})//Closes loop

async function deleteItem(){//Declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//Creating a variable that looks inside the parent list item and grabs the second items text contained inside the list span.
        try{ //Starting a try block that does something
        const response = await fetch('deleteItem',{ //object that's creating a response variable that waits for fetch results in the deletItem Router.
            method: 'delete',
            headers: {'Content-Type': 'application/json'},//specifying type of content expected, which is JSON
            body: JSON.stringify({//setting body message to a JSON string
              'itemFromJS': itemText//setting message body content to the inner text of the span list item and naming it 'itemFromJS'
        
        }) //closing the body
          })//closing the object
        const data = await response.json()//creates variable that awaits response to be converted to json format
        console.log(data)//logs results to the console
        location.reload()//Reloads the page to display updates

    }catch(err){ //creates function to catch errors
        console.log(err)//Console log error
    }//end the function

}
async function markComplete(){//Creating an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//Creating a variable that looks inside the parent list item and grabs the second items text contained inside the list span.
    try{//creating try block that does something
        const response = await fetch('markComplete', {//create response variable that waits for fetch results from markComplete route in server.js
            method: 'put',//sets a put method that updates 
            headers: {'Content-Type': 'application/json'},//Declares json as the content type to be expected in response
            body: JSON.stringify({//sets the messasge body to be converted to a JSON string
                'itemFromJS': itemText//declares inner text inside list item span to be referenced as 'itemFromJS'
            })
          })
        const data = await response.json()//Creates variable assigned to wait for data to be converted and responded with in json
        console.log(data)//logs data to console
        location.reload()//refresh the location to display updates

    }catch(err){//set up method to catch errors
        console.log(err)//creates functiion to catch errors
    }
}

async function markUnComplete(){//Creating an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//creating a variable that grabs the text inside the list item span.
    try{//create a try block that does the following
        const response = await fetch('markUnComplete', {//we're sending a response to the markUnComplete route and awaits results of the fetch
            method: 'put',//sets a put method to the markUnComplete route
            headers: {'Content-Type': 'application/json'},//sets the content type to be served in json format
            body: JSON.stringify({ //sets the message body to be converted to a string in JSON
                'itemFromJS': itemText //specifies the inner text inside list item span with name declaration, 'itemFromJS'
            }) //closes the body 
          })//closes the object
        const data = await response.json()//creating variable assigned to await for requested data to be converted to json
        console.log(data)//logs data to the console
        location.reload()//reloads the location to display updates

    }catch(err){//creates a catch block that sends error if occurs to it
        console.log(err)//logs errors to the console
    }//closes catch block
}//closes function