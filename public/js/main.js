const deleteBtn = document.querySelectorAll('.fa-trash')// create a variable deleBtn and assigning it to a selection of all elements with a class fa fa-trash
const item = document.querySelectorAll('.item span')// Creating a variable item and assigning it to a selection of span tags inside of a parent that has a class of item
const itemCompleted = document.querySelectorAll('.item span.completed')// Creating a variable and assigning it to a selection of completed spans that have a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{ //Creates an array from the selection and starting a loop
    element.addEventListener('click', deleteItem)// add an event listener to the current item that waits for a 'click' and then calls a function called deleteItem
})// closes loop

Array.from(item).forEach((element)=>{//Creates an array from the selection and starting a loop
    element.addEventListener('click', markComplete)// add an event listener to the current item that waits for a 'click' and then calls a function called markComplete
})

Array.from(itemCompleted).forEach((element)=>{//Creates an array from the selection and starting a loop
    element.addEventListener('click', markUnComplete)//adds an event listener to ONLY completed items
})//closes loop

async function deleteItem(){//Declaring asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span 
    try{//Declaring a try block to do something 
        const response = await fetch('deleteItem', {//Creating a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete',//sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//Specifying the type of content expected, which is JSON
            body: JSON.stringify({//Declare the message content being passed, and stringify that content 
                'itemFromJS': itemText//Setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//Closing the body
        })//Closing the object
        const data = await response.json()//Created a variable to wait the response from json to be converted
        console.log(data)//log the data to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)// log the error to the console
    }// closes the catch block
}//Ends the function

async function markComplete(){//Declaring asynchronous function 
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span 
    try{//Starting a try block to do something
        const response = await fetch('markComplete', {//Creating a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',//Setting the CRUD method to update the route
            headers: {'Content-Type': 'application/json'},//Specifying the type of content expected, which is JSON
            body: JSON.stringify({//Declare the message content being passed, and stringify that content 
                'itemFromJS': itemText//Setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//Closes the body
        })//Closes the object
        const data = await response.json()//Created a variable to wait the response from json to be converted
        console.log(data)//log the data to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)// log the error to the console
    }// closes the catch block
}//Ends the function

async function markUnComplete(){//Declaring asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text within the list span 
    try{//Starting a try block to do something
        const response = await fetch('markUnComplete', {//Creating a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put',//Setting the CRUD method to update the route
            headers: {'Content-Type': 'application/json'},//Specifying the type of content expected, which is JSON
            body: JSON.stringify({//Declare the message content being passed, and stringify that content 
                'itemFromJS': itemText//Setting the content of the body to the inner text of the list item, and naming it 'itemFromJS'
            })//Closes the body
        })//Closes the object
        const data = await response.json()//Created a variable to wait the response from json to be converted
        console.log(data)//log the data to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)// log the error to the console
    }//Closes the catch block
}//Ends the function