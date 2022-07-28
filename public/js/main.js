const deleteBtn = document.querySelectorAll('.fa-trash') //creating a variable and selecting all elements with a class of the trash can 
const item = document.querySelectorAll('.item span')//creating variable and selecting all span tags with a parent class if item
const itemCompleted = document.querySelectorAll('.item span.completed')//creating a variable and assigning it to a selection of spans with class of completed inside of parent with a class of item

Array.from(deleteBtn).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', deleteItem)//adding an event listener to the current item and listening for a click and calls function to deleteItem
})//close our loop

Array.from(item).forEach((element)=>{//creating an array and starting loop and selecting span that has a parent class of item
    element.addEventListener('click', markComplete)//add an event listener to the current item that waits for the click annd then calls function called markComplete
})//close our loop

Array.from(itemCompleted).forEach((element)=>{//creating an array from our selection and starting a loop
    element.addEventListener('click', markUnComplete)// adds an event listener to only completed items 
})//closes our loop

async function deleteItem(){//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the innertext within the list span
    try{ //declaring a try block
        const response = await fetch('deleteItem', { //creating a response variable that waits on a fetch to get data from the result of deleteItem route
            method: 'delete', //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected, which is JSON
            body: JSON.stringify({//declare the message content being passed, and stringify that content 
              'itemFromJS': itemText//setting the content of the body to the innertext of the list item, and naming it 'itemFromJS'
            })//closing the body
          })//closing our object
        const data = await response.json()// waiting on JSON from the response
        console.log(data)//log the result to the console
        location.reload()//reloads the page to update what is displayed

    }catch(err){//if an error occurs pass tthe error into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the functiion

async function markComplete(){//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside of the list item and grabs only the innertext within the list span
    try{//declaring the try block
        const response = await fetch('markComplete', {//creating a response variable that waits on a fetch to get data from the result of markCompelete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected
            body: JSON.stringify({//declare the message content being passed, and stringify that content 
                'itemFromJS': itemText //setting the content of the body to the innertext of the list item, and naming it 'itemFromJS'
            })//close the body
          })//closing the object
        const data = await response.json()//waiting on JSON from the response
        console.log(data)//log the result to the console
        location.reload()//reload the page to upadte what is displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function

async function markUnComplete(){//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText////looks inside of the list item and grabs only the innertext within the list span
    try{//creating try block
        const response = await fetch('markUnComplete', {//creating a response variable that waits on a fetch to get data from the result of markUnCompelete route
            method: 'put',//setting the CRUD method to 'update' for the route
            headers: {'Content-Type': 'application/json'},//specifying the type of content expected
            body: JSON.stringify({//declare the message content being passed, and stringify that content 
                'itemFromJS': itemText //setting the content of the body to the innertext of the list item, and naming it 'itemFromJS'
            })//close the body
          })// close the object
        const data = await response.json()//waiting on JSON from the response
        console.log(data)//log the result to the console
        location.reload()//reload the page to update what is displated

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function