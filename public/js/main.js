const deleteBtn = document.querySelectorAll('.fa-trash') //creates a variable and assigning to it a selection all element with a class of ".fa-trash"
const item = document.querySelectorAll('.item span')//creates a variable and assigning to it a selection all spans within a parent elements with a class of ".item"
const itemCompleted = document.querySelectorAll('.item span.completed')//creates a variable and assigning to it a selection all span elements with a class of ".completed" with a parent with a class of ".item"

Array.from(deleteBtn).forEach((element)=>{ //creates an array from deletebn and uses a foreach loop to loop through each element
    element.addEventListener('click', deleteItem)//add an event listener to the current item that waits for a click then fires the function deleteItem
})//closes the loop... ha ha Looper movie tagline

Array.from(item).forEach((element)=>{//creates an array from our item selection and starts a loop
    element.addEventListener('click', markComplete)//adds and eventlistener to the current item that waits for the click and fires the function markComplete
})//closes the loop

Array.from(itemCompleted).forEach((element)=>{//creates an array from our itemsCompleted selection and starts a loop
    element.addEventListener('click', markUnComplete)//adds and eventlistener that listens for the click on completed items and fires markuncomplete function
})//closes the loop

async function deleteItem(){//declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item to extract the text value of the specified list span. 
    try{//starting a try block to do something
        const response = await fetch('deleteItem', {//creating a variable "response" that waits on a fetch to retrieves data from deleteItem route
            method: 'delete',//sets the Crud method for the route
            headers: {'Content-Type': 'application/json'},//specifying the types of content expect which is JSON
            body: JSON.stringify({//declare the message content being passed and strigify that content
              'itemFromJS': itemText//setting the content of the body to the innertext of the list item and assigning the name itemFromJS
            })//closing the response assignment
          })//closing the try block
        const data = await response.json()//waiting on JS from the response ti be converted
        console.log(data)//console log the result
        location.reload()//reloads the page to update what is displayed

    }catch(err){//starting a catch block that handles errors
        console.log(err)//console log the error info
    }//closes the catch block
}//closes the async function

async function markComplete(){//declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item to extract the text value of the specified list span
    try{//starting a try block to do something
        const response = await fetch('markComplete', {//creating a variable "response" that waits on a fetch to retrieves data from markComplete route
            method: 'put',//set the CRUD method for the route. put equals update
            headers: {'Content-Type': 'application/json'},//specifying the types of content expect which is JSON
            body: JSON.stringify({//declare the message content being passed and strigify that content
                'itemFromJS': itemText//setting the content of the body to the innertext of the list item and assigning the name itemFromJS
            })//closing the response assignment
          })//closing the try block
        const data = await response.json()//waiting on JS from the response ti be converted
        console.log(data)//console log the result
        location.reload()//reloads the page to update what is displayed

    }catch(err){//starting a catch block that handles errors
        console.log(err)//console log the error info
    }//closes the catch block
}//closes the async function


async function markUnComplete(){//declares an asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item to extract the text value of the specified list span
    try{//starting a try block to do something
        const response = await fetch('markUnComplete', {//creating a variable "response" that waits on a fetch to retrieves data from markUnComplete route
            method: 'put',//set the CRUD method for the route. put equals update
            headers: {'Content-Type': 'application/json'},//specifying the types of content expect which is JSON
            body: JSON.stringify({//declare the message content being passed and strigify that content
                'itemFromJS': itemText//setting the content of the body to the innertext of the list item and assigning the name itemFromJS
            })//closing the response assignment
          })//closing the try block
        const data = await response.json()//waiting on JS from the response ti be converted
        console.log(data)//console log the result
        location.reload()//reloads the page to update what is displayed

    }catch(err){//starting a catch block that handles errors
        console.log(err)//console log the error info
    }//closes the catch block
}//closes the async function