const deleteBtn = document.querySelectorAll('.fa-trash') //creates a variable and assigns it to all elements with a class of "fa-trash"
const item = document.querySelectorAll('.item span')//creates a variable and assigns it to span tags inside of a parent that has a class of "item"
const itemCompleted = document.querySelectorAll('.item span.completed')//creates a variable and assignes it to soans with a class of "completed" inside of a parent with a class of "item"

Array.from(deleteBtn).forEach((element)=>{//creates an array from the selection, and starts a forEach loop
    element.addEventListener('click', deleteItem)//adds an event listener to the current item that listens for a click, then calls a function called "deleteItem"
})//closes the loop

Array.from(item).forEach((element)=>{//creates an array from the selection, and starts a forEach loop
    element.addEventListener('click', markComplete)//adds an event listener to the current item that listens for a click, then calls a function called "markComplete"
})//closes the loop

Array.from(itemCompleted).forEach((element)=>{//creates an array from the selection, and starts a forEach loop
    element.addEventListener('click', markUnComplete)//adds an event listener to the current item that listens for a click, then calls a function called "markUnComplete"
})/closes the loop

async function deleteItem(){//declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs only the inner test within the list span
    try{ //starts a try block to do a thing
        const response = await fetch('deleteItem', { //creates a response variable that waits on a fetch to get data from the result of the deleteItem route
            method: 'delete', //sets the CRUD method for the route to delete
            headers: {'Content-Type': 'application/json'}, //specifies that the content should be JSON
            body: JSON.stringify({ //declares the message content being passed, and stringifies that content
              'itemFromJS': itemText //sets the content of the body to the inner text of the list item and names it "itemFromJS"
            })//closes the body
          })//closes the object
        const data = await response.json()//waits on JSON from the response to be converted
        console.log(data)//prints result to the console 
        location.reload()//refreshes the page after the function completes to show the updated display

    }catch(err){//starts a catch block that grabs any errors and passes them into the catch block 
        console.log(err)//prints any errors to the console
    }//closes the catch block
}//closes the function

async function markComplete(){//declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText //looks inside the list item and grabs only the inner test within the list span
    try{//starts a try block to do a thing
        const response = await fetch('markComplete', {//creates a response variable that waits on a fetch to get data from the result of the markComplete route
            method: 'put',//sets the CRUD method for the route to put
            headers: {'Content-Type': 'application/json'},//specifies that the content should be JSON
            body: JSON.stringify({//declares the message content being passed, and stringifies that content
                'itemFromJS': itemText//sets the content of the body to the inner text of the list item and names it "itemFromJS"
            })//closes the body
          })//closes the object
        const data = await response.json()//waits on JSON from the response to be converted
        console.log(data)//prints result to the console 
        location.reload()//refreshes the page after the function completes to show the updated display

    }catch(err){//starts a catch block that grabs any errors and passes them into the catch block 
        console.log(err)//prints any errors to the console
    }//closes the catch block
}//closes the function

async function markUnComplete(){//declares an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText//looks inside the list item and grabs only the inner test within the list span
    try{//starts a try block to do a thing
        const response = await fetch('markUnComplete', {//creates a response variable that waits on a fetch to get data from the result of the markUnComplete route
            method: 'put',//sets the CRUD method for the route to put
            headers: {'Content-Type': 'application/json'},//specifies that the content should be JSON
            body: JSON.stringify({//declares the message content being passed, and stringifies that content
                'itemFromJS': itemText//sets the content of the body to the inner text of the list item and names it "itemFromJS"
            })//closes the body
          })//closes the object
        const data = await response.json()//waits on JSON from the response to be converted
        console.log(data)//prints result to the console 
        location.reload()//refreshes the page after the function completes to show the updated display

    }catch(err){//starts a catch block that grabs any errors and passes them into the catch block 
        console.log(err)//prints any errors to the console
    }//closes the catch block
}//closes the function