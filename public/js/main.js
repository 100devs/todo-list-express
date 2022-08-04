const deleteBtn = document.querySelectorAll('.fa-trash')//creates a variable that selects all elements with a class of trashcan
const item = document.querySelectorAll('.item span')//creates a variable that selects all elements with a class of span
const itemCompleted = document.querySelectorAll('.item span.completed')//creates a variable that selects all elements with a class of completed inside of a parent with a class of item

Array.from(deleteBtn).forEach((element)=>{//creating an array from the selection and starting a loop
    element.addEventListener('click', deleteItem)//add an event listener to the curren item
})//close the loop

Array.from(item).forEach((element)=>{//creating an array from the selection and starting a loop
    element.addEventListener('click', markComplete)//add an event listener to the current item that waits for a click then calls a function called mark complete
})//close the loop

Array.from(itemCompleted).forEach((element)=>{//create array from selection and start a loop
    element.addEventListener('click', markUnComplete)//adds an event listener to complete items
})//close the loop

async function deleteItem(){//declare asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of list item to get the text only of a specific list item
    try{//starting a try block
        const response = await fetch('deleteItem', {//creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete',//sets CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specificies to expect content in json
            body: JSON.stringify({//declare the message content being passed and make it a string
              'itemFromJS': itemText//set the content of the body to the inner text and and name it item from js
            })//closing body
          })//closing object
        const data = await response.json()//wait on json from response to be converted
        console.log(data)//log the consult to the console
        location.reload()//reloads the page to update what' displayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function

async function markComplete(){//declare asynch function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item and grabs only the inner text within the list spam
    try{//start a try block
        const response = await fetch('markComplete', {//requests a response variable that waits on fetch to do get data from the result of the markComplete route
            method: 'put',//setting the CRUD method to update the route
            headers: {'Content-Type': 'application/json'},//specifying the type of response expected
            body: JSON.stringify({//declare the message content being passed and make it a string
                'itemFromJS': itemText//set the content of the body to the inner text and name it itemfromjs
            })//closing the body
          })//closing the object
        const data = await response.json()//waiting on the json response to be converted
        console.log(data)//log the result to the console
        location.reload()//reload the page to change what's displayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)//log the error to the consol
    }//close the catch block
}//close the function

async function markUnComplete(){//declare asynch function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the inner text
    try{//creates a try block
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetch to get data from the markUnComplete route
            method: 'put',//setting the CRUD method to update the route
            headers: {'Content-Type': 'application/json'},//specifying the type of response expected, which is json
            body: JSON.stringify({//declare the message content being passed and make it a sting
                'itemFromJS': itemText//set the content of the body to the inner text and name it itemText
            })//closing the body
          })//closing the object
        const data = await response.json()//waiting on the json response to be converted
        console.log(data)//log the result to the consol
        location.reload()//reload the page to change what's displayed

    }catch(err){//if an error occurs pass the error into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//close the function