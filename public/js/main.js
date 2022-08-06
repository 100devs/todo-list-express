const deleteBtn = document.querySelectorAll('.fa-trash')//create a variable that selects all elements with the class of 'fa-trash' and assigns it to deleteBtn
const item = document.querySelectorAll('.item span')//creates a variable named 'item' that selects all span elements with the class name of 'item'
const itemCompleted = document.querySelectorAll('.item span.completed')//creates a variable named itemCompleted that selects spans with the class of 'completed', inside of a parent class named 'item'

Array.from(deleteBtn).forEach((element)=>{//creates an array from our selection and starts a loop
    element.addEventListener('click', deleteItem)//add an event listener to the current item that listens for a click and then calls a function called deleteItem
})//close our loop

Array.from(item).forEach((element)=>{//creates an array from our selection and starts a loop
    element.addEventListener('click', markComplete)//add an event listener that listens for a click, then runs function markComplete
})//close our loop

Array.from(itemCompleted).forEach((element)=>{//creates an array from our selection and starts a loop
    element.addEventListener('click', markUnComplete)//add an event listener to ONLY completed items that listens for a click, then runs function markUnComplete
})//close our loop

async function deleteItem(){//declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //look inside of a list item and grabs only the inner text from within the list span
    try{//starting a try block to do something
        const response = await fetch('deleteItem', {//waits until fetch conditionals are met before firiring deleteItem function
            method: 'delete',   //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},  //specifying JSON as the type of content expected
            body: JSON.stringify({  //setting type of message content being sent back, and stringify that content
              'itemFromJS': itemText    //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            })  //closing the body
          })    //closing the object
        const data = await response.json()  //waiting on JSON from the response to be converted
        console.log(data)   //log the result to the console
        location.reload()   //reloads the page to update what is displayed

    }catch(err){//if an error occurs, pass the error into the catch block
        console.log(err)//log the error to the console
    }//close the catch block
}//end the function

async function markComplete(){  //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText    //looks inside of the list items and grabs only the inner text within the list item span
    try{    //try block to do something
        const response = await fetch('markComplete', {  //waits until fetch conditionals are met before firiring markComplete function
            method: 'put',  //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},  //specifying JSON as the type of content expected
            body: JSON.stringify({  //setting the type of message content being sent back, and stringify that content
                'itemFromJS': itemText  //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            })  //closing the body
                
          })    //end the function
        const data = await response.json()  //waiting on JSON from the response to be converted
        console.log(data)   //log the result to the console
        location.reload()   //reloads the page to update what is displayed

    }catch(err){
        console.log(err)
    }
}

async function markUnComplete(){  //declare an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText    //looks inside of the list items and grabs only the inner text within the list item span
    try{  //try block to do something
        const response = await fetch('markUnComplete', {  //waits until fetch conditionals are met before firiring markUnComplete function
            method: 'put',  //sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},  //specifying JSON as the type of content expected
            body: JSON.stringify({  //setting the type of message content being sent back, and stringify that content
                'itemFromJS': itemText  //setting the content of the body to the inner text of the list item and naming it 'itemFromJS'
            })  //closing the body
          })    //end the function
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}