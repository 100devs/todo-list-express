const deleteBtn = document.querySelectorAll('.fa-trash')    //Assigns all items with the class of fa-trash to the "deleteBtn" variable
const item = document.querySelectorAll('.item span')    //Assigns all items with the span tag with the parent withe the class named "item" to the "item" variable
const itemCompleted = document.querySelectorAll('.item span.completed') //Assigns all items with the class named "completed" inside of the parent with the class named "item" to the variable named "itemCompleted"

Array.from(deleteBtn).forEach((element)=>{  //Creates an array from deleteBtn and starts a loop
    element.addEventListener('click', deleteItem)   //An event listener that waits for a click and then calls the deleteItem function
}) 

Array.from(item).forEach((element)=>{   //Creates an array from item and starts a loop
    element.addEventListener('click', markComplete)     //An event listener that waits for a click and then calls the markComplete function
})

Array.from(itemCompleted).forEach((element)=>{ //Creates an array from itemCompleted and starts a loop
    element.addEventListener('click', markUnComplete)   //An event listener that waits for a click and then calls the markUnComplete function
})

async function deleteItem(){    //Declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText    //Gets the inner text from the list span and assigns it to itemText
    try{    //Starts a try block to do something
        const response = await fetch('deleteItem', { //Waits on a fetch to get data from the result of the deleteItem route and assigns it to the response variable
            method: 'delete',   //Sets the CRUD method for the route
            headers: {'Content-Type': 'application/json'},  //Specifying the type of content expected which is JSON
            body: JSON.stringify({  //Converts the content to a string and declares the message being passed
              'itemFromJS': itemText    //Sets the content of the body to the inner text of the list item and names it "itemFromJS"
            })
          })
        const data = await response.json()  //Waiting on JSON from the response and assigning it to data
        console.log(data)   //Logs data to the console
        location.reload()   //Reloads the page

    }catch(err){    //When an error occurs, the erro is passed into a catch block
        console.log(err)    //Logs the error into the console
    }
}

async function markComplete(){  //Declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText    //Gets the inner text from the list span and assigns it to itemText 
    try{    //Starts a try block to do something    
        const response = await fetch('markComplete', {  //Waits on a fetch to get data from the result of the markComplete route and assigns it to the response variable
            method: 'put',  //Sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},  //Specifying the type of content expected which is JSON
            body: JSON.stringify({  //Converts the content to a string and declares the message being passed
                'itemFromJS': itemText  //Sets the content of the body to the inner text of the list item and names it "itemFromJS"
            })
          })
        const data = await response.json()  //Waiting on JSON from the response and assigning it to data
        console.log(data)   //Logs data to the console
        location.reload()   //Reloads the page

    }catch(err){    //When an error occurs, the erro is passed into a catch block
        console.log(err)    //Logs the error into the console
    }
}

async function markUnComplete(){    ////Declaring an asynchronous function
    const itemText = this.parentNode.childNodes[1].innerText    //Gets the inner text from the list span and assigns it to itemText 
    try{    //Starts a try block to do something    
        const response = await fetch('markUnComplete', {    //Waits on a fetch to get data from the result of the markUnComplete route and assigns it to the response variable
            method: 'put',  //Sets the CRUD method to "update" for the route
            headers: {'Content-Type': 'application/json'},  //Specifying the type of content expected which is JSON
            body: JSON.stringify({     //Converts the content to a string and declares the message being passed
                'itemFromJS': itemText  //Sets the content of the body to the inner text of the list item and names it "itemFromJS"
            })
          })
        const data = await response.json()  //Waiting on JSON from the response and assigning it to data
        console.log(data)   //Logs data to the console
        location.reload()   //Reloads the page

    }catch(err){    //When an error occurs, the erro is passed into a catch block
        console.log(err)    //Logs the error into the console
    }
}